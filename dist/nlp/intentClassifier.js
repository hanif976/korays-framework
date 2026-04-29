export class IntentClassifier {
    aiClient;
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async classify(query, serpSummary) {
        const system = `Classify the search intent for the query using SERP evidence.
Return strict JSON matching the IntentClassification schema.`;
        const prompt = `Query: ${query}\nSERP Summary: ${serpSummary}`;
        return await this.aiClient.generateJSON({
            system,
            prompt,
            schemaName: 'IntentClassification',
        });
    }
}
