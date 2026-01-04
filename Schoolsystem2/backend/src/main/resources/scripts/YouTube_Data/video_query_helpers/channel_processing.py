from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

from .csv_io import read_csv_rows, write_csv_rows, write_local_rows
from .http_utils import api_get
from .playlist_processing import process_playlists_for_channel
from .normalize import normalize_handle, normalize_identifier
from .summary import (
    format_change_summary_colored,
    has_changes,
    record_change,
    record_total,
)
from .utils import chunked, parse_int


def fetch_upload_video_ids(
    api_key: str,
    uploads_playlist_id: str,
    known_ids: set[str],
    max_pages: int,
    stop_on_known: bool,
) -> list[str]:
    collected = []
    page_token = None
    pages = 0
    while True:
        params = {
            "part": "snippet",
            "playlistId": uploads_playlist_id,
            "maxResults": 50,
            "key": api_key,
        }
        if page_token:
            params["pageToken"] = page_token
        data = api_get("playlistItems", params)
        items = data.get("items", [])
        batch = []
        for item in items:
            vid = item.get("snippet", {}).get("resourceId", {}).get("videoId", "")
            if vid:
                batch.append(vid)
        collected.extend(batch)

        if stop_on_known and batch and batch[-1] in known_ids:
            break
        page_token = data.get("nextPageToken")
        pages += 1
        if not page_token:
            break
        if max_pages and pages >= max_pages:
            break
    return collected


