import Listing from '../models/Listing.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';
import { sanitizeTitle, sanitizeBody } from '../utils/sanitize.js';

export const createListing = async (req, res) => {
  try {
    const { title, description, price, category, condition } = req.body;
    if (!title || typeof title !== 'string') return error(res, 'Title required', 400);
    const trimmedTitle = title.trim().substring(0, 200);
    const trimmedDesc = description ? String(description).trim().substring(0, 5000) : '';
    const cleanTitle = sanitizeTitle(trimmedTitle);
    const cleanDesc = sanitizeBody(trimmedDesc);
    const listing = await Listing.create({
      title: cleanTitle, description: cleanDesc, price: Number(price) || 0, category, condition,
      seller: req.user._id, pincode: req.user.pincode,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    if (req.files?.length) {
      listing.images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      await listing.save();
    }
    const populated = await listing.populate('seller', 'name avatar');
    return success(res, 'Listing created', { listing: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getListings = async (req, res) => {
  try {
    const { pincode, category, condition, minPrice, maxPrice, q, page = 1, limit = 20 } = req.query;
    const query = { isSold: false };
    if (pincode) query.pincode = pincode;
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (q) {
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.title = { $regex: safeQ, $options: 'i' };
    }
    const skip = (page - 1) * limit;
    const [listings, total] = await Promise.all([
      Listing.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).populate('seller', 'name avatar'),
      Listing.countDocuments(query),
    ]);
    return success(res, 'Listings', { listings }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name avatar phone pincode');
    if (!listing) return error(res, 'Listing not found', 404);
    return success(res, 'Listing found', { listing });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    if (!listing.seller.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    const allowed = ['title', 'description', 'price', 'category', 'condition'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) listing[key] = req.body[key];
    }
    await listing.save();
    return success(res, 'Listing updated', { listing });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return error(res, 'Listing not found', 404);
    if (!listing.seller.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    listing.isSold = true;
    await listing.save();
    return success(res, 'Listing marked as sold');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const cleanupExpiredListings = async () => {
  try {
    const result = await Listing.updateMany(
      { expiresAt: { $lt: new Date() }, isSold: false },
      { isSold: true }
    );
    if (result.modifiedCount > 0) console.log(`Expired ${result.modifiedCount} listings`);
  } catch (err) {
    console.error('Listing cleanup error:', err.message);
  }
};
