'use client'; // This file is likely used on the client-side

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"; // Added import

// Ensure environment variables are defined (replace with your actual env var names if different)
// Prefix with NEXT_PUBLIC_ to expose to the browser
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp | undefined;
let appCheckInitialized = false;

// Check if Firebase app has already been initialized
if (!getApps().length) {
  // Check for missing Firebase environment variables *before* initializing
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    const errorMessage = `Missing Firebase environment variables: ${missingKeys.join(', ')}. Please check your .env file or environment configuration. Firebase will not be initialized.`;
    console.error(errorMessage);
    // Avoid throwing error directly in top-level module scope.
    // Components using Firebase should handle the uninitialized state.
  } else {
    try {
      app = initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');

      // Check for reCAPTCHA site key
      const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!recaptchaSiteKey) {
          console.error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable. App Check will not be initialized.");
      } else {
          // Initialize App Check only if Firebase app was successfully initialized and key exists
          initializeAppCheck(app, {
            provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
          });
          appCheckInitialized = true;
          console.log('Firebase App Check initialized');
      }

    } catch (error) {
      console.error("Firebase initialization failed:", error);
      app = undefined; // Ensure app is undefined if init fails
      // Handle initialization error appropriately in components
    }
  }
} else {
  app = getApps()[0]; // Get the default app if already initialized
  // Attempt to initialize App Check if not already done (e.g., during hot reload)
  if (app && !appCheckInitialized) {
      const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (recaptchaSiteKey) {
          try {
              initializeAppCheck(app, {
                provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
                isTokenAutoRefreshEnabled: true
              });
              appCheckInitialized = true;
              console.log('Firebase App Check initialized on subsequent load');
          } catch (error) {
              // App Check might already be initialized in some HMR scenarios, ignore duplicate init error
              if (error instanceof Error && error.message.includes('app-check/already-initialized')) {
                  console.warn('Firebase App Check already initialized.');
                  appCheckInitialized = true;
              } else {
                  console.error("Firebase App Check initialization failed on subsequent load:", error);
              }
          }
      } else {
           console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing on subsequent load. App Check not initialized.");
      }
  }
}

// Export the initialized app instance (or undefined if init failed)
// It's safer for components to use getFirebaseApp to ensure initialization.
export { app as firebaseAppInstance };

// Helper function to get the initialized app, useful in components
export const getFirebaseApp = (): FirebaseApp | null => {
  if (app) {
    return app;
  }
  if (getApps().length) {
    // This might catch cases where the above logic didn't set `app` but it was initialized elsewhere
    return getApps()[0];
  }
  console.error("Firebase app is not available or initialization failed.");
  return null;
};