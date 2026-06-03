import { v2 as cloudinary } from 'cloudinary';

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const UPLOAD_PRESETS = {
  avatar: { folder: 'neighborify/avatars', transformation: [{ width: 400, height: 400, crop: 'fill' }] },
  post: { folder: 'neighborify/posts' },
  reel: { folder: 'neighborify/reels', resource_type: 'video' },
  story: { folder: 'neighborify/stories' },
  listing: { folder: 'neighborify/listings' },
  event: { folder: 'neighborify/events' }
};

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export default cloudinary;
