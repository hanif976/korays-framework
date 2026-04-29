# agent.md

## Purpose
This repository is a topical authority and semantic SEO stack for building best-in-class topical maps inspired by Koray-style frameworks.

The goal is to:
- discover seed topics and questions
- cluster keywords and questions semantically
- build a hierarchical topical map
- generate content briefs
- suggest internal links
- score topical coverage and gaps
- refresh the map over time

## Core Principles
1. Optimize for topical coverage, not just keyword volume.
2. Prefer semantic similarity over simple string matching.
3. Build topic hierarchies:
   - Pillar pages
   - Cluster pages
   - Support pages
4. Map entities, intents, and questions to pages.
5. Avoid duplicate pages and overlapping intent.
6. Output actionable briefs, not just clusters.
7. Keep the system reproducible and cache expensive steps.
8. Re-run analysis when new SERP or content data arrives.

## Expected Stack Roles

### Research / Input
- `eagalvez/ustat_backend`
- `KTG1` research repos
- `oneai-nlp/oneai-node`

Use these to:
- collect questions
- extract topics and keywords
- enrich text with entities and labels

### Clustering
- `FassihFayyaz/SEO-Clustering-Tool`
- `bimadewantoro/WebClustering`
- `mali1sav/embedding-visualisation`

Use these to:
- group queries by semantic intent
- cluster by embeddings or TF-IDF
- visualize cluster quality
- compare clusters for overlap

### Hierarchy / Map Building
- `rhamerly/webmapper`
- `ikaikahussey/nuhou`

Use these to:
- create parent-child topic trees
- identify hub pages
- identify sibling and supporting articles

### Workflow / Automation
- `AlliDoisCode1234/MartAI`
- `kushalsarkar404/awwtomation`

Use these to:
- cache runs
- track planning steps
- automate repeatable SEO tasks
- generate structured outputs

## Operating Procedure

### Step 1: Gather inputs
Collect:
- seed topic
- target audience
- business model
- geo / language / market
- known competitors
- existing content URLs
- search queries / PAA / SERP data
- entity list if available

### Step 2: Normalize
Before clustering:
- lowercase text
- remove duplicates
- merge synonyms
- standardize brand and entity names
- separate navigational, informational, commercial, and transactional intent

### Step 3: Cluster
Cluster with multiple methods:
- keyword overlap
- question similarity
- embedding similarity
- SERP similarity

Do not trust only one algorithm.
Compare results and reconcile conflicts.

### Step 4: Build topic hierarchy
Convert clusters into:
- pillar topics
- cluster topics
- support topics

For each node, define:
- primary intent
- target page type
- main entity
- child topics
- sibling topics
- internal link targets

### Step 5: Generate content briefs
For each topic/page:
- title
- H1
- search intent
- target entity set
- required subtopics
- FAQ ideas
- internal links in/out
- content depth guidance
- differentiation angle

### Step 6: Score topical quality
Score each cluster/page on:
- completeness
- overlap risk
- intent clarity
- entity coverage
- depth
- internal link strength
- ranking potential

Flag:
- weak clusters
- duplicate intents
- orphan pages
- under-covered entities
- over-saturated clusters

### Step 7: Refresh and iterate
When new data appears:
- re-cluster
- compare old vs new map
- flag new opportunities
- identify content decay
- update internal link recommendations

## Output Format
When producing a topical map, always output:

1. Executive summary
2. Seed/topic universe
3. Cluster table
4. Topical hierarchy
5. Content brief list
6. Internal linking plan
7. Gap analysis
8. Priority order
9. Recommended next actions

## Quality Bar
A good result must:
- minimize duplication
- maximize semantic coverage
- reflect real search intent
- be easy to turn into content
- include clear parent/child relationships
- show explicit gap opportunities
- support future expansion

## Agent Instructions
- If data is incomplete, state assumptions explicitly.
- If multiple clustering methods disagree, prefer semantic intent and SERP evidence over raw keyword overlap.
- Do not generate final topical maps from seed keywords alone when SERP data or entity data is available.
- Prefer structured outputs over prose.
- Reuse cached results when possible.
- Explain why a cluster belongs where it belongs.
- Highlight what is missing from the map.
- Suggest the smallest number of pages needed to cover the universe well.

## Definition of Done
The topical map is done when:
- each cluster has a clear purpose
- each page has a unique intent
- the hierarchy is coherent
- internal links are planned
- coverage gaps are identified
- duplicate content risk is low
- the result can be turned into an editorial roadmap