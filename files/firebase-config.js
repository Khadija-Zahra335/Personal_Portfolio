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
const FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
