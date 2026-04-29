"""Step 5 — Brief Generation.

Creates a 150-200 word summary for each cluster.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import List

import pandas as pd

logger = logging.getLogger(__name__)

_MIN_WORDS = 150
_MAX_WORDS = 200


@dataclass
class Brief:
    cluster_id: int
    title: str
    body: str
    word_count: int


class BriefGenerator:
    """Generate concise briefs from clustered content."""

    def generate(self, df: pd.DataFrame, cluster_terms: dict[int, list[str]]) -> List[Brief]:
        """Return one Brief per cluster."""
        briefs: List[Brief] = []
        for cid, group in df.groupby("cluster"):
            terms = cluster_terms.get(int(cid), [])
            title = " / ".join(terms[:3]).title() if terms else f"Cluster {cid}"
            combined = " ".join(group["body"].tolist())
            body = self._trim_to_word_range(combined, _MIN_WORDS, _MAX_WORDS)
            briefs.append(
                Brief(
                    cluster_id=int(cid),
                    title=title,
                    body=body,
                    word_count=len(body.split()),
                )
            )
        logger.info("Generated %d briefs.", len(briefs))
        return briefs

    @staticmethod
    def _trim_to_word_range(text: str, min_words: int, max_words: int) -> str:
        words = text.split()
        if len(words) <= max_words:
            # Pad with a note if too short
            trimmed = " ".join(words)
            if len(words) < min_words:
                trimmed += (
                    f" [Note: source content contains only {len(words)} words.]"
                )
            return trimmed
        # Try to end on a sentence boundary within the word window
        snippet = " ".join(words[:max_words])
        last_period = max(snippet.rfind("."), snippet.rfind("!"), snippet.rfind("?"))
        if last_period > 0 and len(snippet[:last_period].split()) >= min_words:
            return snippet[: last_period + 1]
        return snippet
