import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { type: String, maxlength: 5000, default: '' },
  media: [{ url: String, publicId: String, type: { type: String, enum: ['image', 'video'] } }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  type: { type: String, enum: ['text', 'image', 'reel', 'alert', 'poll'], default: 'text' },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  feedScore: { type: Number, default: 0, index: true },
  alertType: { type: String, enum: ['safety', 'lost_found', 'traffic', 'utility', 'weather', 'general', null], default: null },
  pollData: {
    question: String,
    options: [{ text: String, votes: { type: Number, default: 0 } }],
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    endsAt: Date,
  },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.index({ pincode: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ feedScore: -1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
