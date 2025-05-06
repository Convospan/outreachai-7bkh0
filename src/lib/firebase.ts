'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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
let appCheckInitialized = false;

export function initializeFirebase() {
  if (typeof window !== 'undefined') { // Ensure this runs only on the client
    if (!getApps().length) {
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value && key !== 'measurementId')
        .map(([key]) => key);

      if (missingKeys.length > 0) {
        console.error(
          `🔴 Missing Firebase environment variables: ${missingKeys.join(', ')}. ` +
          `Please check your .env file or environment configuration. Firebase will not be initialized.`
        );
        return; // Stop initialization if core Firebase config is missing
      }

      try {
        app = initializeApp(firebaseConfig);
        console.log('🟢 Firebase initialized successfully');

        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!recaptchaSiteKey) {
          console.error(
            "🔴 Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable. " +
            "Firebase App Check will not be initialized. This is required for App Check."
          );
        } else {
          try {
            initializeAppCheck(app, {
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
          } catch (appCheckError) {
            console.error("🔴 Firebase App Check initialization failed:", appCheckError);
            // Log specific details if available
            if (appCheckError instanceof Error) {
              console.error("AppCheck Error Name:", appCheckError.name);
              console.error("AppCheck Error Message:", appCheckError.message);
            }
            console.error("Ensure your NEXT_PUBLIC_RECAPTCHA_SITE_KEY is correct, the domain is authorized in Google Cloud Console for this key, and the reCAPTCHA Enterprise API is enabled for your project.");
          }
        }
      } catch (initError) {
        console.error("🔴 Firebase core initialization failed:", initError);
        app = undefined;
      }
    } else {
      app = getApps()[0];
      if (app && !appCheckInitialized) {
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (recaptchaSiteKey) {
          try {
            initializeAppCheck(app, {
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized on subsequent load.');
          } catch (appCheckError) {
            if (appCheckError instanceof Error && appCheckError.message.includes('app-check/already-initialized')) {
              console.warn('🟡 Firebase App Check already initialized.');
              appCheckInitialized = true;
            } else {
              console.error("🔴 Firebase App Check initialization failed on subsequent load:", appCheckError);
            }
          }
        } else {
          console.warn("🟡 NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing on subsequent load. App Check not initialized.");
        }
      }
    }
  }
}

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') return null; // App Check is client-side

  if (!app || getApps().length === 0) {
    initializeFirebase();
  }
  return app || null;
};
