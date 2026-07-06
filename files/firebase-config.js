/* ==========================================================================
   FIREBASE CONFIG
   1. Go to https://console.firebase.google.com → Create a project (free)
   2. Add a Web App → copy the config values below
   3. Enable: Authentication → Email/Password → add your admin email + password
   4. Enable: Firestore Database → Start in production mode → set rules from README.md
   5. Replace the placeholders below and re-upload this file to your host.
   Until then, the site runs on data.js and the admin panel works in
   "Export mode" (edits download an updated data.js instead of saving live).
   ========================================================================== */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYXzLBIjnPvCtS0iY6mHKAIocF8JwtAB8",
  authDomain: "personal-portfolio-82029.firebaseapp.com",
  projectId: "personal-portfolio-82029",
  storageBucket: "personal-portfolio-82029.firebasestorage.app",
  messagingSenderId: "810618938570",
  appId: "1:810618938570:web:942c8a5c074922ad22c033",
  measurementId: "G-28EGV9YRPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);