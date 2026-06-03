import mongoose from 'mongoose';
import { error } from '../utils/apiResponse.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { ROLES } from '../utils/constants.js';

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
}

async function loadUser(userId) {
  const User = mongoose.models.User;

  if (!User) {
    throw new Error('User model is not registered');
  }

  return User.findById(userId).select('-password');
}

export async function protect(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return error(res, 'Authentication required', 401);
    }

    const decoded = verifyAccessToken(token);
    const user = await loadUser(decoded.id);

    if (!user) {
      return error(res, 'User not found', 401);
    }

    if (user.isBanned) {
      return error(res, 'Your account has been suspended', 403);
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await loadUser(decoded.id);

    if (!user || user.isBanned) {
      return next();
    }

    req.user = user;
    return next();
  } catch (err) {
    return next();
  }
}

export function requireRole(...roles) {
  const allowedRoles = roles.length > 0 ? roles : Object.values(ROLES);

  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Insufficient permissions', 403);
    }

    return next();
  };
}