def process_channels(
    api_key: str,
    channel_source_rows: list[dict],
    start_index: int,
    args,
    include_localizations: bool,
    youtube_csv_dir: Path,
    existing_channels_by_id: dict[str, dict],
    existing_channels_by_handle: dict[str, dict],
    existing_videos_by_channel: dict[str, list[dict]],
    existing_videos_by_id: dict[str, dict],
    existing_playlists_by_id: dict[str, dict],
    existing_playlist_items: list[dict],
    course_blocks: dict[str, list[str]],
    channels_local_by_key: dict[tuple[str, str], dict],
    videos_local_by_key: dict[tuple[str, str], dict],
    playlists_local_by_key: dict[tuple[str, str], dict],
    channel_order: dict[str, int],

    color_enabled: bool,
    csv_headers: dict[str, str],
) -> tuple[
    dict[str, dict],
    dict[str, list[dict]],
    dict[str, dict],
    list[dict],
    dict[tuple[str, str], dict],
    dict[tuple[str, str], dict],
    dict[tuple[str, str], dict],
    dict[str, int],
]:
    processed_channels = 0
    today = dt.date.today().isoformat()

    def sort_channel_rows(rows: list[dict]) -> list[dict]:
        return sorted(rows, key=lambda item: channel_order.get(item.get("channel_id", ""), 9999))

    for row in channel_source_rows[start_index:]:
        if args.channel_limit and processed_channels >= args.channel_limit:
            break

        channel_id = row.get("channel_id", "")
        handle = normalize_handle(row.get("custom_url", ""))
        changes: dict[str, int] = {}
        totals: dict[str, int] = {}

        if not channel_id and handle:
            data = api_get("channels", {"part": "snippet", "forHandle": handle, "key": api_key})
            items = data.get("items", [])
            if items:
                channel_id = items[0].get("id", "")

        if not channel_id:
            print(f"SKIP: could not resolve channel_id for {row}", file=sys.stderr)
            continue
        if channel_id and channel_id not in channel_order:
            channel_order[channel_id] = row["__index"]


        exists = channel_id in existing_channels_by_id or normalize_identifier(handle) in existing_channels_by_handle
        if args.mode in ("discover", "new") and exists:
            continue

        if not exists:
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": row.get("title", ""),
                "description": "",
                "custom_url": row.get("custom_url", ""),
                "published_at": "",
                "default_language": "",
                "country": "",
                "uploads_playlist_id": "",
                "last_updated": "",
            }
            if row.get("custom_url"):
                existing_channels_by_handle[normalize_identifier(row.get("custom_url", ""))] = existing_channels_by_id[channel_id]
            write_csv_rows(
                youtube_csv_dir / "channels.csv",
                csv_headers["channels.csv"].split(","),
                sort_channel_rows(list(existing_channels_by_id.values())),
            )
            record_change(changes, "channels_added", 1)

        uploads_id = existing_channels_by_id.get(channel_id, {}).get("uploads_playlist_id", "")
        channel_item = None
        if not uploads_id:
            channel_parts = "snippet,contentDetails"
            if include_localizations:
                channel_parts = f"{channel_parts},localizations"
            channels_resp = api_get(
                "channels",
                {"part": channel_parts, "id": channel_id, "key": api_key},
            )
            if args.print_json:
                print(json.dumps({"channels": channels_resp}, indent=2))
            items = channels_resp.get("items", [])
            if items:
                channel_item = items[0]

        if channel_item:
            snippet = channel_item.get("snippet", {})
            uploads_id = channel_item.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads", "")
            prior = existing_channels_by_id.get(channel_id, {}).copy()
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
            existing_channels_by_handle[normalize_identifier(snippet.get("customUrl", ""))] = existing_channels_by_id[channel_id]
            if prior:
                changed = any(
                    existing_channels_by_id[channel_id].get(field, "") != prior.get(field, "")
                    for field in (
                        "title",
                        "description",
                        "custom_url",
                        "published_at",
                        "default_language",
                        "country",
                        "uploads_playlist_id",
                    )
                )
                if changed:
                    record_change(changes, "channels_updated", 1)
            if include_localizations:
                for lang, localized in channel_item.get("localizations", {}).items():
                    existing_local = channels_local_by_key.get((channel_id, lang), {})
                    channels_local_by_key[(channel_id, lang)] = {
                        "channel_id": channel_id,
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }
                    if (
                        existing_local.get("title") != localized.get("title", "")
                        or existing_local.get("description") != localized.get("description", "")
                    ):
                        record_change(changes, "channels_local_updated", 1)

        if not uploads_id:
            print(f"SKIP: no uploads playlist for channel {channel_id}", file=sys.stderr)
            continue

        channel_block = existing_videos_by_channel.get(channel_id, [])
        channel_block.sort(key=lambda item: item.get("published_at", ""))
        known_ids = {row.get("video_id", "") for row in channel_block if row.get("video_id")}
        stop_on_known = bool(known_ids)
        collected_ids = fetch_upload_video_ids(
            api_key,
            uploads_id,
            known_ids,
            args.video_page_limit,
            stop_on_known=stop_on_known,
        )
        if not collected_ids:
            print(f"WARNING: no uploads collected for {channel_id}", file=sys.stderr)
            continue

        fetched_ids = [vid for vid in collected_ids if vid]
        fetched_set = set(fetched_ids)

        video_rows = []
        for chunk in chunked(fetched_ids, 50):
            if not chunk:
                continue
            video_parts = "snippet,contentDetails,statistics"
            if include_localizations:
                video_parts = f"{video_parts},localizations"
            videos_resp = api_get(
                "videos",
                {"part": video_parts, "id": ",".join(chunk), "key": api_key},
            )
            if args.print_json:
                print(json.dumps({"videos": videos_resp}, indent=2))
            for item in videos_resp.get("items", []):
                snippet = item.get("snippet", {})
                stats = item.get("statistics", {})
                content = item.get("contentDetails", {})
                tags = snippet.get("tags", [])
                row_data = {
                    "video_id": item.get("id", ""),
                    "channel_id": snippet.get("channelId", ""),
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
                video_rows.append(row_data)
                if include_localizations:
                    existing_keys = [key for key in videos_local_by_key.keys() if key[0] == row_data["video_id"]]
                    existing_by_lang = {key[1]: videos_local_by_key[key] for key in existing_keys}
                    new_langs: set[str] = set()
                    localizations = item.get("localizations", {})
                    record_total(totals, "videos_local_updated", len(localizations))
                    for lang, localized in localizations.items():
                        new_langs.add(lang)
                        existing_local = existing_by_lang.get(lang, {})
                        videos_local_by_key[(row_data["video_id"], lang)] = {
                            "video_id": row_data["video_id"],
                            "language_code": lang,
                            "title": localized.get("title", ""),
                        }
                        if existing_local.get("title") != localized.get("title", ""):
                            record_change(changes, "videos_local_updated", 1)
                    for key in existing_keys:
                        if key[1] not in new_langs:
                            videos_local_by_key.pop(key, None)

        video_rows.sort(key=lambda item: item.get("published_at", ""))

        oldest_known = ""
        for vid in reversed(fetched_ids):
            if vid in known_ids:
                oldest_known = vid
                break

        start_pos = 0
        if oldest_known:
            for idx, item in enumerate(channel_block):
                if item.get("video_id") == oldest_known:
                    start_pos = idx
                    break

        old_segment = channel_block[start_pos:]
        missing = [row.get("video_id", "") for row in old_segment if row.get("video_id") not in fetched_set]
        if missing:
            print(f"WARNING: missing existing videos in fetched batch for {channel_id}: {missing}", file=sys.stderr)
            record_change(changes, "videos_missing", len(missing))

        new_block = channel_block[:start_pos] + video_rows
        existing_videos_by_channel[channel_id] = new_block
        channel_block = new_block
        existing_videos_by_id = {
            row.get("video_id", ""): row
            for rows in existing_videos_by_channel.values()
            for row in rows
            if row.get("video_id")
        }

        merged_videos = list(existing_videos_by_id.values())
        merged_videos.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )
        video_order_index = {
            row.get("video_id", ""): idx for idx, row in enumerate(merged_videos) if row.get("video_id")
        }
        write_csv_rows(youtube_csv_dir / "videos.csv", csv_headers["videos.csv"].split(","), merged_videos)
        old_ids = {row.get("video_id", "") for row in old_segment if row.get("video_id")}
        new_ids = {row.get("video_id", "") for row in video_rows if row.get("video_id")}
        record_change(changes, "videos_added", len(new_ids - old_ids))
        record_change(changes, "videos_removed", len(old_ids - new_ids))
        if new_ids != old_ids:
            record_change(changes, "videos_replaced", 1)

        (
            existing_playlists_by_id,
            existing_playlist_items,
            playlists_local_by_key,
            playlist_index,
        ) = process_playlists_for_channel(
            api_key,
            channel_id,
            handle,
            row.get("title", ""),
            include_localizations,
            args,
            youtube_csv_dir,
            course_blocks,
            playlists_local_by_key,
            existing_playlists_by_id,
            existing_playlist_items,
            channel_order,
            changes,
            totals,
            csv_headers,
        )

        if include_localizations:
            write_local_rows(
                youtube_csv_dir / "videos_local.csv",
                csv_headers["videos_local.csv"].split(","),
                videos_local_by_key,
                order_index=video_order_index,
            )
            write_local_rows(
                youtube_csv_dir / "playlists_local.csv",
                csv_headers["playlists_local.csv"].split(","),
                playlists_local_by_key,
                order_index=playlist_index,
            )

        if args.include_comments and args.comment_video_limit > 0:
            comment_rows = read_csv_rows(youtube_csv_dir / "comments.csv")
            channel_video_ids = [row.get("video_id", "") for row in channel_block if row.get("video_id")]
            for video_id in channel_video_ids[: args.comment_video_limit]:
                comments = api_get(
                    "commentThreads",
                    {
                        "part": "snippet",
                        "videoId": video_id,
                        "order": "relevance",
                        "maxResults": 100,
                        "key": api_key,
                    },
                )
                if args.print_json:
                    print(json.dumps({"commentThreads": comments}, indent=2))
                video_comment_rows = []
                for item in comments.get("items", []):
                    top = item.get("snippet", {}).get("topLevelComment", {})
                    snippet = top.get("snippet", {})
                    like_count = parse_int(snippet.get("likeCount", 0))
                    if like_count <= 9:
                        continue
                    video_comment_rows.append(
                        {
                            "video_id": video_id,
                            "comment_id": top.get("id", ""),
                            "text_original": snippet.get("textOriginal", ""),
                            "like_count": str(like_count),
                            "published_at": snippet.get("publishedAt", ""),
                            "updated_at": snippet.get("updatedAt", ""),
                        }
                    )
                video_comment_rows.sort(key=lambda row: parse_int(row["like_count"]), reverse=True)
                if video_comment_rows:
                    record_change(changes, "comments_added", len(video_comment_rows))
                comment_rows.extend(video_comment_rows)
            write_csv_rows(youtube_csv_dir / "comments.csv", csv_headers["comments.csv"].split(","), comment_rows)

        existing_channels_by_id[channel_id]["last_updated"] = today
        processed_channels += 1
        if has_changes(changes):
            summary = format_change_summary_colored(changes, totals, use_color=color_enabled)
            print(f"UPDATED channel {channel_id}: {summary}")

    return (
        existing_videos_by_id,
        existing_videos_by_channel,
        existing_playlists_by_id,
        existing_playlist_items,
        channels_local_by_key,
        videos_local_by_key,
        playlists_local_by_key,
        channel_order,
    )









