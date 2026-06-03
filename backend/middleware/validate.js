import mongoose from 'mongoose';
import { body, param, query, validationResult } from 'express-validator';
import { isValidPincode } from '../utils/pincode.js';

export const handleValidation = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((validationError) => ({
    field: validationError.path,
    message: validationError.msg
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    error: process.env.NODE_ENV === 'development' ? errors : null
  });
};

export const pincodeValidator = body('pincode')
  .isLength({ min: 6, max: 6 })
  .withMessage('Pincode must be exactly 6 digits')
  .isNumeric()
  .withMessage('Pincode must contain only numbers')
  .custom((value) => isValidPincode(value))
  .withMessage('Invalid Indian pincode');

export const phoneValidator = body('phone')
  .matches(/^\+91[6-9]\d{9}$/)
  .withMessage('Phone must be a valid Indian mobile number with +91 prefix');

export const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

export const objectIdValidator = (fieldName) => param(fieldName)
  .custom((value) => mongoose.Types.ObjectId.isValid(value))
  .withMessage(`${fieldName} must be a valid MongoDB ObjectId`);

export const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1')
    .toInt(),
  query('limit')
    .optional()
    .default(20)
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt()
];
