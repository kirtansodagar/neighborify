import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, refreshToken, logout, getMe, updateProfile, sendOTP, verifyOTP } from '../controllers/auth.controller.js';
import { authLimiter, otpLimiter, refreshLimiter } from '../middleware/rateLimiter.js';
import { phoneValidator, passwordValidator, pincodeValidator, handleValidation } from '../middleware/validate.js';

const router = Router();

router.post('/register', authLimiter, phoneValidator, passwordValidator, pincodeValidator, handleValidation, register);
router.post('/login', authLimiter, phoneValidator, handleValidation, login);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.post('/send-otp', otpLimiter, phoneValidator, handleValidation, sendOTP);
router.post('/verify-otp', otpLimiter, phoneValidator, handleValidation, verifyOTP);

export default router;
