import { AIClient } from '../core/aiClient.js';
import { Entity } from '../types.js';

export class EntityExtractor {
  constructor(private aiClient: AIClient) {}

  async extract(text: string): Promise<Entity[]> {
    const system = `You are an entity extraction system for semantic SEO.
Extract entities with their types, salience, and aliases.
Return strict JSON.`;
    
    const prompt = `Extract entities from the following text:\n\n${text}`;
    
    const result = await this.aiClient.generateJSON<{ entities: Entity[] }>({
      system,
      prompt,
      schemaName: 'EntityList',
    });
    
    return result.entities;
  }
}
