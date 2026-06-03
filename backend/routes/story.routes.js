import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createStory, getActiveStories, viewStory, deleteStory } from '../controllers/story.controller.js';
import { uploadStory } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getActiveStories);
router.post('/', protect, uploadStory, createStory);
router.post('/:id/view', protect, viewStory);
router.delete('/:id', protect, deleteStory);

export default router;
