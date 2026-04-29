export class ClusteringAgent {
    aiClient;
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async cluster(queries) {
        const system = `You are a clustering agent for semantic SEO.
Group queries into clusters based on SERP overlap, intent, and entities.
Return strict JSON.`;
        const prompt = `Cluster these queries:\n${JSON.stringify(queries, null, 2)}`;
        return await this.aiClient.generateJSON({
            system,
            prompt,
            schemaName: 'ClusterList',
        }).then(res => res.clusters);
    }
}
