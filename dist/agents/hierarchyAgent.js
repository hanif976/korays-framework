export class HierarchyAgent {
    aiClient;
    constructor(aiClient) {
        this.aiClient = aiClient;
    }
    async buildHierarchy(nodes) {
        const system = `You are a topical hierarchy builder for semantic SEO.
Define parent-child relationships between clusters and nodes.
Return strict JSON.`;
        const prompt = `Build a hierarchy for these nodes:\n${JSON.stringify(nodes, null, 2)}`;
        const result = await this.aiClient.generateJSON({
            system,
            prompt,
            schemaName: 'HierarchyMap',
        });
        // Update nodes with parent/child info
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        for (const h of result.hierarchy) {
            const node = nodeMap.get(h.id);
            if (node) {
                node.parentId = h.parentId;
                if (h.parentId) {
                    const parent = nodeMap.get(h.parentId);
                    if (parent) {
                        parent.childIds.push(node.id);
                    }
                }
            }
        }
        return Array.from(nodeMap.values());
    }
}
