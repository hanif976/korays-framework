import { QueryData } from '../types.js';
import { AIClient } from '../core/aiClient.js';
export declare class ClusteringAgent {
    private aiClient;
    constructor(aiClient: AIClient);
    cluster(queries: QueryData[]): Promise<{
        clusterId: string;
        queryIds: string[];
    }[]>;
}
