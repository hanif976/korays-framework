"""Smoke tests for the Koray-Style Topical Authority Stack.

These tests use only in-memory / synthetic data so they run without
network access or heavy ML infrastructure.
"""
from __future__ import annotations

import os
import tempfile
import unittest

import pandas as pd

from korays.seed_collector import Seed, SeedCollector
from korays.normalizer import Normalizer
from korays.clusterer import Clusterer
from korays.hierarchy_builder import HierarchyBuilder
from korays.brief_generator import BriefGenerator
from korays.scorer import Scorer
from korays.internal_linker import InternalLinker
from korays.exporter import Exporter


def _make_seeds(n: int = 10) -> list[Seed]:
    topics = [
        "machine learning and artificial intelligence",
        "deep learning neural networks",
        "natural language processing text mining",
        "computer vision image recognition",
        "reinforcement learning reward policy",
    ]
    seeds = []
    for i in range(n):
        topic = topics[i % len(topics)]
        body = (topic + " ") * 40  # ~200-word-ish body
        seeds.append(Seed(url=f"https://example.com/{i}", title=topic, body=body))
    return seeds


class TestNormalizer(unittest.TestCase):
    def test_removes_duplicates(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        # Duplicate bodies are removed: 10 seeds → 5 unique bodies
        self.assertLessEqual(len(df), 10)
        self.assertIn("body", df.columns)

    def test_lowercases_text(self):
        seeds = [Seed(url="http://x.com", title="UPPER", body="SOME BODY TEXT")]
        df = Normalizer().normalize(seeds)
        self.assertEqual(df.iloc[0]["body"], "some body text")


class TestClusterer(unittest.TestCase):
    def test_cluster_column_added(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        df = Clusterer(n_clusters=3).fit_predict(df)
        self.assertIn("cluster", df.columns)
        self.assertTrue(df["cluster"].between(0, 2).all())

    def test_cluster_terms_keys(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        clusterer.fit_predict(df)
        terms = clusterer.cluster_terms
        self.assertEqual(set(terms.keys()), {0, 1, 2})


class TestHierarchyBuilder(unittest.TestCase):
    def test_graph_has_root(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        graph = HierarchyBuilder().build(df, clusterer.cluster_terms)
        self.assertIn("root", graph.nodes)

    def test_to_json(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        hb = HierarchyBuilder()
        hb.build(df, clusterer.cluster_terms)
        with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as tmp:
            path = tmp.name
        try:
            hb.to_json(path)
            self.assertTrue(os.path.getsize(path) > 0)
        finally:
            os.unlink(path)


class TestBriefGenerator(unittest.TestCase):
    def test_generates_one_brief_per_cluster(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        briefs = BriefGenerator().generate(df, clusterer.cluster_terms)
        self.assertEqual(len(briefs), len(df["cluster"].unique()))

    def test_brief_word_count_capped(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        briefs = BriefGenerator().generate(df, clusterer.cluster_terms)
        for b in briefs:
            self.assertLessEqual(b.word_count, 210)  # small tolerance


class TestScorer(unittest.TestCase):
    def test_score_in_range(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        briefs = BriefGenerator().generate(df, clusterer.cluster_terms)
        scored = Scorer().score_all(briefs)
        for sb in scored:
            self.assertGreaterEqual(sb.score, 1.0)
            self.assertLessEqual(sb.score, 10.0)


class TestInternalLinker(unittest.TestCase):
    def test_returns_linked_briefs(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        briefs = BriefGenerator().generate(df, clusterer.cluster_terms)
        scored = Scorer().score_all(briefs)
        linked = InternalLinker().link(scored)
        self.assertEqual(len(linked), len(scored))
        for lb in linked:
            self.assertIsInstance(lb.body, str)


class TestExporter(unittest.TestCase):
    def test_markdown_files_created(self):
        seeds = _make_seeds(10)
        df = Normalizer().normalize(seeds)
        clusterer = Clusterer(n_clusters=3)
        df = clusterer.fit_predict(df)
        briefs = BriefGenerator().generate(df, clusterer.cluster_terms)
        scored = Scorer().score_all(briefs)
        linked = InternalLinker().link(scored)
        with tempfile.TemporaryDirectory() as tmpdir:
            paths = Exporter(output_dir=tmpdir).export(linked, to_pdf=False)
            self.assertEqual(len(paths), len(linked))
            for path in paths:
                self.assertTrue(os.path.exists(path))
                self.assertTrue(path.endswith(".md"))


if __name__ == "__main__":
    unittest.main()
