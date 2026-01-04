import argparse
import sys
from pathlib import Path

from video_query_helpers.backfill import backfill_channel_ids
from video_query_helpers.channel_processing import process_channels

from video_query_helpers.course import parse_course_blocks
from video_query_helpers.csv_io import (
    ensure_csvs,
    ensure_playlist_type_csv,
    read_channel_sources,
    read_csv_rows,
    write_csv_rows,
    write_local_rows,
)
from video_query_helpers.env_utils import get_api_key
from video_query_helpers.http_utils import api_get, set_api_base
from video_query_helpers.normalize import normalize_identifier
from video_query_helpers.prep_phase import run_prep_phase, set_prep_colors
from video_query_helpers.sanitizer import run_sanitizer
from video_query_helpers.single_video import (
    ingest_single_videos,
    prefetch_single_video_sources,
)
from video_query_helpers.summary import set_ansi_colors, use_ansi_color
from video_query_helpers.utils import chunked, find_start_index

# User-configurable defaults.
API_BASE = "https://www.googleapis.com/youtube/v3"
ANSI_RESET = "\033[0m"
ANSI_GREEN = "\033[32m"
ANSI_YELLOW = "\033[33m"
ANSI_RED = "\033[31m"
ANSI_ORANGE = "\033[38;5;208m"

CSV_HEADERS = {
    "videoCategories.csv": "category_id,title,assignable",
    "channels.csv": "channel_id,title,description,custom_url,published_at,default_language,country,uploads_playlist_id,last_updated",
    "channels_local.csv": "channel_id,language_code,title,description",
    "videos.csv": "video_id,channel_id,channel_title,title,description,published_at,category_id,tags,duration,caption_available,default_language,default_audio_language,view_count,like_count,comment_count",
    "videos_local.csv": "video_id,language_code,title",
    "playlists.csv": "playlist_id,channel_id,channel_title,title,description,published_at,item_count,default_language,playlist_type_id",
    "playlists_local.csv": "playlist_id,language_code,title,description",
    "playlistItems.csv": "playlist_item_id,playlist_id,position,video_id,video_owner_channel_id,video_owner_channel_title",
    "audiotracks.csv": "video_id,languages_all,languages_non_auto,has_auto_dub,source,fetched_at,status,error",
    "videos_transcripts.csv": "video_id,duration,language_code,is_generated,is_translatable,status,error,transcript",
    "comments.csv": "video_id,comment_id,text_original,like_count,published_at,updated_at",
}

# CLI quick reference:
# - Base: python AKSEP/Schoolsystem2/backend/src/main/resources/scripts/YouTube_Data/video_query.py
# - --mode (update|discover|new): Update all channels, or only new ones.
# - --start-from <id>: Start from a channel matching sauthorID/title/custom_url/channel_id (repeatable, comma-separated).
# - --channel-limit N: Process only N channels (0 = no limit).
# - --video-page-limit N: Limit uploads playlist pages per channel (0 = no limit).
# - --playlist-page-limit N: Limit playlist pages per channel (0 = no limit).
# - --skip-localizations: Do not fetch localizations.
# - --include-comments: Fetch comments (requires --comment-video-limit > 0).
# - --comment-video-limit N: Number of videos per channel to fetch comments for.
# - --print-json: Print raw API JSON responses.
# - --data-root PATH: Use alternate CSV root (must contain _YouTube_Channels.csv).
# - --prep-clean-source: Remove t_source rows with unknown video references.
# - --prep-only: Run prep phase only, then exit.
# - --no-color: Disable ANSI colors in output.


