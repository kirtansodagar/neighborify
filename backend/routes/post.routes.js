import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createPost, getFeed, getPost, updatePost, deletePost, likePost, unlikePost, getAlerts } from '../controllers/post.controller.js';
import { uploadPostMedia } from '../middleware/upload.js';

const router = Router();

router.get('/feed', optionalAuth, getFeed);
router.get('/alerts', optionalAuth, getAlerts);
router.post('/', protect, uploadPostMedia, createPost);
router.get('/:id', optionalAuth, getPost);
router.patch('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);

export default router;
