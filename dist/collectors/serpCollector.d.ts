import { SearchIntent, PageType, SerpFeature } from '../types.js';
export interface OrganicResult {
    url: string;
    title: string;
    snippet: string;
    position: number;
    domain: string;
}
export interface SerpSnapshot {
    query: string;
    country: string;
    language: string;
    collectedAt: string;
    organicResults: OrganicResult[];
    serpFeatures: SerpFeature[];
    peopleAlsoAsk: string[];
    relatedSearches: string[];
    dominantIntent?: SearchIntent;
    dominantPageType?: PageType;
}
export interface SerpCollector {
    collect(query: string, country: string, language: string): Promise<SerpSnapshot>;
}
