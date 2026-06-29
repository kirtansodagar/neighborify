import { Server } from 'socket.io';
import logger from './utils/logger.js';
import { verifyAccessToken } from './utils/jwt.js';
import User from './models/User.js';
import Message from './models/Message.js';
import Chat from './models/Chat.js';

let io = null;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (!user || user.isBanned) return next(new Error('User not found or banned'));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.userId}`);

    socket.join(`user:${socket.userId}`);
    socket.join(`pincode:${socket.user.pincode}`);

    socket.on('chat:join', (chatId) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on('chat:leave', (chatId) => {
      socket.leave(`chat:${chatId}`);
    });

    socket.on('chat:message', async (data) => {
      try {
        const { chatId, content } = data;
        if (!chatId || !content || typeof content !== 'string') return;
        const trimmed = content.trim().substring(0, 5000);
        if (!trimmed) return;
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.some(p => p.toString() === socket.userId)) return;
        const message = await Message.create({ chat: chatId, sender: socket.userId, content: trimmed });
        chat.lastMessage = { content: trimmed, sender: socket.userId, sentAt: new Date() };
        await chat.save();
        const populated = await message.populate('sender', 'name avatar');
        io.to(`chat:${chatId}`).emit('chat:message', populated);
        for (const participant of chat.participants) {
          const pid = participant.toString();
          if (pid !== socket.userId) {
            io.to(`user:${pid}`).emit('chat:new', { chatId, message: populated });
          }
        }
      } catch (err) {
        logger.error(`Socket chat:message error: ${err.message}`);
      }
    });

    socket.on('chat:typing', (data) => {
      const { chatId, isTyping } = data;
      if (!chatId || typeof isTyping !== 'boolean') return;
      socket.to(`chat:${chatId}`).emit('chat:typing', { userId: socket.userId, isTyping });
    });

    socket.on('post:liked', (data) => {
      const { postId, authorId } = data;
      if (!postId || !authorId || authorId === socket.userId) return;
      io.to(`user:${authorId}`).emit('notification', {
        type: 'like', title: 'Someone liked your post', referenceId: postId, referenceModel: 'Post',
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.userId}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
}

export function getSocketServer() {
  return io;
}

export function closeSocketServer() {
  if (io) {
    io.close();
    io = null;
    logger.info('Socket.IO server closed');
  }
}

export function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

export function emitToPincode(pincode, event, data) {
  if (io) {
    io.to(`pincode:${pincode}`).emit(event, data);
  }
}
