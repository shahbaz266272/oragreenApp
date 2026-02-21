/**
 * Production-Ready Notification Service
 * Send push notifications to iOS and Android devices
 * 
 * Supports:
 * - Expo Push API (simple, works with Expo tokens)
 * - Firebase Cloud Messaging (advanced, official Google solution)
 */

import axios from 'axios';
import admin from 'firebase-admin';
import { logger } from './logger.js'; // You'll create this

// ==================== CONFIGURATION ====================

const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';

// Firebase already initialized in your app
// admin.initializeApp(config) should be done once in your app

// ==================== EXPO PUSH NOTIFICATIONS ====================

/**
 * Send notification using Expo Push API
 * Works with Expo tokens: ExponentPushToken[xxxxx]
 * 
 * @param {string} expoPushToken - Expo push token from device
 * @param {string} title - Notification title (max 100 chars)
 * @param {string} body - Notification body (max 200 chars)
 * @param {object} options - Additional options
 * @param {object} options.data - Custom data payload
 * @param {number} options.badge - Badge number (iOS/Android)
 * @param {string} options.sound - Sound file ('default' or custom)
 * @param {number} options.ttl - Time to live in seconds
 * @param {string[]} options.mutableContent - Make notification editable (iOS)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendExpoNotification(
  expoPushToken,
  title,
  body,
  options = {}
) {
  try {
    // Validate token
    if (!expoPushToken || !expoPushToken.startsWith('ExponentPushToken')) {
      throw new Error(`Invalid token format: ${expoPushToken}`);
    }

    // Validate inputs
    if (!title || title.length > 100) {
      throw new Error('Title required and must be <= 100 chars');
    }
    if (!body || body.length > 200) {
      throw new Error('Body required and must be <= 200 chars');
    }

    const payload = {
      to: expoPushToken,
      sound: options.sound || 'default',
      title: title,
      body: body,
      data: options.data || {},
      badge: options.badge || 1,
      ttl: options.ttl || 3600,
      _displayInForeground: true, // Show in foreground
    };

    // Add iOS-specific options
    if (options.mutableContent) {
      payload.mutableContent = true;
    }

    logger.info('Sending Expo notification', {
      token: expoPushToken.substring(0, 20) + '...',
      title,
    });

    const response = await axios.post(EXPO_PUSH_API, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
      },
    });

    // Check for errors in response
    if (response.data?.errors) {
      const error = response.data.errors[0];
      logger.warn('Expo notification error', {
        error: error.message,
        token: expoPushToken.substring(0, 20) + '...',
      });

      // Handle specific errors
      if (error.message.includes('ExponentPushToken')) {
        return {
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired token',
        };
      }

      throw error;
    }

    logger.info('Expo notification sent successfully', {
      id: response.data.id,
      token: expoPushToken.substring(0, 20) + '...',
    });

    return {
      success: true,
      messageId: response.data.id,
      service: 'expo',
    };
  } catch (error) {
    logger.error('Error sending Expo notification', {
      error: error.message,
      token: expoPushToken?.substring(0, 20),
    });

    return {
      success: false,
      error: error.message,
      service: 'expo',
    };
  }
}

// ==================== FIREBASE CLOUD MESSAGING ====================

/**
 * Send notification using Firebase Cloud Messaging
 * Works with FCM tokens and device tokens for Android/iOS
 * 
 * @param {string} deviceToken - FCM or device token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} options - Additional options
 * @param {object} options.data - Custom data payload
 * @param {number} options.badge - Badge count
 * @param {object} options.androidConfig - Android-specific config
 * @param {object} options.apnsConfig - iOS-specific config
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendFCMNotification(
  deviceToken,
  title,
  body,
  options = {}
) {
  try {
    if (!deviceToken) {
      throw new Error('Device token is required');
    }

    if (!admin.apps.length) {
      throw new Error('Firebase Admin SDK not initialized');
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: normalizeData(options.data || {}),
      token: deviceToken,

      // Android-specific configuration
      android: {
        priority: 'high',
        notification: {
          title: title,
          body: body,
          sound: 'default',
          channelId: 'default',
          clickAction: 'FLUTTER_NOTIFICATION_CLICK',
          tag: options.data?.screen || 'notification',
        },
        ttl: 3600000, // 1 hour in milliseconds
        data: normalizeData(options.data || {}),
      },

      // iOS-specific configuration
      apns: {
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            alert: {
              title: title,
              body: body,
            },
            badge: options.badge || 1,
            sound: 'default',
            'content-available': 1,
            'mutable-content': 1,
            'custom-key': 'lingo',
          },
          customData: options.data || {},
        },
      },

      // Webpush configuration (if needed)
      webpush: {
        notification: {
          title: title,
          body: body,
          icon: 'https://www.example.com/icon-192x192.png',
        },
        data: normalizeData(options.data || {}),
      },
    };

    logger.info('Sending FCM notification', {
      token: deviceToken.substring(0, 20) + '...',
      title,
    });

    const messageId = await admin.messaging().send(message);

    logger.info('FCM notification sent successfully', {
      messageId,
      token: deviceToken.substring(0, 20) + '...',
    });

    return {
      success: true,
      messageId: messageId,
      service: 'fcm',
    };
  } catch (error) {
    logger.error('Error sending FCM notification', {
      error: error.message,
      token: deviceToken?.substring(0, 20),
    });

    // Handle specific FCM errors
    if (error.code === 'messaging/invalid-argument') {
      return {
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid token format',
      };
    }

    if (error.code === 'messaging/registration-token-not-registered') {
      return {
        success: false,
        error: 'TOKEN_NOT_REGISTERED',
        message: 'Token is not registered',
      };
    }

    return {
      success: false,
      error: error.code || 'FCM_ERROR',
      message: error.message,
    };
  }
}

// ==================== SMART NOTIFICATION SENDER ====================

/**
 * Intelligently send notification to device
 * Automatically detects token type (Expo/FCM) and sends accordingly
 * 
 * @param {string} deviceToken - Device token (auto-detects type)
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} options - Additional options
 * @returns {Promise<{success: boolean, messageId?: string, service?: string}>}
 */
