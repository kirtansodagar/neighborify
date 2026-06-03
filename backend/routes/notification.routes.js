import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notification.controller.js';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

export default router;
