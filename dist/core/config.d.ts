import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    project: z.ZodObject<{
        name: z.ZodString;
        country: z.ZodString;
        language: z.ZodString;
        niche: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        country: string;
        language: string;
        niche: string;
    }, {
        name: string;
        country: string;
        language: string;
        niche: string;
    }>;
    providers: z.ZodObject<{
        serp: z.ZodString;
        ai: z.ZodString;
        embeddings: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        serp: string;
        ai: string;
        embeddings: string;
    }, {
        serp: string;
        ai: string;
        embeddings: string;
    }>;
    limits: z.ZodObject<{
        serp_top_n: z.ZodNumber;
        competitor_pages_per_query: z.ZodNumber;
        max_queries_per_seed: z.ZodNumber;
        max_briefs_per_run: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        serp_top_n: number;
        competitor_pages_per_query: number;
        max_queries_per_seed: number;
        max_briefs_per_run: number;
    }, {
        serp_top_n: number;
        competitor_pages_per_query: number;
        max_queries_per_seed: number;
        max_briefs_per_run: number;
    }>;
    clustering: z.ZodObject<{
        serp_overlap_weight: z.ZodNumber;
        embedding_weight: z.ZodNumber;
        entity_weight: z.ZodNumber;
        intent_weight: z.ZodNumber;
        modifier_weight: z.ZodNumber;
        same_page_threshold: z.ZodNumber;
        same_cluster_threshold: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        serp_overlap_weight: number;
        embedding_weight: number;
        entity_weight: number;
        intent_weight: number;
        modifier_weight: number;
        same_page_threshold: number;
        same_cluster_threshold: number;
    }, {
        serp_overlap_weight: number;
        embedding_weight: number;
        entity_weight: number;
        intent_weight: number;
        modifier_weight: number;
        same_page_threshold: number;
        same_cluster_threshold: number;
    }>;
    briefs: z.ZodObject<{
        require_information_gain: z.ZodBoolean;
        require_schema_suggestions: z.ZodBoolean;
        require_internal_links: z.ZodBoolean;
        require_eav_triples: z.ZodBoolean;
        require_expert_review_for_ymyl: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        require_information_gain: boolean;
        require_schema_suggestions: boolean;
        require_internal_links: boolean;
        require_eav_triples: boolean;
        require_expert_review_for_ymyl: boolean;
    }, {
        require_information_gain: boolean;
        require_schema_suggestions: boolean;
        require_internal_links: boolean;
        require_eav_triples: boolean;
        require_expert_review_for_ymyl: boolean;
    }>;
    quality: z.ZodObject<{
        min_entity_coverage_score: z.ZodNumber;
        min_intent_match_score: z.ZodNumber;
        max_cannibalization_risk: z.ZodNumber;
        min_information_gain_items: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min_entity_coverage_score: number;
        min_intent_match_score: number;
        max_cannibalization_risk: number;
        min_information_gain_items: number;
    }, {
        min_entity_coverage_score: number;
        min_intent_match_score: number;
        max_cannibalization_risk: number;
        min_information_gain_items: number;
    }>;
    exports: z.ZodObject<{
        json: z.ZodBoolean;
        csv: z.ZodBoolean;
        xlsx: z.ZodBoolean;
        markdown: z.ZodBoolean;
        mermaid: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        json: boolean;
        csv: boolean;
        xlsx: boolean;
        markdown: boolean;
        mermaid: boolean;
    }, {
        json: boolean;
        csv: boolean;
        xlsx: boolean;
        markdown: boolean;
        mermaid: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    project: {
        name: string;
        country: string;
        language: string;
        niche: string;
    };
    providers: {
        serp: string;
        ai: string;
        embeddings: string;
    };
    limits: {
        serp_top_n: number;
        competitor_pages_per_query: number;
        max_queries_per_seed: number;
        max_briefs_per_run: number;
    };
    clustering: {
        serp_overlap_weight: number;
        embedding_weight: number;
        entity_weight: number;
        intent_weight: number;
        modifier_weight: number;
        same_page_threshold: number;
        same_cluster_threshold: number;
    };
    briefs: {
        require_information_gain: boolean;
        require_schema_suggestions: boolean;
        require_internal_links: boolean;
        require_eav_triples: boolean;
        require_expert_review_for_ymyl: boolean;
    };
    quality: {
        min_entity_coverage_score: number;
        min_intent_match_score: number;
        max_cannibalization_risk: number;
        min_information_gain_items: number;
    };
    exports: {
        json: boolean;
        csv: boolean;
        xlsx: boolean;
        markdown: boolean;
        mermaid: boolean;
    };
}, {
    project: {
        name: string;
        country: string;
        language: string;
        niche: string;
    };
    providers: {
        serp: string;
        ai: string;
        embeddings: string;
    };
    limits: {
        serp_top_n: number;
        competitor_pages_per_query: number;
        max_queries_per_seed: number;
        max_briefs_per_run: number;
    };
    clustering: {
        serp_overlap_weight: number;
        embedding_weight: number;
        entity_weight: number;
        intent_weight: number;
        modifier_weight: number;
        same_page_threshold: number;
        same_cluster_threshold: number;
    };
    briefs: {
        require_information_gain: boolean;
        require_schema_suggestions: boolean;
        require_internal_links: boolean;
        require_eav_triples: boolean;
        require_expert_review_for_ymyl: boolean;
    };
    quality: {
        min_entity_coverage_score: number;
        min_intent_match_score: number;
        max_cannibalization_risk: number;
        min_information_gain_items: number;
    };
    exports: {
        json: boolean;
        csv: boolean;
        xlsx: boolean;
        markdown: boolean;
        mermaid: boolean;
    };
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare function loadConfig(configPath?: string): Config;
export {};
