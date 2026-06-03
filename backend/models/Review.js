import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, maxlength: 2000, default: '' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', index: true },
}, { timestamps: true });

reviewSchema.index({ reviewer: 1, targetUser: 1 }, { unique: true, sparse: true });
reviewSchema.index({ reviewer: 1, listing: 1 }, { unique: true, sparse: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
