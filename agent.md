# Koray-Style Topical Authority Stack — Agent Guide

> **AI Coding Agents**: This is the primary technical reference for working on this codebase.
> Read it in full before making any changes.

---

## 1. Project Purpose

`korays-framework` automates the full **Koray-style topical authority** workflow:

```
seed collection → normalisation → clustering → hierarchy building →
brief generation → scoring → internal linking → export → refresh
```

It is a Python library (`korays/`) with a CLI entry-point (`pipeline.py`).  
Outputs are Markdown files (and optional PDFs) representing authoritative topic clusters.

---

## 2. Repository Layout

```
korays-framework/
├── korays/                   # Core library — one module per pipeline step
│   ├── __init__.py           # Public API re-exports
│   ├── seed_collector.py     # Step 1 — HTTP fetch + HTML parse
│   ├── normalizer.py         # Step 2 — clean, deduplicate, lowercase
│   ├── clusterer.py          # Step 3 — TF-IDF + K-means
│   ├── hierarchy_builder.py  # Step 4 — NetworkX directed graph
│   ├── brief_generator.py    # Step 5 — 150-200 word cluster summaries
│   ├── scorer.py             # Step 6 — 1-10 quality score
│   ├── internal_linker.py    # Step 7 — Markdown hyperlink injection
│   ├── exporter.py           # Step 8 — write .md / .pdf files
│   └── refresher.py          # Step 9 — datestamped re-run
├── tests/
│   └── test_pipeline.py      # Smoke tests — no network, in-memory data only
├── pipeline.py               # CLI orchestrator (argparse entry-point)
├── pyproject.toml            # PEP 517 build config + project metadata
└── requirements.txt          # Pinned runtime dependencies
```

---

## 3. Key Data Structures

Data flows through the pipeline as a chain of typed objects:

| Type | Module | Fields |
|------|--------|--------|
| `Seed` | `seed_collector` | `url`, `title`, `body`, `metadata: dict` |
| `pd.DataFrame` | `normalizer` → `clusterer` | columns: `url`, `title`, `body`, `cluster` (int) |
| `Brief` | `brief_generator` | `cluster_id`, `title`, `body`, `word_count` |
| `ScoredBrief` | `scorer` | `brief: Brief`, `score: float`, `breakdown: dict` |
| `LinkedBrief` | `internal_linker` | `cluster_id`, `title`, `body`, `score`, `links: list[tuple[str,str]]` |

Always preserve this chain when extending the pipeline.

---

## 4. Development Setup

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Install runtime + dev dependencies
pip install -r requirements.txt
pip install -e .                 # Installs the `korays` CLI entry-point

# 3. Run the test suite (no network required)
python -m pytest tests/ -v

# 4. Run a quick smoke run against live URLs
python pipeline.py --urls https://example.com/a --clusters 3
```

---

## 5. CLI Reference

```
korays [--urls URL [URL ...]]
       [--output-dir DIR]          # default: output/
       [--clusters N]              # default: 5
       [--min-score SCORE]         # default: 8.0, range 1-10
       [--pdf]                     # also generate PDF exports
```

The `korays` command is registered via `[project.scripts]` in `pyproject.toml` and maps to `pipeline:main`.

---

## 6. Module API Summary

### `SeedCollector`
```python
seeds: list[Seed] = SeedCollector().collect(urls: list[str])
```
- Fetches URLs in parallel (ThreadPoolExecutor, default 8 workers).
- Returns results in the original URL order.
- Failed URLs are logged as warnings and skipped.

### `Normalizer`
```python
df: pd.DataFrame = Normalizer().normalize(seeds: list[Seed])
```
- Strips HTML tags, collapses whitespace, lowercases.
- Drops rows with empty `body`; deduplicates on `body`.

### `Clusterer`
```python
clusterer = Clusterer(n_clusters=5)
df = clusterer.fit_predict(df)        # adds 'cluster' column
terms = clusterer.cluster_terms       # dict[int, list[str]] — top-10 terms per cluster
```
- Uses `TfidfVectorizer(max_features=5000)` + L2-normalised `KMeans`.
- `n_clusters` is capped at `len(df)` automatically.

### `HierarchyBuilder`
```python
hb = HierarchyBuilder()
graph: nx.DiGraph = hb.build(df, cluster_terms)
hb.to_json("output/hierarchy.json")
```
- Root node → every cluster; clusters sharing ≥2 top terms get a direct edge.

### `BriefGenerator`
```python
briefs: list[Brief] = BriefGenerator().generate(df, cluster_terms)
```
- Produces one `Brief` per cluster; trims to 150-200 words at sentence boundaries.

### `Scorer`
```python
scored: list[ScoredBrief] = Scorer().score_all(briefs)
```
- Score = `0.4 × length_score + 0.4 × keyword_density_score + 0.2 × uniqueness_score`

### `InternalLinker`
```python
linked: list[LinkedBrief] = InternalLinker().link(scored_briefs)
```
- Injects `[keyword](#cluster-N)` anchors into brief bodies; builds `links` list.

### `Exporter`
```python
paths: list[str] = Exporter(output_dir="output").export(linked, to_pdf=False)
```
- Writes `cluster-{id}.md`; optionally `cluster-{id}.pdf` via `fpdf2`.

### `Refresher`
```python
paths = Refresher(output_dir="output").refresh(new_urls, n_clusters=5, min_score=8.0)
```
- Re-runs the full pipeline into `output/refresh_YYYYMMDD_HHMMSS/`.

---

## 7. Adding a New Pipeline Step

1. Create `korays/my_step.py` with a class and a primary method.
2. Add the new dataclass or return type (if any).
3. Import and call it in the correct position inside `pipeline.py:run_pipeline()`.
4. Export the class from `korays/__init__.py`.
5. Add smoke tests in `tests/test_pipeline.py` (no network, synthetic data only).

---

## 8. Code Conventions

- **Python ≥ 3.9**; use `from __future__ import annotations` in every module.
- **Type hints** everywhere — function signatures, dataclass fields, return types.
- **`logging`** via `logger = logging.getLogger(__name__)` — never `print()` in library code.
- **Dataclasses** for plain data objects (`Seed`, `Brief`, `ScoredBrief`, `LinkedBrief`).
- **No circular imports** — each step imports only from earlier steps.
- **Tests**: in-memory synthetic data only; patch network calls with `unittest.mock`.

---

## 9. Testing Guidelines

- Run: `python -m pytest tests/ -v`
- All tests in `tests/test_pipeline.py` use `_make_seeds(n)` for synthetic data.
- No test should make real HTTP requests — mock `requests.get` if needed.
- PDF tests are skipped when `fpdf2` is unavailable; that is expected.

---

## 10. Quality Bar

- All pipeline outputs must score **≥ 8.0 / 10** (overridable via `--min-score`).
- Brief bodies must be **150-200 words**.
- Exported Markdown must be **valid CommonMark**.

---

## 11. Definition of Done

A change is complete when:
1. All existing tests pass (`pytest tests/ -v`).
2. New behaviour is covered by at least one new test.
3. Public API is reflected in this file and in `korays/__init__.py`.
4. `README.md` is updated if CLI options or workflow steps change.