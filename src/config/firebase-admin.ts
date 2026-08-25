import * as admin from "firebase-admin";

let initialized = false;

export function getFirebaseAdmin() {
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
    } else if (!admin.apps.length) {
      // Allows the server to boot without Firebase configured yet (dev mode).
      // Auth-guarded routes will reject requests until real credentials are set.
      admin.initializeApp({ projectId: "focustm-dev", storageBucket: storageBucket || undefined });
    }
    initialized = true;
  }
  return admin;
}
