/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAHwaJ8mvYjDom7lKGcPcvmIyt7WCF5-I4",
  authDomain: "puri-89f9e.firebaseapp.com",
  projectId: "puri-89f9e",
  storageBucket: "puri-89f9e.appspot.com",
  messagingSenderId: "251248602302",
  appId: "1:251248602302:web:91e7d280e6dbb75c1dc2ef",
  measurementId: "G-3PPESZZ5QH"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png'
  });
});