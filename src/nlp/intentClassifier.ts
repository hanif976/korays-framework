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

export class IntentClassifier {
  constructor(private aiClient: AIClient) {}

  async classify(query: string, serpSummary: string): Promise<IntentClassification> {
    const system = `Classify the search intent for the query using SERP evidence.
Return strict JSON matching the IntentClassification schema.`;

    const prompt = `Query: ${query}\nSERP Summary: ${serpSummary}`;

    return await this.aiClient.generateJSON<IntentClassification>({
      system,
      prompt,
      schemaName: 'IntentClassification',
    });
  }
}
