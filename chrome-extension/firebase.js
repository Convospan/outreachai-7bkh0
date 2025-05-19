
// This file is for initializing the Firebase App for the extension.
// It's imported by background.js or popup.js where Firebase services are needed.

// Import functions from the Firebase SDKs
// IMPORTANT: In Manifest V3, direct SDK imports like this in service workers can be tricky.
// Often, it's recommended to use the compat libraries or Firebase's modular SDK v9+
// specifically designed for modern JavaScript environments.
// For simplicity, this example uses a structure assuming v9 modular SDK.

// firebase-app.js
import { initializeApp as initializeApp_app } from 'firebase/app';
export { initializeApp_app as initializeApp };

// firebase-auth.js
import {
  getAuth as getAuth_auth,
  signInWithCustomToken as signInWithCustomToken_auth,
  onAuthStateChanged as onAuthStateChanged_auth
  // Add other auth methods you need, e.g., GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';

export {
  getAuth_auth as getAuth,
  signInWithCustomToken_auth as signInWithCustomToken,
  onAuthStateChanged_auth as onAuthStateChanged
};


// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration.
// Storing this directly in client-side code (even in an extension) is generally
// not recommended for production extensions that are publicly distributed if it contains sensitive info.
// Consider fetching it from a secure remote config or having the user configure it
// if your extension handles highly sensitive operations or API keys not meant to be public.
// For client-side SDK keys (like below), it's common practice but be aware of the implications.
const firebaseConfig = {
  apiKey: "YOUR_NEXT_PUBLIC_FIREBASE_API_KEY", // Replace
  authDomain: "YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", // Replace
  projectId: "YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID", // Replace
  storageBucket: "YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", // Replace
  messagingSenderId: "YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", // Replace
  appId: "YOUR_NEXT_PUBLIC_FIREBASE_APP_ID", // Replace
  // measurementId: "YOUR_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
let app;
try {
    app = initializeApp_app(firebaseConfig);
    console.log("Firebase initialized in extension.");
} catch (e) {
    console.error("Firebase initialization error in extension:", e);
}

const auth = app ? getAuth_auth(app) : null;

export { app, auth };

// You can also export other Firebase services if needed:
// import { getFirestore } from "firebase/firestore";
// const db = getFirestore(app);
// export { db };
