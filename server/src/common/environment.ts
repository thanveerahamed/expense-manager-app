import * as dotenv from 'dotenv';

dotenv.config();

export const getEnvironmentVariable = (variable: string) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is missing`);
  }

  return value;
};
