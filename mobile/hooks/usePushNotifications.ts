
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as api from '../../services/apiService';

// Mocking the Expo Notifications module for this environment
const Notifications = {
  requestPermissionsAsync: async (permissions?: any) => ({ status: 'granted' }),
  getExpoPushTokenAsync: async (options?: any) => ({ data: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' }),
  setNotificationHandler: (handler: any) => {},
  addNotificationReceivedListener: (listener: any) => {
    console.log('Mock: Notification received listener added');
    // Return a subscription object with a remove method
    return { remove: () => console.log('Mock: Listener removed') };
  },
  addNotificationResponseReceivedListener: (listener: any) => {
    console.log('Mock: Notification response listener added');
    return { remove: () => console.log('Mock: Listener removed') };
  },
  // Fix: Ensure this matches the expected signature or handle the object directly
  removeNotificationSubscription: (subscription: any) => {
    if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
    }
  }
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  // This would use Device.isDevice in a real app
  if (true) { 
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Push Notifications', 'Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } else {
    Alert.alert('Push Notifications', 'Must use physical device for Push Notifications');
  }

  return token;
}

export default function usePushNotifications(user: any) {
  const [expoPushToken, setExpoPushToken] = useState('');
  // Initialize refs with null to satisfy strict types
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    if (!user) return; 

    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        api.subscribePush({ token, platform: 'mobile' })
          .catch(err => console.error("Failed to send push token to server", err));
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received while app is running:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped on notification:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return {
    expoPushToken,
  };
}
