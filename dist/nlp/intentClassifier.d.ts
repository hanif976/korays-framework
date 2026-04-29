import { AIClient } from '../core/aiClient.js';
import { SearchIntent, PageType, FunnelStage } from '../types.js';
export interface IntentClassification {
    primaryIntent: SearchIntent;
    secondaryIntent?: SearchIntent;
    recommendedPageType: PageType;
    funnelStage: FunnelStage;
    confidence: number;
    evidence: string[];
}
export declare class IntentClassifier {
    private aiClient;
    constructor(aiClient: AIClient);
    classify(query: string, serpSummary: string): Promise<IntentClassification>;
}
