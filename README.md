# Koray-Style Topical Authority Stack

A Python framework that automates the full **Koray-style topical authority** workflow:
seed collection → normalisation → clustering → hierarchy building → brief generation →
scoring → internal linking → export → refresh.

## Quickstart

```bash
pip install -r requirements.txt
python pipeline.py --urls https://example.com/article1 https://example.com/article2
```

## CLI Options

```
usage: pipeline.py [-h] [--urls URLS [URLS ...]] [--output-dir OUTPUT_DIR]
                   [--clusters CLUSTERS] [--min-score MIN_SCORE]

optional arguments:
  --urls          One or more seed URLs to collect content from
  --output-dir    Directory where Markdown/PDF outputs are written (default: output/)
  --clusters      Number of topic clusters (default: 5)
  --min-score     Minimum quality score threshold 1-10 (default: 8.0)
```

## Workflow Steps

| # | Module | Description |
|---|--------|-------------|
| 1 | `korays/seed_collector.py` | Fetch & parse content from URLs |
| 2 | `korays/normalizer.py` | Clean, deduplicate, standardise text |
| 3 | `korays/clusterer.py` | TF-IDF + K-means clustering |
| 4 | `korays/hierarchy_builder.py` | Build topic relationship graph |
| 5 | `korays/brief_generator.py` | 150-200 word cluster summaries |
| 6 | `korays/scorer.py` | 1-10 quality scoring |
| 7 | `korays/internal_linker.py` | Contextual cross-cluster linking |
| 8 | `korays/exporter.py` | Markdown & PDF export |
| 9 | `korays/refresher.py` | Monthly refresh orchestration |

## Project Structure

```
korays-framework/
├── korays/               # Core library modules
├── tests/                # Unit / smoke tests
├── pipeline.py           # CLI orchestrator
├── requirements.txt
└── pyproject.toml
```
