import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createChat, getChats, getChat, sendMessage, getMessages, markAsRead } from '../controllers/chat.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:id', validateObjectId('id'), protect, getChat);
router.get('/:chatId/messages', validateObjectId('chatId'), protect, getMessages);
router.post('/:chatId/messages', validateObjectId('chatId'), protect, sendMessage);
router.post('/messages/read', protect, markAsRead);

export default router;
