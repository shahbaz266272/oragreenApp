# Production-Ready Backend - Push Notifications Setup

Complete Node.js/Express backend for sending push notifications to iOS and Android.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Files Created](#files-created)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Quick Start](#quick-start)
6. [API Endpoints](#api-endpoints)
7. [Integration Examples](#integration-examples)
8. [Scheduling Tasks](#scheduling-tasks)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This is a production-ready push notification backend that supports:

✅ **Expo Push API** - For Expo-managed apps (ExponentPushToken)
✅ **Firebase Cloud Messaging (FCM)** - For native Android/iOS (FCM tokens)
✅ **Automatic token type detection** - Sends to right service automatically
✅ **Bulk sending with rate limiting** - Send to thousands of users safely
✅ **Retry with exponential backoff** - Handles transient failures
✅ **Error handling & token cleanup** - Removes invalid tokens automatically
✅ **Authentication & Authorization** - Secure API endpoints
✅ **Comprehensive logging** - Debug everything

---

## Files Created

### Core Services (3 files)

| File | Purpose | Lines |
|------|---------|-------|
| `notifications.service.js` | Main notification sending functions | 500+ |
| `notifications.routes.js` | Express API routes | 400+ |
| `firebase-admin.js` | Firebase initialization | 80 |

### Utilities (2 files)

| File | Purpose | Lines |
|------|---------|-------|
| `logger.js` | Logging utility | 50 |
| `auth.middleware.js` | Authentication/Authorization | 100 |

### Configuration & Examples (3 files)

| File | Purpose |
|------|---------|
| `server.example.js` | Example Express server setup |
| `backend.env.example` | Environment variables template |
| `BACKEND_USAGE_EXAMPLES.js` | Implementation examples |

---

## Installation

### 1. Choose Node.js Version

```bash
node --version  # Should be >= 18.0.0
```

### 2. Copy Files to Your Backend

```bash
# Copy all service files to your backend project
cp notifications.service.js /path/to/your/backend/
cp notifications.routes.js /path/to/your/backend/routes/
cp firebase-admin.js /path/to/your/backend/config/
cp logger.js /path/to/your/backend/utils/
cp auth.middleware.js /path/to/your/backend/middleware/
```

### 3. Install Dependencies

```bash
npm install express cors dotenv axios firebase-admin jsonwebtoken express-rate-limit express-validator helmet morgan
```

### 4. Optional Dependencies

```bash
# For advanced logging
npm install winston

# For scheduled jobs (e.g., cart reminders)
npm install node-schedule

# For database (if not already installed)
npm install mongoose

# For better environment file parsing
npm install joi
```

---

## Configuration

### 1. Create `.env` File

```bash
cp backend.env.example .env
```

### 2. Get Firebase Service Account

**Option A: From Firebase Console**
1. Go to Firebase Console → Project Settings ⚙️
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Save as `firebase-adminsdk.json`

**Option B: From Google Cloud Console**
1. Go to Google Cloud Console
2. Create new service account
3. Generate JSON key file
4. Download and save

### 3. Configure `.env`

```bash
# Option 1: Store JSON file path
FIREBASE_SERVICE_ACCOUNT_FILE=./firebase-adminsdk.json

# Option 2: Store JSON as string (easier for deployment)
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Also configure
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-key
MONGODB_URI=mongodb://localhost:27017/oragreen
```

### 4. Update server.js

```javascript
import express from 'express';
import initializeFirebase from './config/firebase-admin.js';
import notificationRoutes from './routes/notifications.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';

const app = express();

// Initialize Firebase (IMPORTANT!)
initializeFirebase();

// Mount routes
app.use('/api/notifications', notificationRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## Quick Start

### 1. Start Your Server

```bash
npm start
# or with development auto-reload
npm run dev  # (requires nodemon)
```

### 2. Get Firebase Initialized

Check logs for:
```
[INFO] Firebase Admin SDK initialized successfully
```

### 3. Test Notification Endpoint

```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxx]",
    "title": "Hello",
    "body": "Your first notification!"
  }'
```

### 4. Check Response

```json
{
  "success": true,
  "messageId": "0:123456789",
  "service": "expo"
}
```

---

## API Endpoints

### 1. Send to Device Token

**POST** `/api/notifications/send`

```bash
Authorization: Bearer {token}
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxx]",
  "title": "Order Update",
  "body": "Your order is confirmed",
  "data": {
    "orderId": "123",
    "screen": "Orders"
  },
  "retry": true
}
```

### 2. Send to User ID

**POST** `/api/notifications/send-to-user`

```bash
Authorization: Bearer {token}

{
  "userId": "user123",
  "title": "Order Update",
  "body": "Your order is confirmed",
  "data": { "orderId": "123" }
}
```

### 3. Send Bulk Notifications

**POST** `/api/notifications/bulk`

```bash
Authorization: Bearer {admin_token}

{
  "userIds": ["user1", "user2", "user3"],
  "title": "50% OFF Sale",
  "body": "Limited time offer",
  "data": { "code": "SALE50" },
  "batchSize": 10,
  "delayMs": 100
}
```

### 4. Order Placed Notification

**POST** `/api/notifications/order-placed`

```bash
{
  "userId": "user123",
  "orderId": "order456",
  "total": 999.99
}
```

### 5. Order Status Update

**POST** `/api/notifications/order-status`

```bash
{
  "userId": "user123",
  "orderId": "order456",
  "status": "shipped"  // confirmed, processing, shipped, delivered, cancelled
}
```

### 6. Payment Success

**POST** `/api/notifications/payment-success`

```bash
{
  "userId": "user123",
  "transactionId": "tx_123",
  "amount": 999.99
}
```

### 7. Send Test Notification

**POST** `/api/notifications/test`

```bash
Authorization: Bearer {admin_token}

