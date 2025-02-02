import { getLoginErrorMessage } from './error';
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import { createUserDocument } from '../../providers';

const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

if (env.DEV === true) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099/', {
    disableWarnings: true,
  });
}

const messaging = getMessaging(app);

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    return getLoginErrorMessage(err.code);
  }
};

const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await createUserDocument(user, name, email);
  } catch (err: any) {
    return getLoginErrorMessage(err.code);
  }
};

const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

const logout = async () => {
  await signOut(auth);
};

const getMessagingToken = async (): Promise<string> => {
  return await getToken(messaging);
};

const subscribeForMessaging = (callBack: any) => {
  return onMessage(messaging, callBack);
};

export {
  app,
  db,
  auth,
  logout,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  User as FirebaseUser,
  getMessagingToken,
  subscribeForMessaging,
};
