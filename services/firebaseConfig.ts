import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAMD8AxVEi_rmuVJD5P47ncM0zSWUEXWhw',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'curatorproto.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'curatorproto',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'curatorproto.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '607597492090',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:607597492090:web:15c2f673ae1e01018108c3'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;

