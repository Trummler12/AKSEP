import argparse
import csv
import sys
import time
from datetime import date
from pathlib import Path


REFERENCE_SAMPLES = {
    "FE-hM1kRK4Y": ["en", "hi"],
    "j0wJBEZdwLs": ["en", "fr", "hi"],
    "-j8PzkZ70Lg": [],
    "M-MgQC6z3VU": ["en", "fr", "es"],
    "_BrFKp-U8GI": [],
    "itRV2jEtV8Q": ["en", "fr"],
    "4NlrfOl0l8U": ["en", "fr", "hi", "uk"],
    "iv-5mZ_9CPY": ["en", "fr", "hi"],
}


def import_query_helpers(script_dir: Path):
    sys.path.insert(0, str(script_dir))
    import audiotrack_query as query

    return query


def main() -> int:
    parser = argparse.ArgumentParser(description="Audio-track smoke test")
    parser.add_argument("--limit-per-channel", type=int, default=0)
    parser.add_argument("--channel-id", action="append", default=[], help="Filter to channel_id (repeatable)")
    parser.add_argument("--channel-title", action="append", default=[], help="Filter to channel title (repeatable)")
    parser.add_argument("--video-id", action="append", default=[], help="Explicit video_id (repeatable)")
    parser.add_argument("--output", default="", help="Override output path for audiotracks.csv")
    parser.add_argument("--client", default="WEB", help="InnerTube client name")
    parser.add_argument("--providers", default="youtubei.js,yt-dlp,ytdl-core", help="Comma-separated provider order")
    parser.add_argument("--yt-dlp-path", default="", help="Optional path to yt-dlp executable")
    parser.add_argument("--sleep", type=float, default=1.5, help="Sleep seconds between requests")
    parser.add_argument("--cookies", default="", help="Path to a cookies.txt file for age-restricted videos")
    parser.add_argument("--newest-first", action="store_true", help="Process newest videos first")
    parser.add_argument("--reference-samples", action="store_true", help="Use built-in 3Blue1Brown sample list")
    parser.add_argument("--debug", action="store_true", help="Print debug details for each error")
    parser.add_argument("--debug-limit", type=int, default=5, help="Max debug errors to print per run")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[2]
    youtube_csv_dir = resources_dir / "csv" / "youtube"
    query = import_query_helpers(script_dir.parent)

    env_vars, env_path = query.load_dotenv_upwards(resources_dir)
    videos_csv = youtube_csv_dir / "videos.csv"
    channels_csv = youtube_csv_dir / "channels.csv"
    output_path = Path(args.output) if args.output else (script_dir / "data" / "audiotracks.csv")

    cookie_path = args.cookies or env_vars.get("YT_DLP_COOKIES_PATH", "")
    cookie_path = query.resolve_cookie_path(cookie_path, env_path) if cookie_path else ""
    yt_dlp_path = args.yt_dlp_path or env_vars.get("YT_DLP_PATH", "")

    provider_names = [name.strip() for name in args.providers.split(",") if name.strip()]
    provider_manager = query.build_provider_manager(
        provider_names,
        script_dir.parent,
        cookie_path,
        args.client,
        yt_dlp_path or None,
    )

    if args.reference_samples:
        video_rows = [{"video_id": vid, "channel_id": ""} for vid in REFERENCE_SAMPLES.keys()]
    elif args.video_id:
        video_rows = [{"video_id": vid, "channel_id": ""} for vid in args.video_id if vid]
    else:
        video_rows = query.read_csv_rows(videos_csv)
        if not video_rows:
            print("No videos found in videos.csv.", file=sys.stderr)
            return 2

        channel_ids = list(args.channel_id)
        channel_titles = [title for arg in args.channel_title for title in arg.split(",") if title.strip()]
        channel_rows = query.read_csv_rows(channels_csv)
        resolved_channel_ids = query.resolve_channel_ids(channel_rows, channel_titles, channel_ids)
        if resolved_channel_ids:
            video_rows = [row for row in video_rows if row.get("channel_id") in resolved_channel_ids]

        if not video_rows:
            print("No videos matched the selected channels.", file=sys.stderr)
            return 2

        ordered_rows = list(reversed(video_rows)) if args.newest_first else list(video_rows)
        if args.limit_per_channel and args.limit_per_channel > 0:
            filtered = []
            counts: dict[str, int] = {}
            for row in ordered_rows:
                cid = row.get("channel_id") or ""
                if not cid:
                    continue
                counts.setdefault(cid, 0)
                if counts[cid] >= args.limit_per_channel:
                    continue
                counts[cid] += 1
                filtered.append(row)
            video_rows = filtered
        else:
            video_rows = ordered_rows

    fetched_at = date.today().isoformat()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    written = 0

    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=query.DEFAULT_HEADER)
        writer.writeheader()
        for row in video_rows:
            video_id = row.get("video_id") or ""
            if not video_id:
                continue
            result = provider_manager.fetch(video_id)
            if not result.ok:
                writer.writerow(
                    {
                        "video_id": video_id,
                        "languages_all": "",
                        "languages_non_auto": "",
                        "has_auto_dub": "unknown",
                        "source": result.source,
                        "fetched_at": fetched_at,
                        "status": result.error_type or "error",
                        "error": result.error or "",
                    }
                )
                f.flush()
                written += 1
                continue

            audio = result.audio_tracks or {}
            languages_all = sorted(set(audio.get("languages_all") or []))
            languages_non_auto = sorted(set(audio.get("languages_non_auto") or [])) or languages_all
            has_auto_dub = audio.get("has_auto_dub") or "unknown"
            default_lang = (audio.get("default_audio_language") or "").strip()
            if not languages_all and default_lang:
                languages_all = [default_lang]
                languages_non_auto = [default_lang]

            writer.writerow(
                {
                    "video_id": video_id,
                    "languages_all": "|".join(languages_all),
                    "languages_non_auto": "|".join(languages_non_auto),
                    "has_auto_dub": has_auto_dub,
                    "source": result.source,
                    "fetched_at": fetched_at,
                    "status": "ok",
                    "error": "",
                }
            )
            f.flush()
            written += 1

            if args.reference_samples and video_id in REFERENCE_SAMPLES:
                expected = set(REFERENCE_SAMPLES[video_id])
                actual = set(languages_all)
                if expected and expected != actual:
                    print(f"Mismatch {video_id}: expected={sorted(expected)} actual={sorted(actual)}", file=sys.stderr)

            if args.sleep and args.sleep > 0:
                time.sleep(args.sleep)

    print(f"OK: audio tracks written to {output_path} ({written} rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
