import { SerpSnapshot, SerpCollector } from './serpCollector.js';
export declare class MockSerpCollector implements SerpCollector {
    collect(query: string, country: string, language: string): Promise<SerpSnapshot>;
}
