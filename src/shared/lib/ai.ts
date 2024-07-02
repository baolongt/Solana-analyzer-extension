import OpenAI from 'openai';
import { ENV } from './constants';

const IGNORE_PROGRAMS = ['ComputeBudget111111111111111111111111111111'];

export const askAI = async (parsed, callback) => {
  console.log('Asking AI');
  const openai = new OpenAI({
    apiKey: ENV.OPEN_ROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': '',
    },
    dangerouslyAllowBrowser: true, // Enable this if you used OAuth to fetch a user-scoped `apiKey` above. See https://openrouter.ai/docs#oauth to learn how.
  });

  const prompt = `
    I need you to serve as a Solana transaction analyzer. I will provide you with a parsed Solana transaction, containing multiple instructions, in the form of a JSON string. Your task is to translate it into a human-readable, user-friendly message. This message should be understandable to people who may not have much experience with web3, helping them comprehend the transaction. Focus on the instructions which you think important in the transaction. Ignore the instruction which interact with following programs: ${IGNORE_PROGRAMS.join(', ')}. If you encounter an instruction that you're unsure about, simply indicate that you don't know its function and warn the user accordingly. Return the result in markdown format.
  
    The parsed transaction is as follows:
  
    ${JSON.stringify(parsed)}
  
    `;

  const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    // model: 'meta-llama/llama-3-8b-instruct:free',
    // model: 'openai/gpt-3.5-turbo',
    model: 'openai/gpt-4-turbo',
    stream: true,
  });

  for await (const chunk of stream) {
    callback(chunk.choices[0]?.delta?.content || '');
  }
};
