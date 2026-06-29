import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { getUser, searchUsers, getUserPosts, getUserReviews, toggleFollow, getNeighbors } from '../controllers/user.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/search', optionalAuth, searchUsers);
router.get('/neighbors', protect, getNeighbors);
router.get('/:id', validateObjectId('id'), optionalAuth, getUser);
router.get('/:id/posts', validateObjectId('id'), optionalAuth, getUserPosts);
router.get('/:id/reviews', validateObjectId('id'), optionalAuth, getUserReviews);
router.post('/:id/follow', validateObjectId('id'), protect, toggleFollow);

export default router;
