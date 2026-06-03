import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, verifyPayment, getPayments } from '../controllers/payment.controller.js';

const router = Router();

router.get('/', protect, getPayments);
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
