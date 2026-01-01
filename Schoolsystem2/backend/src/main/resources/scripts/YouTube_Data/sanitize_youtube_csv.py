#!/usr/bin/env python
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


PATTERNS = [
    (re.compile(r"AWSAccessKeyId=[A-Z0-9]{20}"), "AWSAccessKeyId=REDACTED"),
    (re.compile(r"Signature=[A-Za-z0-9%+=/_-]+"), "Signature=REDACTED"),
]


def sanitize_text(text: str) -> tuple[str, dict[str, int]]:
    counts: dict[str, int] = {}
    for pattern, replacement in PATTERNS:
        text, count = pattern.subn(replacement, text)
        counts[pattern.pattern] = count
    return text, counts


def sanitize_file(input_path: Path, output_path: Path) -> int:
    if not input_path.exists():
        print(f"ERROR: missing input file: {input_path}", file=sys.stderr)
        return 1

    original = input_path.read_text(encoding="utf-8")
    counts: dict[str, int] = {pattern.pattern: 0 for pattern, _ in PATTERNS}
    sanitized_lines = []
    for line in original.splitlines(keepends=True):
        sanitized_line, line_counts = sanitize_text(line)
        for pattern, count in line_counts.items():
            counts[pattern] = counts.get(pattern, 0) + count
        sanitized_lines.append(sanitized_line)
    sanitized = "".join(sanitized_lines)

    for pattern, count in counts.items():
        print(f"replaced {count} occurrence(s) for: {pattern}")

    if sanitized != original:
        output_path.write_text(sanitized, encoding="utf-8")
        print(f"Wrote sanitized file: {output_path}")
    else:
        print("No changes detected.")
    return 0


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]
    youtube_csv_dir = resources_dir / "csv" / "youtube"

    parser = argparse.ArgumentParser(
        description="Sanitize YouTube CSV files by redacting known secret-like params."
    )
    parser.add_argument(
        "--input",
        default=str(youtube_csv_dir / "videos.csv"),
        help="Input CSV file (default: youtube/videos.csv)",
    )
    parser.add_argument(
        "--output",
        default="",
        help="Output file (default: overwrite input)",
    )

    args = parser.parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else input_path
    return sanitize_file(input_path, output_path)


if __name__ == "__main__":
    raise SystemExit(main())
