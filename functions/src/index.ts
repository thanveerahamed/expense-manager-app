import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const projectId = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;
const clientEmail = process.env.CLIENT_EMAIL;

const serviceAccount = {
  projectId,
  privateKey: privateKey?.replace(/\\n/g, "\n"),
  clientEmail,
} as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export * from "./functions/processJobs";
export * from "./functions/syncTransactions";
export * from "./functions/makeTransactionDirty";
// export * from "./functions/service";
