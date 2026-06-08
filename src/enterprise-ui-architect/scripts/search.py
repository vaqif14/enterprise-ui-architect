#!/usr/bin/env python3
"""
Search utility for Enterprise UI Architect skill data.
No external dependencies. Pure Python 3.

Usage:
  python search.py --query "table loading" --domain component-standards -n 5
  python search.py --query "form modal" --domain anti-patterns -n 3
  python search.py --query "spacing token" --domain tokens
  python search.py --query "fintech" --domain industries
  python search.py --query "bento grid" --domain styles
  python search.py --query "fintech" --design-system -p "MyBank"
  python search.py --query "saas" --design-system -f markdown --persist -p "MyApp"
"""

import argparse
import csv
import os
import sys
from pathlib import Path

DOMAINS = {
    "page-patterns": "page-patterns.csv",
    "component-standards": "component-standards.csv",
    "review-rubric": "review-rubric.csv",
    "anti-patterns": "anti-patterns.csv",
    "tokens": "tokens.csv",
    "accessibility": "accessibility-checks.csv",
    "industries": "industries.csv",
    "styles": "styles.csv",
    "color-palettes": "color-palettes.csv",
    "typography": "typography.csv",
    "charts": "charts.csv",
    "pre-delivery-checklist": "pre-delivery-checklist.csv",
    "api-integration": "api-integration-patterns.csv",
    "data-strategies": "data-source-strategies.csv",
    "frontend-loop": "frontend-loop.csv",
}


def find_data_dir() -> Path:
    """Locate the data directory relative to this script."""
    script_dir = Path(__file__).resolve().parent
    candidates = [
        script_dir.parent / "data",
        script_dir.parent / "assets" / "data",
        Path.cwd() / "src" / "enterprise-ui-architect" / "data",
        Path.cwd() / "data",
    ]
    for c in candidates:
        if c.exists():
            return c
    return candidates[0]


def bm25_score(row: dict, query_terms: list[str], avgdl: float, k1: float = 1.5, b: float = 0.75) -> float:
    """Simple BM25-inspired scoring across all row values."""
    text = " ".join(str(v).lower() for v in row.values() if v is not None)
    doc_len = len(text.split())
    score = 0.0
    for term in query_terms:
        tf = text.count(term.lower())
        if tf == 0:
            continue
        # IDF approximation: log(1 + N/n) where N=total docs, n=docs with term
        # For simplicity, use a fixed reasonable IDF
        idf = 1.0
        tf_component = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc_len / max(avgdl, 1))))
        score += idf * tf_component
    return score


def search_csv(data_dir: Path, domain: str, query: str, max_results: int = 10) -> str:
    filename = DOMAINS.get(domain)
    if not filename:
        available = ", ".join(DOMAINS.keys())
        return f"Error: Unknown domain '{domain}'. Available: {available}"

    filepath = data_dir / filename
    if not filepath.exists():
        return f"Error: File not found: {filepath}"

    query_terms = query.split()
    results = []
    total_docs = 0

    # First pass: count total docs and average doc length
    with open(filepath, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        docs = list(reader)
        total_docs = len(docs)
        total_len = sum(len(" ".join(str(v) for v in r.values() if v is not None).split()) for r in docs)
        avgdl = total_len / max(total_docs, 1)

    # Second pass: score
    for row in docs:
        s = bm25_score(row, query_terms, avgdl)
        if s > 0:
            results.append((s, row))

    results.sort(key=lambda x: x[0], reverse=True)
    results = results[:max_results]

    if not results:
        return f"No results for query '{query}' in {domain}."

    lines = [f"# Results: {domain}", f"Query: `{query}` | Matches: {len(results)}\n"]
    for idx, (score, row) in enumerate(results, 1):
        lines.append(f"## {idx}. Score: {score:.2f}")
        for key, value in row.items():
            lines.append(f"- **{key}**: {value}")
        lines.append("")

    return "\n".join(lines)


def generate_design_system(data_dir: Path, query: str, product_name: str = "Your Product", output_format: str = "ascii") -> str:
    """Generate a complete design system based on industry query."""
    industries_result = search_csv(data_dir, "industries", query, max_results=3)
    styles_result = search_csv(data_dir, "styles", query, max_results=3)
    palettes_result = search_csv(data_dir, "color-palettes", query, max_results=3)
    typography_result = search_csv(data_dir, "typography", query, max_results=3)

    if output_format == "markdown":
        lines = [
            f"# Design System: {product_name}",
            "",
            f"Generated for query: `{query}`",
            "",
            "---",
            "",
            "## Industry Match",
            industries_result,
            "",
            "## Recommended Styles",
            styles_result,
            "",
            "## Color Palette",
            palettes_result,
            "",
            "## Typography",
            typography_result,
            "",
            "---",
            "",
            "## Pre-Delivery Checklist",
            "Apply the checks from `pre-delivery-checklist.csv` for each page type you build.",
            "",
        ]
        return "\n".join(lines)

    # ASCII format
    lines = [
        "+----------------------------------------------------------------------------------------+",
        f"|  TARGET: {product_name:<78} |",
        "|  DESIGN SYSTEM (Enterprise UI Architect)                                              |",
        "+----------------------------------------------------------------------------------------+",
        "",
        f"  Industry Query: {query}",
        "",
        "  INDUSTRY MATCH:",
        industries_result,
        "",
        "  STYLES:",
        styles_result,
        "",
        "  COLORS:",
        palettes_result,
        "",
        "  TYPOGRAPHY:",
        typography_result,
        "",
        "  PRE-DELIVERY: Apply checks from pre-delivery-checklist.csv",
        "",
        "+----------------------------------------------------------------------------------------+",
    ]
    return "\n".join(lines)


def persist_design_system(output: str, product_name: str) -> None:
    """Save design system to design-system/MASTER.md for hierarchical retrieval."""
    ds_dir = Path.cwd() / "design-system"
    ds_dir.mkdir(exist_ok=True)
    master_path = ds_dir / "MASTER.md"
    with open(master_path, "w", encoding="utf-8") as f:
        f.write(output)
    print(f"Design system persisted to: {master_path}")


def main():
    parser = argparse.ArgumentParser(
        description="Search Enterprise UI Architect skill data CSVs."
    )
    parser.add_argument("--query", "-q", required=True, help="Search query (space-separated keywords).")
    parser.add_argument(
        "--domain", "-d", default="page-patterns",
        help="Domain to search. Use 'all' to search across all domains."
    )
    parser.add_argument(
        "-n", type=int, default=10, help="Max results to return (default: 10)."
    )
    parser.add_argument(
        "--design-system", action="store_true",
        help="Generate a complete design system for the query."
    )
    parser.add_argument(
        "--product", "-p", default="Your Product",
        help="Product name for design system output."
    )
    parser.add_argument(
        "--format", "-f", default="ascii", choices=["ascii", "markdown"],
        help="Design system output format."
    )
    parser.add_argument(
        "--persist", action="store_true",
        help="Save design system to design-system/MASTER.md."
    )
    args = parser.parse_args()

    data_dir = find_data_dir()

    if args.design_system:
        output = generate_design_system(data_dir, args.query, args.product, args.format)
        print(output)
        if args.persist:
            persist_design_system(output, args.product)
        return

    if args.domain == "all":
        for domain in DOMAINS:
            print(f"\n{'='*60}")
            print(f"Domain: {domain}")
            print(f"{'='*60}")
            print(search_csv(data_dir, domain, args.query, args.n))
        return

    output = search_csv(data_dir, args.domain, args.query, args.n)
    print(output)


if __name__ == "__main__":
    main()
