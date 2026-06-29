import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createListing, getListings, getListing, updateListing, deleteListing } from '../controllers/listing.controller.js';
import { uploadListingImages } from '../middleware/upload.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, getListings);
router.post('/', protect, uploadListingImages, createListing);
router.get('/:id', validateObjectId('id'), optionalAuth, getListing);
router.patch('/:id', validateObjectId('id'), protect, updateListing);
router.delete('/:id', validateObjectId('id'), protect, deleteListing);

export default router;
