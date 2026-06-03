import admin from 'firebase-admin';
import logger from '../utils/logger.js';

let firebaseAdmin = null;
let messaging = null;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
    messaging = firebaseAdmin.messaging();
  } else {
    logger.error('Firebase Admin SDK initialization skipped because required environment variables are missing');
  }
} catch (err) {
  logger.error(`Firebase Admin SDK initialization failed: ${err.message}`);
  firebaseAdmin = null;
  messaging = null;
}

export function isFirebaseInitialized() {
  return Boolean(firebaseAdmin && messaging);
}

export { firebaseAdmin as admin, messaging };
