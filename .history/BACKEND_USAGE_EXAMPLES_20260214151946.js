/**
 * Production Backend - Usage Examples
 * How to use the notification service in your Express app
 */

// ==================== SETUP IN YOUR SERVER ====================

/*
// 1. In server.js or app.js, initialize Firebase first:

import initializeFirebase from './firebase-admin.js';
initializeFirebase(); // Must be called once at startup

// 2. Import notification routes:
import notificationRoutes from './notifications.routes.js';
app.use('/api/notifications', notificationRoutes);

// 3. Make User model available to routes:
import User from './models/User.js';
app.set('User', User);
*/

// ==================== EXAMPLE 1: SAVE PUSH TOKEN ON LOGIN ====================

/*
// In your login route:

import { sendNotification } from './notifications.service.js';

async function handleLogin(req, res) {
  const { email, password } = req.body;

  // ... your existing login logic ...
  const user = await User.findOne({ email });
  
  // ... password verification ...

  // NEW: Save push token from mobile app
  if (req.body.pushToken) {
    await User.updateOne(
      { _id: user._id },
      { pushToken: req.body.pushToken }
    );
  }

  res.json({
    token: jwtToken,
    user: user,
  });
}

// Mobile app would send:
// POST /api/login
// {
//   "email": "user@example.com",
//   "password": "****",
//   "pushToken": "ExponentPushToken[xxxx]" or "FCM:xxxx"
// }
*/

// ==================== EXAMPLE 2: SEND ORDER CONFIRMATION ====================

/*
// In your order creation route:

import { notifyOrderPlaced } from './notifications.service.js';
import { logger } from './logger.js';

async function createOrder(req, res) {
  const { userId, items, shippingAddress } = req.body;

  try {
    // 1. Create order in database
    const order = new Order({
      userId,
      items,
      shippingAddress,
      status: 'placed',
      total: calculateTotal(items),
    });

    await order.save();

    // 2. Send confirmation notification
    const notificationResult = await notifyOrderPlaced(
      userId,
      order._id,
      order.total,
      { userModel: User }
    );

    if (notificationResult.success) {
      logger.info('Order confirmation sent', { orderId: order._id });
    } else {
      logger.warn('Failed to send order confirmation', {
        orderId: order._id,
        error: notificationResult.error,
      });
      // Continue anyway - order was created successfully
    }

    // 3. Send confirmation email (optional)
    await sendOrderConfirmationEmail(user.email, order);

    res.json({
      success: true,
      orderId: order._id,
      message: 'Order created successfully',
    });
  } catch (error) {
    logger.error('Error creating order', { error: error.message });
    res.status(500).json({ error: 'Failed to create order' });
  }
}
*/

// ==================== EXAMPLE 3: UPDATE ORDER STATUS WITH NOTIFICATION ====================

/*
// In your order status update route:

import { notifyOrderStatus } from './notifications.service.js';

async function updateOrderStatus(req, res) {
  const { orderId, status } = req.body;

  try {
    // 1. Update order in database
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 2. Send status notification
    const notificationResult = await notifyOrderStatus(
      order.userId,
      orderId,
      status,
      { userModel: User }
    );

    if (!notificationResult.success) {
      logger.warn('Failed to send status notification', {
        orderId,
        status,
        error: notificationResult.error,
      });
    }

    // 3. Emit real-time update (if using Socket.io)
    io.to(order.userId).emit('orderStatusChanged', {
      orderId,
      status,
    });

    res.json({
      success: true,
      order,
      notificationSent: notificationResult.success,
    });
  } catch (error) {
    logger.error('Error updating order status', { error: error.message });
    res.status(500).json({ error: 'Failed to update status' });
  }
}

// API Call:
// PATCH /api/orders/123/status
// Headers: Authorization: Bearer TOKEN
// Body: {
//   "status": "shipped"
// }
*/

// ==================== EXAMPLE 4: SEND BULK PROMOTIONAL NOTIFICATION ====================

