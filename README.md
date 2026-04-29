# Korays Framework: Topical Authority Operating System

`korays-framework` is a production-grade framework that automates the full topical authority workflow: niche research → semantic topical map → content briefs → internal link graph → technical SEO.

## Features

- **Provider-agnostic AI layer**: Support for Gemini, OpenAI, Claude, and local LLMs.
- **Full SEO data model**: Queries, SERPs, competitors, entities, and EAV triples.
- **Hybrid clustering**: SERP overlap, embeddings, and intent similarity.
- **Entity-first topical authority**: Advanced semantic relationship mapping.
- **Content Briefs V2**: Comprehensive Markdown briefs with information gain and QA.
- **Search Console Loop**: Performance-driven content refresh planning.

## Quickstart

### 1. Installation

```bash
npm install
npm run build
```

### 2. Configuration

Create a `.env` file from `.env.example` and add your API keys:

```bash
GEMINI_API_KEY=your_key
SERP_API_KEY=your_key
```

### 3. Run Pipeline

```bash
npm run korays -- map --seeds "semantic seo" "topical authority"
```

Outputs will be generated in `data/output/`.

## Architecture

The system uses a multi-agent orchestration pattern:

- **SERP Agent**: Collects and analyzes search results.
- **Entity Agent**: Extracts entities and relationships.
- **Clustering Agent**: Groups topics semantically.
- **Hierarchy Agent**: Builds the topical map structure.
- **Brief Agent**: Generates production-ready content briefs.

## Project Structure

```
korays-framework/
├── config/           # YAML configuration
├── src/              # TypeScript source code
│   ├── core/         # Core abstractions & AI clients
│   ├── agents/       # AI agents
│   ├── collectors/   # Data collectors
│   ├── nlp/          # NLP & entity extraction
│   └── exporters/    # Exporters (MD, JSON, CSV)
├── python/           # Legacy/Optional Python workers
└── data/
    └── output/       # Generated results
```

## Implementation Status

- [x] **Phase 1 (MVP)**: AI abstraction, clustering, hierarchy, briefs, and exporters.
- [ ] **Phase 2 (Pro)**: Internal link graph, cannibalization detection, and technical SEO.
- [ ] **Phase 3 (Enterprise)**: GSC integration, refresh loop, and WordPress export.
