type Choice = {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
};

type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type ResponseData = {
  id: string;
  model: string;
  object: string;
  created: number;
  choices: Choice[];
  system_fingerprint: null | string;
  usage: Usage;
};

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
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
      }),
    });

    const data: ResponseData = await res.json();

    return data;
  }

  public static getInstance() {
    return new OpenRouterService();
  }
}
