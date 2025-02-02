export enum FirebaseLoginErrorCode {
  WRONG_PASSWORD = 'auth/wrong-password',
  USER_NOT_FOUND = 'auth/user-not-found',
  UNKNOWN_ERROR = 'unknown-error',
  USER_ALREADY_EXISTS = 'auth/email-already-in-use',
}

export const getLoginErrorMessage = (firebaseErrorCode: string) => {
  switch (firebaseErrorCode) {
    case FirebaseLoginErrorCode.WRONG_PASSWORD:
      return {
        errorCode: firebaseErrorCode,
        message: 'Entered wrong password.',
      };

    case FirebaseLoginErrorCode.USER_NOT_FOUND:
      return {
        errorCode: firebaseErrorCode,
        message: 'User not registered. Please use the signup screen',
      };

    case FirebaseLoginErrorCode.USER_ALREADY_EXISTS:
      return {
        errorCode: firebaseErrorCode,
        message: 'User already exists. Please use the login screen.',
      };

    default:
      return {
        errorCode: FirebaseLoginErrorCode.UNKNOWN_ERROR,
        message: 'Unknown error occurred. Please try again.',
      };
  }
};
