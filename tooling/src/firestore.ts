import * as dotenv from "dotenv";
import * as admin from "firebase-admin";

dotenv.config();

const serviceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.CLIENT_EMAIL,
} as admin.ServiceAccount;

if (process.env.RUN_ENVIRONMENT === "updateUser") {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

export { firestore, admin };
