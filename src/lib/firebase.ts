// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Firebase project configuration
// These values MUST be present in your .env file (e.g., .env.local)
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
let db: any; // Using 'any' for Firestore type, can be more specific

console.log("--- Firebase Env Check (src/lib/firebase.ts) ---");
console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0,6)}...` : "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "NOT SET");
console.log("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "NOT SET (Optional)");
console.log("-------------------------------------------------");


// Check if Firebase has already been initialized
if (typeof window !== 'undefined' && !getApps().length) {
  console.log("Attempting Firebase initialization...");
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];
  const missingKeys = requiredEnvVars.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missingKeys.length > 0) {
    console.error(
      `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
      `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
    );
    app = undefined; // Explicitly set to undefined on failure
  } else {
    console.log("All required Firebase client environment variables are present.");
    try {
      app = initializeApp(firebaseConfig);
      console.log('🟢 Firebase core initialized successfully. Project ID:', firebaseConfig.projectId, "App instance:", app);
      // db = getFirestore(app); // Initialize Firestore here if app is successfully initialized

      // App Check initialization (currently disabled, uncomment to enable)
      // const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      // if (recaptchaSiteKey) {
      //   console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key (masked): ${recaptchaSiteKey.substring(0, 6)}...****`);
      //   try {
      //     initializeAppCheck(app, {
      //       provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      //       isTokenAutoRefreshEnabled: true,
      //     });
      //     console.log("🟢 Firebase App Check initialized with reCAPTCHA Enterprise.");
      //   } catch (appCheckError: any) {
      //     console.error("🔴 Firebase App Check initialization FAILED:", appCheckError.message || appCheckError);
      //     // Decide if this is critical enough to mark 'app' as undefined
      //   }
      // } else {
      //   console.warn("🟠 NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. Firebase App Check (reCAPTCHA) will not be initialized.");
      // }

    } catch (initError: any) {
      console.error("🔴 Firebase core initialization FAILED:", initError.message || initError);
      app = undefined; // Ensure app is undefined on failure
    }
  }
} else if (typeof window !== 'undefined') {
  app = getApp();
  // console.log('Firebase app already initialized. Project ID:', (app.options as any).projectId);
  // if (app) db = getFirestore(app);
}

// Initialize Cloud Firestore and get a reference to the service
// Make sure 'app' is valid before calling getFirestore
if (app && !db) {
    const { getFirestore: getClientFirestore } = await import("firebase/firestore");
    db = getClientFirestore(app);
}

// Export a function to get the app instance, ensuring it's initialized
// This helps consuming modules to wait for initialization if needed,
// or handle cases where initialization might fail.
const getFirebaseApp = (): FirebaseApp | undefined => {
  if (!app && typeof window !== 'undefined' && getApps().length > 0) {
    // This case handles scenarios where firebase.ts might be imported multiple times
    // or initialization sequence is complex.
    app = getApp();
  }
  return app;
};

export { app, db, getFirebaseApp };
