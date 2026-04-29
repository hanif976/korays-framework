import fs from 'fs';
import yaml from 'yaml';
import { z } from 'zod';
const ConfigSchema = z.object({
    project: z.object({
        name: z.string(),
        country: z.string(),
        language: z.string(),
        niche: z.string(),
    }),
    providers: z.object({
        serp: z.string(),
        ai: z.string(),
        embeddings: z.string(),
    }),
    limits: z.object({
        serp_top_n: z.number(),
        competitor_pages_per_query: z.number(),
        max_queries_per_seed: z.number(),
        max_briefs_per_run: z.number(),
    }),
    clustering: z.object({
        serp_overlap_weight: z.number(),
        embedding_weight: z.number(),
        entity_weight: z.number(),
        intent_weight: z.number(),
        modifier_weight: z.number(),
        same_page_threshold: z.number(),
        same_cluster_threshold: z.number(),
    }),
    briefs: z.object({
        require_information_gain: z.boolean(),
        require_schema_suggestions: z.boolean(),
        require_internal_links: z.boolean(),
        require_eav_triples: z.boolean(),
        require_expert_review_for_ymyl: z.boolean(),
    }),
    quality: z.object({
        min_entity_coverage_score: z.number(),
        min_intent_match_score: z.number(),
        max_cannibalization_risk: z.number(),
        min_information_gain_items: z.number(),
    }),
    exports: z.object({
        json: z.boolean(),
        csv: z.boolean(),
        xlsx: z.boolean(),
        markdown: z.boolean(),
        mermaid: z.boolean(),
    }),
});
export function loadConfig(configPath = 'config/default.yaml') {
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.parse(fileContent);
    return ConfigSchema.parse(parsed);
}
