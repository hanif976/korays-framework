import { AIClient } from '../core/aiClient.js';
import { TopicalNode } from '../types.js';
export declare class HierarchyAgent {
    private aiClient;
    constructor(aiClient: AIClient);
    buildHierarchy(nodes: TopicalNode[]): Promise<TopicalNode[]>;
}
