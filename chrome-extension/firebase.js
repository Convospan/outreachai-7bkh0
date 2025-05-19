// chrome-extension/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDgTlRUlQcCAESgxHUSkyHE17O3OrEk_N0",
  authDomain: "outreachai-7bkh0.firebaseapp.com",
  projectId: "outreachai-7bkh0",
  storageBucket: "outreachai-7bkh0.firebasestorage.app",
  messagingSenderId: "533689904717",
  appId: "1:533689904717:web:68bf5ec9f1d8e406bcf604",
  measurementId: "G-9BLQ365PGE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
