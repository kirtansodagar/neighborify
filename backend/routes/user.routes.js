import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { getUser, searchUsers, getUserPosts, getUserReviews, toggleFollow, getNeighbors } from '../controllers/user.controller.js';

const router = Router();

router.get('/search', optionalAuth, searchUsers);
router.get('/neighbors', protect, getNeighbors);
router.get('/:id', optionalAuth, getUser);
router.get('/:id/posts', optionalAuth, getUserPosts);
router.get('/:id/reviews', optionalAuth, getUserReviews);
router.post('/:id/follow', protect, toggleFollow);

export default router;
