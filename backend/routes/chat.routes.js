import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createChat, getChats, getChat, sendMessage, getMessages, markAsRead } from '../controllers/chat.controller.js';

const router = Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:id', protect, getChat);
router.get('/:chatId/messages', protect, getMessages);
router.post('/:chatId/messages', protect, sendMessage);
router.post('/messages/read', protect, markAsRead);

export default router;
