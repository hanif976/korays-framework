"""Step 7 — Internal Linking.

Scans briefs for shared keywords and injects contextual Markdown hyperlinks
so that each brief links to every related brief where terms overlap.
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import List

from korays.scorer import ScoredBrief

logger = logging.getLogger(__name__)


@dataclass
class LinkedBrief:
    cluster_id: int
    title: str
    body: str
    score: float
    links: list[str]


class InternalLinker:
    """Add contextual hyperlinks across briefs."""

    def link(self, scored_briefs: List[ScoredBrief]) -> List[LinkedBrief]:
        """Return LinkedBrief objects with cross-references injected."""
        linked: List[LinkedBrief] = []
        for sb in scored_briefs:
            body, links = self._inject_links(sb, scored_briefs)
            linked.append(
                LinkedBrief(
                    cluster_id=sb.brief.cluster_id,
                    title=sb.brief.title,
                    body=body,
                    score=sb.score,
                    links=links,
                )
            )
        logger.info("Internal linking complete for %d briefs.", len(linked))
        return linked

    @staticmethod
    def _inject_links(
        target: ScoredBrief, all_briefs: List[ScoredBrief]
    ) -> tuple[str, list[str]]:
        body = target.brief.body
        added_links: list[str] = []

        for other in all_briefs:
            if other.brief.cluster_id == target.brief.cluster_id:
                continue
            keywords = [
                kw.strip()
                for kw in other.brief.title.lower().split("/")
                if kw.strip() and len(kw.strip()) > 3
            ]
            anchor_slug = f"cluster-{other.brief.cluster_id}"
            for kw in keywords:
                pattern = re.compile(rf"\b({re.escape(kw)})\b", re.IGNORECASE)
                if pattern.search(body):
                    # Replace only the first occurrence to avoid over-linking
                    body = pattern.sub(
                        rf"[\1](#{anchor_slug})", body, count=1
                    )
                    link_ref = f"#{anchor_slug}"
                    if link_ref not in added_links:
                        added_links.append(link_ref)
                    break

        return body, added_links
