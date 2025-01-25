import { auth } from "firebase-admin";

export const authentication = async (
  authorizationToken?: string
): Promise<boolean> => {
  if (authorizationToken === undefined) {
    return false;
  }

  try {
    await auth().verifyIdToken(authorizationToken);
    return true;
  } catch (e: any) {
    return false;
  }
};
