// src/utils/fcmTokenManager.js
import { fcmService } from '../services/fcmServices';

export const initializeFCMToken = async () => {
  try {
    // Ensure you have the VAPID key in your .env file
    const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY;
    
    if (!VAPID_KEY) {
      console.warn('VAPID key is not defined in environment variables');
      return null;
    }

    // Check if notification permission is granted
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered successfully');
        
        // Initialize FCM and get token
        const token = await fcmService.init(VAPID_KEY);
        
        if (token) {
          console.log('FCM Token successfully obtained:', token);
          return token;
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service workers are not supported');
    }

    return null;
  } catch (error) {
    console.error('FCM Token Initialization Error:', error);
    return null;
  }
};