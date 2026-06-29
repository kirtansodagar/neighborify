import Event from '../models/Event.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';
import { sanitizeTitle, sanitizeBody } from '../utils/sanitize.js';
import { paginate } from '../utils/apiResponse.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, eventType, location, startDate, endDate, maxAttendees, isPaid, price } = req.body;
    if (!title || typeof title !== 'string') return error(res, 'Title required', 400);
    const trimmedTitle = title.trim().substring(0, 200);
    const trimmedDesc = description ? String(description).trim().substring(0, 5000) : '';
    const cleanTitle = sanitizeTitle(trimmedTitle);
    const cleanDesc = sanitizeBody(trimmedDesc);
    const event = await Event.create({
      title: cleanTitle, description: cleanDesc, eventType, location, startDate, endDate,
      maxAttendees, isPaid, price,
      author: req.user._id, pincode: req.user.pincode,
    });
    if (req.file) event.coverImage = { url: req.file.path, publicId: req.file.filename };
    await event.save();
    const populated = await event.populate('author', 'name avatar');
    return success(res, 'Event created', { event: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getEvents = async (req, res) => {
  try {
    const { pincode, eventType, page = 1, limit = 20 } = req.query;
    const query = { isCanceled: false };
    if (pincode) query.pincode = pincode;
    if (eventType) query.eventType = eventType;
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      Event.find(query).sort({ startDate: 1 }).skip(skip).limit(Number(limit)).populate('author', 'name avatar'),
      Event.countDocuments(query),
    ]);
    return success(res, 'Events', { events }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('author', 'name avatar pincode').populate('attendees', 'name avatar');
    if (!event) return error(res, 'Event not found', 404);
    return success(res, 'Event found', { event });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    if (!event.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    const allowed = ['title', 'description', 'eventType', 'location', 'startDate', 'endDate', 'maxAttendees', 'isPaid', 'price'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) event[key] = req.body[key];
    }
    await event.save();
    return success(res, 'Event updated', { event });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    if (!event.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    event.isCanceled = true;
    await event.save();
    return success(res, 'Event canceled');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return error(res, 'Event not found', 404);
    if (event.isCanceled) return error(res, 'Event is canceled', 400);
    const alreadyAttending = event.attendees.some(a => a.equals(req.user._id));
    if (alreadyAttending) {
      event.attendees.pull(req.user._id);
      await event.save();
      return success(res, 'RSVP canceled', { attending: false, attendeesCount: event.attendees.length });
    }
    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return error(res, 'Event is full', 400);
    }
    event.attendees.push(req.user._id);
    await event.save();
    return success(res, 'RSVP confirmed', { attending: true, attendeesCount: event.attendees.length });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const sendEventReminders = async () => {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const events = await Event.find({ startDate: { $gte: now, $lte: in24h }, isCanceled: false });
    for (const event of events) {
      for (const attendeeId of event.attendees) {
        await Notification.create({
          recipient: attendeeId, type: 'event_reminder',
          title: `Reminder: ${event.title}`,
          message: `Starts at ${event.startDate.toLocaleString()}`,
          referenceId: event._id, referenceModel: 'Event',
        });
      }
    }
  } catch (err) {
    console.error('Event reminder error:', err.message);
  }
};
