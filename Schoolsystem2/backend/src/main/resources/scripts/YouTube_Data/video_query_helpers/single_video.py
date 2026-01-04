from __future__ import annotations

from pathlib import Path

from .csv_io import read_csv_with_header, write_csv_rows
from .http_utils import api_get
from .normalize import extract_video_id_from_url
from .utils import chunked


def _video_id_from_row(row: dict) -> str:
    for key in ("videoID0", "video_id", "videoID", "videoId"):
        value = (row.get(key) or "").strip()
        if value:
            return value
    return extract_video_id_from_url(row.get("video_url", ""))


def prefetch_single_video_sources(
    api_key: str,
    video_source_path: Path,
    include_localizations: bool,
) -> tuple[list[dict], list[str], dict[str, dict]]:
    header, rows = read_csv_with_header(video_source_path)
    if not rows:
        return [], [], {}

    video_ids = []
    row_video_ids = []
    for row in rows:
        vid = _video_id_from_row(row)
        row_video_ids.append(vid)
        if vid:
            video_ids.append(vid)

    if not video_ids or not api_key:
        channel_ids = _collect_channel_ids(rows)
        return rows, channel_ids, {}

    parts = "snippet,contentDetails,statistics"
    if include_localizations:
        parts = f"{parts},localizations"

    items_by_id: dict[str, dict] = {}
    for chunk in chunked(video_ids, 50):
        if not chunk:
            continue
        videos_resp = api_get("videos", {"part": parts, "id": ",".join(chunk), "key": api_key})
        for item in videos_resp.get("items", []):
            item_id = item.get("id", "")
            if item_id:
                items_by_id[item_id] = item

    updated = False
    channel_ids = []
    seen_channels = set()
    for row, vid in zip(rows, row_video_ids):
        if not vid:
            continue
        item = items_by_id.get(vid)
        if not item:
            continue
        channel_id = item.get("snippet", {}).get("channelId", "")
        if channel_id:
            if (row.get("channel_id") or "").strip() != channel_id:
                row["channel_id"] = channel_id
                updated = True
            if channel_id not in seen_channels:
                channel_ids.append(channel_id)
                seen_channels.add(channel_id)


    if updated and header:
        write_csv_rows(video_source_path, header, rows)

    return rows, channel_ids, items_by_id


def _collect_channel_ids(rows: list[dict]) -> list[str]:
    ordered = []
    seen = set()
    for row in rows:
        channel_id = (row.get("channel_id") or "").strip()
        if channel_id and channel_id not in seen:
            ordered.append(channel_id)
            seen.add(channel_id)
    return ordered


def ingest_single_videos(
    api_key: str,
    video_source_rows: list[dict],
    include_localizations: bool,
    cached_items: dict[str, dict],
    channel_source_ids: set[str],
    channel_order: dict[str, int],
    existing_channels_by_id: dict[str, dict],
    existing_videos_by_id: dict[str, dict],
    existing_videos_by_channel: dict[str, list[dict]],
    videos_local_by_key: dict[tuple[str, str], dict],
    youtube_csv_dir: Path,
    csv_headers: dict[str, str],
) -> None:
    pending_video_ids = []
    for row in video_source_rows:
        vid = _video_id_from_row(row)
        if not vid:
            continue
        if vid in existing_videos_by_id:
            continue
        channel_id = (row.get("channel_id") or "").strip()
        if channel_id and channel_id in channel_source_ids:
            continue
        pending_video_ids.append(vid)

    if not pending_video_ids:
        return

    missing = [vid for vid in pending_video_ids if vid not in cached_items]
    if missing:
        parts = "snippet,contentDetails,statistics"
        if include_localizations:
            parts = f"{parts},localizations"
        for chunk in chunked(missing, 50):
            if not chunk:
                continue
            videos_resp = api_get("videos", {"part": parts, "id": ",".join(chunk), "key": api_key})
            for item in videos_resp.get("items", []):
                item_id = item.get("id", "")
                if item_id:
                    cached_items[item_id] = item

    new_video_rows = []
    new_video_channel_ids: set[str] = set()
    max_channel_index = max(channel_order.values(), default=-1) + 1

    for vid in pending_video_ids:
        item = cached_items.get(vid)
        if not item:
            continue
        snippet = item.get("snippet", {})
        channel_id = snippet.get("channelId", "")
        if channel_id and channel_id in channel_source_ids:
            continue
        if channel_id and channel_id not in channel_order:
            channel_order[channel_id] = max_channel_index
            max_channel_index += 1
        if channel_id:
            new_video_channel_ids.add(channel_id)

        stats = item.get("statistics", {})
        content = item.get("contentDetails", {})
        tags = snippet.get("tags", [])
        row_data = {
            "video_id": item.get("id", ""),
            "channel_id": channel_id,
            "channel_title": snippet.get("channelTitle", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "published_at": snippet.get("publishedAt", ""),
            "category_id": snippet.get("categoryId", ""),
            "tags": "|".join(tags),
            "duration": content.get("duration", ""),
            "caption_available": content.get("caption", ""),
            "default_language": snippet.get("defaultLanguage", ""),
            "default_audio_language": snippet.get("defaultAudioLanguage", ""),
            "view_count": stats.get("viewCount", ""),
            "like_count": stats.get("likeCount", ""),
            "comment_count": stats.get("commentCount", ""),
        }
        if row_data["video_id"] in existing_videos_by_id:
            continue
        new_video_rows.append(row_data)
        existing_videos_by_id[row_data["video_id"]] = row_data
        if channel_id:
            existing_videos_by_channel.setdefault(channel_id, []).append(row_data)
        if include_localizations:
            for lang, localized in item.get("localizations", {}).items():
                videos_local_by_key[(row_data["video_id"], lang)] = {
                    "video_id": row_data["video_id"],
                    "language_code": lang,
                    "title": localized.get("title", ""),
                }

    if new_video_rows:
        merged_videos = list(existing_videos_by_id.values())
        merged_videos.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )
        write_csv_rows(youtube_csv_dir / "videos.csv", csv_headers["videos.csv"].split(","), merged_videos)
        video_order_index = {
            row.get("video_id", ""): idx for idx, row in enumerate(merged_videos) if row.get("video_id")
        }
        if include_localizations:
            from .csv_io import write_local_rows

            write_local_rows(
                youtube_csv_dir / "videos_local.csv",
                csv_headers["videos_local.csv"].split(","),
                videos_local_by_key,
                order_index=video_order_index,
            )

    for channel_id in new_video_channel_ids:
        if channel_id and channel_id not in existing_channels_by_id:
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": "",
                "description": "",
                "custom_url": "",
                "published_at": "",
                "default_language": "",
                "country": "",
                "uploads_playlist_id": "",
                "last_updated": "",
            }

