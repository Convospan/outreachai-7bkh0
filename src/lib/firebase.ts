// src/lib/firebase.ts
'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"; // Temporarily commented out

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
// let appCheckInitialized = false; // Temporarily commented out

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== 'undefined') {
    const requiredEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      // measurementId is optional, so not checking it here explicitly for critical error
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

        // Temporarily comment out App Check initialization to focus on core Firebase setup
        /*
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!recaptchaSiteKey) {
          console.warn(
            "🟡 WARNING: NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is missing. " +
            "Firebase App Check will NOT be initialized. This is crucial for protecting your backend resources."
          );
        } else if (!appCheckInitialized) {
          try {
            initializeAppCheck(app, {
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
          } catch (appCheckError: any) {
            console.error("🔴 Firebase App Check initialization FAILED:", appCheckError);
          }
        }
        */
      } catch (initError) {
        console.error("🔴 Firebase core initialization FAILED:", initError);
        app = undefined;
        return null;
      }
    } else {
      app = getApp();
      // console.log('🟡 Firebase app already initialized.'); // Less verbose
    }
  } else {
    // console.log("Firebase initialization skipped (server-side or non-browser environment).");
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
    return initializeFirebase();
  }
  return app;
};

// export const isAppCheckInitialized = (): boolean => { // Temporarily commented out
//   return appCheckInitialized;
// };

