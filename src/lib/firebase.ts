'use client';

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

let firebaseApp: FirebaseApp;

// Initialize Firebase only once, on the client
if (!getApps().length) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Check for missing environment variables
  const missingKeys = Object.keys(firebaseConfig).filter(key => !firebaseConfig[key]);
  if (missingKeys.length > 0) {
    console.error('Missing Firebase environment variables:', missingKeys.join(', '));
    // Only throw an error in the client-side:
    throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
  }

  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0]; // Use existing app if already initialized
}

export { firebaseApp };
