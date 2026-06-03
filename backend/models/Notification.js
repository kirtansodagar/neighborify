import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['like', 'comment', 'follow', 'message', 'alert', 'event_reminder', 'payment', 'moderation'], required: true },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  referenceModel: { type: String, enum: ['Post', 'Comment', 'Forum', 'Event', 'Chat', 'Listing', 'User'], default: 'Post' },
  isRead: { type: Boolean, default: false },
  image: { type: String },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
