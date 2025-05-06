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
        .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
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
          console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key: ${recaptchaSiteKey.substring(0, 10)}...`);
          // Pass your reCAPTCHA Enterprise site key (public key) to activate(). Make
          // sure this key is the counterpart to the secret key you set in the Firebase console.
          try {
             // Ensure it's only initialized once.
            if (app && (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN === undefined && !appCheckInitialized) {
                initializeAppCheck(app, {
                    provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
                    isTokenAutoRefreshEnabled: true,
                });
                appCheckInitialized = true;
                console.log('🟢 Firebase App Check initialized with reCAPTCHA Enterprise.');
            } else if (appCheckInitialized) {
                console.warn('🟡 Firebase App Check already initialized.');
            } else if ((self as any).FIREBASE_APPCHECK_DEBUG_TOKEN !== undefined) {
                console.warn('🟡 Firebase App Check debug token is set. Real App Check provider will not be used. For production, remove the debug token.');
            }

          } catch (appCheckError) {
            console.error("🔴 Firebase App Check initialization FAILED:", appCheckError);
             if (appCheckError instanceof Error) {
              console.error("AppCheck Error Name:", appCheckError.name);
              console.error("AppCheck Error Message:", appCheckError.message);
            }
            console.error(
              "🚨 TROUBLESHOOTING Firebase App Check (reCAPTCHA error):\n" +
              "1. VERIFY KEY: Ensure NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env file is correct (" + recaptchaSiteKey.substring(0,10) + "...).\n" +
              "2. DOMAIN AUTHORIZATION: The current domain (e.g., localhost, your deployment URL " + (typeof window !== 'undefined' ? window.location.hostname : '') + ") MUST be added to the allowed domains for this reCAPTCHA key in Google Cloud Console (Security > reCAPTCHA Enterprise).\n" +
              "3. API ENABLED: Make sure the 'reCAPTCHA Enterprise API' is enabled for your Google Cloud project '" + (firebaseConfig.projectId || 'YOUR_PROJECT_ID') + "'.\n" +
              "4. BILLING: Confirm billing is enabled for your Google Cloud project. reCAPTCHA Enterprise might have usage costs.\n" +
              "5. EXTENSIONS: Disable ad blockers or browser extensions that might interfere with reCAPTCHA.\n" +
              "6. DEBUG TOKEN: If you previously used an App Check debug token for local testing, ensure it's removed for production or when testing the real reCAPTCHA flow."
            );
          }
        }
      } catch (initError) {
        console.error("🔴 Firebase core initialization failed:", initError);
        app = undefined;
      }
    } else {
      app = getApps()[0];
      // Attempt to initialize AppCheck if not already done and app exists
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
             } else {
                console.error("🔴 Firebase App Check initialization FAILED on subsequent load:", appCheckError);
                console.error(
                    "🚨 TROUBLESHOOTING (subsequent load): Check previous logs for detailed error messages. Ensure all conditions for reCAPTCHA are met (domain authorization, API enabled, billing)."
                );
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
  if (typeof window === 'undefined') return null; // Firebase is client-side

  if (!app || getApps().length === 0) {
    initializeFirebase();
  }
  return app || null;
};

// Function to get App Check instance (optional, for advanced use cases)
// import { getAppCheck } from "firebase/app-check";
// export const getAppCheckInstance = () => {
//   const firebaseApp = getFirebaseApp();
//   if (firebaseApp && appCheckInitialized) {
//     return getAppCheck(firebaseApp);
//   }
//   return null;
// };
