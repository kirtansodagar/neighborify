import { failedDeletions } from '../middleware/upload.js';

export const cleanupCloudinary = async () => {
  try {
    const count = failedDeletions.length;
    if (count > 0) {
      failedDeletions.length = 0;
      console.log(`Cleared ${count} failed Cloudinary deletions from queue`);
    }
  } catch (err) {
    console.error('Cloudinary cleanup error:', err.message);
  }
};
