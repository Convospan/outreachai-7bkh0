// src/lib/firebase.ts
'use client';

import type { FirebaseApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"; // App Check temporarily disabled

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
// let appCheckInitialized = false; // App Check temporarily disabled

export function initializeFirebase(): FirebaseApp | null {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([key, value]) => !value && key !== 'measurementId')
        .map(([key]) => key);

      if (missingKeys.length > 0) {
        console.error(
          `🔴 Critical Error: Missing Firebase environment variables: ${missingKeys.join(', ')}. ` +
          `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
        );
        return null;
      }

      try {
        app = initializeApp(firebaseConfig);
        console.log('🟢 Firebase initialized successfully. Project ID:', firebaseConfig.projectId);

        // --- App Check Initialization Start (Temporarily Disabled) ---
        console.warn("🟡 SKIPPING Firebase App Check initialization for now.");
        /*
        const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!recaptchaSiteKey) {
          console.warn(
            "🟡 WARNING: NEXT_PUBLIC_RECAPTCHA_SITE_KEY environment variable is missing. " +
            "Firebase App Check will NOT be initialized. This is crucial for protecting your backend resources."
          );
        } else {
          console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key (masked): ${recaptchaSiteKey.substring(0, 6)}...****`);
          
          if ((self as any).FIREBASE_APPCHECK_DEBUG_TOKEN !== undefined) {
            console.warn('🟡 Firebase App Check debug token is set. Real App Check provider will not be used. For production, remove the debug token.');
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
              if (appCheckError.name === 'FirebaseError' && appCheckError.code === 'appCheck/recaptcha-error') {
                   console.error(
                    "🚨🚨🚨 TROUBLESHOOTING Firebase App Check (appCheck/recaptcha-error): 🚨🚨🚨\n" +
                    "This usually means a configuration issue with your reCAPTCHA Enterprise setup in Google Cloud Console or your environment variables.\n" +
                    "Please verify the following:\n" +
                    "1. ✅ VERIFY SITE KEY VALUE: Ensure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` in your .env file is EXACTLY correct for your Firebase project. Current key starts with: " + recaptchaSiteKey.substring(0,10) + "...\n" +
                    "2. ✅ DOMAIN AUTHORIZATION: The current domain (`" + window.location.hostname + "`) MUST be added to the 'Allowed domains' for THIS reCAPTCHA key in Google Cloud Console (IAM & Admin > Security > reCAPTCHA Enterprise > Your Key Settings).\n" +
                    "3. ✅ API ENABLED: Make sure the 'reCAPTCHA Enterprise API' is ENABLED for your Google Cloud project '" + (firebaseConfig.projectId || 'YOUR_PROJECT_ID') + "'.\n" +
                    "4. ✅ BILLING ENABLED: Confirm billing is enabled for your Google Cloud project. reCAPTCHA Enterprise usage might incur costs.\n" +
                    "5. ✅ BROWSER EXTENSIONS: Temporarily disable ad blockers or browser extensions that might interfere with reCAPTCHA loading.\n" +
                    "6. ✅ DEBUG TOKEN: If you previously used an App Check debug token for local testing, ensure it's removed for production or when testing the real reCAPTCHA flow (check console for debug token messages)."
                  );
              } else {
                 console.error(
                  "🚨 An unexpected error occurred during App Check initialization. Check the console for more details from the App Check SDK."
                 );
              }
            }
          } else {
              console.log('🟡 Firebase App Check already initialized in this session.');
          }
        }
        */
        // --- App Check Initialization End (Temporarily Disabled) ---

      } catch (initError) {
        console.error("🔴 Firebase core initialization FAILED:", initError);
        app = undefined;
        return null;
      }
    } else {
      app = getApp();
      console.log('🟡 Firebase App Check initialization skipped on subsequent load (App Check temporarily disabled).');
      // --- App Check Subsequent Load Logic Start (Temporarily Disabled) ---
      /*
      if (!appCheckInitialized && (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN === undefined) {
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
             if (appCheckError.message && (appCheckError.message.includes('app-check/already-initialized') || appCheckError.code === 'app-check/already-initialized')) {
                 console.warn('🟡 Firebase App Check already initialized (detected on subsequent load).');
                 appCheckInitialized = true;
             } else if (appCheckError.name === 'FirebaseError' && appCheckError.code === 'appCheck/recaptcha-error') {
                 console.error("🔴 Firebase App Check initialization FAILED (reCAPTCHA error) on subsequent load. Current domain: `" + window.location.hostname + "`. See detailed troubleshooting steps above.");
             } else {
                console.error("🔴 Firebase App Check initialization FAILED on subsequent load with an unexpected error:", appCheckError);
             }
          }
        } else {
            console.warn("🟡 NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing on subsequent load. App Check not initialized.");
        }
      }
      */
      // --- App Check Subsequent Load Logic End (Temporarily Disabled) ---
    }
  } else {
    console.log("Firebase initialization skipped (server-side or non-browser environment). App Check not applicable here.");
    return null;
  }
  return app || null;
}

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') {
    console.warn("getFirebaseApp called in a non-browser environment. Returning null.");
    return null;
  }

  if (!app || getApps().length === 0) {
    return initializeFirebase();
  }
  return app;
};

/* // App Check temporarily disabled
export const isAppCheckInitialized = (): boolean => {
  return appCheckInitialized;
};
*/
