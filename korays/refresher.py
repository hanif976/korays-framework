"""Step 9 — Refresh.

Re-runs the full pipeline against a new set of URLs and merges results
with any previously-exported briefs.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import List

logger = logging.getLogger(__name__)


class Refresher:
    """Orchestrate a monthly (or on-demand) refresh of the topical stack."""

    def __init__(self, output_dir: str = "output") -> None:
        self.output_dir = output_dir

    def refresh(
        self,
        new_urls: List[str],
        n_clusters: int = 5,
        min_score: float = 8.0,
        to_pdf: bool = False,
    ) -> List[str]:
        """Run the full pipeline for *new_urls* and write outputs.

        Existing output files are preserved; new outputs are written with a
        datestamped subdirectory so refreshes never overwrite previous runs.
        """
        # Import here to avoid circular imports at module level
        from korays.seed_collector import SeedCollector
        from korays.normalizer import Normalizer
        from korays.clusterer import Clusterer
        from korays.hierarchy_builder import HierarchyBuilder
        from korays.brief_generator import BriefGenerator
        from korays.scorer import Scorer
        from korays.internal_linker import InternalLinker
        from korays.exporter import Exporter

        stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        refresh_dir = os.path.join(self.output_dir, f"refresh_{stamp}")

        logger.info("Starting refresh → %s", refresh_dir)

        seeds = SeedCollector().collect(new_urls)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=n_clusters)
        df = clusterer.fit_predict(df)
        cluster_terms = clusterer.cluster_terms

        HierarchyBuilder().build(df, cluster_terms)

        briefs = BriefGenerator().generate(df, cluster_terms)
        scored = Scorer().score_all(briefs)

        # Filter by quality bar
        passing = [sb for sb in scored if sb.score >= min_score]
        if not passing:
            logger.warning(
                "No briefs passed the minimum score threshold of %.1f.", min_score
            )
            passing = scored  # Export all if none pass

        linked = InternalLinker().link(passing)
        paths = Exporter(output_dir=refresh_dir).export(linked, to_pdf=to_pdf)

        logger.info("Refresh complete: %d files written.", len(paths))
        return paths
