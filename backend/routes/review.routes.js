import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createReview, getReviews, deleteReview } from '../controllers/review.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', getReviews);
router.post('/', protect, createReview);
router.delete('/:id', validateObjectId('id'), protect, deleteReview);

export default router;
