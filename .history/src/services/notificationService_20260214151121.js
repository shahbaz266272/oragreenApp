import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for push notifications
 * @returns {Promise<string|null>} - Device push token or null
 */
export const registerForPushNotifications = async () => {
  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push notification permissions!');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Expo Push Token:', token.data);

      // Save token to AsyncStorage for later use
      await AsyncStorage.setItem('expoPushToken', token.data);
      return token.data;
    } else {
      console.warn('Push notifications only work on physical devices!');
      return null;
    }
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Set up notification listeners
 * Call this in your App component useEffect
 */
export const setupNotificationListeners = () => {
  // Listen for notifications when app is in foreground
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('📬 Notification received in foreground:', notification);
      handleNotification(notification);
    }
  );

  // Listen for notification interactions (user tapped on notification)
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log('👆 User tapped notification:', response);
      handleNotificationResponse(response);
    }
  );

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

/**
 * Handle foreground notification
 * Override this to add custom logic
 */
const handleNotification = (notification) => {
  const { title, body, data } = notification.request.content;
  console.log('Notification Data:', { title, body, data });
  // Add your custom handling here (e.g., navigate to specific screen, show toast, etc.)
};

/**
 * Handle notification response (user interaction)
 * Override this to add custom navigation/logic
 */
const handleNotificationResponse = (response) => {
  const { notification } = response;
  const { data } = notification.request.content;
  console.log('Notification Response Data:', data);
  // Add your custom handling here (e.g., navigate based on notification data)
};

/**
 * Send a test notification
 * Use this to test your notification setup
 */
export const sendTestNotification = async () => {
  try {
    const token = await AsyncStorage.getItem('expoPushToken');
    if (!token) {
      console.warn('No push token found. Register first.');
      return;
    }

    console.log('Sending test notification to token:', token);
    
    // In a real app, you'd send this from your backend using the Expo Push API
    // For testing, use: https://expo.dev/notifications
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

/**
 * Get saved push token from storage
 */
export const getPushToken = async () => {
  try {
    const token = await AsyncStorage.getItem('expoPushToken');
    return token;
  } catch (error) {
    console.error('Error retrieving push token:', error);
    return null;
  }
};

/**
 * Schedule a local notification test (runs on device after delay)
 */
export const scheduleTestNotification = async (seconds = 5) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification 🎉',
        body: 'Push notifications are working!',
        data: { testData: 'This is a test' },
        sound: 'default',
        badge: 1,
      },
      trigger: { seconds },
    });
    console.log(`Test notification scheduled for ${seconds} seconds from now`);
  } catch (error) {
    console.error('Error scheduling test notification:', error);
  }
};
