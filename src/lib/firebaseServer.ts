// src/lib/firebaseServer.ts
import * as admin from 'firebase-admin'; // Use namespace import

// Ensure environment variable is loaded and parsed correctly
let serviceAccount;
// Using FIREBASE_SERVICE_ACCOUNT_KEY as per target structure, 
// instead of FIREBASE_SERVICE_ACCOUNT_KEY_JSON from the original file.
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    // Depending on strictness, you might throw an error here or allow Firebase to fail later
  }
} else {
  console.error('🔴 CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK cannot be initialized.');
  // Depending on strictness, throw error or allow Firebase to fail later
}

if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
        // Add other configurations like databaseURL if needed by your admin setup
      });
      console.log('🟢 Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error("🔴 Firebase Admin SDK initialization failed:", error.message);
    }
  } else {
    console.error('🔴 Firebase Admin SDK not initialized due to missing or invalid service account key.');
  }
} else {
  console.log('ℹ️ Firebase Admin SDK already initialized.');
}

const db = admin.firestore();
const adminAuth = admin.auth(); // Initialize and export adminAuth

// Optional: Export other admin services if needed
// const adminStorage = admin.storage(); 

export { db, adminAuth }; // Ensure adminAuth is exported

if (!serviceAccount) {
    // This warning is repeated here to ensure it's visible if the earlier console.error was missed.
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is not set or failed to parse. Firestore and Auth Admin operations will likely fail.");
}
