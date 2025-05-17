// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
// App Check is currently disabled based on previous interactions.
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Firebase project configuration
// These values MUST be present in your .env.local or .env file
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
let db: Firestore | undefined;

console.log("--- Firebase Client-Side Env Check (src/lib/firebase.ts) ---");
const requiredClientEnvVars: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];
let allClientVarsPresent = true;
requiredClientEnvVars.forEach(key => {
  if (!firebaseConfig[key]) {
    console.error(`🔴 Missing NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
    allClientVarsPresent = false;
  } else {
    // Mask sensitive parts of keys if you want, for now just showing presence
    const value = firebaseConfig[key];
    console.log(`🟢 Found NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}: ${typeof value === 'string' && key === 'apiKey' ? value.substring(0,6) + '...' : value}`);
  }
});
if (!firebaseConfig.measurementId) {
    console.warn("🟠 NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is not set (Optional, for Analytics).");
}


// Check if Firebase has already been initialized (client-side check)
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    console.log("Attempting Firebase client-side initialization...");
    if (allClientVarsPresent) {
      try {
        app = initializeApp(firebaseConfig);
        console.log('🟢 Firebase core initialized successfully on client. Project ID:', firebaseConfig.projectId);
        db = getFirestore(app);
        console.log('🟢 Firestore initialized successfully on client.');

        // App Check initialization (currently disabled)
        // const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        // if (recaptchaSiteKey) {
        //   console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key.`);
        //   try {
        //     initializeAppCheck(app, {
        //       provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
        //       isTokenAutoRefreshEnabled: true,
        //     });
        //     console.log("🟢 Firebase App Check initialized with reCAPTCHA Enterprise.");
        //   } catch (appCheckError: any) {
        //     console.error("🔴 Firebase App Check initialization FAILED:", appCheckError.message || appCheckError);
        //   }
        // } else {
        //   console.warn("🟠 NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. Firebase App Check (reCAPTCHA) will not be initialized.");
        // }

      } catch (initError: any) {
        console.error("🔴 Firebase core client-side initialization FAILED:", initError.message || initError);
        app = undefined; 
        db = undefined;
      }
    } else {
      console.error(
        `🔴 Critical Error: Missing one or more Firebase client environment variables. ` +
        `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
      );
      app = undefined;
      db = undefined;
    }
  } else {
    app = getApp();
    if (app && !db) { // Ensure db is also initialized if app already exists
        db = getFirestore(app);
    }
    console.log('Firebase app already initialized on client. Project ID:', (app?.options as any)?.projectId);
  }
}

export { app, db };
