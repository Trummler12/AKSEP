from __future__ import annotations

import csv
import io
import os
from pathlib import Path


def read_csv_rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write_local_rows(
    path: Path,
    header: list[str],
    rows_by_key: dict[tuple[str, str], dict],
    order_index: dict[str, int] | None = None,
) -> None:
    rows = list(rows_by_key.values())
    if order_index:
        rows.sort(
            key=lambda item: (
                order_index.get(item.get(header[0], ""), 9999),
                item.get(header[1], ""),
            )
        )
    else:
        rows.sort(key=lambda item: (item.get(header[0], ""), item.get(header[1], "")))
    write_csv_rows(path, header, rows)


def write_csv_rows(path: Path, header: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)
        return
    except OSError as exc:
        if exc.errno != 22:
            raise
    temp_path = path.with_suffix(path.suffix + ".tmp")
    with temp_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    os.replace(temp_path, path)


def ensure_csvs(data_dir: Path, csv_headers: dict[str, str]) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)
    for name, header in csv_headers.items():
        path = data_dir / name
        if not path.exists():
            path.write_text(header + "\n", encoding="utf-8")


def read_channel_sources(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as handle:
        raw_lines = handle.read().splitlines()
    filtered = []
    for line in raw_lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        filtered.append(line)
    reader = csv.DictReader(filtered)
    for idx, row in enumerate(reader):
        row = {k: (v or "").strip() for k, v in row.items()}
        row["__index"] = idx
        rows.append(row)
    return rows


def read_video_sources(path: Path) -> list[dict]:
    if not path.exists():
        return []
    rows = []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            cleaned = {k: (v or "").strip() for k, v in row.items()}
            rows.append(cleaned)
    return rows


def load_channel_source_lines(path: Path) -> tuple[list[str], list[str], list[tuple[int, dict]], bool]:
    text = path.read_text(encoding="utf-8")
    had_trailing_newline = text.endswith("\n")
    lines = text.splitlines()
    header_fields: list[str] = []
    header_idx = -1
    for idx, line in enumerate(lines):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        header_idx = idx
        header_fields = next(csv.reader([line]))
        break
    if header_idx < 0:
        return lines, header_fields, [], had_trailing_newline

    row_items: list[tuple[int, dict]] = []
    for idx in range(header_idx + 1, len(lines)):
        line = lines[idx]
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        values = next(csv.reader([line]))
        row = {header_fields[i]: (values[i] if i < len(values) else "") for i in range(len(header_fields))}
        row_items.append((idx, row))
    return lines, header_fields, row_items, had_trailing_newline


def render_csv_row(fields: list[str], row: dict) -> str:
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fields, lineterminator="\n")
    writer.writerow({field: row.get(field, "") for field in fields})
    return output.getvalue().rstrip("\n")


def ensure_playlist_type_csv(path: Path) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "playlist_type_id,playlist_type\n"
        "1,playlist\n"
        "2,course\n",
        encoding="utf-8",
    )


def read_csv_with_header(path: Path) -> tuple[list[str], list[dict]]:
    if not path.exists():
        return [], []
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        header = next(reader, [])
        dict_reader = csv.DictReader(handle, fieldnames=header)
        rows = []
        for row in dict_reader:
            rows.append({k: (v or "").strip() for k, v in row.items()})
    return header, rows
