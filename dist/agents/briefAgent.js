export class BriefAgent {
    aiClient;
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async generateBrief(node) {
        const system = `Create a content brief for the target keyword.
Rules:
- Focus on user satisfaction, not keyword stuffing.
- Include original information gain ideas.
- Include required entities and EAV triples.
- Make the outline match the SERP intent.
Return strict JSON matching the ContentBrief interface.`;
        const prompt = `Target Keyword: ${node.query.query}\nNode Data: ${JSON.stringify(node, null, 2)}`;
        return await this.aiClient.generateJSON({
            system,
            prompt,
            schemaName: 'ContentBrief',
        });
    }
}
