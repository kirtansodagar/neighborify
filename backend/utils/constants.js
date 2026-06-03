export const ROLES = Object.freeze({
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
});

export const POST_TYPES = Object.freeze({
  TEXT: 'text',
  IMAGE: 'image',
  REEL: 'reel',
  ALERT: 'alert',
  POLL: 'poll'
});

export const NOTIFICATION_TYPES = Object.freeze({
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
  ALERT: 'alert',
  EVENT_REMINDER: 'event_reminder',
  PAYMENT: 'payment',
  MODERATION: 'moderation'
});

export const ALERT_TYPES = Object.freeze({
  SAFETY: 'safety',
  LOST_FOUND: 'lost_found',
  TRAFFIC: 'traffic',
  UTILITY: 'utility',
  WEATHER: 'weather',
  GENERAL: 'general'
});

export const FORUM_CATEGORIES = Object.freeze({
  GENERAL: 'general',
  HELP: 'help',
  RECOMMENDATIONS: 'recommendations',
  SAFETY: 'safety',
  BUY_SELL: 'buy_sell',
  EVENTS: 'events'
});

export const LISTING_CATEGORIES = Object.freeze({
  ELECTRONICS: 'electronics',
  FURNITURE: 'furniture',
  VEHICLES: 'vehicles',
  HOME: 'home',
  BOOKS: 'books',
  SERVICES: 'services',
  OTHER: 'other'
});

export const EVENT_TYPES = Object.freeze({
  MEETUP: 'meetup',
  FESTIVAL: 'festival',
  SPORTS: 'sports',
  WORKSHOP: 'workshop',
  VOLUNTEERING: 'volunteering',
  OTHER: 'other'
});

export const UPLOAD_LIMITS = Object.freeze({
  AVATAR: { maxSize: 5 * 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  POST_IMAGE: { maxSize: 10 * 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  REEL_VIDEO: { maxSize: 100 * 1024 * 1024, mimeTypes: ['video/mp4', 'video/quicktime', 'video/webm'] },
  STORY_IMAGE: { maxSize: 5 * 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  STORY_VIDEO: { maxSize: 30 * 1024 * 1024, mimeTypes: ['video/mp4', 'video/quicktime'] },
  LISTING_IMAGE: { maxSize: 10 * 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], maxCount: 5 },
  EVENT_COVER: { maxSize: 10 * 1024 * 1024, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] }
});

export const CACHE_TTL = Object.freeze({
  GEOCODE: 24 * 60 * 60 * 1000,
  FEED: 3 * 60 * 1000,
  PROFILE: 5 * 60 * 1000,
  FORUM: 10 * 60 * 1000
});
