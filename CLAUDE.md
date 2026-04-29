# CLAUDE.md — korays-framework (V2)

Instructions for Gemini CLI, Claude Code, and other AI agents.

---

## Project Summary

`korays-framework` is a Topical Authority Operating System. It researches niches, builds semantic topical maps, generates content briefs, and designs internal link graphs.

It is primarily written in **TypeScript (Node.js)** for orchestration and CLI, with optional **Python** workers for heavy NLP/ML.

---

## Essential Commands

```bash
# Setup
npm install

# Build
npm run build

# Run (requires GEMINI_API_KEY in .env)
npm run korays -- map --seeds "semantic seo" "topical authority"

# Test
npm test
```

---

## Core Architecture

- `src/core/`: Abstractions, config, AI clients.
- `src/collectors/`: SERP, seed, and data collectors.
- `src/nlp/`: Entity extraction, intent classification, NLP processing.
- `src/agents/`: Specialized agents for clustering, hierarchy, briefs, etc.
- `src/exporters/`: Markdown, JSON, CSV exporters.
- `src/orchestrator.ts`: Main pipeline logic.

---

## Data Pipeline Chain

```
Seeds → Query Expansion → SERP Collection → Intent Classification → Hybrid Clustering → Topical Hierarchy → Entity/EAV Extraction → Brief Generation → Link Graph Builder → Exports
```

---

## Invariants to Preserve

- Use TypeScript `ES2022` with `NodeNext` module resolution.
- All AI calls must go through the `AIClient` abstraction.
- Use `zod` for all data validation and AI response parsing.
- Keep the system provider-agnostic.
- Markdown briefs must follow the template in `MarkdownExporter`.

---

## Technical SEO Rules

- Every brief must answer a real user need (People-first).
- The page must provide original information gain.
- Every internal link must be semantically relevant.
- Schema suggestions must match visible content.

---

## Search Console Refresh Loop

Integrate GSC data to detect decay and prioritize refreshes. (Phase 3)
