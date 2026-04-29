export class EntityExtractor {
    aiClient;
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async extract(text) {
        const system = `You are an entity extraction system for semantic SEO.
Extract entities with their types, salience, and aliases.
Return strict JSON.`;
        const prompt = `Extract entities from the following text:\n\n${text}`;
        const result = await this.aiClient.generateJSON({
            system,
            prompt,
            schemaName: 'EntityList',
        });
        return result.entities;
    }
}
