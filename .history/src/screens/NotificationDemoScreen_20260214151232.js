import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {
  registerForPushNotifications,
  getPushToken,
  scheduleTestNotification,
  setupNotificationListeners,
} from '../services/notificationService';

/**
 * Example Component: Push Notifications Demo
 * 
 * This component demonstrates how to use push notifications in your app.
 * You can integrate these functions into your existing screens.
 */

export default function NotificationDemoScreen() {
  const [pushToken, setPushToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPushToken();
  }, []);

  const loadPushToken = async () => {
    const token = await getPushToken();
    setPushToken(token);
  };

  const handleRegisterNotifications = async () => {
    setLoading(true);
    try {
      const token = await registerForPushNotifications();
      if (token) {
        setPushToken(token);
        Alert.alert('Success', `Push notifications registered!\n\nToken: ${token}`);
      } else {
        Alert.alert('Error', 'Failed to register for push notifications');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedleTestNotification = async () => {
    setLoading(true);
    try {
      await scheduleTestNotification(2); // Schedule for 2 seconds from now
      Alert.alert('Success', 'Test notification scheduled in 2 seconds!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (pushToken) {
      // Use Clipboard API if available
      try {
        // For React Native, you might need react-native-clipboard
        // For now, just show alert with token
        Alert.alert(
          'Push Token',
          pushToken + '\n\nUse this token to send notifications from Expo dashboard:\nhttps://expo.dev/notifications'
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to copy token');
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' }}>
          🔔 Push Notifications
        </Text>

        {/* Token Display */}
        <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 8 }}>
            Your Device Token:
          </Text>
          {pushToken ? (
            <View>
              <Text
                style={{
                  fontSize: 11,
                  color: '#00b300',
                  fontFamily: 'monospace',
                  backgroundColor: '#f0f0f0',
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              >
                {pushToken}
              </Text>
              <Text style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>
                ✓ Ready to receive notifications
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: '#cc0000' }}>
              ✗ No token available. Register first.
            </Text>
          )}
          <TouchableOpacity
            onPress={handleCopyToken}
            style={{
              backgroundColor: '#007AFF',
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
              View Full Token
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={handleRegisterNotifications}
            disabled={loading}
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
              {loading ? 'Registering...' : 'Register for Push Notifications'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSchedleTestNotification}
            disabled={loading}
            style={{
              backgroundColor: '#34C759',
              padding: 15,
              borderRadius: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
              {loading ? 'Scheduling...' : 'Send Test Notification (2s)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Send Remote Notification',
                'To send notifications from your server:\n\n1. Get your token (above)\n2. Go to https://expo.dev/notifications\n3. Paste token and send message\n\nOr integrate with your backend API.'
              );
            }}
            style={{
              backgroundColor: '#FF9500',
              padding: 15,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
              How to Send Remote Notifications
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Sections */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
            📚 How It Works:
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
              1. Your device is registered for push notifications{'\n'}
              2. A unique token is generated and displayed above{'\n'}
              3. Use this token to send notifications from:
              {'\n'}   • Expo Dashboard
              {'\n'}   • Your backend API
              {'\n'}   • Firebase Cloud Messaging
            </Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
            🧪 Testing:
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
              • Tap "Send Test Notification" to schedule a local notification{'\n'}
              • Use Expo Dashboard to send remote notifications{'\n'}
              • Check console logs for notification events{'\n'}
              • Verify notifications appear even when app is in background
            </Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
            🔧 Backend Integration:
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20 }}>
            <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
              See `src/services/notificationBackend.js` for server-side examples using:{'\n'}
              • Expo Push API (simple){'\n'}
              • Firebase Cloud Messaging (advanced){'\n'}
              • Order notifications{'\n'}
              • Promotional messages{'\n'}
              • Bulk sending
            </Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
            📖 Documentation:
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 8 }}>
            <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
              Read `FIREBASE_SETUP.md` for complete setup guide including:{'\n'}
              • Firebase console setup{'\n'}
              • iOS & Android configuration{'\n'}
              • Environment variables{'\n'}
              • Troubleshooting{'\n'}
              • Backend implementation
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * INTEGRATION EXAMPLES
 * 
 * How to use in other screens:
 */

// ✅ Example 1: Register on user login
/*
import { registerForPushNotifications, getPushToken } from '../services/notificationService';

async function handleUserLogin(credentials) {
  // ... login logic ...
  
  // Register for push notifications
  const pushToken = await registerForPushNotifications();
  
  // Send token to your backend to associate with user
  await updateUserPushToken(userId, pushToken);
}
*/

// ✅ Example 2: Handle specific notification in navigation
/*
import { setupNotificationListeners } from '../services/notificationService';

useEffect(() => {
  const cleanup = setupNotificationListeners();
  return cleanup;
}, []);

// Customize notification handling in notificationService.js:
// Listen for order notifications and navigate to OrdersScreen
*/

// ✅ Example 3: Schedule local notification for reminder
/*
import { scheduleTestNotification } from '../services/notificationService';

async function remindUserAboutCart() {
  await scheduleTestNotification(3600); // 1 hour later
}
*/
