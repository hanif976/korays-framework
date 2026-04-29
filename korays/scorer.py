"""Step 6 — Scoring.

Scores each Brief on a 1-10 scale based on keyword density,
length compliance, and textual uniqueness.
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass
from typing import List

from korays.brief_generator import Brief

logger = logging.getLogger(__name__)

_IDEAL_MIN = 150
_IDEAL_MAX = 200


@dataclass
class ScoredBrief:
    brief: Brief
    score: float
    breakdown: dict[str, float]


class Scorer:
    """Score briefs on a 1-10 quality scale."""

    def score_all(self, briefs: List[Brief]) -> List[ScoredBrief]:
        scored = [self._score_one(b) for b in briefs]
        for sb in scored:
            logger.info(
                "Cluster %d — score %.2f %s",
                sb.brief.cluster_id,
                sb.score,
                sb.breakdown,
            )
        return scored

    def _score_one(self, brief: Brief) -> ScoredBrief:
        length_score = self._length_score(brief.word_count)
        density_score = self._keyword_density_score(brief.body, brief.title)
        uniqueness_score = self._uniqueness_score(brief.body)

        raw = (length_score * 0.4) + (density_score * 0.4) + (uniqueness_score * 0.2)
        final = round(max(1.0, min(10.0, raw)), 2)
        return ScoredBrief(
            brief=brief,
            score=final,
            breakdown={
                "length": round(length_score, 2),
                "density": round(density_score, 2),
                "uniqueness": round(uniqueness_score, 2),
            },
        )

    @staticmethod
    def _length_score(word_count: int) -> float:
        if _IDEAL_MIN <= word_count <= _IDEAL_MAX:
            return 10.0
        if word_count < _IDEAL_MIN:
            return max(1.0, 10.0 * (word_count / _IDEAL_MIN))
        # Over the maximum: penalise proportionally
        over = word_count - _IDEAL_MAX
        penalty = math.log1p(over) * 0.5
        return max(1.0, 10.0 - penalty)

    @staticmethod
    def _keyword_density_score(body: str, title: str) -> float:
        if not body or not title:
            return 5.0
        keywords = [kw.strip() for kw in title.lower().split("/") if kw.strip()]
        words = body.lower().split()
        if not words:
            return 1.0
        hits = sum(words.count(kw) for kw in keywords)
        density = hits / len(words)
        # Ideal density ~1-3 %
        if 0.01 <= density <= 0.03:
            return 10.0
        if density < 0.01:
            return max(1.0, density / 0.01 * 10.0)
        # Over-optimised
        return max(1.0, 10.0 - (density - 0.03) * 100)

    @staticmethod
    def _uniqueness_score(body: str) -> float:
        words = body.lower().split()
        if not words:
            return 1.0
        unique_ratio = len(set(words)) / len(words)
        return round(unique_ratio * 10.0, 2)