/*
// In your admin promotion route:

import { sendBulkNotifications } from './notifications.service.js';

async function sendPromotion(req, res) {
  const { title, description, code, discount, targetUserIds } = req.body;

  try {
    // 1. Get users' push tokens
    let query = { pushToken: { $exists: true, $ne: null } };
    if (targetUserIds && targetUserIds.length > 0) {
      query._id = { $in: targetUserIds };
    }

    const users = await User.find(query, { _id: 1, pushToken: 1 });

    if (users.length === 0) {
      return res.status(400).json({
        error: 'No users with push tokens found',
      });
    }

    // 2. Prepare recipients
    const recipients = users.map(u => ({
      userId: u._id,
      token: u.pushToken,
    }));

    // 3. Send bulk notifications
    const result = await sendBulkNotifications(
      recipients,
      title,
      description,
      {
        data: {
          code,
          discount,
          screen: 'Home',
          type: 'promotion',
        },
        batchSize: 10,
        delayMs: 100,
      }
    );

    res.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: result.total,
      errors: result.errors,
    });
  } catch (error) {
    logger.error('Error sending promotion', { error: error.message });
    res.status(500).json({ error: 'Failed to send promotion' });
  }
}

// API Call:
// POST /api/notifications/bulk-promotion
// Headers: Authorization: Bearer ADMIN_TOKEN
// Body: {
//   "title": "50% OFF Sale! 🎉",
//   "description": "Get 50% off on selected items",
//   "code": "SALE50",
//   "discount": 50
// }
*/

// ==================== EXAMPLE 5: SCHEDULED ABANDONED CART REMINDERS ====================

/*
// Use node-schedule to run periodically
// npm install node-schedule

import schedule from 'node-schedule';
import { sendCartReminder } from './notifications.service.js';

// Run every hour
schedule.scheduleJob('0 * * * *', async () => {
  try {
    logger.info('Running abandoned cart reminder job');

    // Find carts abandoned > 1 hour ago
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const abandonedCarts = await Cart.find({
      createdAt: { $lt: oneHourAgo },
      reminderSent: false,
    }).populate('userId');

    let remindersSent = 0;

    for (const cart of abandonedCarts) {
      const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const result = await sendCartReminder(
        cart.userId._id,
        cart.items.length,
        total,
        { userModel: User }
      );

      if (result.success) {
        // Mark reminder as sent
        await Cart.updateOne(
          { _id: cart._id },
          { reminderSent: true, reminderSentAt: new Date() }
        );
        remindersSent++;
      }
    }

    logger.info('Abandoned cart reminders sent', { count: remindersSent });
  } catch (error) {
    logger.error('Error in abandoned cart reminder job', {
      error: error.message,
    });
  }
});
*/

// ==================== EXAMPLE 6: PAYMENT SUCCESS/FAILURE NOTIFICATIONS ====================

/*
// In your payment callback handler (e.g., Stripe/Razorpay webhook):

import { notifyPaymentSuccess, notifyPaymentFailed } from './notifications.service.js';

async function handlePaymentCallback(req, res) {
  const { transactionId, status, amount, metadata } = req.body;
  const userId = metadata.userId;

  try {
    // 1. Verify payment with payment gateway
    // const payment = await stripe.charges.retrieve(transactionId);

    if (status === 'succeeded') {
      // 2a. Send success notification
      await notifyPaymentSuccess(userId, transactionId, amount, {
        userModel: User,
      });

      // 3a. Update order
      await Order.updateOne(
        { _id: metadata.orderId },
        { paymentStatus: 'paid', paymentId: transactionId }
      );
    } else {
      // 2b. Send failure notification
      await notifyPaymentFailed(userId, transactionId, 'Payment failed. Please try again.', {
        userModel: User,
      });
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Error handling payment callback', {
      error: error.message,
    });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
*/

// ==================== EXAMPLE 7: SEND DIRECT TEST NOTIFICATION ====================

