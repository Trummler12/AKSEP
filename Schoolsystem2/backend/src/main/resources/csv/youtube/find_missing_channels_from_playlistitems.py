#!/usr/bin/env python3
import csv
from collections import Counter, defaultdict
from pathlib import Path


# User-configurable defaults.
MIN_PLAYLIST_ITEMS_COUNT = 2
MAX_OUTPUT_ROWS = 100


def read_channel_ids(path: Path) -> set[str]:
    if not path.exists():
        return set()
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        return {row.get("channel_id", "").strip() for row in reader if row.get("channel_id")}


def main() -> int:
    base_dir = Path(__file__).resolve().parent
    channels_path = base_dir / "channels.csv"
    playlist_items_path = base_dir / "playlistItems.csv"

    channel_ids = read_channel_ids(channels_path)
    if not playlist_items_path.exists():
        print(f"ERROR: missing playlistItems.csv at {playlist_items_path}")
        return 1

    counts: Counter[str] = Counter()
    titles: dict[str, str] = defaultdict(str)

    with playlist_items_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            channel_id = (row.get("video_owner_channel_id") or "").strip()
            if not channel_id:
                continue
            if channel_id in channel_ids:
                continue
            counts[channel_id] += 1
            title = (row.get("video_owner_channel_title") or "").strip()
            if title:
                titles[channel_id] = title

    if not counts:
        print("No missing channels found.")
        return 0

    print("missing_channel_id\tplaylist_items_count\tchannel_title")
    emitted = 0
    for channel_id, count in counts.most_common():
        if count < MIN_PLAYLIST_ITEMS_COUNT:
            continue
        if emitted >= MAX_OUTPUT_ROWS:
            break
        title = titles.get(channel_id, "")
        print(f"{channel_id}\t{count}\t{title}")
        emitted += 1
    if emitted == 0:
        print("No missing channels found within the current thresholds.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
