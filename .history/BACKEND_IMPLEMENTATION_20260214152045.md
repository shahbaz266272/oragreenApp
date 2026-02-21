# Backend Push Notifications - Complete Implementation ✅

Production-ready Node.js/Express code for sending push notifications to iOS and Android with Firebase Cloud Messaging and Expo Push API.

---

## 📦 What's Included

### Core Services (3 files - 700+ lines)

1. **`notifications.service.js`** (500+ lines)
   - `sendExpoNotification()` - Send via Expo Push API
   - `sendFCMNotification()` - Send via Firebase Cloud Messaging
   - `sendNotification()` - Auto-detect and send
   - `sendBulkNotifications()` - Send to multiple users
   - `sendToUser()` - Fetch token and send
   - Use-case functions:
     - `notifyOrderPlaced()` - Order confirmation
     - `notifyOrderStatus()` - Order status updates
     - `sendPromotion()` - Promotional notifications
     - `sendCartReminder()` - Abandoned cart
     - `notifyDelivery()` - Out for delivery
     - `notifyPaymentSuccess()` - Payment confirmed
     - `notifyPaymentFailed()` - Payment failed
   - `sendWithRetry()` - Retry with backoff
   - Helper functions for validation

2. **`notifications.routes.js`** (400+ lines)
   - 10 Express endpoints
   - Rate limiting
   - Input validation
   - Authentication/Authorization
   - Error handling

3. **`firebase-admin.js`** (80 lines)
   - Firebase Admin SDK initialization
   - Flexible configuration (env var, file, or default)
   - Error handling

### Utilities (2 files - 150+ lines)

4. **`logger.js`** (50 lines)
   - Simple logging utility
   - Optional Winston integration

5. **`auth.middleware.js`** (100 lines)
   - JWT authentication
   - Role-based authorization
   - Owner verification

### Configuration & Documentation (3 files)

6. **`server.example.js`**
   - Complete Express server example
   - Shows how to integrate all pieces
   - Comments on what to customize

7. **`backend.env.example`**
   - All environment variables
   - Firebase configuration options
   - API keys and secrets

8. **`BACKEND_USAGE_EXAMPLES.js`**
   - 8 complete integration examples
   - Real-world scenarios
   - Copy-paste ready code

### Setup & Reference

9. **`BACKEND_SETUP_GUIDE.md`**
   - Complete implementation guide
   - Installation steps
   - Configuration instructions
   - Best practices
   - Troubleshooting guide

---

## 🚀 Getting Started (5 Minutes)

### 1. Copy Files to Your Backend

```bash
# Copy all files to your backend project
cp notifications.service.js your-backend/services/
cp notifications.routes.js your-backend/routes/
cp firebase-admin.js your-backend/config/
cp logger.js your-backend/utils/
cp auth.middleware.js your-backend/middleware/
```

### 2. Install Dependencies

```bash
cd your-backend
npm install firebase-admin express-rate-limit express-validator axios
```

### 3. Configure Firebase

```bash
cp backend.env.example .env

# Option A: Save Firebase JSON as file
# Place firebase-adminsdk.json in project root

# Option B: Save as environment variable
# Edit .env and add FIREBASE_SERVICE_ACCOUNT_JSON='{...}'
```

### 4. Integration Code

Add to your `server.js`:

```javascript
import initializeFirebase from './config/firebase-admin.js';
import notificationRoutes from './routes/notifications.routes.js';
import User from './models/User.js';

// Initialize Firebase (MUST be first!)
initializeFirebase();

// Mount routes
app.use('/api/notifications', notificationRoutes);

// Make User model available to routes
app.set('User', User);

// Also in User model, add pushToken field:
// pushToken: { type: String, default: null }
```

### 5. Start Sending!

```bash
npm start
```

---

## 📊 API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/notifications/send` | Send to device token | User |
| POST | `/api/notifications/send-to-user` | Send to user ID | User |
| POST | `/api/notifications/bulk` | Send to multiple users | Admin |
| POST | `/api/notifications/order-placed` | Order confirmation | User |
| POST | `/api/notifications/order-status` | Order status update | User |
| POST | `/api/notifications/delivery` | Out for delivery | User |
| POST | `/api/notifications/payment-success` | Payment confirmed | User |
| POST | `/api/notifications/payment-failed` | Payment failed | User |
| POST | `/api/notifications/promotion` | Send promotion | Admin |
| POST | `/api/notifications/cart-reminder` | Abandoned cart | User |
| POST | `/api/notifications/test` | Test notification | Admin |

