import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent, rsvpEvent } from '../controllers/event.controller.js';
import { uploadEventCover } from '../middleware/upload.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, getEvents);
router.post('/', protect, uploadEventCover, createEvent);
router.get('/:id', validateObjectId('id'), optionalAuth, getEvent);
router.patch('/:id', validateObjectId('id'), protect, updateEvent);
router.delete('/:id', validateObjectId('id'), protect, deleteEvent);
router.post('/:id/rsvp', validateObjectId('id'), protect, rsvpEvent);

export default router;
