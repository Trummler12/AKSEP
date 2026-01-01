#!/usr/bin/env python
from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path


VIDEO_ID_PATTERNS = [
    re.compile(r"youtu\.be/([^?&#/]+)"),
    re.compile(r"youtube\.com/watch\?v=([^?&#/]+)"),
    re.compile(r"youtube\.com/shorts/([^?&#/]+)"),
    re.compile(r"youtube\.com/embed/([^?&#/]+)"),
]


def extract_video_id(url: str) -> str:
    for pattern in VIDEO_ID_PATTERNS:
        match = pattern.search(url)
        if match:
            return match.group(1)
    return ""


def load_audiotracks(path: Path) -> dict[str, tuple[str, str]]:
    with path.open("r", newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            return {}
        result: dict[str, tuple[str, str]] = {}
        for row in reader:
            video_id = (row.get("video_id") or "").strip()
            if not video_id:
                continue
            result[video_id] = (
                (row.get("languages_non_auto") or "").strip(),
                (row.get("languages_all") or "").strip(),
            )
        return result


def update_sources(source_old: Path, audiotracks: Path, output: Path) -> int:
    if not source_old.exists():
        print(f"ERROR: missing source input: {source_old}", file=sys.stderr)
        return 1
    if not audiotracks.exists():
        print(f"ERROR: missing audiotracks input: {audiotracks}", file=sys.stderr)
        return 1

    audio_map = load_audiotracks(audiotracks)

    with source_old.open("r", newline="", encoding="utf-8") as source_handle:
        reader = csv.DictReader(source_handle)
        if not reader.fieldnames:
            print("ERROR: t_source_OLD.csv has no headers.", file=sys.stderr)
            return 1
        base_fields = list(reader.fieldnames)
        if "sa_resource" in base_fields:
            base_fields.remove("sa_resource")
            out_fields = base_fields + ["dubbed", "ai_dubbed", "sa_resource"]
        else:
            out_fields = base_fields + ["dubbed", "ai_dubbed"]

        with output.open("w", newline="", encoding="utf-8") as out_handle:
            writer = csv.DictWriter(out_handle, fieldnames=out_fields)
            writer.writeheader()

            for row in reader:
                source_url = (row.get("source_URL") or "").strip()
                video_id = extract_video_id(source_url)
                languages_non_auto, languages_all = audio_map.get(video_id, ("", ""))
                row["dubbed"] = languages_non_auto
                row["ai_dubbed"] = languages_all
                writer.writerow(row)
    return 0


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]
    youtube_csv_dir = resources_dir / "csv" / "youtube"

    parser = argparse.ArgumentParser(
        description=(
            "Rebuild t_source_PLANNING.csv from t_source_OLD.csv with dubbed/ai_dubbed"
        )
    )
    parser.add_argument(
        "--source-old",
        default=str(youtube_csv_dir / "t_source_OLD.csv"),
        help="Path to t_source_OLD.csv",
    )
    parser.add_argument(
        "--audiotracks",
        default=str(youtube_csv_dir / "audiotracks.csv"),
        help="Path to audiotracks.csv",
    )
    parser.add_argument(
        "--output",
        default=str(youtube_csv_dir / "t_source_PLANNING.csv"),
        help="Path to t_source_PLANNING.csv (overwritten)",
    )

    args = parser.parse_args()
    return update_sources(
        Path(args.source_old),
        Path(args.audiotracks),
        Path(args.output),
    )


if __name__ == "__main__":
    raise SystemExit(main())
