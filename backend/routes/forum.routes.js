import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createForum, getForums, getForum, updateForum, deleteForum, likeForum } from '../controllers/forum.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, getForums);
router.post('/', protect, createForum);
router.get('/:id', validateObjectId('id'), optionalAuth, getForum);
router.patch('/:id', validateObjectId('id'), protect, updateForum);
router.delete('/:id', validateObjectId('id'), protect, deleteForum);
router.post('/:id/like', validateObjectId('id'), protect, likeForum);

export default router;
