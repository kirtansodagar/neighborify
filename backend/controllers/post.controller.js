import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';
import { computeFeedScore, computePincodeAverageEngagement } from '../utils/feedAlgorithm.js';
import { feedCache } from '../utils/cache.js';
import { sanitizeBody } from '../utils/sanitize.js';

export const createPost = async (req, res) => {
  try {
    const { content, type, alertType, pollData } = req.body;
    if (!content || typeof content !== 'string') return error(res, 'Content required', 400);
    const trimmedContent = content.trim().substring(0, 5000);
    if (!trimmedContent) return error(res, 'Content cannot be empty', 400);
    const cleanContent = sanitizeBody(trimmedContent);
    const postData = {
      content: cleanContent,
      author: req.user._id,
      pincode: req.user.pincode,
      type: type || 'text',
      alertType: alertType || null,
      pollData: pollData || undefined,
    };
    if (req.files?.length) {
      postData.media = req.files.map(f => ({ url: f.path, publicId: f.filename, type: f.mimetype.startsWith('video') ? 'video' : 'image' }));
      if (!postData.type || postData.type === 'text') postData.type = 'image';
    }
    const post = await Post.create(postData);
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });
    feedCache.delete(`feed:${req.user.pincode}`);
    const populated = await post.populate('author', 'name avatar pincode');
    return success(res, 'Post created', { post: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, pincode } = req.query;
    const userPincode = pincode || req.user?.pincode;
    if (!userPincode) return error(res, 'Pincode required', 400);
    const cacheKey = `feed:${userPincode}:${page}`;
    const cached = feedCache.get(cacheKey);
    if (cached) return success(res, 'Feed', { posts: cached.posts, fromCache: true }, 200, cached.pagination);
    const skip = (page - 1) * limit;
    const query = { pincode: userPincode, isArchived: false };
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ feedScore: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar pincode'),
      Post.countDocuments(query),
    ]);
    const pagination = paginate(Number(page), Number(limit), total);
    feedCache.set(cacheKey, { posts, pagination }, 180000);
    return success(res, 'Feed', { posts }, 200, pagination);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar pincode');
    if (!post) return error(res, 'Post not found', 404);
    return success(res, 'Post found', { post });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return error(res, 'Post not found', 404);
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    const allowed = ['content', 'alertType'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'content' && typeof req.body[key] === 'string') {
          post[key] = sanitizeBody(req.body[key]);
        } else {
          post[key] = req.body[key];
        }
      }
    }
    await post.save();
    feedCache.delete(`feed:${post.pincode}`);
    return success(res, 'Post updated', { post });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return error(res, 'Post not found', 404);
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    post.isArchived = true;
    await post.save();
    await User.findByIdAndUpdate(post.author, { $inc: { postsCount: -1 } });
    feedCache.delete(`feed:${post.pincode}`);
    return success(res, 'Post deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likesCount: 1 } }, { new: true });
    if (!post) return error(res, 'Post not found', 404);
    if (!post.author.equals(req.user._id)) {
      await Notification.create({ recipient: post.author, type: 'like', title: 'Liked your post', referenceId: post._id, referenceModel: 'Post', image: req.user.avatar });
    }
    return success(res, 'Post liked', { likesCount: post.likesCount });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likesCount: -1 } }, { new: true });
    if (!post) return error(res, 'Post not found', 404);
    return success(res, 'Post unliked', { likesCount: post.likesCount });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAlerts = async (req, res) => {
  try {
    const { pincode, page = 1, limit = 20 } = req.query;
    const query = { type: 'alert', isArchived: false };
    if (pincode) query.pincode = pincode;
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar'),
      Post.countDocuments(query),
    ]);
    return success(res, 'Alerts', { posts }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const recomputeScores = async () => {
  try {
    const posts = await Post.find({ isArchived: false }).populate('author', 'pincode');
    const pincodeGroups = {};
    for (const post of posts) {
      if (!pincodeGroups[post.pincode]) pincodeGroups[post.pincode] = [];
      pincodeGroups[post.pincode].push(post);
    }
    for (const [pincode, group] of Object.entries(pincodeGroups)) {
      const avgEngagement = computePincodeAverageEngagement(group);
      for (const post of group) {
        const score = computeFeedScore(post, avgEngagement, 1);
        await Post.findByIdAndUpdate(post._id, { feedScore: Math.round(score * 100) / 100 });
      }
    }
  } catch (err) {
    console.error('Feed score recompute error:', err.message);
  }
};
