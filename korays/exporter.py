"""Step 8 — Export.

Writes final briefs to Markdown files and (optionally) PDF.
"""
from __future__ import annotations

import logging
import os
from typing import List

from korays.internal_linker import LinkedBrief

logger = logging.getLogger(__name__)


class Exporter:
    """Export linked briefs to Markdown and PDF."""

    def __init__(self, output_dir: str = "output") -> None:
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def export(self, briefs: List[LinkedBrief], to_pdf: bool = False) -> List[str]:
        """Write each brief to a .md file; optionally convert to PDF."""
        paths: List[str] = []
        for brief in briefs:
            md_path = self._write_markdown(brief)
            paths.append(md_path)
            if to_pdf:
                pdf_path = self._write_pdf(brief, md_path)
                paths.append(pdf_path)
        logger.info("Exported %d files to %s", len(paths), self.output_dir)
        return paths

    def _write_markdown(self, brief: LinkedBrief) -> str:
        slug = f"cluster-{brief.cluster_id}"
        filename = os.path.join(self.output_dir, f"{slug}.md")
        score_bar = "★" * round(brief.score) + "☆" * (10 - round(brief.score))
        lines = [
            f"# {brief.title} {{#{slug}}}",
            "",
            f"> **Quality Score**: {brief.score}/10 {score_bar}",
            "",
            brief.body,
            "",
        ]
        if brief.links:
            lines += ["## Related Topics", ""]
            for link in brief.links:
                lines.append(f"- [{link}]({link})")
            lines.append("")
        with open(filename, "w", encoding="utf-8") as fh:
            fh.write("\n".join(lines))
        logger.debug("Markdown written: %s", filename)
        return filename

    def _write_pdf(self, brief: LinkedBrief, md_path: str) -> str:
        try:
            from fpdf import FPDF
        except ImportError:
            logger.warning("fpdf2 not installed — skipping PDF export for %s", md_path)
            return ""

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=12)
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.multi_cell(0, 10, brief.title)
        pdf.set_font("Helvetica", size=10)
        pdf.multi_cell(0, 8, f"Quality Score: {brief.score}/10")
        pdf.ln(4)
        pdf.set_font("Helvetica", size=12)
        pdf.multi_cell(0, 8, brief.body)

        pdf_path = md_path.replace(".md", ".pdf")
        pdf.output(pdf_path)
        logger.debug("PDF written: %s", pdf_path)
        return pdf_path
