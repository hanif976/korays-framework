import { AIClient } from './aiClient.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiClient implements AIClient {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string, modelName: string = 'gemini-1.5-pro') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateJSON<T>(params: {
    system: string;
    prompt: string;
    schemaName: string;
    temperature?: number;
  }): Promise<T> {
    const fullPrompt = `${params.system}\n\n${params.prompt}\n\nReturn strict JSON matching the ${params.schemaName} schema.`;
    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: params.temperature ?? 0.7,
        responseMimeType: 'application/json',
      },
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as T;
  }

  async generateText(params: {
    system: string;
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    const result = await this.model.generateContent({
      contents: [
        { role: 'system', parts: [{ text: params.system }] },
        { role: 'user', parts: [{ text: params.prompt }] },
      ],
      generationConfig: {
        temperature: params.temperature ?? 0.7,
      },
    });

    const response = await result.response;
    return response.text();
  }
}
