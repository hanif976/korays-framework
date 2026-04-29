"""Step 1 — Seed Collection.

Fetches content from a list of URLs and returns a list of Seed objects.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_DEFAULT_TIMEOUT = 10
_DEFAULT_HEADERS = {
    "User-Agent": "KoraysFramework/0.1 (+https://github.com/hanif976/korays-framework)"
}


@dataclass
class Seed:
    url: str
    title: str = ""
    body: str = ""
    metadata: dict = field(default_factory=dict)


class SeedCollector:
    """Collect seed content from a list of URLs."""

    def __init__(
        self,
        timeout: int = _DEFAULT_TIMEOUT,
        headers: dict | None = None,
    ) -> None:
        self.timeout = timeout
        self.headers = headers or _DEFAULT_HEADERS

    def collect(self, urls: List[str]) -> List[Seed]:
        """Fetch each URL and return a list of Seed objects."""
        seeds: List[Seed] = []
        for url in urls:
            seed = self._fetch(url)
            if seed is not None:
                seeds.append(seed)
        logger.info("Collected %d seeds from %d URLs.", len(seeds), len(urls))
        return seeds

    def _fetch(self, url: str) -> Seed | None:
        try:
            response = requests.get(url, timeout=self.timeout, headers=self.headers)
            response.raise_for_status()
        except requests.RequestException as exc:
            logger.warning("Failed to fetch %s: %s", url, exc)
            return None

        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        paragraphs = [p.get_text(separator=" ", strip=True) for p in soup.find_all("p")]
        body = " ".join(paragraphs)
        return Seed(url=url, title=title, body=body)