def main() -> int:
    parser = argparse.ArgumentParser(description="Pull YouTube channel/video/playlist data into CSVs.")
    parser.add_argument("--mode", choices=["update", "discover", "new"], default="update")
    parser.add_argument("--start-from", action="append", default=[])
    parser.add_argument("--channel-limit", type=int, default=0)
    parser.add_argument("--video-page-limit", type=int, default=0)
    parser.add_argument("--playlist-page-limit", type=int, default=0)
    parser.add_argument("--skip-localizations", action="store_true")
    parser.add_argument("--include-comments", action="store_true")
    parser.add_argument("--comment-video-limit", type=int, default=0)
    parser.add_argument("--print-json", action="store_true")
    parser.add_argument("--data-root", default="")
    parser.add_argument("--prep-clean-source", action="store_true")
    parser.add_argument("--prep-only", action="store_true")
    parser.add_argument("--no-color", action="store_true")
    args = parser.parse_args()

    set_api_base(API_BASE)
    set_ansi_colors(ANSI_RESET, ANSI_GREEN, ANSI_YELLOW, ANSI_RED, ANSI_ORANGE)
    set_prep_colors(ANSI_RED, ANSI_YELLOW, ANSI_RESET)

    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]

    if args.data_root:
        candidate = Path(args.data_root)
        if not candidate.is_absolute():
            candidate = (Path.cwd() / candidate).resolve()
        else:
            candidate = candidate.resolve()
        if not candidate.exists() or not candidate.is_dir():
            print(f"ERROR: data-root does not exist: {candidate}", file=sys.stderr)
            return 2
        channel_marker = candidate / "_YouTube_Channels.csv"
        if not channel_marker.exists():
            print(
                "ERROR: data-root missing _YouTube_Channels.csv; refuse to create CSVs in an unintended location.",
                file=sys.stderr,
            )
            return 2
        youtube_csv_dir = candidate
    else:
        youtube_csv_dir = resources_dir / "csv" / "youtube"

    channel_source_csv = youtube_csv_dir / "_YouTube_Channels.csv"
    ensure_csvs(youtube_csv_dir, CSV_HEADERS)
    ensure_playlist_type_csv(youtube_csv_dir / "playlist_type.csv")

    api_key = get_api_key(script_dir)
    color_enabled = use_ansi_color(not args.no_color)
    if not api_key:
        print("WARN: Missing YOUTUBE_DATA_API_KEY; channel_id backfill skipped.", file=sys.stderr)
    else:
        backfill_counts = backfill_channel_ids(channel_source_csv, youtube_csv_dir / "channels.csv", api_key)
        if backfill_counts["updated"] or backfill_counts["unresolved"]:
            print(
                "PREP _YouTube_Channels.csv:\t"
                f"channel_id_backfilled={backfill_counts['updated']}, "
                f"from_channels={backfill_counts['from_channels']}, "
                f"from_api={backfill_counts['from_api']}, "
                f"unresolved={backfill_counts['unresolved']}"
            )

    include_localizations = not args.skip_localizations
    single_video_rows, single_video_channel_ids, single_video_cache = prefetch_single_video_sources(
        api_key,
        youtube_csv_dir / "_YouTube_Videos.csv",
        include_localizations,
    )

    channel_source_rows = read_channel_sources(channel_source_csv)
    run_prep_phase(
        youtube_csv_dir,
        channel_source_rows,
        script_dir,
        args.prep_clean_source,
        color_enabled,
        single_video_channel_ids,
        CSV_HEADERS,
    )
    if args.prep_only:
        print("OK: prep-only run complete.")
        return 0

    if not api_key:
        print("Missing YOUTUBE_DATA_API_KEY.", file=sys.stderr)
        return 2

    start_index = find_start_index(channel_source_rows, [s for arg in args.start_from for s in arg.split(",")])

    existing_channels = read_csv_rows(youtube_csv_dir / "channels.csv")
    existing_channels_by_id = {row.get("channel_id", ""): row for row in existing_channels if row.get("channel_id")}
    existing_channels_by_handle = {
        normalize_identifier(row.get("custom_url", "")): row
        for row in existing_channels
        if row.get("custom_url")
    }

    existing_videos = read_csv_rows(youtube_csv_dir / "videos.csv")
    existing_videos_by_id = {row.get("video_id", ""): row for row in existing_videos if row.get("video_id")}
    existing_videos_by_channel: dict[str, list[dict]] = {}
    for row in existing_videos:
        channel_id = row.get("channel_id", "")
        if channel_id:
            existing_videos_by_channel.setdefault(channel_id, []).append(row)
    for rows in existing_videos_by_channel.values():
        rows.sort(key=lambda item: item.get("published_at", ""))

    existing_playlists = read_csv_rows(youtube_csv_dir / "playlists.csv")
    existing_playlists_by_id = {row.get("playlist_id", ""): row for row in existing_playlists if row.get("playlist_id")}
    existing_playlist_items = read_csv_rows(youtube_csv_dir / "playlistItems.csv")

    course_blocks = parse_course_blocks(youtube_csv_dir / "_YouTube_Courses.txt")

    channels_local_by_key = {
        (row.get("channel_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "channels_local.csv")
        if row.get("channel_id") and row.get("language_code")
    }
    videos_local_by_key = {
        (row.get("video_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "videos_local.csv")
        if row.get("video_id") and row.get("language_code")
    }
    playlists_local_by_key = {
        (row.get("playlist_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "playlists_local.csv")
        if row.get("playlist_id") and row.get("language_code")
    }

    channel_order = {row.get("channel_id", ""): row["__index"] for row in channel_source_rows if row.get("channel_id")}
    max_index = max(channel_order.values(), default=-1) + 1
    for channel_id in single_video_channel_ids:
        if channel_id and channel_id not in channel_order:
            channel_order[channel_id] = max_index
            max_index += 1
    for row in existing_channels:
        channel_id = row.get("channel_id", "")
        if channel_id and channel_id not in channel_order:
            channel_order[channel_id] = max_index
            max_index += 1

    channel_source_ids = {row.get("channel_id", "") for row in channel_source_rows if row.get("channel_id")}

    (
        existing_videos_by_id,
        existing_videos_by_channel,
        existing_playlists_by_id,
        existing_playlist_items,
        channels_local_by_key,
        videos_local_by_key,
        playlists_local_by_key,
        channel_order,
    ) = process_channels(
        api_key,
        channel_source_rows,
        start_index,
        args,
        include_localizations,
        youtube_csv_dir,
        existing_channels_by_id,
        existing_channels_by_handle,
        existing_videos_by_channel,
        existing_videos_by_id,
        existing_playlists_by_id,
        existing_playlist_items,
        course_blocks,
        channels_local_by_key,
        videos_local_by_key,
        playlists_local_by_key,
        channel_order,
        color_enabled,
        CSV_HEADERS,
    )

    if single_video_rows:
        ingest_single_videos(
            api_key,
            single_video_rows,
            include_localizations,
            single_video_cache,
            channel_source_ids,
            channel_order,
            existing_channels_by_id,
            existing_videos_by_id,
            existing_videos_by_channel,
            videos_local_by_key,
            youtube_csv_dir,
            CSV_HEADERS,
        )

    all_channel_ids = [row.get("channel_id", "") for row in existing_channels_by_id.values() if row.get("channel_id")]
    for chunk in chunked(all_channel_ids, 50):
        if not chunk:
            continue
        channel_parts = "snippet,contentDetails"
        if include_localizations:
            channel_parts = f"{channel_parts},localizations"
        channels_resp = api_get("channels", {"part": channel_parts, "id": ",".join(chunk), "key": api_key})
        if args.print_json:
            print(__import__("json").dumps({"channels": channels_resp}, indent=2))
        for item in channels_resp.get("items", []):
            snippet = item.get("snippet", {})
            uploads_id = item.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads", "")
            channel_id = item.get("id", "")
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "custom_url": snippet.get("customUrl", ""),
                "published_at": snippet.get("publishedAt", ""),
                "default_language": snippet.get("defaultLanguage", ""),
                "country": snippet.get("country", ""),
                "uploads_playlist_id": uploads_id,
                "last_updated": existing_channels_by_id.get(channel_id, {}).get("last_updated", ""),
            }
            if include_localizations:
                for lang, localized in item.get("localizations", {}).items():
                    channels_local_by_key[(channel_id, lang)] = {
                        "channel_id": channel_id,
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }

    def sort_channel_rows(rows: list[dict]) -> list[dict]:
        return sorted(rows, key=lambda item: channel_order.get(item.get("channel_id", ""), 9999))

    write_csv_rows(
        youtube_csv_dir / "channels.csv",
        CSV_HEADERS["channels.csv"].split(","),
        sort_channel_rows(list(existing_channels_by_id.values())),
    )
    if include_localizations:
        write_local_rows(
            youtube_csv_dir / "channels_local.csv",
            CSV_HEADERS["channels_local.csv"].split(","),
            channels_local_by_key,
            order_index=channel_order,
        )

    run_sanitizer(script_dir, youtube_csv_dir)

    print("OK: CSVs written to", youtube_csv_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

