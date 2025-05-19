// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from "firebase/analytics";

// Firebase project configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | null = null;

// Check if all required environment variables are present for client-side initialization
const requiredClientEnvVarKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingKeys = requiredClientEnvVarKeys.filter(key => !process.env[key]);

if (typeof window !== 'undefined') { // Ensure this runs only on the client
  if (missingKeys.length > 0) {
    console.error(
      `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
      `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
    );
    // To prevent the app from breaking entirely, we might not throw an error here
    // but 'app', 'auth', 'db' will remain uninitialized or point to a dummy/null object.
    // The application's components that rely on Firebase should handle this gracefully.
    // @ts-ignore - Assigning a dummy object to prevent crashes if accessed before init
    app = {} as FirebaseApp; 
    // @ts-ignore
    auth = {} as Auth;
    // @ts-ignore
    db = {} as Firestore;

  } else if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
      console.log(`🟢 Firebase core initialized successfully. Project ID: ${firebaseConfig.projectId}`);

      // Optional: App Check (currently disabled as per readiness report)
      /*
      import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        console.log("Attempting to initialize App Check...");
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: true
        });
        console.log("🟢 Firebase App Check initialized with reCAPTCHA Enterprise.");
      } else {
        console.warn("🟠 NEXT_PUBLIC_RECAPTCHA_SITE_KEY not found. App Check not initialized.");
      }
      */

    } catch (initError: any) {
      console.error("🔴 Firebase core client-side initialization FAILED:", initError.message || initError);
      // @ts-ignore
      app = {} as FirebaseApp;
      // @ts-ignore
      auth = {} as Auth;
      // @ts-ignore
      db = {} as Firestore;
    }
  } else {
    app = getApp(); // Get the default app if already initialized
    auth = getAuth(app);
    db = getFirestore(app);
    if (firebaseConfig.measurementId && typeof window !== "undefined") {
        // Check if analytics is already initialized to avoid re-initializing
        try {
            analytics = getAnalytics(app);
        } catch (e) {
            // If getAnalytics throws, it might mean it's already initialized, or other issues.
            // For safety, we can try to get an existing instance or just log.
            console.warn("Could not get Analytics instance, it might already be initialized or not available.")
        }
    }
    console.log('Firebase app already initialized on client. Project ID:', (app?.options as any)?.projectId);
  }
} else {
    // Server-side or non-browser environment
    // Initialize a minimal app if needed for some server-side imports, but usually firebaseServer.ts is used.
    if (!getApps().length && missingKeys.length === 0) { // Only if env vars are somehow available server-side, which is unusual for NEXT_PUBLIC_
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } else if (getApps().length) {
        app = getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        console.warn("🟠 Firebase client SDK not initialized (not in browser or missing env vars).");
         // @ts-ignore
        app = {} as FirebaseApp;
        // @ts-ignore
        auth = {} as Auth;
        // @ts-ignore
        db = {} as Firestore;
    }
}

export { app, db, auth, analytics };
