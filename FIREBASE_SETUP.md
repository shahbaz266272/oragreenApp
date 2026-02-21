# Firebase Push Notifications Setup Guide

This guide will help you set up Firebase push notifications in your Oragreen app.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Firebase Console Setup](#firebase-console-setup)
3. [iOS Setup](#ios-setup)
4. [Android Setup](#android-setup)
5. [Environment Configuration](#environment-configuration)
6. [Testing](#testing)
7. [Backend Integration](#backend-integration)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Firebase account (create at https://console.firebase.google.com/)
- Expo CLI installed
- EAS CLI installed (`npm install -g eas-cli`)
- Dependencies already installed via `npm install` or `yarn install`

---

## Firebase Console Setup

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Oragreen" (or your choice)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Get Firebase Credentials
1. In Firebase Console, click the gear icon ⚙️ → Project Settings
2. Go to the "General" tab
3. Scroll down to "Your apps" section
4. Click "Add app" and select "Web"
5. Enter app name: "Oragreen Web"
6. Copy all the config values (apiKey, projectId, etc.)
7. Save these values - you'll need them for later

### 3. Enable Cloud Messaging
1. Go to Firebase Console → "Cloud Messaging" (under "Grow" section)
2. Click "Enable" if not already enabled
3. Note the **Server API Key** - you'll need this for backend integration

---

## iOS Setup

### 1. Create APNs Certificate
1. Go to [Apple Developer Account](https://developer.apple.com/)
2. Sign in and go to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → Select your app identifier "com.oragreen.app"
4. Enable "Push Notifications"
5. Click "Save"
6. Go back and click "Keys" → "Create a key"
7. Select "Apple Push Notifications service (APNs)" 
8. Download the key (save as `.p8` file)

### 2. Configure Firebase for iOS
1. In Firebase Console → Project Settings → "Service Accounts"
2. Click "Generate New Private Key" and download the JSON file
3. Go to Firebase Console → Cloud Messaging
4. Under "APNs authentication key", upload your `.p8` file
5. Enter Key ID and Team ID from Apple Developer

### 3. Build for iOS
```bash
cd /Users/najeebmacmini/Desktop/oragreendevelopment/oragreenApp
eas build --platform ios
```

---

## Android Setup

### 1. Get Google Services Credentials
1. In Firebase Console, create or select your Android app:
   - Click "Add app" → Android
   - Enter package name: `com.oragreen.app`
   - Skip SHA-1 for now (can add later)
   - Click "Register app"
2. Download the `google-services.json` file
3. Place it in your project root: `/Users/najeebmacmini/Desktop/oragreendevelopment/oragreenApp/`

### 2. Build for Android
```bash
cd /Users/najeebmacmini/Desktop/oragreendevelopment/oragreenApp
eas build --platform android
```

---

## Environment Configuration

### 1. Create `.env` File
Copy the `.env.example` file and create `.env`:
```bash
cp .env.example .env
```

### 2. Add Firebase Credentials
Edit `.env` and replace with your Firebase project credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:android:abcdef123456
```

### 3. Using Environment Variables
Your Firebase config will automatically load from the `.env` file. Verify in `src/services/firebaseConfig.js`.

---

## Testing

### 1. Get Your Device Push Token
Run the app and check the console logs:
```bash
npm start
# Or for iOS: npm run ios
# Or for Android: npm run android
```

Look for a log like:
```
Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]
```

Save this token - you'll use it for testing.

### 2. Send Test Notification via Expo
1. Go to https://expo.dev/notifications
2. Paste your Expo Push Token
3. Enter a test message
4. Click "Send a notification"
5. Check your device - notification should appear!

### 3. Local Test Notification
Call this function from your app (e.g., add to a test button):
```javascript
import { scheduleTestNotification } from './src/services/notificationService';

// Schedule notification in 5 seconds
await scheduleTestNotification(5);
```

---

## Backend Integration

### Send Notifications from Your Server

#### Using Node.js/Express
```javascript
import axios from 'axios';

async function sendPushNotification(expoPushToken, title, body, data = {}) {
  try {
    const response = await axios.post('https://exp.host/--/api/v2/push/send', {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      _displayInForeground: true,
    });
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Usage
sendPushNotification(
  'ExponentPushToken[xxxx]',
  'Order Update',
  'Your order #123 has been shipped!',
  { orderId: '123', screen: 'Orders' }
);
```

#### Using Firebase Cloud Messaging (FCM)
```javascript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendFCMNotification(deviceToken, title, body, data = {}) {
  try {
    const response = await admin.messaging().send({
      token: deviceToken,
      notification: {
        title: title,
        body: body,
      },
      data: data,
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
    });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
```

### Store Device Tokens
Save user's push token to your database:
```javascript
import { getPushToken } from './src/services/notificationService';

// When user logs in
const pushToken = await getPushToken();
// Send to your backend to associate with user account
await updateUserPushToken(userId, pushToken);
```

---

## Handling Notifications in Your App

### Custom Notification Handling
Edit `src/services/notificationService.js` to add navigation/custom logic:

```javascript
const handleNotificationResponse = (response) => {
  const { data } = response.notification.request.content;
  
  // Navigate based on notification type
  if (data?.screen === 'Orders') {
    // Navigate to OrdersScreen
    navigation.navigate('Orders');
  }
};
```

### Customize Notification Sound
Add your notification sound file:
1. Place audio file in `assets/` folder
2. Update `app.json` plugins section:
```json
"sounds": ["./assets/your-notification-sound.mp3"]
```

---

## Troubleshooting

### Notifications Not Received
1. **Check permissions**: Make sure user granted notification permissions
2. **Check device**: Push notifications only work on physical devices, not emulators
3. **Check server API key**: Ensure using correct Firebase Server API Key
4. **Check token format**: Verify token starts with `ExponentPushToken[` or `FCM:`

### App Crashes on Build
1. Run: `expo prebuild --clean`
2. Rebuild: `eas build --platform ios --clean` or `eas build --platform android --clean`

### Notifications Appear in Notification Center But Not in App
This is normal. Set `_displayInForeground: true` when sending notifications from backend.

### Firebase Config Not Loading
1. Check `.env` file exists in project root
2. Verify all keys start with `EXPO_PUBLIC_`
3. Make sure values have no extra quotes

### Badge Number Not Updating
1. For iOS: Add badge number in notification: `badge: 1`
2. For Android: May require additional setup with firebase-admin

---

## Security Considerations

⚠️ **IMPORTANT:**
- Never commit `.env` file to version control (add to `.gitignore`)
- Never expose API keys in client code
- Use environment variables for sensitive data
- Validate tokens on your backend before sending notifications
- Implement rate limiting for notification sending

---

## Additional Resources

- [Expo Notifications Docs](https://docs.expo.dev/guides/push-notifications/)
- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [React Native Notifications Guide](https://github.com/wix/react-native-notifications)

---

## Quick Start Checklist

- [ ] Created Firebase project
- [ ] Got Firebase credentials and added to `.env`
- [ ] Downloaded `google-services.json` for Android
- [ ] Set up APNs certificate for iOS
- [ ] Ran `npm install` or `yarn install`
- [ ] Built app with EAS: `eas build --platform ios` or `eas build --platform android`
- [ ] Got Expo Push Token from device logs
- [ ] Tested notification via https://expo.dev/notifications
- [ ] Set up backend integration
- [ ] Customized notification handling in `notificationService.js`

That's it! Your push notifications are ready to go! 🚀
