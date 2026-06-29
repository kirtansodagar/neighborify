import rateLimit from 'express-rate-limit';
import { error } from '../utils/apiResponse.js';

function createLimiter(windowMs, limit, message) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => error(res, message, 429)
  });
}

export const globalLimiter = createLimiter(15 * 60 * 1000, 100, 'Too many requests, please try again later');
export const otpLimiter = createLimiter(60 * 60 * 1000, 5, 'Too many OTP requests, please try again later');
export const uploadLimiter = createLimiter(60 * 60 * 1000, 20, 'Too many upload requests, please try again later');
export const authLimiter = createLimiter(15 * 60 * 1000, 10, 'Too many authentication requests, please try again later');
export const refreshLimiter = createLimiter(15 * 60 * 1000, 20, 'Too many token refresh requests, please try again later');
