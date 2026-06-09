#!/usr/bin/env python3
"""
Build a Context Graph reuse map for enterprise-ui-architect.

Scans a project for reusable components, hooks, theme tokens, and services,
then writes design-system/CONTEXT_GRAPH.md.

Usage:
  python context-graph.py
  python context-graph.py --root ./src --out design-system/CONTEXT_GRAPH.md
  python context-graph.py --root . --format markdown
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

COMPONENT_DIRS = (
    "components",
    "features",
    "ui",
    "ui-custom",
    "layouts",
    "shared",
)

HOOK_DIRS = ("hooks", "store", "stores")

THEME_FILES = (
    "theme",
    "themes",
    "@core/theme",
)

SERVICE_DIRS = ("services", "api", "lib/services")

COMPONENT_EXTENSIONS = {".tsx", ".jsx", ".vue", ".svelte"}
HOOK_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}

EXPORT_RE = re.compile(
    r"export\s+(?:default\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)"
)
HOOK_RE = re.compile(r"export\s+(?:function|const)\s+(use[A-Z][A-Za-z0-9_]*)")


def is_test_file(path: Path) -> bool:
    name = path.name
    return (
        ".test." in name
        or ".spec." in name
        or name.startswith("__")
        or "/__tests__/" in str(path).replace("\\", "/")
    )


def collect_files(root: Path, extensions: set[str], dir_names: tuple[str, ...]) -> list[Path]:
    found: list[Path] = []
    if not root.exists():
        return found

    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in extensions:
            continue
        if is_test_file(path):
            continue
        rel = str(path.relative_to(root)).replace("\\", "/")
        if not any(part in rel.split("/") for part in dir_names):
            continue
        found.append(path)
    return sorted(found)


def extract_exports(path: Path) -> list[str]:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return []
    names = EXPORT_RE.findall(text) + HOOK_RE.findall(text)
    if "export default" in text and not names:
        stem = path.stem
        if stem[0].isupper() or stem.startswith("use"):
            names.append(stem)
    return sorted(set(names))


def find_theme_files(project_root: Path) -> list[Path]:
    candidates: list[Path] = []
    for pattern in ("**/theme/index.ts", "**/theme.ts", "**/createTheme.ts", "**/globals.css"):
        candidates.extend(project_root.glob(pattern))
    seen: set[Path] = set()
    unique: list[Path] = []
    for path in sorted(candidates):
        if path not in seen and path.is_file():
            seen.add(path)
            unique.append(path)
    return unique[:20]


def find_package_stack(project_root: Path) -> dict[str, bool]:
    pkg_path = project_root / "package.json"
    flags = {
        "mui": False,
        "shadcn": False,
        "tanstack_table": False,
        "tanstack_query": False,
        "react_hook_form": False,
    }
    if not pkg_path.exists():
        return flags
    try:
        text = pkg_path.read_text(encoding="utf-8")
    except OSError:
        return flags
    flags["mui"] = "@mui/material" in text
    flags["shadcn"] = (project_root / "components.json").exists()
    flags["tanstack_table"] = "@tanstack/react-table" in text
    flags["tanstack_query"] = "@tanstack/react-query" in text
    flags["react_hook_form"] = "react-hook-form" in text
    return flags


def build_graph(project_root: Path, scan_root: Path) -> str:
    stack = find_package_stack(project_root)
    components = collect_files(scan_root, COMPONENT_EXTENSIONS, COMPONENT_DIRS)
    hooks = collect_files(scan_root, HOOK_EXTENSIONS, HOOK_DIRS)
    services = collect_files(scan_root, HOOK_EXTENSIONS, SERVICE_DIRS)
    themes = find_theme_files(project_root)

    lines = [
        "# Context Graph",
        "",
        f"Project: `{project_root.name}`",
        f"Scan root: `{scan_root.relative_to(project_root) if scan_root != project_root else '.'}`",
        "",
        "## Stack Signals",
        "",
        f"- MUI: {'yes' if stack['mui'] else 'no'}",
        f"- shadcn (components.json): {'yes' if stack['shadcn'] else 'no'}",
        f"- TanStack Table: {'yes' if stack['tanstack_table'] else 'no'}",
        f"- TanStack Query: {'yes' if stack['tanstack_query'] else 'no'}",
        f"- react-hook-form: {'yes' if stack['react_hook_form'] else 'no'}",
        "",
        "## Reuse Map",
        "",
        "Before codegen, import from these targets instead of creating duplicates.",
        "",
    ]

    def append_section(title: str, paths: list[Path]) -> None:
        lines.append(f"### {title}")
        lines.append("")
        if not paths:
            lines.append("_None detected in scan paths._")
            lines.append("")
            return
        for path in paths[:60]:
            rel = path.relative_to(project_root)
            exports = extract_exports(path)
            export_note = f" — exports: {', '.join(exports[:5])}" if exports else ""
            lines.append(f"- `{rel}`{export_note}")
        if len(paths) > 60:
            lines.append(f"- _…and {len(paths) - 60} more_")
        lines.append("")

    append_section("Components", components)
    append_section("Hooks / Stores", hooks)
    append_section("Services / API", services)

    lines.append("### Theme / Tokens")
    lines.append("")
    if themes:
        for path in themes:
            lines.append(f"- `{path.relative_to(project_root)}`")
    else:
        lines.append("_No theme files detected._")
    lines.append("")

    lines.extend(
        [
            "## Agent Checklist",
            "",
            "- [ ] Map skill names to repo names (e.g. PageLayout → PageScaffold)",
            "- [ ] Pick one table pattern; extend existing DataTable if present",
            "- [ ] List explicit imports in plan before Phase 5",
            "- [ ] Run `enterprise-ui verify-loop` before marking complete",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate Context Graph reuse map.")
    parser.add_argument("--root", default=".", help="Project root (default: cwd)")
    parser.add_argument("--scan", default="src", help="Directory to scan (default: src)")
    parser.add_argument(
        "--out",
        default="design-system/CONTEXT_GRAPH.md",
        help="Output markdown path relative to project root",
    )
    parser.add_argument("--format", choices=["markdown"], default="markdown")
    args = parser.parse_args()

    project_root = Path(args.root).resolve()
    scan_root = (project_root / args.scan).resolve()
    if not scan_root.exists():
        scan_root = project_root

    content = build_graph(project_root, scan_root)
    out_path = project_root / args.out
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(content, encoding="utf-8")
    print(f"Context graph written to: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
