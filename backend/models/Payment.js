import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, unique: true, sparse: true },
  paymentId: { type: String, unique: true, sparse: true },
  signature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['created', 'attempted', 'paid', 'failed', 'refunded'], default: 'created' },
  purpose: { type: String, enum: ['event', 'featured_listing', 'donation'], default: 'event' },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  referenceModel: { type: String, enum: ['Event', 'Listing'] },
  refundId: { type: String },
}, { timestamps: true });

paymentSchema.index({ user: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
