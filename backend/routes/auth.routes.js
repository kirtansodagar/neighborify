import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, refreshToken, logout, getMe, updateProfile, sendOTP, verifyOTP } from '../controllers/auth.controller.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.post('/send-otp', authLimiter, sendOTP);
router.post('/verify-otp', authLimiter, verifyOTP);

export default router;
