import Review from '../models/Review.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';

export const createReview = async (req, res) => {
  try {
    const { rating, text, targetUser, listing } = req.body;
    if (!targetUser && !listing) return error(res, 'Target user or listing required', 400);
    const existing = await Review.findOne({
      reviewer: req.user._id,
      ...(targetUser ? { targetUser } : {}),
      ...(listing ? { listing } : {}),
    });
    if (existing) return error(res, 'Already reviewed', 409);
    const review = await Review.create({ rating, text, reviewer: req.user._id, targetUser, listing });
    const populated = await review.populate('reviewer', 'name avatar');
    return success(res, 'Review created', { review: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getReviews = async (req, res) => {
  try {
    const { targetUser, listing, page = 1, limit = 20 } = req.query;
    const query = {};
    if (targetUser) query.targetUser = targetUser;
    if (listing) query.listing = listing;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('reviewer', 'name avatar'),
      Review.countDocuments(query),
    ]);
    const stats = await Review.aggregate([
      { $match: query },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } },
    ]);
    return success(res, 'Reviews', { reviews, stats: stats[0] || { avgRating: 0, totalReviews: 0 } }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return error(res, 'Review not found', 404);
    if (!review.reviewer.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    await Review.findByIdAndDelete(req.params.id);
    return success(res, 'Review deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
