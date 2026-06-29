import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';

export const createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) return error(res, 'Participant ID required', 400);
    const existing = await Chat.findOne({ participants: { $all: [req.user._id, participantId], $size: 2 }, isGroupChat: false });
    if (existing) return success(res, 'Chat exists', { chat: existing });
    const chat = await Chat.create({ participants: [req.user._id, participantId] });
    const populated = await chat.populate('participants', 'name avatar');
    return success(res, 'Chat created', { chat: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .sort({ 'lastMessage.sentAt': -1, updatedAt: -1 })
      .populate('participants', 'name avatar pincode');
    return success(res, 'Chats', { chats });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('participants', 'name avatar pincode');
    if (!chat) return error(res, 'Chat not found', 404);
    if (!chat.participants.some(p => p._id.equals(req.user._id))) return error(res, 'Not authorized', 403);
    return success(res, 'Chat found', { chat });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    if (!chatId || !content || typeof content !== 'string') return error(res, 'Chat ID and content required', 400);
    const trimmed = content.trim().substring(0, 5000);
    if (!trimmed) return error(res, 'Message cannot be empty', 400);
    const chat = await Chat.findById(chatId);
    if (!chat) return error(res, 'Chat not found', 404);
    if (!chat.participants.some(p => p.equals(req.user._id))) return error(res, 'Not authorized', 403);
    const message = await Message.create({ chat: chatId, sender: req.user._id, content });
    chat.lastMessage = { content, sender: req.user._id, sentAt: new Date() };
    await chat.save();
    const populated = await message.populate('sender', 'name avatar');
    const otherParticipants = chat.participants.filter(p => !p.equals(req.user._id));
    for (const userId of otherParticipants) {
      await Notification.create({ recipient: userId, type: 'message', title: 'New message', message: content.substring(0, 100), referenceId: chatId, referenceModel: 'Chat' });
    }
    return success(res, 'Message sent', { message: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return error(res, 'Chat not found', 404);
    if (!chat.participants.some(p => p.equals(req.user._id))) return error(res, 'Not authorized', 403);
    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      Message.find({ chat: req.params.chatId, isDeleted: false }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('sender', 'name avatar'),
      Message.countDocuments({ chat: req.params.chatId, isDeleted: false }),
    ]);
    return success(res, 'Messages', { messages: messages.reverse() }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    if (!messageIds?.length) return error(res, 'Message IDs required', 400);
    await Message.updateMany(
      { _id: { $in: messageIds }, 'readBy.user': { $ne: req.user._id } },
      { $push: { readBy: { user: req.user._id, readAt: new Date() } } }
    );
    return success(res, 'Messages marked as read');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
