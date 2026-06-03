import Razorpay from 'razorpay';

let razorpay = null;

function getRazorpay() {
  if (!razorpay && isRazorpayConfigured()) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export default new Proxy({}, {
  get(_, prop) {
    const instance = getRazorpay();
    if (!instance) {
      if (prop === 'orders') return { create: () => Promise.reject(new Error('Razorpay not configured')) };
      return () => Promise.reject(new Error('Razorpay not configured'));
    }
    return instance[prop];
  }
});
