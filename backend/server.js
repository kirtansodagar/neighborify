import dotenv from 'dotenv';

dotenv.config();

const { default: mongoose } = await import('mongoose');
const { default: logger } = await import('./utils/logger.js');
const { validateEnv } = await import('./config/env.js');
const { connectDB } = await import('./config/db.js');

let server = null;
let app = null;
let initializeSocket = null;
let closeSocketServer = () => {};
let startCronJobs = null;
let stopCronJobs = () => {};

function shouldExitOnFatal() {
  return process.env.NODE_ENV === 'production';
}

function handleFatalError(type, err) {
  logger.error(`${type}: ${err?.stack || err?.message || err}`);

  if (shouldExitOnFatal()) {
    process.exit(1);
  }
}

process.on('uncaughtException', (err) => {
  handleFatalError('uncaughtException', err);
});

process.on('unhandledRejection', (reason) => {
  handleFatalError('unhandledRejection', reason);
});

async function flushLogs() {
  try {
    await Promise.all(
      logger.transports.map((transport) => new Promise((resolve) => {
        if (typeof transport.close === 'function') {
          transport.close();
        }
        resolve();
      }))
    );
  } catch (err) {
    logger.error(`Failed to flush logs: ${err.message}`);
  }
}

async function gracefulShutdown(signal) {
  try {
    logger.info(`${signal} received. Starting graceful shutdown`);

    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }

    closeSocketServer();
    stopCronJobs();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    await flushLogs();
    process.exit(0);
  } catch (err) {
    logger.error(`Graceful shutdown failed: ${err.message}`);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});

process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

function verifySystemStatus(status) {
  logger.info('SYSTEM STATUS');
  logger.info(`${status.mongodb ? '✓' : '✗'} MongoDB`);
  logger.info(`${status.firebase ? '✓' : '✗'} Firebase`);
  logger.info(`${status.cloudinary ? '✓' : '✗'} Cloudinary`);
  logger.info(`${status.razorpay ? '✓' : '✗'} Razorpay`);
  logger.info(`${status.cron ? '✓' : '✗'} Cron`);
  logger.info(`${status.routes ? '✓' : '✗'} Routes`);

  if (!status.mongodb || !status.cloudinary || !status.razorpay || !status.cron || !status.routes || !status.env) {
    throw new Error('Critical startup verification failed');
  }
}

async function startServer() {
  try {
    validateEnv();
    const appModule = await import('./app.js');
    const socketModule = await import('./socket.js');
    const cronModule = await import('./cron/index.js');
    const firebaseModule = await import('./config/firebase.js');
    const cloudinaryModule = await import('./config/cloudinary.js');
    const razorpayModule = await import('./config/razorpay.js');

    app = appModule.default;
    initializeSocket = socketModule.initializeSocket;
    closeSocketServer = socketModule.closeSocketServer;
    startCronJobs = cronModule.startCronJobs;
    stopCronJobs = cronModule.stopCronJobs;

    await connectDB();
    const cronJobs = startCronJobs();

    verifySystemStatus({
      env: true,
      mongodb: mongoose.connection.readyState === 1,
      firebase: firebaseModule.isFirebaseInitialized(),
      cloudinary: cloudinaryModule.isCloudinaryConfigured(),
      razorpay: razorpayModule.isRazorpayConfigured(),
      cron: cronModule.areCronJobsLoaded() && cronJobs.length === 4,
      routes: appModule.areRoutesMounted()
    });

    const port = process.env.PORT || 5000;
    server = app.listen(port, () => {
      initializeSocket(server);
      logger.info(`🏘️  Neighborify Backend running on port ${port}`);
      logger.info('📦 MongoDB connected');
      logger.info('⚡ Socket.IO ready');
    });
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

startServer();
