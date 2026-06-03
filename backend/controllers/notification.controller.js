import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';
import { paginate } from '../utils/apiResponse.js';

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const query = { recipient: req.user._id };
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(query),
      Notification.countDocuments({ ...query, isRead: false }),
    ]);
    return success(res, 'Notifications', { notifications, unreadCount }, 200, paginate(Number(page), Number(limit), total));
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { ids, all } = req.body;
    const query = { recipient: req.user._id, isRead: false };
    if (all) {
      await Notification.updateMany(query, { isRead: true });
      return success(res, 'All notifications marked as read');
    }
    if (ids?.length) {
      query._id = { $in: ids };
      await Notification.updateMany(query, { isRead: true });
    }
    return success(res, 'Notifications marked as read');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    if (!notification) return error(res, 'Notification not found', 404);
    return success(res, 'Notification deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};
