/**
 * Backend Notification Sender Utility
 *
 * This file contains examples for sending push notifications
 * from your backend to users. Implement these functions in your server.
 *
 * Two approaches:
 * 1. Expo Push API - Simple, works with Expo tokens
 * 2. Firebase Cloud Messaging (FCM) - More powerful, official Google solution
 */

// ==================== EXPO PUSH API ====================
/**
 * Send notification using Expo Push API
 * Works with Expo Push Tokens (format: ExponentPushToken[...])
 *
 * @param {string} expoPushToken - The Expo push token from device
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} data - Additional data to send with notification
 * @param {string} badgeCount - Badge number (iOS/Android)
 */
export async function sendExpoNotification(
  expoPushToken,
  title,
  body,
  data = {},
  badgeCount = 1,
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
    badge: badgeCount,
    // Show notification even if app is in foreground
    _displayInForeground: true,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseJson = await response.json();

    if (responseJson.errors) {
      console.error("Expo Push Error:", responseJson.errors);
      return { success: false, error: responseJson.errors };
    }

    console.log("Expo notification sent successfully:", responseJson);
    return { success: true, response: responseJson };
  } catch (error) {
    console.error("Error sending Expo notification:", error);
    return { success: false, error: error.message };
  }
}

// ==================== FIREBASE CLOUD MESSAGING ====================
/**
 * Send notification using Firebase Cloud Messaging
 * Requires Firebase Admin SDK in your backend
 *
 * Install: npm install firebase-admin
 *
 * @param {object} admin - Firebase admin instance
 * @param {string} deviceToken - Device token (Android/iOS)
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} data - Additional data
 */
export async function sendFCMNotification(
  admin,
  deviceToken,
  title,
  body,
  data = {},
) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: data,
    token: deviceToken,
    // For Android
    android: {
      priority: "high",
      notification: {
        sound: "default",
        channelId: "default",
      },
    },
    // For iOS
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          sound: "default",
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("FCM notification sent successfully:", response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error("Error sending FCM notification:", error);
    return { success: false, error: error.message };
  }
}

// ==================== USE CASES ====================

/**
 * Send order update notification
 */
export async function notifyOrderUpdate(pushToken, orderId, status) {
  return await sendExpoNotification(
    pushToken,
    "📦 Order Update",
    `Your order #${orderId} status: ${status}`,
    {
      orderId: orderId,
      status: status,
      screen: "Orders",
      timestamp: new Date().toISOString(),
    },
  );
}

/**
 * Send promotional notification
 */
export async function sendPromotionalNotification(
  pushToken,
  title,
  message,
  offerLink,
) {
  return await sendExpoNotification(pushToken, title, message, {
    type: "promotion",
    link: offerLink,
    screen: "Home",
  });
}

/**
 * Send abandoned cart reminder
 */
export async function sendCartReminderNotification(
  pushToken,
  cartTotal,
  itemCount,
) {
  return await sendExpoNotification(
    pushToken,
    "🛒 Complete Your Purchase",
    `You have ${itemCount} items in your cart (₹${cartTotal})`,
    {
      type: "cart_reminder",
      screen: "Cart",
      cartTotal: cartTotal,
    },
  );
}

/**
 * Send delivery notification
 */
export async function sendDeliveryNotification(
  pushToken,
  orderId,
  estimatedTime,
) {
  return await sendExpoNotification(
    pushToken,
    "🚚 Out for Delivery",
    `Order #${orderId} is on its way! Arriving ${estimatedTime}`,
    {
      orderId: orderId,
      type: "delivery",
      screen: "Orders",
    },
  );
}

/**
 * Send bulk notifications to multiple users
 */
export async function sendBulkNotifications(recipients, title, body, data) {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendExpoNotification(
      recipient.pushToken,
      title,
      body,
      { ...data, userId: recipient.userId },
    );
    results.push({
      userId: recipient.userId,
      ...result,
    });
  }

  return results;
}

// ==================== BACKEND INTEGRATION EXAMPLE ====================

/**
 * Example Express.js endpoint to send notifications
 *
 * POST /api/notifications/send
 * Body: {
 *   userId: "user123",
 *   title: "Hello",
 *   body: "This is a test",
 *   data: { ... }
 * }
 */
export async function handleNotificationRequest(req, res) {
  const { userId, title, body, data } = req.body;

  // Get user's push token from database
  const user = await findUserById(userId);

  if (!user || !user.pushToken) {
    return res.status(404).json({ error: "User or push token not found" });
  }

  // Send notification
  const result = await sendExpoNotification(user.pushToken, title, body, data);

  if (result.success) {
    res.json({ success: true, message: "Notification sent" });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
}

// ==================== DATABASE OPERATIONS ====================

/**
 * Save user's push token when they log in or open app
 */
export async function savePushToken(userId, pushToken, deviceType) {
  // Implementation depends on your database
  // Example with MongoDB:
  /*
  await User.updateOne(
    { _id: userId },
    {
      pushToken: pushToken,
      deviceType: deviceType, // 'ios' or 'android'
      lastTokenUpdate: new Date(),
    }
  );
  */
}

/**
 * Get all users for bulk notifications
 */
export async function getAllUsersWithTokens() {
  // Implementation depends on your database
  /*
  return await User.find(
    { pushToken: { $exists: true, $ne: null } },
    { _id: 1, pushToken: 1, email: 1 }
  );
  */
}

/**
 * Delete expired/invalid token
 */
export async function invalidatePushToken(userId, pushToken) {
  // Implementation depends on your database
  /*
  await User.updateOne(
    { _id: userId },
    { pushToken: null }
  );
  */
}

// ==================== ERROR HANDLING ====================

/**
 * Handle notification errors (invalid token, etc.)
 */
export async function handleNotificationError(error, userId) {
  if (error.includes("ExponentPushToken")) {
    // Invalid Expo token - remove from database
    console.log(`Removing invalid token for user ${userId}`);
    await invalidatePushToken(userId, null);
  } else if (error.includes("InvalidRegistration")) {
    // Invalid FCM token - remove from database
    console.log(`Removing invalid FCM token for user ${userId}`);
    await invalidatePushToken(userId, null);
  }
}
