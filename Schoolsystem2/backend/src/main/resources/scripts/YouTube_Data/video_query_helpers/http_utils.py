from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import urlopen

API_BASE = "https://www.googleapis.com/youtube/v3"


def set_api_base(value: str) -> None:
    global API_BASE
    API_BASE = value


def api_get(path: str, params: dict) -> dict:
    query = urlencode(params)
    url = f"{API_BASE}/{path}?{query}"
    with urlopen(url) as resp:
        return json.loads(resp.read().decode("utf-8"))
