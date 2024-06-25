import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

let outlookClient: Client;

export function initializeOutlookClient(accessToken: string) {
  outlookClient = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

export async function getOutlookMessages() {
  const messages = await outlookClient
    .api('/me/messages')
    .select('subject,bodyPreview')
    .get();

  return messages.value;
}

export async function sendOutlookEmail(email: string, subject: string, message: string) {
  await outlookClient
    .api('/me/sendMail')
    .post({
      message: {
        subject: subject,
        body: {
          contentType: 'Text',
          content: message,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email,
            },
          },
        ],
      },
    });
}
