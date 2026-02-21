/**
 * Firebase Admin SDK Initialization
 * Set up Firebase Admin SDK for sending notifications via FCM
 * 
 * Usage in your app:
 * import './firebase-admin.js'; // Call this once in your server startup
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

/**
 * Initialize Firebase Admin SDK
 * Configuration priority:
 * 1. FIREBASE_SERVICE_ACCOUNT_JSON env variable (JSON string)
 * 2. FIREBASE_SERVICE_ACCOUNT_FILE env variable (file path)
 * 3. ./firebase-adminsdk.json (default file location)
 */
export function initializeFirebase() {
  try {
    let serviceAccount;

    // Option 1: JSON string in environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        logger.info('Loaded Firebase credentials from env variable (JSON)');
      } catch (error) {
        logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON', {
          error: error.message,
        });
        throw error;
      }
    }
    // Option 2: File path in environment variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE) {
      try {
        const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        serviceAccount = JSON.parse(fileContent);
        logger.info('Loaded Firebase credentials from file', { filePath });
      } catch (error) {
        logger.error('Failed to load Firebase credentials from file', {
          error: error.message,
        });
        throw error;
      }
    }
    // Option 3: Default file location
    else {
      try {
        const defaultPath = path.join(process.cwd(), 'firebase-adminsdk.json');
        if (fs.existsSync(defaultPath)) {
          const fileContent = fs.readFileSync(defaultPath, 'utf8');
          serviceAccount = JSON.parse(fileContent);
          logger.info('Loaded Firebase credentials from default location', {
            path: defaultPath,
          });
        } else {
          logger.warn('Firebase credentials file not found', {
            path: defaultPath,
          });
          return false;
        }
      } catch (error) {
        logger.error('Failed to load Firebase credentials', {
          error: error.message,
        });
        return false;
      }
    }

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    logger.info('Firebase Admin SDK initialized successfully', {
      projectId: serviceAccount.project_id,
    });

    return true;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK', {
      error: error.message,
    });
    process.exit(1);
  }
}

/**
 * Get Firebase Messaging instance
 */
export function getMessaging() {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin SDK not initialized');
  }
  return admin.messaging();
}

export default initializeFirebase;