/*
// Endpoint for testing/debugging

import { sendNotification } from './notifications.service.js';

async function sendTestNotification(req, res) {
  const { token, title, body } = req.body;

  try {
    const result = await sendNotification(
      token,
      title || 'Test Notification',
      body || 'Testing push notifications',
      {
        data: {
          test: true,
          timestamp: new Date().toISOString(),
        },
      }
    );

    if (result.success) {
      return res.json({ success: true, messageId: result.messageId });
    }

    res.status(400).json({
      success: false,
      error: result.error,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error sending test notification', {
      error: error.message,
    });
    res.status(500).json({ error: 'Failed to send notification' });
  }
}

// API Call:
// POST /api/notifications/send
// Headers: Authorization: Bearer TOKEN
// Body: {
//   "token": "ExponentPushToken[xxxxx]",
//   "title": "Hello",
//   "body": "This is a test"
// }
*/

// ==================== EXAMPLE 8: DELIVERY STATUS WITH REAL LOCATION ====================

/*
// In your delivery tracking route:

import { notifyDelivery } from './notifications.service.js';

async function updateDeliveryStatus(req, res) {
  const { orderId, latitude, longitude, estimatedTime } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryStatus: 'out_for_delivery',
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    // Send notification with estimated time
    const notificationResult = await notifyDelivery(
      order.userId,
      orderId,
      estimatedTime,
      { userModel: User }
    );

    // Broadcast location update via Socket.io (optional)
    io.to(order.userId).emit('deliveryLocationUpdated', {
      orderId,
      location: { latitude, longitude },
      estimatedTime,
    });

    res.json({
      success: true,
      notificationSent: notificationResult.success,
    });
  } catch (error) {
    logger.error('Error updating delivery status', {
      error: error.message,
    });
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
}
*/

// ==================== BEST PRACTICES ====================

/*
1. ERROR HANDLING:
   - Always check if notification send succeeded
   - Log failures but don't fail the main operation
   - The business transaction (order creation, payment, etc.) should succeed
     even if notification fails

2. RETRY LOGIC:
   - Use sendWithRetry() for critical notifications
   - Automatic exponential backoff for transient failures
   - Skip retries for invalid token errors

3. INVALID TOKENS:
   - When a token is invalid, remove it from database
   - This happens automatically in sendToUser()
   - Prevents repeatedly trying to send to dead tokens

4. RATE LIMITING:
   - API has rate limiting enabled
   - Bulk sends batched by default (10 at a time with 100ms delays)
   - Can adjust batchSize and delayMs for your needs

5. LOGGING:
   - All operations logged for debugging
   - Includes token (first 20 chars), user ID, and timestamps
   - Check logs for issues

6. SECURITY:
   - Always authenticate/authorize notification requests
   - Validate user can only send to their own notifications
   - Admins can send bulk/promotional notifications
   - Use HTTPS only in production

7. DATABASE:
   - Store pushToken in User collection
   - Automatically clear invalid/expired tokens
   - No personal data in notification data payload

8. TESTING:
   - Use /api/notifications/test endpoint (admin only)
   - Check device receives notification
   - Verify app handles tap correctly
*/

// ==================== CURL EXAMPLES ====================

/*
// 1. Send test notification
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxx]",
    "title": "Test",
    "body": "Testing notifications",
    "data": {"screen": "Home"}
  }'

// 2. Send to user by ID
curl -X POST http://localhost:3000/api/notifications/send-to-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Order Update",
    "body": "Your order is confirmed",
    "data": {"orderId": "order456"}
  }'

// 3. Send bulk promotion
curl -X POST http://localhost:3000/api/notifications/bulk \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user1", "user2", "user3"],
    "title": "50% OFF Sale",
    "body": "Limited time offer",
    "data": {"code": "SALE50"}
  }'

// 4. Send order notification
curl -X POST http://localhost:3000/api/notifications/order-placed \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "orderId": "order456",
    "total": 999.99
  }'

// 5. Update order status
curl -X POST http://localhost:3000/api/notifications/order-status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "orderId": "order456",
    "status": "shipped"
  }'
*/

export default {};
