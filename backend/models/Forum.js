import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200, trim: true },
  content: { type: String, required: true, maxlength: 10000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  category: { type: String, enum: ['general', 'help', 'recommendations', 'safety', 'buy_sell', 'events'], default: 'general' },
  tags: [{ type: String, maxlength: 30 }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isResolved: { type: Boolean, default: false },
}, { timestamps: true });

forumSchema.index({ pincode: 1, category: 1, createdAt: -1 });
forumSchema.index({ author: 1 });

const Forum = mongoose.model('Forum', forumSchema);
export default Forum;
