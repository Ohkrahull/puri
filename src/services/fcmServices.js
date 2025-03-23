// // src/services/fcmServices.js
// import { getToken, onMessage } from 'firebase/messaging';
// import { messaging } from '../firebase/firebase';
// import { doc, setDoc, getFirestore } from 'firebase/firestore';

// class FCMService {
//   constructor() {
//     this.db = getFirestore();
//   }

//   // async init(vapidKey) {
//   //   try {
//   //     if (!('serviceWorker' in navigator)) {
//   //       throw new Error('Service workers are not supported');
//   //     }

//   //     await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//   //     const permission = await Notification.requestPermission();
      
//   //     if (permission === 'granted') {
//   //       const token = await this.getToken(vapidKey);
//   //       console.log(token);
        
//   //       this.onMessageListener();
//   //       return token;
//   //     }
//   //     throw new Error('Permission denied');
//   //   } catch (error) {
//   //     console.error('FCM init error:', error);
//   //     throw error;
//   //   }
//   // }
//   async init(vapidKey) {
//     try {
//       if (!('serviceWorker' in navigator)) {
//         throw new Error('Service workers are not supported');
//       }
      
//       // Register service worker first
//       await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
//       // Request permission
//       const permission = await Notification.requestPermission();
      
//       if (permission === 'granted') {
//         // Use the VAPID key from env or fallback to the one provided
//         const actualVapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || vapidKey;
        
//         // Make sure we have a valid VAPID key
//         if (!actualVapidKey) {
//           console.warn('No VAPID key available - FCM token generation might fail');
//         }
        
//         // Get token with the key
//         const token = await this.getToken(actualVapidKey);
//         console.log("FCM Token:", token);
        
//         this.onMessageListener();
//         return token;
//       }
//       throw new Error('Permission denied');
//     } catch (error) {
//       console.error('FCM init error:', error);
//       throw error;
//     }
//   }

//   async getToken(vapidKey) {
//     try {
//       const currentToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.getRegistration() });
//       if (currentToken) {
//         console.log('Token:', currentToken);
//         return currentToken;
//       }
//       throw new Error('No token received');
//     } catch (error) {
//       console.error('Token error:', error);
//       throw error;
//     }
//   }

//   onMessageListener() {
//     onMessage(messaging, (payload) => {
//       console.log('Message received:', payload);
//       this.showNotification(payload);
//     });
//   }

//   showNotification(payload) {
//     const { title, body } = payload.notification;
//     new Notification(title, {
//       body,
//       icon: '/logo192.png'
//     });
//   }

//   async saveToken(userId, token) {
//     try {
//       await setDoc(doc(this.db, 'fcmTokens', userId), {
//         token,
//         updatedAt: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Save token error:', error);
//       throw error;
//     }
//   }

//   async sendNotification(data) {
//     try {
//       const response = await fetch('http://localhost:5000/api/send-notification2', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
//       return await response.json();
//     } catch (error) {
//       console.error('Send notification error:', error);
//       throw error;
//     }
//   }
// }

