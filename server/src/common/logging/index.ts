import bunyan from 'bunyan';
import { LoggingBunyan } from '@google-cloud/logging-bunyan';
import { sendEmail } from '../emails';
import { getEnvironmentVariable } from '../environment';

const loggingBunyan = new LoggingBunyan();
const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Cloud Logging
  // will contain "name": "my-service"
  name: 'expense-manager-node-api',
  streams: [
    // Log to the console at 'info' and above
    { stream: process.stdout, level: 'info' },
    // And log to Cloud Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});

interface ErrorParams {
  location: string;
  error: any;
}

export const logInfo = (message: any, ...params: any[]) =>
  logger.info(message, ...params);
export const logError = (message: string, params?: ErrorParams) => {
  logger.error(message, params);
  if (getEnvironmentVariable('ENVIRONMENT') !== 'local') {
    sendEmail(message, { location: params?.location, error: params?.error });
  }
};
