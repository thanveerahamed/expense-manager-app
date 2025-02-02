import * as admin from 'firebase-admin';
import * as jose from 'jose';
import { logError } from '../logging';
import { getEnvironmentVariable } from '../environment';

export const isAuthenticatedUser = async (
  authorizationHeader?: string,
): Promise<string | undefined> => {
  if (authorizationHeader === undefined) {
    return undefined;
  }

  try {
    if (getEnvironmentVariable('ENVIRONMENT') === 'local') {
      const decodedToken = jose.decodeJwt(authorizationHeader);
      return String(decodedToken.user_id);
    }

    const decodedIdToken = await admin
      .auth()
      .verifyIdToken(authorizationHeader);
    return decodedIdToken.uid;
  } catch (error: any) {
    logError(error.member);
    return undefined;
  }
};
