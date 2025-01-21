import * as dotenv from "dotenv";
import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";

dotenv.config();

initializeApp({projectId: process.env.PROJECT_ID});
const db = getFirestore();
connectFirestoreEmulator(db, "127.0.0.1", 8080);

export {db};
