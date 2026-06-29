import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markAsRead, deleteNotification } from '../controllers/notification.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/read', protect, markAsRead);
router.delete('/:id', validateObjectId('id'), protect, deleteNotification);

export default router;
