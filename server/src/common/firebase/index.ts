import * as admin from 'firebase-admin';
import { getEnvironmentVariable } from '../environment';

const serviceAccount = {
  projectId: getEnvironmentVariable('PROJECT_ID'),
  privateKey: getEnvironmentVariable('PRIVATE_KEY').replace(/\\n/g, '\n'),
  clientEmail: getEnvironmentVariable('CLIENT_EMAIL'),
} as admin.ServiceAccount;

if (getEnvironmentVariable('ENVIRONMENT') === 'local') {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

export { firestore };
