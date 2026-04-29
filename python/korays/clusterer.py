"""Step 3 — Clustering.

Vectorises normalised text with TF-IDF and groups it into topic clusters.
"""
from __future__ import annotations

import logging

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize

logger = logging.getLogger(__name__)

_DEFAULT_N_CLUSTERS = 5
_DEFAULT_RANDOM_STATE = 42


class Clusterer:
    """Cluster normalised seed content into topic groups."""

    def __init__(
        self,
        n_clusters: int = _DEFAULT_N_CLUSTERS,
        random_state: int = _DEFAULT_RANDOM_STATE,
    ) -> None:
        self.n_clusters = n_clusters
        self.random_state = random_state
        self._vectorizer = TfidfVectorizer(max_features=5000, stop_words="english")
        self._model: KMeans | None = None

    def fit_predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add a 'cluster' column to *df* and return it."""
        if df.empty:
            df["cluster"] = pd.Series(dtype=int)
            return df

        n_clusters = min(self.n_clusters, len(df))
        matrix = self._vectorizer.fit_transform(df["body"])
        matrix = normalize(matrix)

        self._model = KMeans(
            n_clusters=n_clusters,
            random_state=self.random_state,
            n_init="auto",
        )
        labels = self._model.fit_predict(matrix)
        df = df.copy()
        df["cluster"] = labels

        logger.info(
            "Clustering complete: %d documents → %d clusters.", len(df), n_clusters
        )
        return df

    @property
    def cluster_terms(self) -> dict[int, list[str]]:
        """Return top-10 terms per cluster (available after fit_predict)."""
        if self._model is None:
            return {}
        terms = self._vectorizer.get_feature_names_out()
        result: dict[int, list[str]] = {}
        for idx, center in enumerate(self._model.cluster_centers_):
            top_indices = center.argsort()[::-1][:10]
            result[idx] = [terms[i] for i in top_indices]
        return result
