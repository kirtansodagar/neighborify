import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createStory, getActiveStories, viewStory, deleteStory } from '../controllers/story.controller.js';
import { uploadStory } from '../middleware/upload.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, getActiveStories);
router.post('/', protect, uploadStory, createStory);
router.post('/:id/view', validateObjectId('id'), protect, viewStory);
router.delete('/:id', validateObjectId('id'), protect, deleteStory);

export default router;
