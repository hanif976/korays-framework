export interface AIClient {
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
