from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def run_sanitizer(script_dir: Path, youtube_csv_dir: Path) -> None:
    sanitize_script = script_dir / "sanitize_youtube_csv.py"
    if not sanitize_script.exists():
        print("WARN: sanitize_youtube_csv.py not found; skipping sanitization.", file=sys.stderr)
        return
    try:
        subprocess.run(
            [sys.executable, str(sanitize_script), "--input", str(youtube_csv_dir / "videos.csv")],
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        print(f"WARN: sanitizer failed (exit {exc.returncode}); continuing.", file=sys.stderr)
