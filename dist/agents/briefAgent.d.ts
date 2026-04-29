import { AIClient } from '../core/aiClient.js';
import { ContentBrief, TopicalNode } from '../types.js';
export declare class BriefAgent {
    private aiClient;
    constructor(aiClient: AIClient);
    generateBrief(node: TopicalNode): Promise<ContentBrief>;
}
