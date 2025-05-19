// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase project configuration
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

console.log("Attempting Firebase initialization...");

// --- Firebase Client-Side Env Check ---
console.log("--- Firebase Client-Side Env Check (src/lib/firebase.ts) ---");
const requiredClientEnvVarKeys: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];
let allClientVarsPresent = true;
const missingKeys: string[] = [];

requiredClientEnvVarKeys.forEach(key => {
  const envVarName = `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`;
  if (!firebaseConfig[key]) {
    console.error(`🔴 ${envVarName}: NOT SET`);
    missingKeys.push(envVarName);
    allClientVarsPresent = false;
  } else {
    const value = firebaseConfig[key];
     // Mask sensitive parts for logging if it's the API key
    const displayValue = typeof value === 'string' && key === 'apiKey' ? `${value.substring(0, 6)}... (masked)` : value;
    console.log(`🟢 ${envVarName}: SET (Value: ${displayValue})`);
  }
});

if (!firebaseConfig.measurementId) {
    console.warn("🟠 NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID is not set (Optional, for Analytics).");
}


// Initialize Firebase App
if (typeof window !== 'undefined') { // Ensure this runs only on the client
  if (!getApps().length) {
    if (allClientVarsPresent) {
      try {
        app = initializeApp(firebaseConfig);
        console.log(`🟢 Firebase core initialized successfully. Project ID: ${firebaseConfig.projectId} App instance:`, app);
        db = getFirestore(app);
        console.log('🟢 Firestore initialized successfully for app:', (app?.options as any)?.projectId);

        // Connect to Firestore Emulator in development
        if (process.env.NODE_ENV === 'development') {
          if (db) {
            try {
              connectFirestoreEmulator(db, 'localhost', 8080);
              console.log("🔥 Firestore emulator connected at localhost:8080");
            } catch (error: any) {
              // It's common for connectFirestoreEmulator to throw if already connected or if db is not ready.
              // This might happen due to HMR. Check if it's the specific "already connected" error.
              if (error.message && error.message.includes("already connected")) {
                console.warn("⚠️ Firestore emulator was already connected or an attempt was made to connect multiple times.");
              } else {
                console.error("🔴 Error connecting to Firestore emulator:", error.message || error);
              }
            }
          } else {
            console.warn("⚠️ Firestore db instance was not available when attempting to connect to emulator.");
          }
        }
      } catch (initError: any) {
        console.error("🔴 Firebase core client-side initialization FAILED:", initError.message || initError);
        app = undefined;
        db = undefined;
      }
    } else {
      console.error(
        `🔴 Critical Error: Missing Firebase client environment variables: ${missingKeys.join(', ')}. ` +
        `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env file or environment configuration. Firebase will NOT be initialized.`
      );
      app = undefined;
      db = undefined;
    }
  } else {
    app = getApp(); // Get the default app if already initialized
    if (app && !db) { // Ensure db is also initialized if app already exists
        db = getFirestore(app);
    }
    console.log('Firebase app already initialized on client. Project ID:', (app?.options as any)?.projectId);

    // Connect to Firestore Emulator in development if app was already initialized elsewhere
    if (process.env.NODE_ENV === 'development' && db) {
        try {
            // Check if already connected might be tricky without internal state access
            // For simplicity, we might attempt connection, catching common errors
            connectFirestoreEmulator(db, 'localhost', 8080);
            console.log("🔥 Firestore emulator (re-check) connected at localhost:8080");
        } catch (error:any) {
            if (error.message && error.message.includes("already connected")) {
              // This is expected if HMR re-runs this block
            } else {
              console.warn("⚠️ Error during emulator re-check/connect:", error.message || error);
            }
        }
    }
  }
} else {
  console.log("Firebase client-side initialization skipped (not in browser environment).");
}

export { app, db };