---

## 💡 Key Functions

### Send Notification (Auto-detect platform)

```javascript
import { sendNotification } from './notifications.service.js';

const result = await sendNotification(
  'ExponentPushToken[xxxx]' or 'FCM:xxxxx',
  'Order Confirmed',
  'Your order #123 is confirmed',
  {
    data: { orderId: '123', screen: 'Orders' }
  }
);

if (result.success) {
  console.log('Sent:', result.messageId);
} else {
  console.error('Failed:', result.error);
}
```

### Send to User (Fetches token from DB)

```javascript
import { sendToUser } from './notifications.service.js';
import User from './models/User.js';

const result = await sendToUser(
  userId,
  'Order Confirmed',
  'Your order is on its way',
  {
    data: { orderId: '123' },
    userModel: User // Required for DB lookup
  }
);
```

### Send Multiple Users

```javascript
import { sendBulkNotifications } from './notifications.service.js';

const recipients = [
  { userId: 'user1', token: 'ExponentPushToken[xxx]' },
  { userId: 'user2', token: 'FCM:xxx' },
  { userId: 'user3', token: 'ExponentPushToken[yyy]' }
];

const result = await sendBulkNotifications(
  recipients,
  'Special Offer',
  '50% off today only',
  {
    data: { code: 'SALE50' },
    batchSize: 10,
    delayMs: 100
  }
);

console.log(`Sent: ${result.sent}, Failed: ${result.failed}`);
```

### Pre-built Use Cases

```javascript
import {
  notifyOrderPlaced,
  notifyOrderStatus,
  sendPromotion,
  sendCartReminder,
  notifyDelivery,
  notifyPaymentSuccess
} from './notifications.service.js';

// Order placed
await notifyOrderPlaced(userId, orderId, total, { userModel: User });

// Status update
await notifyOrderStatus(userId, orderId, 'shipped', { userModel: User });

// Promotion
await sendPromotion(userId, 'Sale', 'Get 50% off', 'SALE50', 50, { userModel: User });

// Cart reminder
await sendCartReminder(userId, 3, 999.99, { userModel: User });

// Delivery
await notifyDelivery(userId, orderId, 'by 6 PM', { userModel: User });

// Payment
await notifyPaymentSuccess(userId, txId, 999.99, { userModel: User });
```

---

## 🔧 Real-World Integration Examples

### Example 1: Save Token on User Login

```javascript
// In your login endpoint
const user = await User.findOne({ email });

// Save push token from mobile app
if (req.body.pushToken) {
  await User.updateOne(
    { _id: user._id },
    { pushToken: req.body.pushToken }
  );
}

// Return JWT token
res.json({ token: generateJWT(user) });
```

**Mobile app sends:**
```javascript
const loginResponse = await axios.post('/api/login', {
  email: 'user@example.com',
  password: '****',
  pushToken: 'ExponentPushToken[xxxxx]' // From app
});
```

### Example 2: Notify When Order is Placed

```javascript
import { notifyOrderPlaced } from './notifications.service.js';

async function createOrder(req, res) {
  // Create order
  const order = new Order(req.body);
  await order.save();

  // Send notification (don't fail if it errors)
  try {
    await notifyOrderPlaced(
      order.userId,
      order._id,
      order.total,
      { userModel: User }
    );
  } catch (error) {
    logger.warn('Notification failed', error);
  }

  res.json({ orderId: order._id, success: true });
}
```

### Example 3: Send on Order Status Update

```javascript
async function updateOrderStatus(req, res) {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { status: req.body.status },
    { new: true }
  );

  // Send status notification
  await notifyOrderStatus(
    order.userId,
    order._id,
    req.body.status,
    { userModel: User }
  );

  res.json(order);
}
```

### Example 4: Schedule Abandoned Cart Reminders

