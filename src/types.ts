export type SearchIntent =
  | "Informational"
  | "Definitional"
  | "Commercial"
  | "Transactional"
  | "Navigational"
  | "Local"
  | "Investigational"
  | "Comparative"
  | "Troubleshooting";

export type FunnelStage = "TOFU" | "MOFU" | "BOFU" | "Retention";

export type PageType =
  | "Pillar"
  | "Hub"
  | "Supporting"
  | "Leaf"
  | "Glossary"
  | "Comparison"
  | "Review"
  | "HowTo"
  | "FAQ"
  | "Product"
  | "Category"
  | "LocalLanding";

export type SerpFeature =
  | "AIOverview"
  | "FeaturedSnippet"
  | "PeopleAlsoAsk"
  | "Video"
  | "ImagePack"
  | "LocalPack"
  | "Shopping"
  | "TopStories"
  | "Discussions"
  | "Sitelinks"
  | "None";

export interface Entity {
  id: string;
  name: string;
  type: string;
  aliases: string[];
  salienceScore: number;
  sourceUrls: string[];
  confidence: number;
}

export interface EAVTriple {
  entity: string;
  attribute: string;
  value: string;
  context: string;
  sourceUrl?: string;
  confidence: number;
}

export interface QueryData {
  id: string;
  query: string;
  normalizedQuery: string;
  seed: string;
  searchVolume?: number;
  keywordDifficulty?: number;
  cpc?: number;
  country: string;
  language: string;
  intent: SearchIntent;
  funnelStage: FunnelStage;
  modifiers: string[];
  serpFeatures: SerpFeature[];
  paaQuestions: string[];
  autocompleteSuggestions: string[];
  relatedSearches: string[];
  topRankingUrls: string[];
}

export interface CompetitorPage {
  url: string;
  domain: string;
  title: string;
  metaDescription?: string;
  h1?: string;
  h2s: string[];
  h3s: string[];
  wordCount: number;
  schemaTypes: string[];
  entities: Entity[];
  eavTriples: EAVTriple[];
  internalLinks: string[];
  externalLinks: string[];
  contentGaps: string[];
}

export interface ContentBrief {
  briefId: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  urlSlug: string;
  recommendedTitle: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  searchIntent: SearchIntent;
  pageType: PageType;
  funnelStage: FunnelStage;
  centralEntity: string;
  macroContext: string;
  microContexts: string[];
  requiredEntities: Entity[];
  requiredEAVTriples: EAVTriple[];
  outline: OutlineSection[];
  faqs: FAQItem[];
  informationGainIdeas: string[];
  originalResearchIdeas: string[];
  mediaSuggestions: MediaSuggestion[];
  schemaSuggestions: SchemaSuggestion[];
  internalLinksIn: InternalLinkSuggestion[];
  internalLinksOut: InternalLinkSuggestion[];
  expertReviewRequired: boolean;
  qualityChecklist: QualityCheck[];
  estimatedWordCount: {
    min: number;
    max: number;
  };
}

export interface OutlineSection {
  headingLevel: "H2" | "H3" | "H4";
  heading: string;
  purpose: string;
  entitiesToCover: string[];
  questionsToAnswer: string[];
  recommendedFormat: "paragraph" | "table" | "ordered-list" | "unordered-list" | "definition" | "steps" | "pros-cons" | "comparison";
}

export interface FAQItem {
  question: string;
  answerIntent: string;
  recommendedAnswer: string;
  source: "PAA" | "SERP" | "Autocomplete" | "Generated";
}

export interface MediaSuggestion {
  type: "image" | "video" | "diagram" | "table" | "calculator" | "template";
  purpose: string;
  altText?: string;
}

export interface SchemaSuggestion {
  schemaType: string;
  reason: string;
  requiredProperties: string[];
  warnings: string[];
}

export interface InternalLinkSuggestion {
  sourceNodeId: string;
  targetNodeId: string;
  anchorText: string;
  linkReason: string;
  linkStrength: number;
  placement: "intro" | "body" | "definition" | "comparison" | "conclusion";
}

export interface QualityCheck {
  name: string;
  status: "pass" | "fail" | "warning" | "manual-review";
  notes: string;
}

export interface TopicalNode {
  id: string;
  clusterId: string;
  parentId?: string;
  childIds: string[];
  query: QueryData;
  pageType: PageType;
  tier: "Pillar" | "Hub" | "Supporting" | "Leaf";
  entities: Entity[];
  eavTriples: EAVTriple[];
  competitorPages: CompetitorPage[];
  brief?: ContentBrief;
  inboundLinks: InternalLinkSuggestion[];
  outboundLinks: InternalLinkSuggestion[];
  scores: NodeScores;
}

export interface NodeScores {
  topicalAuthorityScore: number;
  entityCoverageScore: number;
  intentMatchScore: number;
  contentGapScore: number;
  internalLinkScore: number;
  cannibalizationRisk: number;
  refreshPriorityScore?: number;
  finalPriorityScore: number;
}
