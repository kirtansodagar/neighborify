import Forum from '../models/Forum.js';
import Comment from '../models/Comment.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';
import { forumCache } from '../utils/cache.js';

export const createForum = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    if (!title || typeof title !== 'string' || !content || typeof content !== 'string') {
      return error(res, 'Title and content required', 400);
    }
    const trimmedTitle = title.trim().substring(0, 200);
    const trimmedContent = content.trim().substring(0, 10000);
    const forum = await Forum.create({
      title: trimmedTitle, content: trimmedContent, category: category || 'general', tags: tags || [],
      author: req.user._id, pincode: req.user.pincode,
    });
    forumCache.delete(`forum:${req.user.pincode}`);
    const populated = await forum.populate('author', 'name avatar');
    return success(res, 'Forum created', { forum: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getForums = async (req, res) => {
  try {
    const { pincode, category, page = 1, limit = 20 } = req.query;
    const query = {};
    if (pincode) query.pincode = pincode;
    if (category) query.category = category;
    const cacheKey = `forum:${pincode || 'all'}:${category || 'all'}:${page}`;
    const cached = forumCache.get(cacheKey);
    if (cached) return success(res, 'Forums', { forums: cached.forums }, 200, cached.pagination);
    const skip = (page - 1) * limit;
    const [forums, total] = await Promise.all([
      Forum.find(query).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar'),
      Forum.countDocuments(query),
    ]);
    const pagination = paginate(Number(page), Number(limit), total);
    forumCache.set(cacheKey, { forums, pagination }, 600000);
    return success(res, 'Forums', { forums }, 200, pagination);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id).populate('author', 'name avatar pincode');
    if (!forum) return error(res, 'Forum not found', 404);
    return success(res, 'Forum found', { forum });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) return error(res, 'Forum not found', 404);
    if (!forum.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    const allowed = ['title', 'content', 'category', 'tags', 'isResolved'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) forum[key] = req.body[key];
    }
    await forum.save();
    forumCache.clear();
    return success(res, 'Forum updated', { forum });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteForum = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) return error(res, 'Forum not found', 404);
    if (!forum.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    await Comment.deleteMany({ forum: forum._id });
    await Forum.findByIdAndDelete(forum._id);
    forumCache.clear();
    return success(res, 'Forum deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const likeForum = async (req, res) => {
  try {
    const forum = await Forum.findByIdAndUpdate(req.params.id, { $inc: { likesCount: 1 } }, { new: true });
    if (!forum) return error(res, 'Forum not found', 404);
    return success(res, 'Forum liked', { likesCount: forum.likesCount });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
