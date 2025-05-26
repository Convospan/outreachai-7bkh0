import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Extend the NodeJS.Global interface to declare the firebaseAdminApp property
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
if (!globalThis.firebaseAdminApp && serviceAccountKeyJson) {
  try {
    globalThis.firebaseAdminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccountKeyJson))
    });
    console.log("🟢 Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error("🔴 Firebase Admin SDK initialization failed:", error.message);
    // Optionally, you could throw the error here to halt server startup if Firebase Admin is critical
    // throw error;
  }
} else if (globalThis.firebaseAdminApp && serviceAccountKeyJson) {
  // If already initialized, this typically means we're in a hot-reload scenario or the module was imported multiple times.
  console.log("ℹ️ Firebase Admin SDK already initialized.");
}

// Get the Firestore instance. This will use the default initialized app.
export const db = getFirestore(globalThis.firebaseAdminApp);

// Exporting the firebase-admin/app namespace for other admin features if needed
import * as admin from "firebase-admin/app";
export { admin };

if (!serviceAccountKeyJson) {
  // This warning is repeated here to ensure it's visible if the earlier console.error was missed.
  console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY_JSON is not set. Firestore Admin operations will likely fail.");
}
