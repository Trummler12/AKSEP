#!/usr/bin/env python3
import csv
import sys
from pathlib import Path

DEFAULT_INPUT_NAME = "Disciplines_restructured.csv"
DEFAULT_ENRICHMENT_NAME = "Disciplines_enrichment.csv"
DEFAULT_OUTPUT_NAME = "Disciplines_enrichment.csv"

BASE_COLUMNS = ["key", "description", "attached to", "status", "suggested key"]


def read_restructured(path: Path):
    with path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            key = row.get("key", "").strip()
            name = row.get("name", "").strip()
            if not key:
                continue
            rows.append({"key": key, "name": name})
    return rows


def read_enrichment(path: Path):
    if not path.exists():
        return [], []
    with path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            key = row.get("key", "").strip()
            if not key:
                continue
            rows.append({k: (v or "").strip() for k, v in row.items()})
    return rows, reader.fieldnames or []


def suggest_key(key: str, restructured_keys: set, keys_by_leaf: dict):
    if key.endswith("-2"):
        base = key[:-2]
        if base in restructured_keys:
            return base
    leaf = key.rsplit(".", 1)[-1]
    matches = keys_by_leaf.get(leaf, [])
    if len(matches) == 1:
        return matches[0]
    return ""

def parse_attached_to(value: str):
    if not value:
        return []
    parts = [p.strip() for p in value.split(";") if p.strip()]
    refs = []
    for part in parts:
        if "|" in part:
            ref, req = part.split("|", 1)
        else:
            ref, req = part, "0"
        refs.append((ref.strip(), req.strip()))
    return refs


def format_attached_to(refs):
    if not refs:
        return ""
    parts = [f"{ref}|{req}" for ref, req in refs]
    return ";".join(parts)


def merge_attached_to(base_value: str, extra_value: str):
    if not extra_value:
        return base_value
    if not base_value:
        return extra_value
    merged = parse_attached_to(base_value) + parse_attached_to(extra_value)
    best_by_ref = {}
    order = []
    for ref, req in merged:
        if ref not in best_by_ref:
            best_by_ref[ref] = req
            order.append(ref)
            continue
        try:
            current = int(best_by_ref[ref])
            incoming = int(req)
        except ValueError:
            continue
        if incoming < current:
            best_by_ref[ref] = req
    deduped = [(ref, best_by_ref[ref]) for ref in order]
    return format_attached_to(deduped)


def merge_columns(existing: list, extra: list):
    cols = []
    for name in BASE_COLUMNS + extra:
        if name and name not in cols:
            cols.append(name)
    return cols


def main() -> int:
    apply_suggestions = False
    resolve_orphans = False
    if "--apply-suggestions" in sys.argv:
        apply_suggestions = True
        sys.argv = [arg for arg in sys.argv if arg != "--apply-suggestions"]
    if "--resolve-orphans" in sys.argv:
        resolve_orphans = True
        sys.argv = [arg for arg in sys.argv if arg != "--resolve-orphans"]

    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    enrichment_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    output_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    if input_path is None:
        input_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_INPUT_NAME
    if enrichment_path is None:
        enrichment_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_ENRICHMENT_NAME
    if output_path is None:
        output_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_OUTPUT_NAME

    restructured = read_restructured(input_path)
    restructured_keys = {row["key"] for row in restructured}

    enrichment_rows, enrichment_fields = read_enrichment(enrichment_path)
    extra_fields = [f for f in enrichment_fields or [] if f not in BASE_COLUMNS]
    header = merge_columns(BASE_COLUMNS, extra_fields)

    by_key = {}
    duplicates = []
    for row in enrichment_rows:
        key = row.get("key", "")
        if key in by_key:
            duplicates.append(key)
            continue
        by_key[key] = row

    keys_by_leaf = {}
    for row in restructured:
        leaf = row["key"].rsplit(".", 1)[-1]
        keys_by_leaf.setdefault(leaf, []).append(row["key"])

    output_rows = []
    missing_count = 0
    suggested_count = 0
    orphan_count = 0

    resolved_by_key = {}
    if resolve_orphans:
        for row in enrichment_rows:
            key = row.get("key", "").strip()
            if not key:
                continue
            status = (row.get("status") or "").strip()
            suggestion = (row.get("suggested key") or "").strip()
            if suggestion:
                target = resolved_by_key.get(suggestion) or by_key.get(suggestion)
                if not target:
                    target = {col: "" for col in header}
                    target["key"] = suggestion
                else:
                    target = dict(target)
                desc = (row.get("description") or "").strip()
                if desc and not (target.get("description") or "").strip():
                    target["description"] = desc
                att = (row.get("attached to") or "").strip()
                if att:
                    target["attached to"] = merge_attached_to(target.get("attached to", ""), att)
                target["status"] = "valid"
                target["suggested key"] = ""
                resolved_by_key[suggestion] = target
                continue
            resolved_by_key.setdefault(key, dict(row))

    for row in restructured:
        key = row["key"]
        if resolve_orphans:
            existing = resolved_by_key.get(key) or by_key.get(key)
        else:
            existing = by_key.get(key)
        if existing:
            updated = dict(existing)
            updated["status"] = "valid"
            updated["suggested key"] = ""
        else:
            updated = {col: "" for col in header}
            updated["key"] = key
            updated["description"] = ""
            updated["attached to"] = ""
            updated["status"] = "missing"
            updated["suggested key"] = ""
            missing_count += 1
        output_rows.append(updated)

    if apply_suggestions:
        valid_by_key = {row["key"]: row for row in output_rows}
        for row in enrichment_rows:
            status = (row.get("status") or "").strip()
            suggestion = (row.get("suggested key") or "").strip()
            if status != "suggested" or not suggestion:
                continue
            target = valid_by_key.get(suggestion)
            if not target:
                continue
            desc = row.get("description", "").strip()
            if desc and not target.get("description"):
                target["description"] = desc
            att = row.get("attached to", "").strip()
            if att:
                target["attached to"] = merge_attached_to(target.get("attached to", ""), att)

    for key, row in (resolved_by_key.items() if resolve_orphans else by_key.items()):
        if key in restructured_keys:
            continue
        updated = dict(row)
        suggestion = suggest_key(key, restructured_keys, keys_by_leaf)
        if suggestion and not apply_suggestions and not resolve_orphans:
            updated["status"] = "suggested"
            updated["suggested key"] = suggestion
            suggested_count += 1
        else:
            updated["status"] = "orphan"
            if suggestion:
                updated["suggested key"] = suggestion
            else:
                updated["suggested key"] = ""
            orphan_count += 1
        output_rows.append(updated)

    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for row in output_rows:
            writer.writerow({k: row.get(k, "") for k in header})

    if duplicates:
        unique = sorted(set(duplicates))
        print(f"Warning: duplicate enrichment keys (showing first 10): {unique[:10]}", file=sys.stderr)

    print(
        f"Wrote {len(output_rows)} rows to {output_path} "
        f"(missing={missing_count}, orphan={orphan_count}, suggested={suggested_count})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
