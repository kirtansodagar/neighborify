import express from 'express';
import mongoose from 'mongoose';
import { success, error } from '../utils/apiResponse.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    return success(res, 'Service healthy', {
      serverTime: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      environment: process.env.NODE_ENV,
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      memoryUsage: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (err) {
    return error(res, 'Health check failed', 500, err);
  }
});

export default router;
