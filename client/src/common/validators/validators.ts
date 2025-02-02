// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const required = (value: any) =>
  value === null || value === undefined || value === ''
    ? 'Required'
    : undefined;

export const isEmailValid = (email: string) => email.match(EMAIL_REGEX);
export const isFieldEmpty = (value: string) =>
  value === '' || value === undefined || value === null;
