import express from 'express';
import bodyParser from 'body-parser';
import { addEmailToQueue } from './bullmq';
import { getGmailAuthUrl, setGmailCredentials } from './services/googleAuthService';
import { initializeOutlookClient } from './services/outlookAuthService';

const app = express();
app.use(bodyParser.json());

app.get('/auth/gmail', async (req, res) => {
  const authUrl = await getGmailAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code as string;
  await setGmailCredentials(code);
  res.send('Gmail authentication successful');
});

app.get('/auth/outlook', (req, res) => {
  // Redirect to Outlook authentication URL
});

app.get('/auth/outlook/callback', async (req, res) => {
  const accessToken = req.query.access_token as string;
  initializeOutlookClient(accessToken);
  res.send('Outlook authentication successful');
});

app.post('/email', async (req, res) => {
  const { emailContent, email, provider } = req.body;
  await addEmailToQueue(emailContent, email, provider);
  res.send('Email processing added to queue');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
