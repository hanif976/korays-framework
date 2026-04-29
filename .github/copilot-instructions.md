# GitHub Copilot Instructions — korays-framework

## Project Overview
`korays-framework` is a Python library that automates the Koray-style topical authority SEO workflow in 9 steps: seed collection → normalisation → clustering → hierarchy building → brief generation → scoring → internal linking → export → refresh.

## Architecture
Each pipeline step lives in a dedicated module under `korays/`:

| Step | Module | Class | Input → Output |
|------|--------|-------|----------------|
| 1 | `seed_collector.py` | `SeedCollector` | `list[str]` URLs → `list[Seed]` |
| 2 | `normalizer.py` | `Normalizer` | `list[Seed]` → `pd.DataFrame` (normalization) |
| 3 | `clusterer.py` | `Clusterer` | `DataFrame` → `DataFrame` + `cluster_terms` |
| 4 | `hierarchy_builder.py` | `HierarchyBuilder` | `DataFrame` + terms → `nx.DiGraph` |
| 5 | `brief_generator.py` | `BriefGenerator` | `DataFrame` + terms → `list[Brief]` |
| 6 | `scorer.py` | `Scorer` | `list[Brief]` → `list[ScoredBrief]` |
| 7 | `internal_linker.py` | `InternalLinker` | `list[ScoredBrief]` → `list[LinkedBrief]` |
| 8 | `exporter.py` | `Exporter` | `list[LinkedBrief]` → `list[str]` (paths) |
| 9 | `refresher.py` | `Refresher` | URLs → `list[str]` (paths in datestamped dir) |

## Key Types
- `Seed(url, title, body, metadata)` — raw fetched content
- `Brief(cluster_id, title, body, word_count)` — 150-200 word summary
- `ScoredBrief(brief, score, breakdown)` — scored 1-10
- `LinkedBrief(cluster_id, title, body, score, links)` — with Markdown hyperlinks

## Code Style Rules
- Python ≥ 3.9; use `from __future__ import annotations` in every file (required for 3.9 compatibility — PEP 563 postponed evaluation)
- Type hints on all function signatures and dataclass fields
- Use `logging.getLogger(__name__)` — never `print()` in library code
- Dataclasses for data objects; no mutable default arguments
- No circular imports — each step only imports from earlier steps
- Tests use synthetic in-memory data only (no HTTP calls)

## Test Command
```bash
python -m pytest tests/ -v
```

## Common Tasks
- **Add a pipeline step**: create `korays/my_step.py`, update `pipeline.py:run_pipeline()`, export from `korays/__init__.py`, add tests
- **Extend scoring**: modify `Scorer._score_one()` in `korays/scorer.py`
- **Add a CLI flag**: add `argparse` argument in `pipeline.py:build_parser()`, thread it through `run_pipeline()`
- **Change export format**: extend `Exporter` in `korays/exporter.py`

## Quality Requirements
- Brief bodies: 150-200 words
- Minimum quality score: 8.0/10 (default, configurable via `--min-score`)
- Exported Markdown must be valid CommonMark
