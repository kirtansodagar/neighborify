import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200, trim: true },
  description: { type: String, maxlength: 5000, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pincode: { type: String, required: true, match: /^\d{6}$/ },
  eventType: { type: String, enum: ['meetup', 'festival', 'sports', 'workshop', 'volunteering', 'other'], default: 'meetup' },
  coverImage: { url: String, publicId: String },
  location: { name: String, lat: Number, lng: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  isCanceled: { type: Boolean, default: false },
}, { timestamps: true });

eventSchema.index({ pincode: 1, startDate: -1 });
eventSchema.index({ author: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
