#!/usr/bin/env python3
"""Koray-Style Topical Authority Stack — CLI pipeline orchestrator.

Usage examples
--------------
# Run full pipeline on two URLs:
python pipeline.py --urls https://example.com/a https://example.com/b

# Export PDFs, use 8 clusters, minimum score 7:
python pipeline.py --urls https://example.com/a --clusters 8 --min-score 7 --pdf
"""
from __future__ import annotations

import argparse
import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="korays",
        description="Koray-Style Topical Authority Stack",
    )
    parser.add_argument(
        "--urls",
        nargs="+",
        required=True,
        metavar="URL",
        help="One or more seed URLs to collect content from.",
    )
    parser.add_argument(
        "--output-dir",
        default="output",
        metavar="DIR",
        help="Directory where Markdown/PDF outputs are written (default: output/).",
    )
    parser.add_argument(
        "--clusters",
        type=int,
        default=5,
        metavar="N",
        help="Number of topic clusters (default: 5).",
    )
    parser.add_argument(
        "--min-score",
        type=float,
        default=8.0,
        metavar="SCORE",
        help="Minimum quality score 1-10 (default: 8.0).",
    )
    parser.add_argument(
        "--pdf",
        action="store_true",
        help="Also generate PDF exports.",
    )
    return parser


def run_pipeline(
    urls: list[str],
    output_dir: str = "output",
    n_clusters: int = 5,
    min_score: float = 8.0,
    to_pdf: bool = False,
) -> list[str]:
    """Execute the full 9-step pipeline and return a list of output file paths."""
    from korays.seed_collector import SeedCollector
    from korays.normalizer import Normalizer
    from korays.clusterer import Clusterer
    from korays.hierarchy_builder import HierarchyBuilder
    from korays.brief_generator import BriefGenerator
    from korays.scorer import Scorer
    from korays.internal_linker import InternalLinker
    from korays.exporter import Exporter

    # Step 1 — Collect
    logger.info("Step 1/9 — Seed Collection")
    seeds = SeedCollector().collect(urls)
    if not seeds:
        logger.error("No seeds collected. Aborting.")
        return []

    # Step 2 — Normalise
    logger.info("Step 2/9 — Normalisation")
    df = Normalizer().normalize(seeds)

    # Step 3 — Cluster
    logger.info("Step 3/9 — Clustering")
    clusterer = Clusterer(n_clusters=n_clusters)
    df = clusterer.fit_predict(df)
    cluster_terms = clusterer.cluster_terms

    # Step 4 — Hierarchy
    logger.info("Step 4/9 — Hierarchy Building")
    import os
    import json
    hb = HierarchyBuilder()
    hb.build(df, cluster_terms)
    os.makedirs(output_dir, exist_ok=True)
    hb.to_json(os.path.join(output_dir, "hierarchy.json"))

    # Step 5 — Briefs
    logger.info("Step 5/9 — Brief Generation")
    briefs = BriefGenerator().generate(df, cluster_terms)

    # Step 6 — Score
    logger.info("Step 6/9 — Scoring")
    scored = Scorer().score_all(briefs)

    # Filter
    passing = [sb for sb in scored if sb.score >= min_score]
    if not passing:
        logger.warning(
            "No briefs met the minimum score (%.1f). Exporting all %d briefs.",
            min_score,
            len(scored),
        )
        passing = scored

    # Step 7 — Internal Linking
    logger.info("Step 7/9 — Internal Linking")
    linked = InternalLinker().link(passing)

    # Step 8 — Export
    logger.info("Step 8/9 — Export")
    paths = Exporter(output_dir=output_dir).export(linked, to_pdf=to_pdf)

    logger.info("Step 9/9 — Pipeline complete. %d files written to %s.", len(paths), output_dir)
    return paths


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    paths = run_pipeline(
        urls=args.urls,
        output_dir=args.output_dir,
        n_clusters=args.clusters,
        min_score=args.min_score,
        to_pdf=args.pdf,
    )
    if not paths:
        return 1
    print(f"\nDone. {len(paths)} file(s) written:")
    for p in paths:
        print(f"  {p}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
