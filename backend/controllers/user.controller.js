import User from '../models/User.js';
import Post from '../models/Post.js';
import Review from '../models/Review.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, 'User found', { user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q, pincode, page = 1, limit = 20 } = req.query;
    const query = {};
    if (q) {
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.name = { $regex: safeQ, $options: 'i' };
    }
    if (pincode) query.pincode = pincode;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-refreshToken'),
      User.countDocuments(query),
    ]);
    return success(res, 'Users found', { users }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const query = { author: req.params.id, isArchived: false };
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar pincode'),
      Post.countDocuments(query),
    ]);
    return success(res, 'User posts', { posts }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const query = { targetUser: req.params.id };
    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('reviewer', 'name avatar'),
      Review.countDocuments(query),
    ]);
    return success(res, 'User reviews', { reviews }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return error(res, 'User not found', 404);
    if (target._id.equals(req.user._id)) return error(res, 'Cannot follow yourself', 400);
    return success(res, 'Follow toggled (placeholder)', { following: true });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getNeighbors = async (req, res) => {
  try {
    const { pincode, page = 1, limit = 20 } = req.query;
    if (!pincode) return error(res, 'Pincode required', 400);
    const skip = (page - 1) * limit;
    const query = { pincode, _id: { $ne: req.user?._id } };
    const [users, total] = await Promise.all([
      User.find(query).sort({ postsCount: -1 }).skip(skip).limit(Number(limit)).select('name avatar bio pincode followersCount'),
      User.countDocuments(query),
    ]);
    return success(res, 'Neighbors found', { users }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};
