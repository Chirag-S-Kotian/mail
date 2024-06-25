import axios from 'axios';

const apiKey = process.env.HUGGINGFACE_API_KEY;

export async function getEmailContext(emailContent: string) {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/distilbert-base-uncased',
    { inputs: emailContent },
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  return response.data[0].label;
}

export async function generateReply(emailContent: string, context: string) {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/gpt2',
    { inputs: `Generate a reply for an email categorized as ${context}: ${emailContent}` },
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );
  return response.data[0].generated_text;
}
