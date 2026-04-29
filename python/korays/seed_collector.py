"""Step 1 — Seed Collection.

Fetches content from a list of URLs and returns a list of Seed objects.
"""
from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import List

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_DEFAULT_TIMEOUT = 10
_DEFAULT_HEADERS = {
    "User-Agent": "KoraysFramework/0.1 (+https://github.com/hanif976/korays-framework)"
}
_MAX_WORKERS = 8


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
        max_workers: int = _MAX_WORKERS,
    ) -> None:
        self.timeout = timeout
        self.headers = headers or _DEFAULT_HEADERS
        self.max_workers = max_workers

    def collect(self, urls: List[str]) -> List[Seed]:
        """Fetch each URL in parallel and return a list of Seed objects."""
        if not urls:
            return []
        seeds: List[Seed] = []
        with ThreadPoolExecutor(max_workers=min(self.max_workers, len(urls))) as executor:
            future_to_url = {executor.submit(self._fetch, url): url for url in urls}
            for future in as_completed(future_to_url):
                seed = future.result()
                if seed is not None:
                    seeds.append(seed)
        # Restore original URL order for deterministic output
        url_order = {url: idx for idx, url in enumerate(urls)}
        seeds.sort(key=lambda s: url_order.get(s.url, 0))
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

        # Extract meta description if present
        meta_desc = ""
        meta_tag = soup.find("meta", attrs={"name": "description"})
        if meta_tag and meta_tag.get("content"):
            meta_desc = meta_tag["content"].strip()

        return Seed(
            url=url,
            title=title,
            body=body,
            metadata={"description": meta_desc} if meta_desc else {},
        )
