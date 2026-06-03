import Story from '../models/Story.js';
import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';

export const createStory = async (req, res) => {
  try {
    if (!req.file) return error(res, 'Media file required', 400);
    const story = await Story.create({
      media: { url: req.file.path || '', publicId: req.file.filename || '', type: req.file.mimetype?.startsWith('video') ? 'video' : 'image' },
      author: req.user._id,
      pincode: req.user.pincode,
      caption: req.body.caption || '',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    const populated = await story.populate('author', 'name avatar');
    return success(res, 'Story created', { story: populated }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getActiveStories = async (req, res) => {
  try {
    const { pincode } = req.query;
    const query = {
      expiresAt: { $gt: new Date() },
      isArchived: false,
    };
    if (pincode) query.pincode = pincode;
    const stories = await Story.find(query).sort({ createdAt: -1 }).populate('author', 'name avatar pincode');
    const grouped = {};
    for (const story of stories) {
      const authorId = story.author._id.toString();
      if (!grouped[authorId]) {
        grouped[authorId] = { user: story.author, stories: [] };
      }
      grouped[authorId].stories.push(story);
    }
    return success(res, 'Active stories', { groups: Object.values(grouped) });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const viewStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { viewers: req.user._id } },
      { new: true }
    );
    if (!story) return error(res, 'Story not found', 404);
    return success(res, 'Story viewed', { viewersCount: story.viewers.length });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return error(res, 'Story not found', 404);
    if (!story.author.equals(req.user._id) && req.user.role !== 'admin') return error(res, 'Not authorized', 403);
    story.isArchived = true;
    await story.save();
    return success(res, 'Story deleted');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const cleanupExpiredStories = async () => {
  try {
    const result = await Story.deleteMany({ expiresAt: { $lt: new Date() } });
    if (result.deletedCount > 0) console.log(`Cleaned up ${result.deletedCount} expired stories`);
  } catch (err) {
    console.error('Story cleanup error:', err.message);
  }
};
