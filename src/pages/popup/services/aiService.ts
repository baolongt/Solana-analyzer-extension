import { GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const google = new GoogleGenerativeAI('AIzaSyAn-9d_KSSXwJ4S5BJQET4aYP1n_SkwG2E');
let instance: AIService | undefined;

export class AIService {
  private model: GenerativeModel;

  constructor({ model }: { model?: GenerativeModel }) {
    this.model = model;
  }

  async analyzeArguments(args: string) {
    if (!args) throw new Error('no arguments');
    const result = await this.model.generateContent(args);
    const response = result.response;
    const text = response.text();
    return text;
  }

  public static getInstance() {
    if (!instance) {
      instance = new AIService({
        model: google.getGenerativeModel({
          model: 'models/gemini-pro',
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
        }),
      });
    }
    return instance;
  }
}
