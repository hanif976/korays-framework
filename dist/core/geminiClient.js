import { GoogleGenerativeAI } from '@google/generative-ai';
export class GeminiClient {
    genAI;
    model;
    constructor(apiKey, modelName = 'gemini-1.5-pro') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }
    async generateJSON(params) {
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
        return JSON.parse(text);
    }
    async generateText(params) {
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
