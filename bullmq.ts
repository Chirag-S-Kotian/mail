import { Queue, Worker } from 'bullmq';
import { processEmail } from './services/emailService';

const emailQueue = new Queue('emailQueue');

const emailWorker = new Worker('emailQueue', async (job) => {
  await processEmail(job.data.emailContent, job.data.email, job.data.provider);
});

export async function addEmailToQueue(emailContent: string, email: string, provider: 'gmail' | 'outlook') {
  await emailQueue.add('processEmail', { emailContent, email, provider });
}