// export const fcmService = new FCMService();
// src/services/fcmServices.js

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';
import { doc, setDoc, getDoc, serverTimestamp, getFirestore, collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';

class FCMService {
  constructor() {
    this.db = getFirestore();
    this.notificationHandlers = [];
  }
  
  // Initialize FCM and get token
  async init(vapidKey) {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported');
      }
      
      // Register service worker first
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully', registration);
      
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Use the VAPID key from env or fallback to the one provided
        const actualVapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY || vapidKey;
        
        // Get token with the key
        const token = await this.getToken(actualVapidKey, registration);
        console.log("Dashboard FCM Token:", token);
        
        // Save token to Firestore
        await this.saveDashboardToken(token);
        
        // Set up message listener
        this.onMessageListener();
        
        return token;
      }
      throw new Error('Notification permission denied');
    } catch (error) {
      console.error('FCM initialization error:', error);
      throw error;
    }
  }
  
  // Get FCM token
  async getToken(vapidKey, registration) {
    try {
      const currentToken = await getToken(messaging, { 
        vapidKey, 
        serviceWorkerRegistration: registration || await navigator.serviceWorker.getRegistration() 
      });
      
      if (currentToken) {
        return currentToken;
      }
      throw new Error('No FCM token received');
    } catch (error) {
      console.error('FCM token error:', error);
      throw error;
    }
  }
  
  // Save token to Firestore for the dashboard
  async saveDashboardToken(token) {
    try {
      // Save to both locations for backward compatibility
      
      // Save to settings collection
      await setDoc(doc(this.db, 'settings', 'dashboard_fcm_token'), {
        token,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      // Save to notificationTokens collection
      await setDoc(doc(this.db, 'notificationTokens', 'dashboard'), {
        token,
        type: 'dashboard',
        platform: 'web',
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('Dashboard FCM token saved to Firestore');
      return true;
    } catch (error) {
      console.error('Error saving dashboard token:', error);
      return false;
    }
  }
  
  // Listen for incoming messages
  // onMessageListener() {
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received in foreground:', payload);
      
  //     // Show browser notification
  //     this.showNotification(payload);
      
  //     // Save notification to Firestore
  //     this.saveNotificationToFirestore(payload);
      
  //     // Notify all registered handlers
  //     this.notifyHandlers(payload);
  //   });
  // }
  // Check this part of your fcmServices.js
onMessageListener() {
  onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    
    // Add this console log to see exactly what's happening
    console.log('Payload structure:', JSON.stringify(payload, null, 2));
    
    // Show browser notification
    this.showNotification(payload);
    
    // Save notification to Firestore
    this.saveNotificationToFirestore(payload);
    
    // Notify all registered handlers
    this.notifyHandlers(payload);
  });
}
  
  // Show browser notification
  showNotification(payload) {
    if (payload.notification) {
      const { title, body } = payload.notification;
      const options = {
        body,
        icon: '/logo192.png'
      };
      
      // Add image to notification if available
      if (payload.data && (payload.data.visitorImage || payload.data.imageUrl)) {
        options.image = payload.data.visitorImage || payload.data.imageUrl;
      }
      
      new Notification(title, options);
    }
  }
  
  // Save notification to Firestore
  async saveNotificationToFirestore(payload) {
    try {
      // Check if notification already exists
      if (payload.data && payload.data.notificationId) {
        const notificationRef = doc(this.db, 'notifications', payload.data.notificationId);
        const notificationDoc = await getDoc(notificationRef);
        
        if (notificationDoc.exists()) {
          // Update existing notification
          await setDoc(notificationRef, {
            receivedAt: serverTimestamp(),
            receivedByDashboard: true
          }, { merge: true });
          
          return payload.data.notificationId;
        }
      }
      
      // Create new notification document
      const notificationData = {
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body || '',
        timestamp: serverTimestamp(),
        read: false,
        data: payload.data || {},
        type: payload.data?.type || 'GENERAL'
      };
      
      // Add more specific notification data
      if (payload.data) {
        if (payload.data.type === 'SOS_ALERT' || payload.data.emergencyType) {
          notificationData.category = 'EMERGENCY';
          notificationData.priority = 'HIGH';
        } else if (payload.data.type === 'VISITOR_APPROVAL') {
          notificationData.category = 'VISITOR';
          notificationData.priority = 'MEDIUM';
        } else if (payload.data.type === 'SOS_CANCELLED') {
          notificationData.category = 'EMERGENCY';
          notificationData.priority = 'MEDIUM';
          notificationData.relatedId = payload.data.sosId;
        }
      }
      
      const docRef = await addDoc(collection(this.db, 'notifications'), notificationData);
      console.log('Notification saved to Firestore with ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving notification to Firestore:', error);
      return null;
    }
  }
  
  // Register a handler for new notifications
  registerNotificationHandler(handler) {
    this.notificationHandlers.push(handler);
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
    };
  }
  
  // Notify all handlers
  notifyHandlers(payload) {
    this.notificationHandlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error('Error in notification handler:', err);
      }
    });
  }
  
  // Get notifications from Firestore
  async getNotifications(limit = 20) {
    try {
      const q = query(
        collection(this.db, 'notifications'),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
  
  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      await setDoc(doc(this.db, 'notifications', notificationId), {
        read: true,
        readAt: serverTimestamp()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }
  
  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const q = query(
        collection(this.db, 'notifications'),
        where('read', '==', false),
        limit(100) // Process in batches of 100
      );
      
      const snapshot = await getDocs(q);
      
      const batch = this.db.batch();
      let count = 0;
      
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: serverTimestamp()
        });
        count++;
      });
      
      if (count > 0) {
        await batch.commit();
      }
      
      return count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
  }
  
  // Count unread notifications
  async getUnreadCount() {
    try {
      const q = query(
        collection(this.db, 'notifications'),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }
  }
}

export const fcmService = new FCMService();