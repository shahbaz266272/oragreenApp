# Push Notifications Quick Reference

## Files Created/Modified

### New Files
- `src/services/notificationService.js` - Core notification handler
- `src/services/firebaseConfig.js` - Firebase configuration
- `src/services/notificationBackend.js` - Backend notification examples
- `src/screens/NotificationDemoScreen.js` - Demo component
- `FIREBASE_SETUP.md` - Complete setup guide
- `.env.example` - Environment variables template

### Modified Files
- `App.js` - Added notification initialization
- `app.json` - Added notification plugin & iOS/Android config
- `package.json` - Added Firebase & notification dependencies

---

## Installation

```bash
cd /Users/najeebmacmini/Desktop/oragreendevelopment/oragreenApp

# Install dependencies
npm install
# or
yarn install
```

---

## Environment Setup

### 1. Create `.env` file
```bash
cp .env.example .env
```

### 2. Add your Firebase credentials
Edit `.env` and add your Firebase project credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Firebase Console Setup (5 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project → "Oragreen"
3. Settings ⚙️ → Project Settings
4. Copy all values to `.env`
5. Click "Cloud Messaging" tab → Download Server API Key (for backend)

---

## Testing Notifications

### Option 1: Local Test (Fastest)
```javascript
// In any screen
import { scheduleTestNotification } from '../services/notificationService';

// Schedule notification in 5 seconds
await scheduleTestNotification(5);
```

### Option 2: Expo Dashboard
1. Find your Expo Push Token in console logs
2. Go to https://expo.dev/notifications
3. Paste token → Send test message

### Option 3: Using `.env`
- No additional setup needed
- Expo will automatically load Firebase config

---

## Key Functions

### Register for Notifications
```javascript
import { registerForPushNotifications } from '../services/notificationService';

const token = await registerForPushNotifications();
```

### Get Device Token
```javascript
import { getPushToken } from '../services/notificationService';

const token = await getPushToken();
```

### Schedule Notification (Local)
```javascript
import { scheduleTestNotification } from '../services/notificationService';

await scheduleTestNotification(5); // 5 seconds delay
```

### Send from Backend
```javascript
import { sendExpoNotification } from '../services/notificationBackend';

await sendExpoNotification(
  'ExponentPushToken[xxxxx]',
  'Order Update',
  'Your order is ready!',
  { orderId: '123', screen: 'Orders' }
);
```

---

## Notification Data Structure

When sending notifications, use this structure:

```javascript
{
  to: 'ExponentPushToken[xxxx]',
  title: 'Notification Title',
  body: 'Notification message',
  data: {
    screen: 'Orders',        // Navigation target
    orderId: '123',          // Custom data
    timestamp: '2024-02-14'  // Any custom field
  },
  sound: 'default',
  badge: 1
}
```

---

## Handling Notifications in App

Edit `src/services/notificationService.js` to customize behavior:

```javascript
// Handle notification when app is in foreground
const handleNotification = (notification) => {
  console.log('Notification received:', notification.request.content);
  // Add custom logic here
};

// Handle when user taps notification
const handleNotificationResponse = (response) => {
  const { data } = response.notification.request.content;
  // Navigate based on data.screen
  if (data?.screen === 'Orders') {
    navigation.navigate('Orders');
  }
};
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No token found" | Run `registerForPushNotifications()` first |
| Notifications not appearing | Check device permissions for notifications |
| Emulator issues | Test on physical device only |
| Firebase not loading | Check `.env` file exists & has `EXPO_PUBLIC_` prefix |
| Build fails | Run `expo prebuild --clean` then rebuild |

---

## Security Checklist

✅ Add `.env` to `.gitignore` (never commit credentials)
✅ Use `EXPO_PUBLIC_` prefix for client-side variables
✅ Validate tokens on backend before sending
✅ Don't hardcode API keys in code
✅ Implement rate limiting for notifications
✅ Secure your Firebase project with rules

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Set up Firebase project
3. ✅ Add credentials to `.env`
4. ✅ Create `.env` file: `cp .env.example .env`
5. ✅ Test local notification with `scheduleTestNotification()`
6. ✅ Test remote via https://expo.dev/notifications
7. ✅ Integrate with your backend API
8. ✅ Add custom notification handling logic

---

## Demo Screen

To test all features, navigate to `NotificationDemoScreen`:

```javascript
// Add to your drawer navigator in App.js
<Drawer.Screen
  name="Notifications"
  component={NotificationDemoScreen}
/>
```

---

## Backend Integration Steps

### Node.js/Express Example:
```javascript
import { sendExpoNotification } from './notificationBackend.js';

app.post('/api/send-notification', async (req, res) => {
  const { userId, message } = req.body;
  
  // Get user's push token from database
  const user = await User.findById(userId);
  
  // Send notification
  const result = await sendExpoNotification(
    user.pushToken,
    'Message',
    message,
    { userId }
  );
  
  res.json(result);
});
```

### On User Login:
```javascript
// Save token to associate with user
const token = await registerForPushNotifications();
await updateUserPushToken(userId, token);
```

---

## Resources

- 📖 [Complete Guide](./FIREBASE_SETUP.md)
- 🔧 [Backend Examples](./src/services/notificationBackend.js)
- 📱 [Demo Component](./src/screens/NotificationDemoScreen.js)
- 🔗 [Expo Notifications Docs](https://docs.expo.dev/guides/push-notifications/)
- 🔗 [Firebase Docs](https://firebase.google.com/docs/cloud-messaging)

---

## Questions?

Check the detailed setup guide: `FIREBASE_SETUP.md`
