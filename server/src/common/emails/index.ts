import { google } from 'googleapis';
import { getEnvironmentVariable } from '../environment';

const OAuth2 = google.auth.OAuth2;

// OAuth2 configuration
const oauth2Client = new OAuth2(
  getEnvironmentVariable('GOOGLE_CLIENT_ID'),
  getEnvironmentVariable('GOOGLE_CLIENT_SECRET'),
  'http://localhost:3001/oauth2callback', // Must match redirect URI in Google Cloud Console
);

oauth2Client.setCredentials({
  refresh_token: getEnvironmentVariable('GMAIL_REFRESH_TOKEN'),
});

function makeBody(to: string, from: string, subject: string, message: string) {
  const str = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ',
    to,
    '\n',
    'from: ',
    from,
    '\n',
    'subject: ',
    subject,
    '\n\n',
    message,
  ].join('');

  const encodedMail = Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return encodedMail;
}

// Example function to send email
export async function sendEmail(
  message: string,
  { location, error }: { location?: string; error?: any },
) {
  try {
    const body = makeBody(
      getEnvironmentVariable('GMAIL_EMAIL'),
      getEnvironmentVariable('GMAIL_EMAIL'),
      'Expense Manager Error',
      JSON.stringify({
        message,
        location,
        error: error.message,
        stack: error.stack,
      }),
    );

    const gmail = google.gmail({
      version: 'v1',
      auth: oauth2Client,
    });

    await gmail.users.messages.send({
      auth: oauth2Client,
      userId: 'me',
      requestBody: {
        raw: body,
      },
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
