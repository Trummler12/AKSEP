#!/usr/bin/env python3
import csv
import sys
from pathlib import Path

DEFAULT_INPUT_NAME = "Disciplines_restructured.csv"
DEFAULT_ENRICHMENT_NAME = "Disciplines_enrichment.csv"
DEFAULT_OUTPUT_NAME = "Disciplines_final.csv"
DEFAULT_REQ_TYPE = "0"

GROUP_KEYS = {
    "humanities",
    "social-science",
    "natural-science",
    "formal-science",
}


def parse_attached_to(value: str):
    if not value:
        return []
    parts = [p.strip() for p in value.split(";") if p.strip()]
    refs = []
    for part in parts:
        if "|" in part:
            ref, req = part.split("|", 1)
        else:
            ref, req = part, DEFAULT_REQ_TYPE
        refs.append((ref.strip(), req.strip()))
    return refs


def format_attached_to(refs):
    if not refs:
        return ""
    parts = [f"{ref}|{req}" for ref, req in refs]
    return ";".join(parts)


def compute_layers(rows):
    key_to_row = {row["key"]: row for row in rows}
    name_to_keys = {}
    for row in rows:
        name_to_keys.setdefault(row["name"], []).append(row["key"])

    memo = {}
    visiting = set()

    def resolve_ref(ref: str):
        if ref.startswith("key:"):
            key = ref[4:].strip()
            if key in key_to_row:
                return key, None
            return None, "MISSING_PARENT"
        keys = name_to_keys.get(ref, [])
        if not keys:
            return None, "MISSING_PARENT"
        if len(keys) > 1:
            return None, "AMBIGUOUS_PARENT"
        return keys[0], None

    def is_error(value):
        return isinstance(value, str) and value.startswith("0 (")

    def dfs(key: str):
        if key in memo:
            return memo[key]
        if key in visiting:
            memo[key] = "0 (CYCLE)"
            return memo[key]
        visiting.add(key)
        row = key_to_row[key]
        refs = parse_attached_to(row.get("attached to", ""))
        req_refs = [ref for ref, req in refs if req == DEFAULT_REQ_TYPE]
        if not req_refs:
            memo[key] = 1
            visiting.remove(key)
            return memo[key]
        layers = []
        for ref in req_refs:
            parent_key, err = resolve_ref(ref)
            if err:
                memo[key] = f"0 ({err})"
                visiting.remove(key)
                return memo[key]
            parent_layer = dfs(parent_key)
            if is_error(parent_layer):
                memo[key] = parent_layer
                visiting.remove(key)
                return memo[key]
            layers.append(parent_layer)
        memo[key] = max(layers) + 1 if layers else 1
        visiting.remove(key)
        return memo[key]

    for row in rows:
        if row["key"] in GROUP_KEYS:
            row["layer"] = 0
        else:
            row["layer"] = dfs(row["key"])
    return rows


def read_enrichment(path: Path):
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        enrichment = {}
        for row in reader:
            key = row.get("key", "").strip()
            if not key:
                continue
            enrichment[key] = {
                "description": row.get("description", "").strip(),
                "attached to": row.get("attached to", "").strip(),
                "status": row.get("status", "").strip().lower(),
            }
    return enrichment


def parent_key_of(key: str):
    if "." not in key:
        return None
    return key.rsplit(".", 1)[0]


def describe_row(row, name_by_key):
    key = row["key"]
    name = row["name"]
    if key in GROUP_KEYS:
        return f"{name} is a broad academic domain."
    parent_key = parent_key_of(key)
    parent_name = name_by_key.get(parent_key)
    if parent_name:
        return f"{name} is a discipline within {parent_name}."
    return f"{name} is an academic discipline."


def merge_attached_to(base_value: str, extra_value: str):
    if not extra_value:
        return base_value
    if extra_value.startswith("override:"):
        merged = parse_attached_to(extra_value[len("override:") :])
    else:
        merged = parse_attached_to(base_value) + parse_attached_to(extra_value)
    def req_rank(req: str):
        try:
            return int(req)
        except ValueError:
            return None

    best_by_ref = {}
    order = []
    for ref, req in merged:
        rank = req_rank(req)
        if ref not in best_by_ref:
            best_by_ref[ref] = req
            order.append(ref)
            continue
        current = req_rank(best_by_ref[ref])
        if rank is None:
            continue
        if current is None or rank < current:
            best_by_ref[ref] = req

    deduped = [(ref, best_by_ref[ref]) for ref in order]
    return format_attached_to(deduped)


