import OpenAI from 'openai';

export class OpenRouterService {
  private token = '';
  private model = 'openai/gpt-3.5-turbo';
  constructor() {
    chrome.storage.sync.get('ai_settings', async function (d) {
      this.token = d.settings.token;
      this.model = d.settings.model;
    });
  }

  public async analyzeArguments(prompt: string, callback?: (chunk: string) => void) {
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: this.token,
      dangerouslyAllowBrowser: true,
    });
    const stream = await openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'system', content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      if (callback) {
        callback(chunk.choices[0].delta.content);
      }
    }
  }

  public static getInstance() {
    return new OpenRouterService();
  }
}