export async function sendNotification(
  deviceToken,
  title,
  body,
  options = {}
) {
  if (!deviceToken) {
    throw new Error('Device token is required');
  }

  // Detect token type
  if (deviceToken.startsWith('ExponentPushToken')) {
    return sendExpoNotification(deviceToken, title, body, options);
  } else if (deviceToken.startsWith('FCM:')) {
    return sendFCMNotification(deviceToken, title, body, options);
  } else {
    // Assume JSON Web Token for FCM
    return sendFCMNotification(deviceToken, title, body, options);
  }
}

// ==================== BULK NOTIFICATIONS ====================

/**
 * Send notifications to multiple devices in parallel
 * Handles rate limiting and batching
 * 
 * @param {Array<{token: string, userId: string}>} recipients - List of recipients
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} options - Additional options
 * @param {number} options.batchSize - How many to send in parallel (default: 10)
 * @param {number} options.delayMs - Delay between batches in ms (default: 100)
 * @returns {Promise<{sent: number, failed: number, errors: Array}>}
 */
export async function sendBulkNotifications(
  recipients,
  title,
  body,
  options = {}
) {
  const batchSize = options.batchSize || 10;
  const delayMs = options.delayMs || 100;
  let sent = 0;
  let failed = 0;
  const errors = [];

  logger.info('Starting bulk notification send', {
    recipientCount: recipients.length,
    title,
  });

  // Process in batches
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    const promises = batch.map(async (recipient) => {
      try {
        const result = await sendNotification(
          recipient.token,
          title,
          body,
          { ...options, userId: recipient.userId }
        );

        if (result.success) {
          sent++;
          return { userId: recipient.userId, success: true };
        } else {
          failed++;
          errors.push({
            userId: recipient.userId,
            token: recipient.token.substring(0, 20),
            error: result.error,
          });
          return { userId: recipient.userId, success: false };
        }
      } catch (error) {
        failed++;
        errors.push({
          userId: recipient.userId,
          error: error.message,
        });
        return { userId: recipient.userId, success: false };
      }
    });

    await Promise.all(promises);

    // Delay between batches to avoid rate limiting
    if (i + batchSize < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  logger.info('Bulk notification send complete', {
    sent,
    failed,
    total: recipients.length,
  });

  return {
    sent,
    failed,
    total: recipients.length,
    errors: errors.slice(0, 10), // Return first 10 errors
  };
}

// ==================== SEND TO USER ====================

/**
 * Send notification to a user from database
 * Fetches user's push token and sends notification
 * 
 * @param {string} userId - User ID in database
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} options - Additional options (User model required)
 * @param {Model} options.userModel - Mongoose User model
 * @returns {Promise<{success: boolean, messageId?: string}>}
 */
export async function sendToUser(
  userId,
  title,
  body,
  options = {}
) {
  try {
    const { userModel } = options;

    if (!userModel) {
      throw new Error('User model required in options');
    }

    // Get user's push token from database
    const user = await userModel.findById(userId).select('pushToken');

    if (!user) {
      logger.warn('User not found', { userId });
      return { success: false, error: 'USER_NOT_FOUND' };
    }

    if (!user.pushToken) {
      logger.warn('User has no push token', { userId });
      return { success: false, error: 'NO_PUSH_TOKEN' };
    }

    // Send notification
    const result = await sendNotification(
      user.pushToken,
      title,
      body,
      { ...options, userId }
    );

    // If token invalid, remove from database
    if (!result.success && (result.error === 'INVALID_TOKEN' || result.error === 'TOKEN_NOT_REGISTERED')) {
      await userModel.updateOne(
        { _id: userId },
        { pushToken: null }
      );
      logger.info('Invalid token removed from database', { userId });
    }

    return result;
  } catch (error) {
    logger.error('Error sending notification to user', {
      error: error.message,
      userId,
    });

    return {
      success: false,
      error: error.message,
    };
  }
}

// ==================== USE CASE FUNCTIONS ====================

/**
 * Send order confirmation notification
 */
export async function notifyOrderPlaced(userId, orderId, total, options = {}) {
  return sendToUser(
    userId,
    '📦 Order Placed Successfully',
    `Order #${orderId} for ₹${total}`,
    {
      data: {
        screen: 'Orders',
        orderId: orderId,
        action: 'orderPlaced',
      },
      badge: 1,
      ...options,
    }
  );
}

/**
 * Send order status update notification
 */
export async function notifyOrderStatus(userId, orderId, status, options = {}) {
  const statusMessages = {
    confirmed: { title: '✓ Order Confirmed', icon: '✓' },
    processing: { title: '⚙️ Processing', icon: '⚙️' },
    shipped: { title: '🚚 Order Shipped', icon: '🚚' },
    delivered: { title: '✅ Delivered', icon: '✅' },
    cancelled: { title: '❌ Cancelled', icon: '❌' },
  };

  const statusInfo = statusMessages[status] || statusMessages.confirmed;

  return sendToUser(
    userId,
    statusInfo.title,
    `Order #${orderId} status: ${status}`,
    {
      data: {
        screen: 'Orders',
        orderId: orderId,
        status: status,
      },
      badge: status === 'delivered' ? 2 : 1,
      ...options,
    }
  );
}

/**
 * Send promotional notification
 */
export async function sendPromotion(
  userId,
  title,
  description,
  offerCode,
  discount,
  options = {}
) {
  return sendToUser(
    userId,
    title,
    description,
    {
      data: {
        screen: 'Home',
        offerCode: offerCode,
        discount: discount,
        type: 'promotion',
      },
      badge: 1,
      ...options,
    }
  );
}

/**
 * Send abandoned cart reminder
 */
export async function sendCartReminder(userId, itemCount, total, options = {}) {
  return sendToUser(
    userId,
    '🛒 Complete Your Purchase',
    `You have ${itemCount} items in your cart (₹${total})`,
    {
      data: {
        screen: 'Cart',
        itemCount: itemCount,
        total: total,
        type: 'cart_reminder',
      },
      badge: 1,
      ...options,
    }
  );
}

/**
 * Send delivery notification with estimated time
 */
export async function notifyDelivery(
  userId,
  orderId,
  estimatedTime,
  options = {}
) {
  return sendToUser(
    userId,
    '🚚 Out for Delivery',
    `Order #${orderId} arriving ${estimatedTime}`,
    {
      data: {
        screen: 'Orders',
        orderId: orderId,
        estimatedTime: estimatedTime,
        type: 'delivery',
      },
      badge: 2,
      ...options,
    }
  );
}

/**
 * Send payment success notification
 */
export async function notifyPaymentSuccess(
  userId,
  transactionId,
  amount,
  options = {}
) {
  return sendToUser(
    userId,
    '✓ Payment Successful',
    `Transaction ${transactionId} for ₹${amount}`,
    {
      data: {
        screen: 'Orders',
        transactionId: transactionId,
        amount: amount,
        type: 'payment',
      },
      badge: 1,
      ...options,
    }
  );
}

/**
 * Send payment failed notification
 */
export async function notifyPaymentFailed(
  userId,
  transactionId,
  reason,
  options = {}
) {
  return sendToUser(
    userId,
    '❌ Payment Failed',
    `${reason}. Please try again.`,
    {
      data: {
        screen: 'Cart',
        transactionId: transactionId,
        reason: reason,
        type: 'payment_failed',
      },
      badge: 1,
      ...options,
    }
  );
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Normalize data object to only strings (FCM requirement)
 */
function normalizeData(data) {
  const normalized = {};
  for (const [key, value] of Object.entries(data)) {
    normalized[key] = String(value);
  }
  return normalized;
}

/**
 * Retry notification send with exponential backoff
 */
export async function sendWithRetry(
  deviceToken,
  title,
  body,
  options = {},
  maxRetries = 3
) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendNotification(deviceToken, title, body, options);

      if (result.success) {
        return result;
      }

      lastError = result;

      // Don't retry on invalid token errors
      if (result.error === 'INVALID_TOKEN' || result.error === 'TOKEN_NOT_REGISTERED') {
        return result;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        logger.info('Retrying notification', {
          attempt,
          nextAttemptIn: `${delayMs}ms`,
        });
      }
    } catch (error) {
      lastError = error;
      logger.error('Error in retry attempt', {
        attempt,
        error: error.message,
      });
    }
  }

  return {
    success: false,
    error: lastError?.error || lastError?.message,
    attempts: maxRetries,
  };
}

/**
 * Validate device token format
 */
export function isValidToken(token) {
  if (!token) return false;
  if (token.startsWith('ExponentPushToken')) return true;
  if (token.startsWith('FCM:')) return true;
  if (token.length > 50) return true; // Likely FCM
  return false;
}

/**
 * Get token type
 */
export function getTokenType(token) {
  if (token.startsWith('ExponentPushToken')) return 'expo';
  if (token.startsWith('FCM:')) return 'fcm';
  return 'fcm'; // Assume FCM for long tokens
}

export default {
  sendExpoNotification,
  sendFCMNotification,
  sendNotification,
  sendBulkNotifications,
  sendToUser,
  notifyOrderPlaced,
  notifyOrderStatus,
  sendPromotion,
  sendCartReminder,
  notifyDelivery,
  notifyPaymentSuccess,
  notifyPaymentFailed,
  sendWithRetry,
  isValidToken,
  getTokenType,
};
