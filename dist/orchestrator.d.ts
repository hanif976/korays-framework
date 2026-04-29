import { Config } from './core/config.js';
import { AIClient } from './core/aiClient.js';
import { SerpCollector } from './collectors/serpCollector.js';
export declare class Orchestrator {
    private config;
    private aiClient;
    private serpCollector;
    private entityExtractor;
    private intentClassifier;
    private clusteringAgent;
    private hierarchyAgent;
    private briefAgent;
    private markdownExporter;
    private jsonExporter;
    private csvExporter;
    constructor(config: Config, aiClient: AIClient, serpCollector: SerpCollector);
    run(seeds: string[]): Promise<void>;
}
