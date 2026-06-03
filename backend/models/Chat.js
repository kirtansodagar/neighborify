import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentAt: Date,
  },
  isGroupChat: { type: Boolean, default: false },
  groupName: { type: String, maxlength: 100 },
  groupAvatar: { type: String },
}, { timestamps: true });

chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.sentAt': -1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
