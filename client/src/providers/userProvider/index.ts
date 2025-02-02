import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

import { db, FirebaseUser } from '../../common/firebase/firebase';
import { UserDemographics } from '../../common/types/user';

export const createUserDocument = async (
  user: FirebaseUser,
  name: string,
  email: string,
) => {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    authProvider: 'local',
    email,
  });
};

export const getUserDemographics = async (
  userId: string,
): Promise<UserDemographics> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as UserDemographics;
};

export const maybeSetDeviceInformation = async (
  userId: string,
  fcmToken: string,
): Promise<void> => {
  const deviceDocumentReference = doc(db, 'users', userId, 'devices', fcmToken);
  const deviceDocument = await getDoc(deviceDocumentReference);

  if (deviceDocument.exists()) {
    await updateDoc(deviceDocumentReference, { lastActiveAt: Timestamp.now() });
  } else {
    await setDoc(deviceDocumentReference, {
      userAgent: navigator.userAgent,
      lastActiveAt: Timestamp.now(),
    });
  }
};
