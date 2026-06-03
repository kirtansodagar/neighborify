import multer from 'multer';
import logger from '../utils/logger.js';
import { error } from '../utils/apiResponse.js';

function getDuplicateField(err) {
  return Object.keys(err.keyValue || {})[0] || 'Field';
}

function formatMongooseValidation(err) {
  return Object.values(err.errors || {}).map((fieldError) => ({
    field: fieldError.path,
    message: fieldError.message
  }));
}

export default function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl
  });

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: process.env.NODE_ENV === 'development' ? formatMongooseValidation(err) : null
    });
  }

  if (err.name === 'CastError') {
    return error(res, 'Invalid ID format', 400, err);
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = getDuplicateField(err);
    return error(res, `${field} already exists`, 409, err);
  }

  if (err.name === 'JsonWebTokenError') {
    return error(res, 'Invalid token', 401, err);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, 'Token expired, please login again', 401, err);
  }

  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    const size = err.maxSizeMb ? `${err.maxSizeMb} MB` : 'allowed';
    return error(res, `File too large. Max size: ${size}`, 413, err);
  }

  if (err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE') {
    return error(res, err.message || 'Unexpected file field', 400, err);
  }

  return error(res, 'Something went wrong', 500, err);
}
