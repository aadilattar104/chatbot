// firebase.js

// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAscBzvPEmqmy58uBppWimNgoKp2El5Urw",
  authDomain: "chatbot-bfdbc.firebaseapp.com",
  projectId: "chatbot-bfdbc",
  storageBucket: "chatbot-bfdbc.appspot.com",
  messagingSenderId: "1078257869404",
  appId: "1:1078257869404:web:d9482b565f684ce5a6bc99",
  measurementId: "G-S8P7DGTQHL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
const analytics = getAnalytics(app);

export default app;
