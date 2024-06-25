import { getEmailContext, generateReply } from './openAiService';
import { sendGmail } from './googleAuthService';
import { sendOutlookEmail } from './outlookAuthService';

export async function processEmail(emailContent: string, email: string, provider: 'gmail' | 'outlook') {
  const context = await getEmailContext(emailContent);
  const category = categorizeEmail(context);
  const reply = await generateReply(emailContent, category);
  
  if (provider === 'gmail') {
    await sendGmail(email, 'Re: Your email', reply);
  } else if (provider === 'outlook') {
    await sendOutlookEmail(email, 'Re: Your email', reply);
  }
}

function categorizeEmail(context: string): string {
  if (context.includes('interested')) return 'Interested';
  if (context.includes('not interested')) return 'Not Interested';
  if (context.includes('more information')) return 'More Information';
  return 'Uncategorized';
}
