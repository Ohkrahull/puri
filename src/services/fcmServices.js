// src/services/fcmServices.js
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/firebase';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

class FCMService {
  constructor() {
    this.db = getFirestore();
  }

  async init(vapidKey) {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers are not supported');
      }

      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await this.getToken(vapidKey);
        this.onMessageListener();
        return token;
      }
      throw new Error('Permission denied');
    } catch (error) {
      console.error('FCM init error:', error);
      throw error;
    }
  }

  async getToken(vapidKey) {
    try {
      const currentToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.getRegistration() });
      if (currentToken) {
        console.log('Token:', currentToken);
        return currentToken;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }

  onMessageListener() {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      this.showNotification(payload);
    });
  }

  showNotification(payload) {
    const { title, body } = payload.notification;
    new Notification(title, {
      body,
      icon: '/logo192.png'
    });
  }

  async saveToken(userId, token) {
    try {
      await setDoc(doc(this.db, 'fcmTokens', userId), {
        token,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Save token error:', error);
      throw error;
    }
  }

  async sendNotification(data) {
    try {
      const response = await fetch('http://localhost:5000/api/send-notification2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Send notification error:', error);
      throw error;
    }
  }
}

export const fcmService = new FCMService();