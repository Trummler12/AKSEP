from __future__ import annotations

from pathlib import Path


def parse_dotenv_file(path: Path) -> dict:
    out = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        out[key.strip()] = value.strip().strip('"').strip("'")
    return out


def load_dotenv_upwards(start_dir: Path, filename: str = ".env", max_levels: int = 12) -> dict:
    current = start_dir
    for _ in range(max_levels + 1):
        candidate = current / filename
        if candidate.exists():
            return parse_dotenv_file(candidate)
        if current.parent == current:
            break
        current = current.parent
    return {}


def get_api_key(start_dir: Path) -> str:
    env_key = __import__("os").getenv("YOUTUBE_DATA_API_KEY")
    if env_key:
        return env_key
    env = load_dotenv_upwards(start_dir)
    return env.get("YOUTUBE_DATA_API_KEY", "")
