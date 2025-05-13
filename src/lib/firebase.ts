// src/lib/firebase.ts
'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"; // App Check currently disabled

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
// let appCheckInitialized = false; // App Check currently disabled

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== 'undefined') {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      // measurementId is optional for core Firebase, but if you use Analytics, it becomes important.
      // 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    ];
    const missingKeys = requiredEnvVars.filter(key => !process.env[key]);

    if (missingKeys.length > 0) {
      console.error(
        `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
        `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
      );
      return null; // Critical error, do not proceed
    }

    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        console.log('🟢 Firebase initialized successfully. Project ID:', firebaseConfig.projectId);

        // App Check is currently disabled to isolate other potential issues.
        // To re-enable, ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set and uncomment below.
        /*
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!recaptchaSiteKey) {
          console.warn(
            "🟡 WARNING: NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is missing. " +
            "Firebase App Check will NOT be initialized. This is crucial for protecting your backend resources."
          );
        } else if (!appCheckInitialized) { // Check if already initialized
          try {
            initializeAppCheck(app!, { // Added non-null assertion operator assuming 'app' will be initialized
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
          } catch (appCheckError: any) {
            console.error("🔴 Firebase App Check initialization FAILED:", appCheckError.message || appCheckError);
          }
        }
        */
      } catch (initError: any) {
        console.error("🔴 Firebase core initialization FAILED:", initError.message || initError);
        app = undefined; // Ensure app is undefined on failure
        return null;
      }
    } else {
      app = getApp();
      // console.log('Firebase app already initialized.'); // Less verbose on subsequent calls
    }
  } else {
    // console.log("Firebase initialization skipped (server-side or non-browser environment).");
    return null;
  }
  return app || null; // Return the initialized app or null if issues occurred
}

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') {
    // This function is primarily for client-side use.
    // Server-side Firebase (firebase-admin) is handled separately.
    // console.warn("getFirebaseApp called in a non-browser environment. Returning null.");
    return null;
  }
  if (!app || getApps().length === 0) {
    return initializeFirebase();
  }
  return app;
};

// export const isAppCheckInitialized = (): boolean => {
//   return appCheckInitialized;
// };
