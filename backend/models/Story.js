import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  media: { url: String, publicId: String, type: { type: String, enum: ['image', 'video'] } },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  caption: { type: String, maxlength: 200, default: '' },
  expiresAt: { type: Date, required: true, index: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

storySchema.index({ pincode: 1, createdAt: -1 });
storySchema.index({ author: 1, createdAt: -1 });

const Story = mongoose.model('Story', storySchema);
export default Story;
