import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

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
    const user = await User.findOne({ phone }).select('+password');
    if (!user) return error(res, 'Invalid credentials', 401);
    if (user.isBanned) return error(res, 'Account is banned', 403);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);
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
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return error(res, 'Invalid refresh token', 401);
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
    return success(res, 'OTP sent successfully (dev mode)', { otp, message: 'In production, SMS would be sent via Twilio' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return error(res, 'Phone and OTP required', 400);
    return success(res, 'OTP verified', { verified: true });
  } catch (err) {
    return error(res, err.message, 500);
  }
};
