import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent, rsvpEvent } from '../controllers/event.controller.js';
import { uploadEventCover } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getEvents);
router.post('/', protect, uploadEventCover, createEvent);
router.get('/:id', optionalAuth, getEvent);
router.patch('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/rsvp', protect, rsvpEvent);

export default router;
