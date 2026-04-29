# AGENTS.md — korays-framework

This file provides instructions for AI coding agents (OpenAI Codex, Devin, SWE-agent, etc.)
working on this repository.

---

## What This Project Does

`korays-framework` is a Python library that automates the full Koray-style topical authority
SEO workflow in 9 discrete, independently-testable pipeline steps.

---

## How to Run and Test

```bash
# Install
pip install -r requirements.txt
pip install -e .

# Run the full test suite (no network required)
python -m pytest tests/ -v

# Run the CLI
python pipeline.py --urls https://example.com/article --clusters 3 --min-score 7
```

All tests are in `tests/test_pipeline.py` and use synthetic in-memory data.  
**Never make real HTTP requests in tests.** Mock `requests.get` when needed.

---

## Repository Structure

```
korays/
  seed_collector.py     # Step 1: fetch URLs → list[Seed]
  normalizer.py         # Step 2: list[Seed] → cleaned pd.DataFrame
  clusterer.py          # Step 3: TF-IDF + K-means → DataFrame with 'cluster' column
  hierarchy_builder.py  # Step 4: NetworkX DiGraph from cluster metadata
  brief_generator.py    # Step 5: 150-200 word Brief per cluster
  scorer.py             # Step 6: 1-10 quality score per Brief
  internal_linker.py    # Step 7: inject Markdown hyperlinks into briefs
  exporter.py           # Step 8: write .md (and optionally .pdf) files
  refresher.py          # Step 9: datestamped re-run of the full pipeline
pipeline.py             # CLI entry-point (argparse)
tests/test_pipeline.py  # All unit/smoke tests
```

---

## Data Flow

```
list[str] URLs
  → SeedCollector.collect()      → list[Seed]
  → Normalizer.normalize()       → pd.DataFrame  (cols: url, title, body)
  → Clusterer.fit_predict()      → pd.DataFrame  (+ cluster: int)
  → HierarchyBuilder.build()     → nx.DiGraph
  → BriefGenerator.generate()    → list[Brief]
  → Scorer.score_all()           → list[ScoredBrief]
  → InternalLinker.link()        → list[LinkedBrief]
  → Exporter.export()            → list[str]  (file paths)
```

---

## Coding Rules

1. Python ≥ 3.9. Add `from __future__ import annotations` at the top of every module.
2. All function signatures and dataclass fields must have type hints.
3. Use `logger = logging.getLogger(__name__)` — never use `print()` in library code.
4. Use `@dataclass` for all data transfer objects.
5. No circular imports: a module may only import from modules earlier in the pipeline.
6. The `korays/__init__.py` must re-export every public class.
7. `pipeline.py` is the only place that orchestrates the full pipeline.

---

## Adding a New Step

1. Create `korays/new_step.py` with a class and at least one public method.
2. Define input/output types as `@dataclass` if new types are needed.
3. Insert the call at the correct position in `pipeline.py:run_pipeline()`.
4. Add the class to `korays/__init__.py`.
5. Write smoke tests in `tests/test_pipeline.py` using synthetic data.
6. Update `README.md` workflow table and `agent.md` module API section.

---

## Pull Request / Commit Standards

- Commits: use conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
- Every PR must have passing tests (`python -m pytest tests/ -v`).
- Do not remove or weaken existing tests.
- Do not introduce `print()` statements in library code.

---

## Out of Scope

- Do not change `pyproject.toml` `[build-system]` settings without a strong reason.
- Do not add new top-level dependencies without updating both `requirements.txt` and `pyproject.toml`.
- Do not make HTTP requests inside the test suite.
