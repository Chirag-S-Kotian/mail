import Configuration, OpenAIApi  from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function getEmailContext(emailContent: string) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Categorize this email content: ${emailContent}`,
    max_tokens: 50,
  });
  return response.data.choices[0].text.trim();
}

export async function generateReply(emailContent: string, context: string) {
  const prompt = `Generate a reply for an email categorized as ${context}: ${emailContent}`;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 150,
  });
  return response.data.choices[0].text.trim();
}
