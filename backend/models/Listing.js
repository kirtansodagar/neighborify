import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200, trim: true },
  description: { type: String, maxlength: 5000, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['electronics', 'furniture', 'vehicles', 'home', 'books', 'services', 'other'], default: 'other' },
  condition: { type: String, enum: ['new', 'like_new', 'good', 'fair', 'poor'], default: 'good' },
  images: [{ url: String, publicId: String }],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  isSold: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  expiresAt: { type: Date },
}, { timestamps: true });

listingSchema.index({ pincode: 1, category: 1, createdAt: -1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ isSold: 1, expiresAt: 1 });

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
