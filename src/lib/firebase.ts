// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;

// Check if Firebase has already been initialized
if (!getApps().length) {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];
  const missingKeys = requiredEnvVars.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    console.error(
      `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
      `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
    );
    // To prevent errors if app is used before proper initialization,
    // you might want to throw an error here or handle this case gracefully in your app.
    // For now, we'll let it proceed, but Firebase services will fail.
    // A more robust solution would be to not export 'app' and 'db' if config is missing.
    app = null as any; // Explicitly set to something that would cause errors if used without proper init
  } else {
    try {
      app = initializeApp(firebaseConfig);
      console.log('🟢 Firebase core initialized successfully. Project ID:', firebaseConfig.projectId);
    } catch (initError: any) {
      console.error("🔴 Firebase core initialization FAILED:", initError.message || initError);
      app = null as any;
    }
  }
} else {
  app = getApp();
  // console.log('Firebase app already initialized.');
}

// Initialize Cloud Firestore and get a reference to the service
// Ensure 'app' is valid before calling getFirestore
const db = app ? getFirestore(app) : null as any; // Handle case where app might not be initialized

if (app && !db && process.env.NODE_ENV === 'development') {
  console.warn("Firestore (db) could not be initialized. This might be due to an issue with Firebase app initialization.");
}

export { app, db };
