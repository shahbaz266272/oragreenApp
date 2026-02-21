/**
 * IMPLEMENTATION GUIDE: Common Use Cases
 *
 * Copy these code snippets into your app for common notification scenarios
 */

// ============================================================================
// USE CASE 1: Save Push Token When User Logs In
// ============================================================================
// File: src/screens/LoginScreen.js (or your login service)

export async function handleUserLogin(email, password) {
  try {
    // Your existing login logic
    const response = await api.login(email, password);
    const { userId, token } = response;

    // NEW: Get push token and save to user profile
    const {
      getPushToken,
      registerForPushNotifications,
    } = require("../services/notificationService");

    const pushToken =
      (await getPushToken()) || (await registerForPushNotifications());

    if (pushToken) {
      // Send to your backend to associate with user account
      await api.updateUserProfile(userId, {
        pushToken: pushToken,
        deviceType: "mobile",
        lastLogin: new Date().toISOString(),
      });

      console.log("✓ Push token saved:", pushToken);
    }

    return { success: true, userId, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// USE CASE 2: Notify User When Order is Placed
// ============================================================================
// File: Your backend (Node.js/Express)

async function createOrderAndNotify(userId, cartItems, shippingAddress) {
  try {
    // 1. Create order in database
    const order = await Order.create({
      userId: userId,
      items: cartItems,
      shippingAddress: shippingAddress,
      status: "placed",
      createdAt: new Date(),
    });

    // 2. Get user's push token from database
    const user = await User.findById(userId);
    if (!user?.pushToken) {
      console.warn("User has no push token");
      return { success: true, orderId: order._id };
    }

    // 3. Send notification
    const { sendExpoNotification } = require("./notificationBackend");
    await sendExpoNotification(
      user.pushToken,
      "📦 Order Placed Successfully",
      `Order #${order._id} - ₹${order.total}`,
      {
        orderId: order._id.toString(),
        screen: "Orders",
        action: "orderPlaced",
      },
    );

    // 4. Send confirmation email (optional)
    await sendOrderConfirmationEmail(user.email, order);

    return { success: true, orderId: order._id };
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// ============================================================================
// USE CASE 3: Notify User When Order Status Changes
// ============================================================================
// File: Your backend order service

async function updateOrderStatus(orderId, newStatus) {
  try {
    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus, updatedAt: new Date() },
      { new: true },
    );

    // Get user and send appropriate notification
    const user = await User.findById(order.userId);
    if (!user?.pushToken) return;

    const notifications = {
      confirmed: {
        title: "✓ Order Confirmed",
        body: `Your order #${orderId} has been confirmed`,
        badge: 2,
      },
      processing: {
        title: "⚙️ Order Processing",
        body: `Order #${orderId} is being prepared`,
        badge: 2,
      },
      shipped: {
        title: "🚚 Order Shipped",
        body: `Your order #${orderId} is on its way!`,
        badge: 3,
      },
      delivered: {
        title: "✅ Delivery Complete",
        body: `Order #${orderId} has been delivered`,
        badge: 4,
      },
    };

    const notification = notifications[newStatus];
    if (notification) {
      const { sendExpoNotification } = require("./notificationBackend");
      await sendExpoNotification(
        user.pushToken,
        notification.title,
        notification.body,
        {
          orderId: orderId,
          status: newStatus,
          screen: "Orders",
        },
        notification.badge,
      );
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
}

// ============================================================================
// USE CASE 4: Send Promotional Notification to All Users
// ============================================================================
// File: Your backend promotional service

async function sendPromotionToAllUsers(promotion) {
  try {
    // Get all users with push tokens
    const users = await User.find(
      { pushToken: { $exists: true, $ne: null } },
      { _id: 1, pushToken: 1 },
    ).limit(1000); // In production, paginate for large user bases

    const { sendExpoNotification } = require("./notificationBackend");
    let successCount = 0;
    let failureCount = 0;

    // Send notifications in parallel batches
    for (let i = 0; i < users.length; i += 10) {
      const batch = users.slice(i, i + 10);

      const promises = batch.map((user) =>
        sendExpoNotification(
          user.pushToken,
          promotion.title,
          promotion.description,
          {
            promotionId: promotion._id.toString(),
            code: promotion.code,
            discount: promotion.discount,
            screen: "Home",
            type: "promotion",
          },
        ).then((result) => {
          if (result.success) successCount++;
          else {
            failureCount++;
            // Optionally remove invalid token
            if (result.error?.includes("InvalidRegistration")) {
              User.updateOne(
                { pushToken: user.pushToken },
                { pushToken: null },
              );
            }
          }
        }),
      );

      await Promise.all(promises);
    }

    console.log(
      `Promotion sent: ${successCount} success, ${failureCount} failed`,
    );
    return { successCount, failureCount };
  } catch (error) {
    console.error("Error sending promotion:", error);
  }
}

// ============================================================================
// USE CASE 5: Send Abandoned Cart Reminder
// ============================================================================
// File: Your backend scheduled job (e.g., using node-schedule or cron)

async function sendAbandonedCartReminders() {
  try {
    // Find carts abandoned for > 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const abandonedCarts = await Cart.find({
      lastModified: { $lt: oneHourAgo },
      notificationSent: false,
      items: { $exists: true, $ne: [] },
    }).populate("userId");

    const { sendExpoNotification } = require("./notificationBackend");
    let remindersSent = 0;

    for (const cart of abandonedCarts) {
      const user = cart.userId;
      if (!user?.pushToken) continue;

      // Calculate total
      const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const result = await sendExpoNotification(
        user.pushToken,
        "🛒 Complete Your Purchase",
        `You have ${cart.items.length} items in your cart (₹${total})`,
        {
          cartId: cart._id.toString(),
          screen: "Cart",
          type: "cart_reminder",
        },
      );

      if (result.success) {
        // Mark notification as sent
        await Cart.updateOne(
          { _id: cart._id },
          { notificationSent: true, reminderSentAt: new Date() },
        );
        remindersSent++;
      }
    }

    console.log(`Abandoned cart reminders sent: ${remindersSent}`);
    return remindersSent;
  } catch (error) {
    console.error("Error sending cart reminders:", error);
  }
}

// ============================================================================
// USE CASE 6: Handle Notification in Your App
// ============================================================================
// File: src/services/notificationService.js (modify existing)

const handleNotificationResponse = (response) => {
  const { data } = response.notification.request.content;
  console.log("👆 User tapped notification:", data);

  // Navigate based on notification type
  if (data?.action === "orderPlaced") {
    // Navigate to Orders screen
    navigationRef.navigate("Orders", { orderId: data.orderId });
  } else if (data?.type === "promotion") {
    // Navigate to Home screen with promotion highlighted
    navigationRef.navigate("Home");
  } else if (data?.type === "cart_reminder") {
    // Navigate to Cart screen
    navigationRef.navigate("Cart");
  } else if (data?.screen) {
    // Generic navigation based on screen field
    navigationRef.navigate(data.screen, data);
  }
};

// ============================================================================
// USE CASE 7: Test Endpoint to Send Notifications
// ============================================================================
// File: Your backend API routes

app.post("/api/test/send-notification", async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    // Get user's push token
    const user = await User.findById(userId);
    if (!user?.pushToken) {
      return res.status(404).json({ error: "User has no push token" });
    }

    // Send notification
    const { sendExpoNotification } = require("./notificationBackend");
    const result = await sendExpoNotification(
      user.pushToken,
      title || "Test Notification",
      body || "This is a test message",
      { test: true, timestamp: new Date().toISOString() },
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// USE CASE 8: API Endpoint to Update User Push Token
// ============================================================================
// File: Your backend API routes

app.post("/api/user/push-token", async (req, res) => {
  try {
    const { userId } = req.user; // From auth middleware
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: "Push token required" });
    }

    // Validate token format
    if (
      !pushToken.startsWith("ExponentPushToken") &&
      !pushToken.startsWith("FCM:")
    ) {
      return res.status(400).json({ error: "Invalid push token format" });
    }

    // Update or create user token
    await User.updateOne(
      { _id: userId },
      {
        pushToken: pushToken,
        lastTokenUpdate: new Date(),
        notificationsEnabled: true,
      },
    );

    res.json({ success: true, message: "Push token updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// SCHEDULED JOBS SETUP (Using node-schedule)
// ============================================================================
// File: Your backend scheduled jobs

import schedule from "node-schedule";

// Run abandoned cart reminder every hour
schedule.scheduleJob("0 * * * *", async () => {
  console.log("⏰ Running abandoned cart reminders...");
  await sendAbandonedCartReminders();
});

// Send daily deals at 9 AM
schedule.scheduleJob("0 9 * * *", async () => {
  console.log("📢 Sending daily deals...");
  const todaysPromotion = await Promotion.findOne({
    type: "daily_deal",
    date: new Date().toDateString(),
  });
  if (todaysPromotion) {
    await sendPromotionToAllUsers(todaysPromotion);
  }
});

// ============================================================================
// DATABASE SCHEMA (MongoDB Example)
// ============================================================================

/*
User Schema updates:
{
  _id: ObjectId,
  email: String,
  pushToken: String,           // Expo or FCM token
  deviceType: String,          // 'ios', 'android'
  notificationsEnabled: Boolean,
  lastTokenUpdate: Date,
  lastLogin: Date
}

Order Schema:
{
  _id: ObjectId,
  userId: ObjectId,
  items: Array,
  status: String,              // 'placed', 'confirmed', 'shipped', 'delivered'
  total: Number,
  createdAt: Date,
  updatedAt: Date
}

Cart Schema:
{
  _id: ObjectId,
  userId: ObjectId,
  items: Array,
  lastModified: Date,
  notificationSent: Boolean,
  reminderSentAt: Date
}

Promotion Schema:
{
  _id: ObjectId,
  title: String,
  description: String,
  code: String,
  discount: Number,
  expiresAt: Date,
  type: String                 // 'promotion', 'daily_deal'
}
*/

// ============================================================================
// TESTING CHECKLIST
// ============================================================================

/*
1. ✓ User registers and gets push token
   - Run app on physical device
   - Check console for Expo Push Token
   - Verify token is sent to backend

2. ✓ Order notification when user places order
   - Place order in app
   - Check backend for notification sent
   - Verify notification appears on device

3. ✓ Order status update notifications
   - Update order status in admin panel/backend
   - Verify notification sent with new status
   - Check app receives and handles notification

4. ✓ Promotional notifications
   - Run send promotion endpoint
   - Verify all users receive notification
   - Check that invalid tokens are removed

5. ✓ Cart reminder notifications
   - Add items to cart and leave app for 1+ hour
   - Verify reminder notification sent
   - Check user can navigate to cart from notification

6. ✓ Handle notification taps
   - Send test notification
   - Tap in notification center
   - Verify app navigates to correct screen

7. ✓ Error handling
   - Send notification with invalid token
   - Verify app handles gracefully
   - Check token is removed from database
*/

// ============================================================================
// QUICK API CALLS FOR TESTING
// ============================================================================

/*
// Using curl or Postman:

// Update user's push token
POST /api/user/push-token
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "pushToken": "ExponentPushToken[xxxxx]"
}

// Send test notification
POST /api/test/send-notification
Body: {
  "userId": "user123",
  "title": "Test",
  "body": "Testing notifications"
}

// Send promotion
POST /api/promotions/send
Body: {
  "promotionId": "promo123"
}
*/