```javascript
import schedule from 'node-schedule';
import { sendCartReminder } from './notifications.service.js';

// Run every hour
schedule.scheduleJob('0 * * * *', async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const carts = await Cart.find({
    createdAt: { $lt: oneHourAgo },
    reminderSent: false
  }).populate('userId');

  for (const cart of carts) {
    const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    
    await sendCartReminder(
      cart.userId._id,
      cart.items.length,
      total,
      { userModel: User }
    );
    
    await Cart.updateOne({ _id: cart._id }, { reminderSent: true });
  }
});
```

### Example 5: Send Bulk Promotional Campaign

```javascript
async function sendPromotion(req, res) {
  const { title, description, code, discount } = req.body;

  // Get all users with push tokens
  const users = await User.find(
    { pushToken: { $exists: true, $ne: null } },
    { _id: 1, pushToken: 1 }
  );

  const recipients = users.map(u => ({
    userId: u._id,
    token: u.pushToken
  }));

  const result = await sendBulkNotifications(
    recipients,
    title,
    description,
    { data: { code, discount, screen: 'Home' } }
  );

  res.json({
    success: true,
    sent: result.sent,
    failed: result.failed
  });
}
```

---

## 🔐 Security Features

✅ **JWT Authentication** - All endpoints require valid token
✅ **Role-based Authorization** - Admin-only bulk/promo endpoints
✅ **Input Validation** - Validates all inputs with express-validator
✅ **Rate Limiting** - 100 requests/15min per user, 5 bulk/hour
✅ **Helmet.js** - Security headers
✅ **CORS** - Configurable cross-origin requests
✅ **Token Cleanup** - Auto-removes invalid tokens
✅ **Error Handling** - Doesn't leak sensitive information

---

## 📋 Environment Variables

```env
# Required
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-key

# Firebase (choose one)
FIREBASE_SERVICE_ACCOUNT_FILE=./firebase-adminsdk.json
# OR
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Optional
MONGODB_URI=mongodb://localhost:27017/oragreen
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
LOG_LEVEL=info
```

---

## 🧪 Testing

### Test with cURL

```bash
# Send test notification
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxx]",
    "title": "Test",
    "body": "Testing notifications"
  }'
```

### Expected Response

```json
{
  "success": true,
  "messageId": "0:1708876543123:abcdef...",
  "service": "expo"
}
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Expo Push API support | ✅ |
| Firebase Cloud Messaging | ✅ |
| Auto token type detection | ✅ |
| Bulk sending (1000+) | ✅ |
| Rate limiting | ✅ |
| Retry with backoff | ✅ |
| Invalid token cleanup | ✅ |
| JWT Authentication | ✅ |
| Role-based authorization | ✅ |
| Input validation | ✅ |
| Comprehensive logging | ✅ |
| Error handling | ✅ |
| Pre-built use cases | ✅ |
| Production ready | ✅ |

---

## 📚 Documentation

1. **BACKEND_SETUP_GUIDE.md** - Complete setup & integration guide
2. **BACKEND_USAGE_EXAMPLES.js** - 8 ready-to-use examples
3. **server.example.js** - Full server setup example
4. **Inline comments** - Every function is documented

---

## 🎯 Next Steps

1. ✅ Copy all files to your backend
2. ✅ Install dependencies
3. ✅ Configure Firebase & `.env`
4. ✅ Add to server.js (3 lines of code)
5. ✅ Add `pushToken` field to User model
6. ✅ Start sending notifications!

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Firebase not initializing | Check `.env` has correct Firebase credentials |
| "Invalid token" | Ensure token format is correct (Expo or FCM) |
| Notifications not arriving | Check device has notification permissions enabled |
| Rate limit errors | Spread requests out or increase limits |
| CORS errors | Add your frontend URL to `CORS_ORIGIN` in `.env` |

---

## 💬 Support

**Check:**
1. `BACKEND_SETUP_GUIDE.md` for full documentation
2. `BACKEND_USAGE_EXAMPLES.js` for implementation examples
3. `notifications.service.js` for available functions
4. Log output for detailed error messages

**Example logs:**
```
[INFO] Firebase Admin SDK initialized successfully
[INFO] Sending expo notification - title: Order Placed
[INFO] Expo notification sent successfully - id: 0:123456
```

---

**You now have production-ready push notification code for your Express backend!** 🎉

All 700+ lines of code, 10+ API endpoints, and real-world examples are ready to use.

Start with **Example 1** in `BACKEND_USAGE_EXAMPLES.js` (saving tokens on login) and build from there.
