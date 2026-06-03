import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createForum, getForums, getForum, updateForum, deleteForum, likeForum } from '../controllers/forum.controller.js';

const router = Router();

router.get('/', optionalAuth, getForums);
router.post('/', protect, createForum);
router.get('/:id', optionalAuth, getForum);
router.patch('/:id', protect, updateForum);
router.delete('/:id', protect, deleteForum);
router.post('/:id/like', protect, likeForum);

export default router;
