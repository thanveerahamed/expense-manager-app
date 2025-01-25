import { Firestore } from "@google-cloud/firestore";
import { auth } from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(config);
const firebaseAuth = getAuth(firebaseApp);

export const firestore = new Firestore();

export const getAuthToken = async (userId: string): Promise<string> => {
  const customToken = await auth().createCustomToken(userId);
  const credentials = await signInWithCustomToken(firebaseAuth, customToken);
  return credentials.user.getIdToken();
};
