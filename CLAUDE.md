# CLAUDE.md — korays-framework

Instructions for Claude Code (claude.ai/code) and Claude-based agents.

---

## Project Summary

`korays-framework` is a Python pipeline library that automates the Koray-style topical
authority SEO workflow. It has 9 steps, each in its own module under `korays/`, chained
together by `pipeline.py`.

---

## Essential Commands

```bash
# Setup
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && pip install -e .

# Test (always run before and after changes)
python -m pytest tests/ -v

# CLI smoke-run
python pipeline.py --urls https://example.com --clusters 3
```

---

## Data Pipeline Chain

```
URLs → Seed → DataFrame(+cluster) → Brief → ScoredBrief → LinkedBrief → files
```

Each arrow corresponds to one module. Do not skip or reorder steps.

---

## Module Locations

| Class | File |
|-------|------|
| `SeedCollector` | `korays/seed_collector.py` |
| `Normalizer` | `korays/normalizer.py` |
| `Clusterer` | `korays/clusterer.py` |
| `HierarchyBuilder` | `korays/hierarchy_builder.py` |
| `BriefGenerator` | `korays/brief_generator.py` |
| `Scorer` | `korays/scorer.py` |
| `InternalLinker` | `korays/internal_linker.py` |
| `Exporter` | `korays/exporter.py` |
| `Refresher` | `korays/refresher.py` |

---

## Invariants to Preserve

- `from __future__ import annotations` must be the first import in every module.
- No `print()` calls in library code — use `logging.getLogger(__name__)`.
- Tests must not make real HTTP requests.
- `korays/__init__.py` must export all public classes.
- The `cluster` column in the DataFrame is always `int` typed.
- Briefs are always 150-200 words; the scorer penalises deviations.

---

## Scoring Formula

```
score = 0.4 × length_score + 0.4 × keyword_density_score + 0.2 × uniqueness_score
```

Minimum passing score is 8.0/10 by default. Controlled via `--min-score`.

---

## Do Not

- Do not add network calls to tests.
- Do not introduce circular imports between pipeline modules.
- Do not remove or relax existing assertions in tests.
- Do not add new dependencies without updating both `requirements.txt` and `pyproject.toml`.
