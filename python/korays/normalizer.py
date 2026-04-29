"""Step 2 — Normalisation.

Cleans and deduplicates a list of Seed objects, returning a tidy DataFrame.
"""
from __future__ import annotations

import re
import logging
from typing import List

import pandas as pd

from korays.seed_collector import Seed

logger = logging.getLogger(__name__)


class Normalizer:
    """Clean, deduplicate, and standardise seed content."""

    def normalize(self, seeds: List[Seed]) -> pd.DataFrame:
        """Return a clean DataFrame with columns: url, title, body."""
        records = [{"url": s.url, "title": s.title, "body": s.body} for s in seeds]
        df = pd.DataFrame(records)

        # Clean text fields
        df["title"] = df["title"].apply(self._clean_text)
        df["body"] = df["body"].apply(self._clean_text)

        # Drop rows with empty body
        df = df[df["body"].str.strip().astype(bool)].copy()

        # Deduplicate on body content
        df = df.drop_duplicates(subset="body").reset_index(drop=True)

        logger.info("Normalized DataFrame: %d rows after cleaning.", len(df))
        return df

    @staticmethod
    def _clean_text(text: str) -> str:
        if not isinstance(text, str):
            return ""
        # Remove HTML tags (fallback)
        text = re.sub(r"<[^>]+>", " ", text)
        # Collapse whitespace
        text = re.sub(r"\s+", " ", text)
        return text.strip().lower()
