import { TopicalNode, QueryData } from '../types.js';
import { AIClient } from '../core/aiClient.js';

export class ClusteringAgent {
  constructor(private aiClient: AIClient) {}

  async cluster(queries: QueryData[]): Promise<{ clusterId: string; queryIds: string[] }[]> {
    const system = `You are a clustering agent for semantic SEO.
Group queries into clusters based on SERP overlap, intent, and entities.
Return strict JSON.`;

    const prompt = `Cluster these queries:\n${JSON.stringify(queries, null, 2)}`;

    return await this.aiClient.generateJSON<{ clusters: { clusterId: string; queryIds: string[] }[] }>({
      system,
      prompt,
      schemaName: 'ClusterList',
    }).then(res => res.clusters);
  }
}
