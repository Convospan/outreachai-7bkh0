import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');

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

const db = getFirestore();

async function create(collectionName: string, data: object) {
  const docRef = await db.collection(collectionName).add(data);
  return docRef.id;
}

async function read(collectionName: string, documentId: string) {
  const doc = await db.collection(collectionName).doc(documentId).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data();
}

async function update(collectionName: string, documentId: string, data: object) {
  await db.collection(collectionName).doc(documentId).update(data);
}

async function deleteDocument(collectionName: string, documentId: string) {
  await db.collection(collectionName).doc(documentId).delete();
}

export { admin, db, create, read, update, deleteDocument };

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.');
}