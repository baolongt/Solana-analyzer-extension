export class OpenRouterService {
  private token = '';
  private model = 'openai/gpt-3.5-turbo';
  constructor() {
    chrome.storage.sync.get('ai_settings', async function (d) {
      this.token = d.settings.token;
      this.model = d.settings.model;
    });
  }

  public async analyzeArguments(prompt: string) {
    console.log('prompt', prompt);

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: 'What is the meaning of life?' }],
      }),
    });

    const data = await res.json();
    console.log('data', data);

    return data;
  }

  public static getInstance() {
    return new OpenRouterService();
  }
}
