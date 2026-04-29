import { AIClient } from './aiClient.js';
export declare class GeminiClient implements AIClient {
    private genAI;
    private model;
    constructor(apiKey: string, modelName?: string);
    generateJSON<T>(params: {
        system: string;
        prompt: string;
        schemaName: string;
        temperature?: number;
    }): Promise<T>;
    generateText(params: {
        system: string;
        prompt: string;
        temperature?: number;
    }): Promise<string>;
}
