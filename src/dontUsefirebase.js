// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFireStore} from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBG83jKkcjrpSrCpGhO01nvHaa0Z-wtX5E",
  authDomain: "beeyondpuri.firebaseapp.com",
  projectId: "beeyondpuri",
  storageBucket: "beeyondpuri.appspot.com",
  messagingSenderId: "236509559370",
  appId: "1:236509559370:web:f7f66c702e88c041d984b3",
  measurementId: "G-BW4KP08RRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFireStore(app)