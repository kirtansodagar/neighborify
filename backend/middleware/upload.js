import { Readable } from 'stream';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';
import { UPLOAD_LIMITS } from '../utils/constants.js';

export const failedDeletions = [];

const storage = multer.memoryStorage();

function createMulterError(code, message, maxSizeMb = null) {
  const err = new multer.MulterError(code);
  err.message = message;
  err.maxSizeMb = maxSizeMb;
  return err;
}

function validateFile(file, rule) {
  if (!rule.mimeTypes.includes(file.mimetype)) {
    throw createMulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type');
  }

  if (file.size > rule.maxSize) {
    throw createMulterError('LIMIT_FILE_SIZE', `File too large. Max size: ${rule.maxSize / 1024 / 1024} MB`, rule.maxSize / 1024 / 1024);
  }
}

function validateFiles(files, allowedRules) {
  for (const file of files) {
    const rule = allowedRules.find((candidate) => candidate.mimeTypes.includes(file.mimetype));

    if (!rule) {
      throw createMulterError('LIMIT_UNEXPECTED_FILE', 'Unsupported file type');
    }

    validateFile(file, rule);
  }
}

function buildUploader(multerMiddleware, getFiles, allowedRules) {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      try {
        if (err) {
          if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            const maxSize = Math.max(...allowedRules.map((rule) => rule.maxSize));
            err.maxSizeMb = maxSize / 1024 / 1024;
          }
          return next(err);
        }

        validateFiles(getFiles(req), allowedRules);
        return next();
      } catch (validationError) {
        return next(validationError);
      }
    });
  };
}

function baseUpload(maxSize) {
  return multer({
    storage,
    limits: { fileSize: maxSize }
  });
}

export const uploadAvatar = buildUploader(
  baseUpload(UPLOAD_LIMITS.AVATAR.maxSize).single('avatar'),
  (req) => (req.file ? [req.file] : []),
  [UPLOAD_LIMITS.AVATAR]
);

export const uploadPostMedia = buildUploader(
  baseUpload(UPLOAD_LIMITS.POST_IMAGE.maxSize).array('media', 5),
  (req) => req.files || [],
  [UPLOAD_LIMITS.POST_IMAGE]
);

export const uploadReel = buildUploader(
  baseUpload(UPLOAD_LIMITS.REEL_VIDEO.maxSize).single('reel'),
  (req) => (req.file ? [req.file] : []),
  [UPLOAD_LIMITS.REEL_VIDEO]
);

export const uploadStory = buildUploader(
  baseUpload(UPLOAD_LIMITS.STORY_VIDEO.maxSize).single('story'),
  (req) => (req.file ? [req.file] : []),
  [UPLOAD_LIMITS.STORY_IMAGE, UPLOAD_LIMITS.STORY_VIDEO]
);

export const uploadListingImages = buildUploader(
  baseUpload(UPLOAD_LIMITS.LISTING_IMAGE.maxSize).array('images', UPLOAD_LIMITS.LISTING_IMAGE.maxCount),
  (req) => req.files || [],
  [UPLOAD_LIMITS.LISTING_IMAGE]
);

export const uploadEventCover = buildUploader(
  baseUpload(UPLOAD_LIMITS.EVENT_COVER.maxSize).single('cover'),
  (req) => (req.file ? [req.file] : []),
  [UPLOAD_LIMITS.EVENT_COVER]
);

export async function uploadToCloudinary(buffer, mimetype, preset) {
  try {
    const resourceType = mimetype.startsWith('video/') ? 'video' : 'image';

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { ...preset, resource_type: preset?.resource_type || resourceType },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}

export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    failedDeletions.push({ publicId, resourceType, failedAt: new Date() });
    logger.error(`Cloudinary delete failed for ${publicId}: ${err.message}`);
  }
}
