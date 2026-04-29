import { AIClient } from '../core/aiClient.js';
import { Entity } from '../types.js';
export declare class EntityExtractor {
    private aiClient;
    constructor(aiClient: AIClient);
    extract(text: string): Promise<Entity[]>;
}
