import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', index: true },
  forum: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', index: true },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likesCount: { type: Number, default: 0 },
  isEdited: { type: Boolean, default: false },
}, { timestamps: true });

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ forum: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
