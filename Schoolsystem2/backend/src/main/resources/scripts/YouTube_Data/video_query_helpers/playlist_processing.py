from __future__ import annotations

import json
import sys
from pathlib import Path

from .course import matches_course_header
from .csv_io import write_csv_rows, write_local_rows
from .http_utils import api_get
from .summary import record_change, record_total
from .utils import parse_int


def process_playlists_for_channel(
    api_key: str,
    channel_id: str,
    handle: str,
    channel_title: str,
    include_localizations: bool,
    args,
    youtube_csv_dir: Path,
    course_blocks: dict[str, list[str]],
    playlists_local_by_key: dict[tuple[str, str], dict],
    existing_playlists_by_id: dict[str, dict],
    existing_playlist_items: list[dict],
    channel_order: dict[str, int],
    changes: dict[str, int],
    totals: dict[str, int],
    csv_headers: dict[str, str],
) -> tuple[dict[str, dict], list[dict], dict[tuple[str, str], dict], dict[str, int]]:
    playlists_items = []
    page_token = None
    pages = 0
    while True:
        playlist_parts = "snippet,contentDetails"
        if include_localizations:
            playlist_parts = f"{playlist_parts},localizations"
        params = {
            "part": playlist_parts,
            "channelId": channel_id,
            "maxResults": 50,
            "key": api_key,
        }
        if page_token:
            params["pageToken"] = page_token
        playlists_resp = api_get("playlists", params)
        if args.print_json:
            print(json.dumps({"playlists": playlists_resp}, indent=2))
        playlists_items.extend(playlists_resp.get("items", []))
        page_token = playlists_resp.get("nextPageToken")
        pages += 1
        if not page_token:
            break
        if args.playlist_page_limit and pages >= args.playlist_page_limit:
            break

    course_ids = []
    for header, ids in course_blocks.items():
        if matches_course_header(header, channel_title, handle):
            course_ids.extend(ids)

    course_set = set(course_ids)
    playlist_ids_in_response = {item.get("id", "") for item in playlists_items if item.get("id")}
    missing_course_ids = [pid for pid in course_set if pid and pid not in playlist_ids_in_response]
    if missing_course_ids:
        print(
            f"WARNING: course playlists missing from channel list for {channel_id}: {missing_course_ids}",
            file=sys.stderr,
        )

    changed_playlist_ids = set()
    record_total(totals, "playlists_updated", len(playlists_items))
    for item in playlists_items:
        snippet = item.get("snippet", {})
        row_data = {
            "playlist_id": item.get("id", ""),
            "channel_id": snippet.get("channelId", ""),
            "channel_title": snippet.get("channelTitle", ""),
            "title": snippet.get("title", ""),
            "description": snippet.get("description", ""),
            "published_at": snippet.get("publishedAt", ""),
            "item_count": str(item.get("contentDetails", {}).get("itemCount", "")),
            "default_language": snippet.get("defaultLanguage", ""),
            "playlist_type_id": "2" if item.get("id", "") in course_set else "1",
        }
        existing = existing_playlists_by_id.get(row_data["playlist_id"])
        local_changed = False
        if include_localizations and item.get("localizations"):
            existing_keys = [key for key in playlists_local_by_key.keys() if key[0] == row_data["playlist_id"]]
            existing_by_lang = {key[1]: playlists_local_by_key[key] for key in existing_keys}
            new_langs: set[str] = set()
            localizations = item.get("localizations", {})
            for lang, localized in localizations.items():
                new_langs.add(lang)
                existing_local = existing_by_lang.get(lang, {})
                if (
                    existing_local.get("title") != localized.get("title", "")
                    or existing_local.get("description") != localized.get("description", "")
                ):
                    local_changed = True
            for key in existing_keys:
                if key[1] not in new_langs:
                    playlists_local_by_key.pop(key, None)
            for lang, localized in localizations.items():
                playlists_local_by_key[(row_data["playlist_id"], lang)] = {
                    "playlist_id": row_data["playlist_id"],
                    "language_code": lang,
                    "title": localized.get("title", ""),
                    "description": localized.get("description", ""),
                }
            if local_changed:
                record_change(changes, "playlists_local_updated", 1)
        if not existing or any(existing.get(k, "") != row_data.get(k, "") for k in row_data.keys()) or local_changed:
            changed_playlist_ids.add(row_data["playlist_id"])
        existing_playlists_by_id[row_data["playlist_id"]] = row_data

    channel_playlist_ids = [
        pid for pid, row_data in existing_playlists_by_id.items() if row_data.get("channel_id") == channel_id
    ]
    removed_playlists = {pid for pid in channel_playlist_ids if pid not in playlist_ids_in_response}
    if removed_playlists:
        for pid in removed_playlists:
            existing_playlists_by_id.pop(pid, None)
            for key in list(playlists_local_by_key.keys()):
                if key[0] == pid:
                    playlists_local_by_key.pop(key, None)
        existing_playlist_items = [
            row_data for row_data in existing_playlist_items if row_data.get("playlist_id") not in removed_playlists
        ]
        record_change(changes, "playlists_removed", len(removed_playlists))

    merged_playlists = list(existing_playlists_by_id.values())
    merged_playlists.sort(
        key=lambda item: (
            channel_order.get(item.get("channel_id", ""), 9999),
            item.get("published_at", ""),
        )
    )

    playlist_index = {
        row_data.get("playlist_id", ""): idx
        for idx, row_data in enumerate(merged_playlists)
        if row_data.get("playlist_id")
    }

    if changed_playlist_ids:
        record_change(changes, "playlists_updated", len(changed_playlist_ids))
        updated_playlist_items = [
            row_data
            for row_data in existing_playlist_items
            if row_data.get("playlist_id", "") not in changed_playlist_ids
        ]
        for playlist_id in changed_playlist_ids:
            page_token = None
            while True:
                params = {
                    "part": "snippet",
                    "playlistId": playlist_id,
                    "maxResults": 50,
                    "key": api_key,
                }
                if page_token:
                    params["pageToken"] = page_token
                items_resp = api_get("playlistItems", params)
                if args.print_json:
                    print(json.dumps({"playlistItems": items_resp}, indent=2))
                for item in items_resp.get("items", []):
                    snippet = item.get("snippet", {})
                    updated_playlist_items.append(
                        {
                            "playlist_item_id": item.get("id", ""),
                            "playlist_id": snippet.get("playlistId", ""),
                            "position": snippet.get("position", ""),
                            "video_id": snippet.get("resourceId", {}).get("videoId", ""),
                            "video_owner_channel_id": snippet.get("videoOwnerChannelId", ""),
                            "video_owner_channel_title": snippet.get("videoOwnerChannelTitle", ""),
                        }
                    )
                    record_change(changes, "playlist_items_added", 1)
                page_token = items_resp.get("nextPageToken")
                if not page_token:
                    break
        updated_playlist_items.sort(
            key=lambda item: (
                playlist_index.get(item.get("playlist_id", ""), 9999),
                parse_int(item.get("position", "")),
            )
        )
        existing_playlist_items = updated_playlist_items

    write_csv_rows(youtube_csv_dir / "playlists.csv", csv_headers["playlists.csv"].split(","), merged_playlists)
    write_csv_rows(
        youtube_csv_dir / "playlistItems.csv",
        csv_headers["playlistItems.csv"].split(","),
        existing_playlist_items,
    )

    if include_localizations:
        write_local_rows(
            youtube_csv_dir / "playlists_local.csv",
            csv_headers["playlists_local.csv"].split(","),
            playlists_local_by_key,
            order_index=playlist_index,
        )

    return existing_playlists_by_id, existing_playlist_items, playlists_local_by_key, playlist_index
