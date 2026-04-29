"""Step 4 — Hierarchy Building.

Constructs a directed graph of topic relationships from cluster metadata.
"""
from __future__ import annotations

import json
import logging
from typing import Any

import networkx as nx
import pandas as pd

logger = logging.getLogger(__name__)


class HierarchyBuilder:
    """Build and serialise a topic-relationship graph."""

    def __init__(self) -> None:
        self.graph: nx.DiGraph = nx.DiGraph()

    def build(self, df: pd.DataFrame, cluster_terms: dict[int, list[str]]) -> nx.DiGraph:
        """Populate the graph from clustered DataFrame.

        A synthetic root node connects to every cluster node; clusters with
        overlapping top-terms share a directed edge (parent → child by cluster id).
        """
        self.graph.clear()
        self.graph.add_node("root", label="Root Topic")

        cluster_ids = sorted(df["cluster"].unique())
        for cid in cluster_ids:
            terms = cluster_terms.get(int(cid), [])
            label = " / ".join(terms[:3]) if terms else f"Cluster {cid}"
            self.graph.add_node(int(cid), label=label, terms=terms)
            self.graph.add_edge("root", int(cid))

        # Add edges between clusters that share at least two top terms
        for i in cluster_ids:
            for j in cluster_ids:
                if i >= j:
                    continue
                shared = set(cluster_terms.get(int(i), [])) & set(
                    cluster_terms.get(int(j), [])
                )
                if len(shared) >= 2:
                    self.graph.add_edge(int(i), int(j), shared_terms=list(shared))

        logger.info(
            "Hierarchy graph: %d nodes, %d edges.",
            self.graph.number_of_nodes(),
            self.graph.number_of_edges(),
        )
        return self.graph

    def to_dict(self) -> dict[str, Any]:
        """Serialise the graph as a JSON-compatible dict."""
        return nx.node_link_data(self.graph)

    def to_json(self, path: str) -> None:
        """Write the graph to *path* as JSON."""
        data = self.to_dict()
        with open(path, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2)
        logger.info("Graph written to %s", path)
