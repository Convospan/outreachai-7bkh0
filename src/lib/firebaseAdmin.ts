import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Credentials should be in the form {"projectId": "...", "private_key": "...", "client_email": "..."}
// Replace with your actual service account key JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin SDK initialized');
    } catch (error) {
        console.error('Firebase Admin initialization error', error);
    }
}

// Get the Firestore instance
const db = getFirestore();

export { admin, db };

// Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.');
}
