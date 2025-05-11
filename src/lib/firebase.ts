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
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value && key !== 'measurementId')
        .map(([key]) => key);

      if (missingKeys.length > 0) {
        console.error(
          `🔴 Missing Firebase environment variables: ${missingKeys.join(', ')}. ` +
          `Please check your .env file or environment configuration. Firebase will not be initialized.`
        );
        return;
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
          console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key starting with: ${recaptchaSiteKey.substring(0, 10)}...`);
          
          if (app && (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN === undefined && !appCheckInitialized) {
            try {
              initializeAppCheck(app, {
                  provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
                  isTokenAutoRefreshEnabled: true,
              });
              appCheckInitialized = true;
              console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
            } catch (appCheckError: any) {
              console.error("🔴 Firebase App Check initialization FAILED:", appCheckError);
              console.error("AppCheck Error Name:", appCheckError.name);
              console.error("AppCheck Error Message:", appCheckError.message);
              if (appCheckError.code === 'appCheck/recaptcha-error' || (appCheckError.message && appCheckError.message.includes('ReCAPTCHA'))) {
                   console.error(
                    "🚨 TROUBLESHOOTING Firebase App Check (reCAPTCHA error):\n" +
                    "1. VERIFY KEY: Ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file is correct (currently starts with: " + recaptchaSiteKey.substring(0,10) + "...).\n" +
                    "2. DOMAIN AUTHORIZATION: The current domain (" + window.location.hostname + ") MUST be added to the allowed domains for this reCAPTCHA key in Google Cloud Console (Security > reCAPTCHA Enterprise).\n" +
                    "3. API ENABLED: Make sure the 'reCAPTCHA Enterprise API' is enabled for your Google Cloud project '" + (firebaseConfig.projectId || 'YOUR_PROJECT_ID') + "'.\n" +
                    "4. BILLING: Confirm billing is enabled for your Google Cloud project. reCAPTCHA Enterprise might have usage costs.\n" +
                    "5. EXTENSIONS: Disable ad blockers or browser extensions that might interfere with reCAPTCHA.\n" +
                    "6. DEBUG TOKEN: If you previously used an App Check debug token for local testing, ensure it's removed for production or when testing the real reCAPTCHA flow."
                  );
              } else {
                 console.error(
                  "🚨 An unexpected error occurred during App Check initialization. Check the console for more details."
                 );
              }
            }
          } else if (appCheckInitialized) {
              console.warn('🟡 Firebase App Check already initialized.');
          } else if ((self as any).FIREBASE_APPCHECK_DEBUG_TOKEN !== undefined) {
              console.warn('🟡 Firebase App Check debug token is set. Real App Check provider will not be used. For production, remove the debug token.');
          }
        }
      } catch (initError) {
        console.error("🔴 Firebase core initialization failed:", initError);
        app = undefined;
      }
    } else {
      app = getApps()[0];
      if (app && !appCheckInitialized && (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN === undefined) {
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (recaptchaSiteKey) {
          try {
            initializeAppCheck(app, {
              provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
              isTokenAutoRefreshEnabled: true,
            });
            appCheckInitialized = true;
            console.log('🟢 Firebase App Check initialized on subsequent load.');
          } catch (appCheckError : any) {
             if (appCheckError.message && appCheckError.message.includes('app-check/already-initialized')) {
                 console.warn('🟡 Firebase App Check already initialized on subsequent load.');
                 appCheckInitialized = true;
             } else if (appCheckError.code === 'appCheck/recaptcha-error' || (appCheckError.message && appCheckError.message.includes('ReCAPTCHA'))) {
                 console.error("🔴 Firebase App Check initialization FAILED (reCAPTCHA error) on subsequent load. Current domain: " + window.location.hostname + ". See detailed troubleshooting steps above.");
             } else {
                console.error("🔴 Firebase App Check initialization FAILED on subsequent load:", appCheckError);
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
  if (typeof window === 'undefined') return null; 

  if (!app || getApps().length === 0) {
    initializeFirebase();
  }
  return app || null;
};
