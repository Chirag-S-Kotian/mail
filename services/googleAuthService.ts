import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

export async function getGmailAuthUrl() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
  });
  return authUrl;
}

export async function setGmailCredentials(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
}

export async function sendGmail(email: string, subject: string, message: string) {
  const accessToken = oAuth2Client.credentials.access_token;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: oAuth2Client.credentials.refresh_token,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
}
