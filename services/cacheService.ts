import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getCached<T>(
  collection: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    const timestamp = data.timestamp?.toMillis?.() || data.timestamp || 0;
    const age = Date.now() - timestamp;
    
    if (age > CACHE_TTL) {
      // Cache expired, but don't delete from client side
      return null;
    }
    
    return data.value as T;
  } catch (error) {
    console.error(`Cache read error for ${collection}/${docId}:`, error);
    return null;
  }
}

export async function setCached<T>(
  collection: string,
  docId: string,
  value: T
): Promise<void> {
  try {
    const docRef = doc(db, collection, docId);
    await setDoc(docRef, {
      value,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error(`Cache write error for ${collection}/${docId}:`, error);
    // Don't throw, caching is not critical
  }
}

