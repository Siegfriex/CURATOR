import { getFirestore, Timestamp } from "firebase-admin/firestore";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

let dbInstance: ReturnType<typeof getFirestore> | null = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = getFirestore();
  }
  return dbInstance;
}

export async function getCached<T>(
  collection: string,
  docId: string
): Promise<T | null> {
  try {
    const db = getDb();
    const docRef = db.collection(collection).doc(docId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    let timestamp: number;
    if (data.timestamp instanceof Timestamp) {
      timestamp = data.timestamp.toMillis();
    } else if (typeof data.timestamp === 'number') {
      timestamp = data.timestamp;
    } else {
      timestamp = 0;
    }
    
    const age = Date.now() - timestamp;
    
    if (age > CACHE_TTL) {
      // Cache expired, delete it
      await docRef.delete();
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
    const db = getDb();
    const docRef = db.collection(collection).doc(docId);
    await docRef.set({
      value,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`Cache write error for ${collection}/${docId}:`, error);
    // Don't throw, caching is not critical
  }
}

