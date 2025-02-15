// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";


// // const firebaseConfig = {
// //   apiKey: "AIzaSyAHwaJ8mvYjDom7lKGcPcvmIyt7WCF5-I4",
// //   authDomain: "puri-89f9e.firebaseapp.com",
// //   projectId: "puri-89f9e",
// //   storageBucket: "puri-89f9e.appspot.com",
// //   messagingSenderId: "251248602302",
// //   appId: "1:251248602302:web:91e7d280e6dbb75c1dc2ef",
// //   measurementId: "G-3PPESZZ5QH"
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAHwaJ8mvYjDom7lKGcPcvmIyt7WCF5-I4",
//   authDomain: "puri-89f9e.firebaseapp.com",
//   projectId: "puri-89f9e",
//   storageBucket: "puri-89f9e.appspot.com",
//   messagingSenderId: "251248602302",
//   appId: "1:251248602302:web:91e7d280e6dbb75c1dc2ef",
//   measurementId: "G-3PPESZZ5QH"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase services
// const analytics  = getAnalytics(app);
// const db = getFirestore(app);
// const auth = getAuth(app);

// export { app, analytics, db, auth };

// // Add this line to ensure Firebase is initialized
// initializeApp(firebaseConfig);

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAHwaJ8mvYjDom7lKGcPcvmIyt7WCF5-I4",
  authDomain: "puri-89f9e.firebaseapp.com",
  projectId: "puri-89f9e",
  storageBucket: "puri-89f9e.appspot.com",
  messagingSenderId: "251248602302",
  appId: "1:251248602302:web:91e7d280e6dbb75c1dc2ef",
  measurementId: "G-3PPESZZ5QH"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

export const onMessageListener = () => {
  if (!messaging) return () => {};
  
  return new Promise(resolve => {
    onMessage(messaging, payload => {
      resolve(payload);
    });
  });
};

export { app, analytics, db, auth, messaging };