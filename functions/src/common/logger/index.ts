import * as functions from "firebase-functions";

export const logInfo = (message: string, details?: any) =>
  functions.logger.info(
    message,
    details === undefined ? {} : { details: JSON.stringify(details) }
  );

export const logError = (message: string, details?: any) =>
  functions.logger.error(
    message,
    details === undefined ? {} : { details: JSON.stringify(details) }
  );
