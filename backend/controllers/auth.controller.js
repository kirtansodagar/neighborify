import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

function timingSafeEqual(a, b) {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export const register = async (req, res) => {
  try {
    const { name, phone, pincode, password } = req.body;
    const exists = await User.findOne({ phone });
    if (exists) return error(res, 'Phone already registered', 409);
    const user = await User.create({ name, phone, pincode, password, isPhoneVerified: true });
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return success(res, 'Registration successful', { user, accessToken, refreshToken }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select('+password +loginAttempts +lockUntil');
    if (!user) return error(res, 'Invalid credentials', 401);

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitMin = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return error(res, `Account locked. Try again in ${waitMin} minute(s)`, 423);
    }

    if (user.isBanned) return error(res, 'Account is banned', 403);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.loginAttempts = 0;
      }
      await user.save({ validateBeforeSave: false });
      return error(res, 'Invalid credentials', 401);
    }

    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return success(res, 'Login successful', { user, accessToken, refreshToken });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return error(res, 'Refresh token required', 400);
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || !timingSafeEqual(user.refreshToken, token)) {
      return error(res, 'Invalid refresh token', 401);
    }
    const accessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return success(res, 'Token refreshed', { accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return error(res, 'Invalid refresh token', 401);
  }
};

export const logout = async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save({ validateBeforeSave: false });
    return success(res, 'Logged out successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMe = async (req, res) => {
  return success(res, 'User profile', { user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'email', 'neighborhood', 'city', 'state'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    return success(res, 'Profile updated', { user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return error(res, 'Phone number required', 400);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await User.findOneAndUpdate({ phone }, { otp: hashedOtp, otpExpires: Date.now() + 10 * 60 * 1000 });
    return success(res, 'OTP sent successfully', { message: 'OTP sent to your phone' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return error(res, 'Phone and OTP required', 400);
    const user = await User.findOne({ phone, otpExpires: { $gt: Date.now() } }).select('+otp');
    if (!user || !await bcrypt.compare(otp, user.otp)) {
      return error(res, 'Invalid or expired OTP', 401);
    }
    user.isPhoneVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return success(res, 'OTP verified', { verified: true });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
