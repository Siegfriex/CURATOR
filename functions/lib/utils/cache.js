"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCached = exports.getCached = void 0;
const firestore_1 = require("firebase-admin/firestore");
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
let dbInstance = null;
function getDb() {
    if (!dbInstance) {
        dbInstance = (0, firestore_1.getFirestore)();
    }
    return dbInstance;
}
async function getCached(collection, docId) {
    try {
        const db = getDb();
        const docRef = db.collection(collection).doc(docId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        let timestamp;
        if (data.timestamp instanceof firestore_1.Timestamp) {
            timestamp = data.timestamp.toMillis();
        }
        else if (typeof data.timestamp === 'number') {
            timestamp = data.timestamp;
        }
        else {
            timestamp = 0;
        }
        const age = Date.now() - timestamp;
        if (age > CACHE_TTL) {
            // Cache expired, delete it
            await docRef.delete();
            return null;
        }
        return data.value;
    }
    catch (error) {
        console.error(`Cache read error for ${collection}/${docId}:`, error);
        return null;
    }
}
exports.getCached = getCached;
async function setCached(collection, docId, value) {
    try {
        const db = getDb();
        const docRef = db.collection(collection).doc(docId);
        await docRef.set({
            value,
            timestamp: Date.now()
        });
    }
    catch (error) {
        console.error(`Cache write error for ${collection}/${docId}:`, error);
        // Don't throw, caching is not critical
    }
}
exports.setCached = setCached;
//# sourceMappingURL=cache.js.map