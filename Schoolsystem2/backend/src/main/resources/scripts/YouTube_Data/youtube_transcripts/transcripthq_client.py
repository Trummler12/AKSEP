"""TranscriptHQ API client helpers (stdlib only)."""

from __future__ import annotations

import json
import time
import socket
import urllib.error
import urllib.request
from typing import Any, Dict, Iterable, Optional

API_BASE = "https://api.transcripthq.io"


class TranscriptHQError(RuntimeError):
    """Raised when TranscriptHQ requests fail."""


def _extract_videos_map(response: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    videos: Dict[str, Dict[str, Any]] = {}
    response_videos = response.get("videos") or {}
    if isinstance(response_videos, dict):
        for vid, item in response_videos.items():
            if isinstance(item, dict):
                videos[str(vid)] = item
    elif isinstance(response_videos, list):
        for item in response_videos:
            if isinstance(item, dict):
                vid = str(item.get("video_id") or "")
                if vid:
                    videos[vid] = item
    return videos


def _is_terminal_status(status: str) -> bool:
    return status in {
        "done",
        "completed",
        "failed",
        "error",
        "missing",
        "no_captions",
        "no_transcript",
        "not_found",
    }


def _request_json(
    method: str,
    url: str,
    api_key: str,
    payload: Optional[Dict[str, Any]] = None,
    timeout: Optional[int] = None,
) -> Dict[str, Any]:
    headers = {
        "Accept": "application/json",
        "X-API-Key": api_key,
    }
    data = None
    if payload is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        if timeout is None:
            with urllib.request.urlopen(request) as response:
                body = response.read()
        else:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                body = response.read()
    except urllib.error.HTTPError as exc:
        body = exc.read()
        detail = body.decode("utf-8", errors="replace")
        raise TranscriptHQError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise TranscriptHQError(f"Network error: {exc.reason}") from exc
    except (TimeoutError, socket.timeout) as exc:
        raise TranscriptHQError("Timeout while contacting TranscriptHQ") from exc

    try:
        return json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        snippet = body[:200].decode("utf-8", errors="replace")
        raise TranscriptHQError(f"Non-JSON response: {snippet}") from exc


def create_transcript_job(
    api_key: str,
    videos: Iterable[str],
    service_type: str = "youtube",
    options: Optional[Dict[str, Any]] = None,
    timeout: Optional[int] = None,
) -> Dict[str, Any]:
    video_list = list(videos)
    if not video_list:
        raise ValueError("videos must not be empty")
    payload: Dict[str, Any] = {
        "service_type": service_type,
        "videos": video_list,
    }
    if options:
        payload.update(options)
    return _request_json(
        "POST",
        f"{API_BASE}/v1/transcripts",
        api_key,
        payload=payload,
        timeout=timeout,
    )


def get_transcript_job(
    api_key: str,
    job_id_or_url: str,
    timeout: Optional[int] = None,
) -> Dict[str, Any]:
    if job_id_or_url.startswith("http://") or job_id_or_url.startswith("https://"):
        url = job_id_or_url
    elif job_id_or_url.startswith("/"):
        url = f"{API_BASE}{job_id_or_url}"
    else:
        url = f"{API_BASE}/v1/transcripts/{job_id_or_url}"
    return _request_json("GET", url, api_key, payload=None, timeout=timeout)


def wait_for_job(
    api_key: str,
    job_id_or_url: str,
    poll_interval: float = 2.0,
    timeout_seconds: Optional[int] = None,
) -> Dict[str, Any]:
    start = time.monotonic()
    while True:
        response = get_transcript_job(api_key, job_id_or_url)
        status = str(response.get("status", "")).lower()
        if status in {"completed", "failed", "error"}:
            return response
        if timeout_seconds and timeout_seconds > 0:
            if time.monotonic() - start > timeout_seconds:
                raise TranscriptHQError("Timeout waiting for TranscriptHQ job")
        time.sleep(poll_interval)


def wait_for_job_by_videos(
    api_key: str,
    job_id_or_url: str,
    expected_video_ids: Iterable[str],
    poll_interval: float = 2.0,
    timeout_seconds: Optional[int] = None,
) -> Dict[str, Any]:
    expected = {str(vid) for vid in expected_video_ids if vid}
    start = time.monotonic()
    while True:
        response = get_transcript_job(api_key, job_id_or_url)
        videos = _extract_videos_map(response)
        if expected:
            missing = expected.difference(videos.keys())
            if not missing:
                statuses = [
                    str((videos[vid].get("status") or "")).lower() for vid in expected
                ]
                if all(_is_terminal_status(status) for status in statuses):
                    return response

        if timeout_seconds and timeout_seconds > 0:
            if time.monotonic() - start > timeout_seconds:
                raise TranscriptHQError("Timeout waiting for TranscriptHQ job")
        time.sleep(poll_interval)
