import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Forum from '../models/Forum.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';

export const createComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { postId, forumId } = req.params;
    if (!text || typeof text !== 'string') return error(res, 'Text required', 400);
    const trimmedText = text.trim().substring(0, 5000);
    if (!trimmedText) return error(res, 'Comment cannot be empty', 400);
    const comment = await Comment.create({
      text: trimmedText,
      author: req.user._id,
      post: postId || undefined,
      forum: forumId || undefined,
      parentComment: parentComment || undefined,
    });
    if (postId) {
      const post = await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      if (post && !post.author.equals(req.user._id)) {
        await Notification.create({ recipient: post.author, type: 'comment', title: 'Commented on your post', referenceId: postId, referenceModel: 'Post', image: req.user.avatar });
      }
    }
    if (forumId) {
      await Forum.findByIdAndUpdate(forumId, { $inc: { commentsCount: 1 } });
    }
    const populated = await comment.populate('author', 'name avatar');
    return success(res, 'Comment created', { comment: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getPostComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const query = { post: req.params.postId, parentComment: null };
    const [comments, total] = await Promise.all([
      Comment.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar'),
      Comment.countDocuments(query),
    ]);
    const commentsWithReplies = await Promise.all(
      comments.map(async (c) => {
        const replies = await Comment.find({ parentComment: c._id }).sort({ createdAt: 1 }).populate('author', 'name avatar');
        return { ...c.toObject(), replies };
      })
    );
    return success(res, 'Comments', { comments: commentsWithReplies }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getForumComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const query = { forum: req.params.forumId, parentComment: null };
    const [comments, total] = await Promise.all([
      Comment.find(query).sort({ createdAt: 1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar'),
      Comment.countDocuments(query),
    ]);
    const commentsWithReplies = await Promise.all(
      comments.map(async (c) => {
        const replies = await Comment.find({ parentComment: c._id }).sort({ createdAt: 1 }).populate('author', 'name avatar');
        return { ...c.toObject(), replies };
      })
    );
    return success(res, 'Comments', { comments: commentsWithReplies }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return error(res, 'Comment not found', 404);
    if (!comment.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    if (comment.post) await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    if (comment.forum) await Forum.findByIdAndUpdate(comment.forum, { $inc: { commentsCount: -1 } });
    await Comment.deleteMany({ parentComment: comment._id });
    await Comment.findByIdAndDelete(comment._id);
    return success(res, 'Comment deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
