// src/lib/firebase.ts
'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
// App Check is currently disabled. To re-enable:
// 1. Ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set in your .env.local
// 2. Uncomment the imports and the App Check initialization block below.
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional for Analytics
};

let app: FirebaseApp | undefined;
// let appCheckInitialized = false; // Keep this if you plan to re-enable App Check

export function initializeFirebase(): FirebaseApp | null {
  console.log('Attempting Firebase initialization...');
  if (typeof window !== 'undefined') {
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
        `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env.local file or environment configuration. Firebase will NOT be initialized.`
      );
      app = undefined; // Ensure app is marked as uninitialized
      return null;
    }

    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        console.log('🟢 Firebase core initialized successfully. Project ID:', firebaseConfig.projectId, 'App instance:', app);

        // App Check Initialization Block (Currently Disabled)
        /*
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!recaptchaSiteKey) {
          console.warn(
            "🟡 WARNING: NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is missing. " +
            "Firebase App Check will NOT be initialized if re-enabled."
          );
        } else if (app && !appCheckInitialized) { // Ensure app is defined
          console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key (masked): ${recaptchaSiteKey.substring(0, 6)}...****`);
          try {
            initializeAppCheck(app, {
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
          } catch (appCheckError: any) {
            console.error("🔴 Firebase App Check initialization FAILED:", appCheckError.message || appCheckError);
            // Optionally, decide if this is a critical failure for your app
          }
        }
        */
      } catch (initError: any) {
        console.error("🔴 Firebase core initialization FAILED:", initError.message || initError);
        app = undefined;
        return null;
      }
    } else {
      app = getApp();
      // console.log('Firebase app already initialized. App instance:', app); // Less verbose on subsequent calls
    }
  } else {
    console.log("Firebase initialization skipped (server-side or non-browser environment).");
    return null;
  }
  return app || null;
}

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') {
    // console.warn("getFirebaseApp called in a non-browser environment. Returning null.");
    return null;
  }
  if (!app || getApps().length === 0) {
    console.log("getFirebaseApp: Firebase app not yet initialized or no apps found, attempting to initialize...");
    return initializeFirebase();
  }
  // console.log("getFirebaseApp: Returning existing Firebase app instance.");
  return app;
};
