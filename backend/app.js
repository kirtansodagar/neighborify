import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import logger from './utils/logger.js';
import { error } from './utils/apiResponse.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { requestId } from './middleware/requestId.js';
import errorHandler from './middleware/errorHandler.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import storyRoutes from './routes/story.routes.js';
import commentRoutes from './routes/comment.routes.js';
import forumRoutes from './routes/forum.routes.js';
import eventRoutes from './routes/event.routes.js';
import listingRoutes from './routes/listing.routes.js';
import reviewRoutes from './routes/review.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();

app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && req.headers['x-arr-ssl'] !== '1') {
      return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    }
    next();
  });
}

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'https:', 'http://res.cloudinary.com'],
      'media-src': ["'self'", 'https:', 'http://res.cloudinary.com'],
      'connect-src': ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173']
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'no-referrer' }
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());
app.use(globalLimiter);
app.use(requestId);
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1000000;
    logger.info(`[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(2)}ms`);
  });
  next();
});

app.use('/api/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/forums', forumRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.use((req, res) => {
  return error(res, 'Route not found', 404);
});

app.use(errorHandler);

export function areRoutesMounted() {
  return true;
}

export default app;