def prune_redundant_attached_to(rows):
    key_to_row = {row["key"]: row for row in rows}

    def parse_req(req: str):
        try:
            return int(req)
        except ValueError:
            return None

    for row in rows:
        refs = parse_attached_to(row.get("attached to", ""))
        if not refs:
            continue

        ancestor_refs = {}
        parent_key = parent_key_of(row["key"])
        while parent_key and parent_key in key_to_row:
            parent = key_to_row[parent_key]
            for ref, req in parse_attached_to(parent.get("attached to", "")):
                req_value = parse_req(req)
                if req_value is None:
                    continue
                existing = ancestor_refs.get(ref)
                if existing is None or req_value < existing:
                    ancestor_refs[ref] = req_value
            parent_key = parent_key_of(parent_key)

        if not ancestor_refs:
            continue

        best_by_ref = {}
        order = []
        for ref, req in refs:
            if ref not in best_by_ref:
                best_by_ref[ref] = req
                order.append(ref)
            else:
                current = parse_req(best_by_ref[ref])
                incoming = parse_req(req)
                if incoming is not None and (current is None or incoming < current):
                    best_by_ref[ref] = req

        filtered = []
        for ref in order:
            req = best_by_ref[ref]
            req_value = parse_req(req)
            ancestor_req = ancestor_refs.get(ref)
            if ancestor_req is not None and req_value is not None and ancestor_req <= req_value:
                continue
            filtered.append((ref, req))

        row["attached to"] = format_attached_to(filtered)
    return rows


def main() -> int:
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    enrichment_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    output_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    if input_path is None:
        input_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_INPUT_NAME
    if enrichment_path is None:
        enrichment_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_ENRICHMENT_NAME
    if output_path is None:
        output_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_OUTPUT_NAME

    with input_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            rows.append(
                {
                    "key": row.get("key", "").strip(),
                    "name": row.get("name", "").strip(),
                    "description": row.get("description", "").strip(),
                    "attached to": row.get("attached to", "").strip(),
                    "layer": row.get("layer", "").strip(),
                    "type": row.get("type", "").strip(),
                    "url": row.get("url", "").strip(),
                }
            )

    name_by_key = {row["key"]: row["name"] for row in rows}
    name_to_keys = {}
    for row in rows:
        name_to_keys.setdefault(row["name"], []).append(row["key"])

    enrichment_raw = read_enrichment(enrichment_path)
    enrichment = {}
    misfires = []

    for ref, payload in enrichment_raw.items():
        status = payload.get("status", "")
        if status in {"orphan", "suggested"}:
            continue
        if ref.startswith("name:"):
            name = ref[len("name:") :].strip()
            keys = name_to_keys.get(name, [])
            if not keys:
                misfires.append(f"name:{name} -> MISSING")
                continue
            if len(keys) > 1:
                misfires.append(f"name:{name} -> AMBIGUOUS ({len(keys)})")
                continue
            enrichment[keys[0]] = payload
        else:
            if ref not in name_by_key:
                misfires.append(f"key:{ref} -> MISSING")
                continue
            enrichment[ref] = payload

    missing_enrichment = []
    for row in rows:
        payload = enrichment.get(row["key"])
        if payload:
            if payload.get("description"):
                row["description"] = payload["description"]
            if payload.get("attached to"):
                row["attached to"] = merge_attached_to(row["attached to"], payload["attached to"])
        else:
            missing_enrichment.append(row["key"])

        if not row["description"]:
            row["description"] = describe_row(row, name_by_key)

    rows = compute_layers(rows)
    rows = prune_redundant_attached_to(rows)

    header = ["key", "name", "description", "attached to", "layer", "type", "url"]
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in header})

    if misfires:
        print("Warning: enrichment misfires (missing/ambiguous):", file=sys.stderr)
        for item in misfires[:10]:
            print(f"- {item}", file=sys.stderr)

    if missing_enrichment:
        print("Warning: entries without explicit enrichment (first 10):", file=sys.stderr)
        for key in missing_enrichment[:10]:
            print(f"- {key}", file=sys.stderr)

    print(f"Wrote {len(rows)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
