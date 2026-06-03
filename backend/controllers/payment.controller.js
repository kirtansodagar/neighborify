import Payment from '../models/Payment.js';
import razorpay from '../config/razorpay.js';
import { success, error } from '../utils/apiResponse.js';

export const createOrder = async (req, res) => {
  try {
    const { amount, purpose, referenceId, referenceModel } = req.body;
    if (!amount || amount < 1) return error(res, 'Valid amount required', 400);
    const options = { amount: Math.round(amount * 100), currency: 'INR', receipt: `receipt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    const payment = await Payment.create({
      user: req.user._id, orderId: order.id, amount, purpose, referenceId, referenceModel, status: 'created',
    });
    return success(res, 'Order created', { order: order, payment }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    if (!orderId || !paymentId || !signature) return error(res, 'All fields required', 400);
    const crypto = await import('crypto');
    const expected = crypto.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
    if (expected !== signature) return error(res, 'Invalid signature', 400);
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentId, signature, status: 'paid' },
      { new: true }
    );
    if (!payment) return error(res, 'Payment not found', 404);
    return success(res, 'Payment verified', { payment });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return success(res, 'Payments', { payments });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const crypto = await import('crypto');
    const expected = crypto.default.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    if (expected !== req.headers['x-razorpay-signature']) return res.status(400).json({ status: 'invalid' });
    const { event, payload } = req.body;
    if (event === 'payment.captured') {
      await Payment.findOneAndUpdate({ orderId: payload.payment.entity.order_id }, { paymentId: payload.payment.entity.id, status: 'paid' });
    }
    return res.json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
