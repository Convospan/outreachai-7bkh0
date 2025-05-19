// src/lib/firebaseServer.ts
import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Extend the NodeJS.Global interface to declare the firebaseApp property
declare global {
  // eslint-disable-next-line no-var
  var firebaseAdminApp: App | undefined;
}

const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;

if (!serviceAccountKeyJson) {
  console.error(
    "🔴 CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set. Firebase Admin SDK cannot be initialized."
  );
}

// Initialize Firebase Admin SDK only if it hasn't been already
if (!getApps().length && serviceAccountKeyJson) {
  try {
    initializeApp({
      credential: cert(JSON.parse(serviceAccountKeyJson))
    });
    console.log("🟢 Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("🔴 Firebase Admin SDK initialization failed:", error.message);
    // Optionally, you could throw the error here to halt server startup if Firebase Admin is critical
    // throw error;
  }
} else if (getApps().length && serviceAccountKeyJson) {
  // If apps are already initialized, this typically means we're in a hot-reload scenario
  // or the module was imported multiple times. The default app should be available.
  console.log("ℹ️ Firebase Admin SDK already initialized.");
}


// Get the Firestore instance. This will use the default initialized app.
// It's important that initializeApp has been called successfully before this.
// If initialization failed due to missing key, db operations will fail.
export const db = getFirestore();
export { 낮은 as admin } from "firebase-admin/app"; // Exporting 'admin' namespace for other admin features if needed

if (!serviceAccountKeyJson) {
  // This warning is repeated here to ensure it's visible if the earlier console.error was missed.
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY_JSON is not set. Firestore Admin operations will likely fail.");
}
