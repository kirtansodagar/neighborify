import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function connectDB(attempt = 1) {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB connected to ${connection.connection.name} at ${connection.connection.host}`);
    return connection;
  } catch (err) {
    logger.error(`MongoDB connection attempt ${attempt} failed: ${err.message}`);

    if (attempt >= MAX_RETRIES) {
      throw err;
    }

    logger.info(`Retrying MongoDB connection, attempt ${attempt + 1} of ${MAX_RETRIES}`);
    await wait(RETRY_DELAY_MS);
    return connectDB(attempt + 1);
  }
}
