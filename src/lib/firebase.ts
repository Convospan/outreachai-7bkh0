// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Define an array of required Firebase environment variable keys
const REQUIRED_FIREBASE_CLIENT_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  // 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID' is optional
];

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | null = null;

function initializeFirebaseClientSDK() {
  if (typeof window === 'undefined') {
    // Don't run Firebase client SDK initialization on the server
    return;
  }

  if (app) {
    console.log("Firebase app already initialized on client. Project ID:", (app.options as any)?.projectId);
    return;
  }

  console.log("Attempting Firebase client-side initialization...");

  const missingKeys: string[] = [];
  console.log("--- Firebase Client-Side Env Check (src/lib/firebase.ts) ---");
  REQUIRED_FIREBASE_CLIENT_ENV_VARS.forEach(key => {
    if (!process.env[key]) {
      missingKeys.push(key);
      console.log(`${key}: NOT SET`);
    } else {
      console.log(`${key}: SET (value will not be logged for security)`);
    }
  });
  // Check optional measurement ID
  if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    console.log(`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: SET`);
  } else {
    console.log(`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: NOT SET (Optional)`);
  }
  console.log("---------------------------------------------------------");


  if (missingKeys.length > 0) {
    console.error(
      `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
      `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
    );
    app = undefined; // Explicitly set to undefined on failure
    auth = undefined;
    db = undefined;
    analytics = null;
    return;
  }

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
  };

  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log(`🟢 Firebase core initialized successfully. Project ID: ${firebaseConfig.projectId} App instance:`, app);
    } else {
      app = getApp(); // Get the default app if already initialized
      console.log('Firebase app already initialized on client (getApp). Project ID:', (app.options as any)?.projectId);
    }

    auth = getAuth(app);
    db = getFirestore(app);

    if (firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
        console.log("🟢 Firebase Analytics initialized.");
      } catch (e) {
        console.warn("🟠 Firebase Analytics initialization failed or already initialized:", e);
      }
    } else {
      console.log("ℹ️ Firebase Measurement ID not provided. Analytics not initialized.");
    }

    // Connect to Firestore emulator in development
    if (process.env.NODE_ENV === 'development' && db) {
        try {
            // Note: It's good practice to ensure the emulator host is also an env var
            // e.g. process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || 'localhost'
            // process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080
            connectFirestoreEmulator(db, 'localhost', 8080);
            console.log("🔥 Firestore emulator connected at localhost:8080 (client-side)");
        } catch (error: any) {
            // It's common for this to throw an error if already connected, especially with HMR
            if (error.message.includes("already connected")) {
                 console.log("🔥 Firestore emulator was already connected (client-side).");
            } else {
                console.warn("⚠️ Error connecting client-side Firestore to emulator:", error.message);
            }
        }
    }


    // App Check initialization (currently disabled in your project)
    // import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
    // const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    // if (recaptchaSiteKey) {
    //   console.log(`🟠 Attempting to initialize App Check with reCAPTCHA site key (masked): ${recaptchaSiteKey.substring(0, 6)}...****`);
    //   try {
    //     initializeAppCheck(app, {
    //       provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    //       isTokenAutoRefreshEnabled: true,
    //     });
    //     console.log("🟢 Firebase App Check initialized with reCAPTCHA Enterprise.");
    //   } catch (appCheckError: any) {
    //      console.error("🔴 Firebase App Check initialization FAILED:", appCheckError.message || appCheckError);
    //   }
    // } else {
    //   console.warn("🟠 NEXT_PUBLIC_RECAPTCHA_SITE_KEY not found. App Check not initialized.");
    // }

  } catch (initError: any) {
    console.error("🔴 Firebase core client-side initialization FAILED:", initError.message || initError);
    app = undefined; // Ensure app is undefined on failure
    auth = undefined;
    db = undefined;
    analytics = null;
  }
}

// Call initialization when this module is loaded on the client side
initializeFirebaseClientSDK();

// Export the initialized instances
export { app, db, auth, analytics };
