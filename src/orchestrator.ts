import { Config } from './core/config.js';
import { AIClient } from './core/aiClient.js';
import { SerpCollector } from './collectors/serpCollector.js';
import { EntityExtractor } from './nlp/entityExtractor.js';
import { IntentClassifier } from './nlp/intentClassifier.js';
import { ClusteringAgent } from './agents/clusteringAgent.js';
import { HierarchyAgent } from './agents/hierarchyAgent.js';
import { BriefAgent } from './agents/briefAgent.js';
import { MarkdownExporter } from './exporters/markdownExporter.js';
import { JsonExporter } from './exporters/jsonExporter.js';
import { CsvExporter } from './exporters/csvExporter.js';
import { TopicalNode, QueryData } from './types.js';
import { v4 as uuidv4 } from 'uuid';

export class Orchestrator {
  private entityExtractor: EntityExtractor;
  private intentClassifier: IntentClassifier;
  private clusteringAgent: ClusteringAgent;
  private hierarchyAgent: HierarchyAgent;
  private briefAgent: BriefAgent;
  private markdownExporter: MarkdownExporter;
  private jsonExporter: JsonExporter;
  private csvExporter: CsvExporter;

  constructor(
    private config: Config,
    private aiClient: AIClient,
    private serpCollector: SerpCollector
  ) {
    this.entityExtractor = new EntityExtractor(aiClient);
    this.intentClassifier = new IntentClassifier(aiClient);
    this.clusteringAgent = new ClusteringAgent(aiClient);
    this.hierarchyAgent = new HierarchyAgent(aiClient);
    this.briefAgent = new BriefAgent(aiClient);
    this.markdownExporter = new MarkdownExporter();
    this.jsonExporter = new JsonExporter();
    this.csvExporter = new CsvExporter();
  }

  async run(seeds: string[]): Promise<void> {
    console.log('Starting Topical Authority Pipeline...');

    // 1. Query Expansion (Simplified for MVP)
    console.log('Step 1: Query Expansion');
    const queries: QueryData[] = seeds.map(s => ({
      id: uuidv4(),
      query: s,
      normalizedQuery: s.toLowerCase(),
      seed: s,
      country: this.config.project.country,
      language: this.config.project.language,
      intent: 'Informational', // Placeholder
      funnelStage: 'TOFU', // Placeholder
      modifiers: [],
      serpFeatures: [],
      paaQuestions: [],
      autocompleteSuggestions: [],
      relatedSearches: [],
      topRankingUrls: [],
    }));

    // 2. SERP Collection
    console.log('Step 2: SERP Collection');
    for (const q of queries) {
      const snapshot = await this.serpCollector.collect(q.query, q.country, q.language);
      q.serpFeatures = snapshot.serpFeatures;
      q.paaQuestions = snapshot.peopleAlsoAsk;
      q.relatedSearches = snapshot.relatedSearches;
      q.topRankingUrls = snapshot.organicResults.map(r => r.url);
      
      // 3. Intent Classification
      const classification = await this.intentClassifier.classify(q.query, snapshot.organicResults[0]?.snippet || '');
      q.intent = classification.primaryIntent;
      q.funnelStage = classification.funnelStage;
    }

    // 4. Clustering
    console.log('Step 3: Clustering');
    const clusters = await this.clusteringAgent.cluster(queries);
    
    // Create nodes from clusters
    let nodes: TopicalNode[] = clusters.map(c => {
      const primaryQuery = queries.find(q => q.id === c.queryIds[0])!;
      return {
        id: c.clusterId,
        clusterId: c.clusterId,
        childIds: [],
        query: primaryQuery,
        pageType: 'Pillar', // Default
        tier: 'Pillar',
        entities: [],
        eavTriples: [],
        competitorPages: [],
        inboundLinks: [],
        outboundLinks: [],
        scores: {
          topicalAuthorityScore: 0,
          entityCoverageScore: 0,
          intentMatchScore: 0,
          contentGapScore: 0,
          internalLinkScore: 0,
          cannibalizationRisk: 0,
          finalPriorityScore: 0,
        }
      };
    });

    // 5. Entity Extraction (on cluster level for MVP)
    console.log('Step 4: Entity Extraction');
    for (const node of nodes) {
      node.entities = await this.entityExtractor.extract(node.query.query);
    }

    // 6. Hierarchy Building
    console.log('Step 5: Hierarchy Building');
    nodes = await this.hierarchyAgent.buildHierarchy(nodes);

    // 7. Brief Generation
    console.log('Step 6: Brief Generation');
    for (const node of nodes) {
      node.brief = await this.briefAgent.generateBrief(node);
      
      // 8. Export
      console.log(`Exporting brief for: ${node.query.query}`);
      this.markdownExporter.exportBrief(node, 'data/output/content_briefs');
    }

    // 9. Export Map
    console.log('Step 7: Exporting Topical Map');
    this.jsonExporter.exportMap(nodes, 'data/output');
    this.csvExporter.exportMap(nodes, 'data/output');

    console.log('Pipeline complete!');
  }
}
