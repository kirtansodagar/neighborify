import cron from 'node-cron';
import logger from '../utils/logger.js';
import { recomputeScores } from '../controllers/post.controller.js';
import { sendEventReminders } from '../controllers/event.controller.js';
import { cleanupExpiredListings } from '../controllers/listing.controller.js';
import { cleanupExpiredStories } from '../controllers/story.controller.js';
import { cleanupCloudinary } from '../controllers/upload.controller.js';

const scheduledJobs = [];

export function startCronJobs() {
  const feedJob = cron.schedule('0 */6 * * *', async () => {
    logger.info('Cron: Recomputing feed scores');
    try {
      await recomputeScores();
      logger.info('Cron: Feed scores recomputed');
    } catch (err) {
      logger.error(`Cron: Feed score error - ${err.message}`);
    }
  }, { scheduled: false });

  const eventJob = cron.schedule('*/5 * * * *', async () => {
    logger.info('Cron: Sending event reminders');
    try {
      await sendEventReminders();
    } catch (err) {
      logger.error(`Cron: Event reminder error - ${err.message}`);
    }
  }, { scheduled: false });

  const listingJob = cron.schedule('0 2 * * *', async () => {
    logger.info('Cron: Cleaning up expired listings');
    try {
      await cleanupExpiredListings();
      logger.info('Cron: Expired listings cleaned');
    } catch (err) {
      logger.error(`Cron: Listing cleanup error - ${err.message}`);
    }
  }, { scheduled: false });

  const storyJob = cron.schedule('0 3 * * *', async () => {
    logger.info('Cron: Cleaning up expired stories');
    try {
      await cleanupExpiredStories();
      logger.info('Cron: Expired stories cleaned');
    } catch (err) {
      logger.error(`Cron: Story cleanup error - ${err.message}`);
    }
  }, { scheduled: false });

  scheduledJobs.push(feedJob, eventJob, listingJob, storyJob);
  scheduledJobs.forEach(job => job.start());
  logger.info('Cron jobs started');
  return scheduledJobs;
}

export function stopCronJobs() {
  scheduledJobs.forEach(job => job.stop());
  scheduledJobs.length = 0;
  logger.info('Cron jobs stopped');
}

export function areCronJobsLoaded() {
  return scheduledJobs.length === 4;
}
