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
        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            });
        }
        else if (!admin.apps.length) {
            admin.initializeApp({ projectId: "focustm-dev" });
        }
        initialized = true;
    }
    return admin;
}
//# sourceMappingURL=firebase-admin.js.map