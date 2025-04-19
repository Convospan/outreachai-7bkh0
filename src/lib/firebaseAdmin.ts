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

/**
 * @param {string} collectionName
 * @param {object} data
 */
async function create(collectionName: string, data: object) {
  const docRef = await db.collection(collectionName).add(data);
  return docRef.id;
}

/**
 * @param {string} collectionName
 * @param {string} documentId
 */
async function read(collectionName: string, documentId: string) {
  const doc = await db.collection(collectionName).doc(documentId).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data();
}

/**
 * @param {string} collectionName
 * @param {string} documentId
 * @param {object} data
 */
async function update(collectionName: string, documentId: string, data: object) {
  await db.collection(collectionName).doc(documentId).update(data);
}

/**
 * @param {string} collectionName
 * @param {string} documentId
 */
async function deleteDocument(collectionName: string, documentId: string) {
  await db.collection(collectionName).doc(documentId).delete();
}

export { admin, db, create, read, update, deleteDocument };

// Ensure FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment variables
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.');
}
