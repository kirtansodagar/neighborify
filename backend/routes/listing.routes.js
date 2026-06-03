import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { createListing, getListings, getListing, updateListing, deleteListing } from '../controllers/listing.controller.js';
import { uploadListingImages } from '../middleware/upload.js';

const router = Router();

router.get('/', optionalAuth, getListings);
router.post('/', protect, uploadListingImages, createListing);
router.get('/:id', optionalAuth, getListing);
router.patch('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

export default router;
