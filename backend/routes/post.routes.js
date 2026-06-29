import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createPost, getFeed, getPost, updatePost, deletePost, likePost, unlikePost, getAlerts } from '../controllers/post.controller.js';
import { uploadPostMedia } from '../middleware/upload.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/feed', optionalAuth, getFeed);
router.get('/alerts', optionalAuth, getAlerts);
router.post('/', protect, uploadPostMedia, createPost);
router.get('/:id', validateObjectId('id'), optionalAuth, getPost);
router.patch('/:id', validateObjectId('id'), protect, updatePost);
router.delete('/:id', validateObjectId('id'), protect, deletePost);
router.post('/:id/like', validateObjectId('id'), protect, likePost);
router.post('/:id/unlike', validateObjectId('id'), protect, unlikePost);

export default router;
