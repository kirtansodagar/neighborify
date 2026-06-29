import admin from 'firebase-admin';
import logger from '../utils/logger.js';

let firebaseAdmin = null;
let messaging = null;

try {
  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;
  const isValidKey = FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.includes('BEGIN') && FIREBASE_PRIVATE_KEY.includes('PRIVATE KEY');

  if (FIREBASE_PROJECT_ID && isValidKey && FIREBASE_CLIENT_EMAIL) {
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({ projectId: FIREBASE_PROJECT_ID, privateKey, clientEmail: FIREBASE_CLIENT_EMAIL })
    });
    messaging = firebaseAdmin.messaging();
  } else {
    logger.warn('Firebase Admin SDK skipped — push notifications disabled');
  }
} catch (err) {
  logger.warn(`Firebase Admin SDK skipped — ${err.message}`);
  firebaseAdmin = null;
  messaging = null;
}

export function isFirebaseInitialized() {
  return Boolean(firebaseAdmin && messaging);
}

export { firebaseAdmin as admin, messaging };
