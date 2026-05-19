import admin from "firebase-admin";
import { env } from "./env";

const serviceAccount = {
  projectId: env.FIREBASE_PROJECT_ID,

  privateKeyId: env.FIREBASE_PRIVATE_KEY_ID,

  privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

  clientEmail: env.FIREBASE_CLIENT_EMAIL,

  clientId: env.FIREBASE_CLIENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Connected ✅");

export default admin;