{
  "token": "ExponentPushToken[xxxxx]",
  "title": "Test Notification",
  "body": "Testing notifications"
}
```

---

## Integration Examples

### Example 1: Save Token on Login

```javascript
// In your login endpoint
async function handleLogin(req, res) {
  const user = await User.findOne({ email: req.body.email });
  
  // Save push token from mobile app
  if (req.body.pushToken) {
    user.pushToken = req.body.pushToken;
    await user.save();
  }

  res.json({ token: generateJWT(user) });
}
```

**Mobile sends:**
```javascript
const response = await api.post('/login', {
  email: 'user@example.com',
  password: '****',
  pushToken: await getPushToken() // From notificationService.js
});
```

### Example 2: Send After Order Creation

```javascript
import { notifyOrderPlaced } from './notifications.service.js';

async function createOrder(req, res) {
  const order = new Order(req.body);
  await order.save();

  // Send notification (don't fail if it errors)
  notifyOrderPlaced(order.userId, order._id, order.total, {
    userModel: User
  }).catch(err => logger.warn('Notification failed', err));

  res.json({ orderId: order._id });
}
```

### Example 3: Send on Status Update

```javascript
import { notifyOrderStatus } from './notifications.service.js';

async function updateOrderStatus(req, res) {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { status: req.body.status },
    { new: true }
  );

  // Notify user
  await notifyOrderStatus(
    order.userId,
    order._id,
    req.body.status,
    { userModel: User }
  );

  res.json(order);
}
```

---

## Scheduling Tasks

### Schedule Abandoned Cart Reminders

```bash
npm install node-schedule
```

```javascript
// in scheduled-jobs.js
import schedule from 'node-schedule';
import { sendCartReminder } from './notifications.service.js';

// Run every hour
schedule.scheduleJob('0 * * * *', async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const carts = await Cart.find({
    createdAt: { $lt: oneHourAgo },
    reminderSent: false
  });

  for (const cart of carts) {
    const total = sum(cart.items.map(i => i.price * i.quantity));
    await sendCartReminder(cart.userId, cart.items.length, total, {
      userModel: User
    });
    await Cart.updateOne({ _id: cart._id }, { reminderSent: true });
  }
});
```

---

## Best Practices

### ✅ DO

1. **Always use try-catch**
   ```javascript
   try {
     const result = await notifyOrderPlaced(...);
   } catch (error) {
     logger.error('Notification failed', error);
     // Continue - notification failure shouldn't fail order creation
   }
   ```

2. **Check if notification succeeds**
   ```javascript
   if (!result.success) {
     logger.warn('Notification not sent', { error: result.error });
   }
   ```

3. **Use sendToUser() for database lookups**
   ```javascript
   // Handles invalid tokens automatically
   await sendToUser(userId, title, body, { userModel: User });
   ```

4. **Log everything**
   ```javascript
   logger.info('Order confirmed', { userId, orderId });
   ```

### ❌ DON'T

1. **Don't fail business operations if notification fails**
   - Order should be created even if notification fails

2. **Don't hardcode tokens**
   - Always store and retrieve from database

3. **Don't send without authentication**
   - All endpoints require valid JWT token

4. **Don't send personal data in notification data**
   - Use only IDs that can be looked up on app

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Firebase not initializing | Check `.env` file has correct credentials |
| Invalid token errors | Token format mismatch - ensure Expo or FCM format |
| Notifications not arriving | Check device permissions on app |
| Rate limiting errors | Increase rate limit or add delay between requests |
| "No token found" | User hasn't logged in yet or token not saved |
| Firebase cert missing | Download from Firebase Console → Service Accounts |
| CORS errors | Add frontend URL to `CORS_ORIGIN` in `.env` |

### Debug Logs

Enable debug logging:
```bash
DEBUG=true npm start
```

Check logs for:
- "Firebase Admin SDK initialized"
- "Sending [service] notification"
- "Notification sent successfully"
- Error messages with token first 20 chars

---

## Performance Tips

1. **Batch bulk sends** (default: 10 at a time)
   - Prevents overwhelming Firebase/Expo
   - Use `batchSize` and `delayMs` parameters

2. **Use async/await properly**
   - Don't wait for notification if not critical
   - Fire and forget for non-blocking operations

3. **Cache user tokens** if sending multiple notifications
   - Reduces database queries

4. **Monitor rate limits**
   - API has 100 requests/15 min per user
   - Bulk is 5 requests/hour

5. **Use Redis** for caching (optional)
   - Cache valid tokens temporarily
   - Reduce database hits

---

## Production Deployment

### On Heroku

```bash
# Set environment variables
heroku config:set FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account"...}'
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### On AWS Lambda

Use Firebase Admin SDK with Lambda. See firebase-admin.js for configuration.

### On Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
expose 3000
CMD ["npm", "start"]
```

---

## Support & Help

**Files:**
- Core logic: `notifications.service.js`
- API routes: `notifications.routes.js`
- Examples: `BACKEND_USAGE_EXAMPLES.js`
- Setup: `server.example.js`

**Utilities:**
- Logging: `logger.js`
- Auth: `auth.middleware.js`
- Firebase: `firebase-admin.js`

**Check logs for:**
```bash
tail -f logs/combined.log
```

---

## Summary

You now have a production-ready backend for pushing notifications:

✅ 7 pre-built endpoints
✅ Automatic token type detection (Expo/FCM)
✅ Bulk sending with rate limiting
✅ Automatic token cleanup
✅ Full authentication/authorization
✅ Comprehensive logging
✅ Error handling & retries
✅ Ready for 1000s of users

**Start with Example 1** from `BACKEND_USAGE_EXAMPLES.js` to integrate with your existing backend.
