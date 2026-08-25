"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseAdmin = getFirebaseAdmin;
const admin = require("firebase-admin");
let initialized = false;
function getFirebaseAdmin() {
    if (!initialized) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
        const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
                storageBucket: storageBucket || undefined,
            });
        }
        else if (!admin.apps.length) {
            admin.initializeApp({ projectId: "focustm-dev", storageBucket: storageBucket || undefined });
        }
        initialized = true;
    }
    return admin;
}
//# sourceMappingURL=firebase-admin.js.map