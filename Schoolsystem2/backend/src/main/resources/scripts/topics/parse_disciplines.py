#!/usr/bin/env python3
import argparse
import csv
import re
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

IGNORE_H2 = {
    "See also",
    "Notes",
    "Further reading",
    "External links",
}

WIKI_PREFIX = "https://en.wikipedia.org"
DEFAULT_INPUT_NAME = "Disciplines_raw.md"
DEFAULT_OUTPUT_NAME = "Disciplines_parsed.csv"
DEFAULT_REQ_TYPE = "0"
DEFAULT_TOPIC_TYPE = "S"
GROUP_LAYER = 0
LAYER_OFFSET = -1

def normalize_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def strip_citations(text: str) -> str:
    return re.sub(r"\[\d+\]", "", text)


def strip_outline_markers(text: str) -> str:
    text = re.sub(r"\s*\((?i:.*outline.*)\)\s*", " ", text)
    text = re.sub(r"^(?i:Outline of (the )?)", "", text)
    return text.strip()


def normalize_name(text: str) -> str:
    text = normalize_whitespace(text)
    text = strip_citations(text)
    text = strip_outline_markers(text)
    text = normalize_whitespace(text)
    return text


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text or "item"


class OutlineParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.nodes = []
        self.current_h2_index = None
        self.current_h3_index = None
        self.heading_level = None
        self.heading_text_parts = []
        self.heading_url = None
        self.pending_heading_index = None
        self.in_hatnote = False
        self.hatnote_links = []
        self.li_stack = []
        self.ul_parent_stack = []
        self.skip_section = False

    def handle_starttag(self, tag, attrs):
        if tag in {"h2", "h3"}:
            self.heading_level = tag
            self.heading_text_parts = []
            self.heading_url = None
            self.pending_heading_index = None
            return

        if self.skip_section:
            return

        if tag == "ul":
            parent = None
            if self.li_stack:
                parent = self.li_stack[-1]["index"]
            elif self.current_h3_index is not None:
                parent = self.current_h3_index
            elif self.current_h2_index is not None:
                parent = self.current_h2_index
            self.ul_parent_stack.append(parent)
            if self.li_stack:
                self.li_stack[-1]["ul_depth"] += 1
                self.li_stack[-1]["capture"] = False
            return

        if tag == "li":
            parent = self.ul_parent_stack[-1] if self.ul_parent_stack else None
            node_index = len(self.nodes)
            self.nodes.append(
                {
                    "name": "",
                    "url": "",
                    "kind": "subdiscipline",
                    "parent_index": parent,
                }
            )
            self.li_stack.append(
                {
                    "index": node_index,
                    "text_parts": [],
                    "url": None,
                    "capture": True,
                    "ul_depth": 0,
                }
            )
            return

        if tag == "a":
            href = None
            title = None
            for key, value in attrs:
                if key == "href":
                    href = value
                    break
                if key == "title":
                    title = value
            if not href:
                return
            if self.in_hatnote:
                self.hatnote_links.append((href, title or ""))
                return
            if self.heading_level:
                if self.heading_url is None or "Outline_of" in href:
                    if "Outline_of" in href or self.heading_url is None:
                        self.heading_url = href
                return
            if self.li_stack and self.li_stack[-1]["capture"] and not self.li_stack[-1]["url"]:
                self.li_stack[-1]["url"] = href
            return
        if tag == "div":
            class_value = None
            for key, value in attrs:
                if key == "class":
                    class_value = value
                    break
            if class_value and "hatnote" in class_value and self.pending_heading_index is not None:
                self.in_hatnote = True
                self.hatnote_links = []
                return

    def handle_endtag(self, tag):
        if tag == "h2":
            name = normalize_name("".join(self.heading_text_parts))
            self.heading_level = None
            self.heading_text_parts = []
            if not name:
                return
            if name in IGNORE_H2:
                self.skip_section = True
                self.current_h2_index = None
                self.current_h3_index = None
                self.pending_heading_index = None
                return
            self.skip_section = False
            node_index = len(self.nodes)
            self.nodes.append(
                {
                    "name": name,
                    "url": normalize_url(self.heading_url or ""),
                    "kind": "group",
                    "parent_index": None,
                }
            )
            self.current_h2_index = node_index
            self.current_h3_index = None
            self.pending_heading_index = node_index
            return

        if tag == "h3":
            name = normalize_name("".join(self.heading_text_parts))
            self.heading_level = None
            self.heading_text_parts = []
            if self.skip_section or not name:
                return
            node_index = len(self.nodes)
            self.nodes.append(
                {
                    "name": name,
                    "url": normalize_url(self.heading_url or ""),
                    "kind": "discipline",
                    "parent_index": self.current_h2_index,
                }
            )
            self.current_h3_index = node_index
            self.pending_heading_index = node_index
            return

        if self.skip_section:
            return

        if tag == "ul":
            if self.ul_parent_stack:
                self.ul_parent_stack.pop()
            if self.li_stack and self.li_stack[-1]["ul_depth"] > 0:
                self.li_stack[-1]["ul_depth"] -= 1
                if self.li_stack[-1]["ul_depth"] == 0:
                    self.li_stack[-1]["capture"] = True
            return

        if tag == "li":
            if not self.li_stack:
                return
            entry = self.li_stack.pop()
            name = normalize_name("".join(entry["text_parts"]))
            node = self.nodes[entry["index"]]
            node["name"] = name or "Unnamed"
            node["url"] = entry["url"] or ""
            return
        if tag == "div" and self.in_hatnote:
            chosen_href = ""

            def is_outline_link(href: str, title: str) -> bool:
                if "Outline_of" in href:
                    return True
                if re.search(r"\\boutline\\b", title, flags=re.IGNORECASE):
                    return True
                return False

            for href, title in self.hatnote_links:
                if not is_outline_link(href, title):
                    chosen_href = href
                    break
            if not chosen_href and self.hatnote_links:
                chosen_href = self.hatnote_links[0][0]

            if chosen_href and self.pending_heading_index is not None:
                node = self.nodes[self.pending_heading_index]
                if not node.get("url"):
                    node["url"] = normalize_url(chosen_href)
            self.in_hatnote = False
            self.hatnote_links = []
            self.pending_heading_index = None
            return

    def handle_data(self, data):
        if self.heading_level:
            self.heading_text_parts.append(data)
            return
        if self.skip_section:
            return
        if self.li_stack and self.li_stack[-1]["capture"]:
            self.li_stack[-1]["text_parts"].append(data)


def build_keys(nodes):
    key_counts = {}
    for node in nodes:
        path_names = []
        parent = node["parent_index"]
        while parent is not None:
            path_names.append(nodes[parent]["name"])
            parent = nodes[parent]["parent_index"]
        path_names.reverse()
        path_names.append(node["name"])
        segments = [slugify(p) for p in path_names]
        base_key = ".".join(segments)
        count = key_counts.get(base_key, 0) + 1
        key_counts[base_key] = count
        key = base_key if count == 1 else f"{base_key}-{count}"
        node["key"] = key
    return nodes


def normalize_url(href: str) -> str:
    if not href:
        return ""
    if href.startswith("/wiki/"):
        return f"{WIKI_PREFIX}{href}"
    if href.startswith("http://") or href.startswith("https://"):
        return href
    return ""


def build_attached_to(nodes):
    name_to_keys = {}
    for node in nodes:
        name_to_keys.setdefault(node["name"], []).append(node["key"])

    for node in nodes:
        parent_index = node["parent_index"]
        if parent_index is None:
            node["attached_to"] = ""
            continue
        parent = nodes[parent_index]
        parent_name = parent["name"]
        if len(name_to_keys.get(parent_name, [])) == 1:
            parent_ref = parent_name
        else:
            parent_ref = f"key:{parent['key']}"
        node["attached_to"] = f"{parent_ref}|{DEFAULT_REQ_TYPE}"
    return nodes


def parse_attached_to(value: str):
    if not value:
        return []
    parts = [p.strip() for p in value.split(";") if p.strip()]
    refs = []
    for part in parts:
        if "|" in part:
            ref, _req = part.split("|", 1)
        else:
            ref = part
        refs.append(ref.strip())
    return refs


def compute_layers(nodes):
    key_to_node = {node["key"]: node for node in nodes}
    name_to_keys = {}
    for node in nodes:
        name_to_keys.setdefault(node["name"], []).append(node["key"])

    memo = {}
    visiting = set()

    def resolve_ref(ref: str):
        if ref.startswith("key:"):
            key = ref[4:].strip()
            if key in key_to_node:
                return key, None
            return None, "MISSING_PARENT"
        name = ref
        keys = name_to_keys.get(name, [])
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
        node = key_to_node[key]
        refs = parse_attached_to(node.get("attached_to", ""))
        if not refs:
            memo[key] = 1
            visiting.remove(key)
            return memo[key]
        layers = []
        for ref in refs:
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

    for node in nodes:
        node["layer"] = dfs(node["key"])
    return nodes


def main() -> int:
    parser = argparse.ArgumentParser(description=f"Parse {DEFAULT_INPUT_NAME} into {DEFAULT_OUTPUT_NAME}")
    parser.add_argument("--input", required=True, help=f"Path to {DEFAULT_INPUT_NAME}")
    parser.add_argument("--output", help=f"Path to {DEFAULT_OUTPUT_NAME}")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output) if args.output else input_path.with_name(DEFAULT_OUTPUT_NAME)
    html = input_path.read_text(encoding="utf-8")

    parser = OutlineParser()
    parser.feed(html)

    nodes = parser.nodes
    nodes = build_keys(nodes)
    for node in nodes:
        node["url"] = normalize_url(node.get("url", ""))
    nodes = build_attached_to(nodes)
    nodes = compute_layers(nodes)

    header = ["key", "name", "description", "attached to", "layer", "type", "kind", "url"]
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for node in nodes:
            layer = node.get("layer", "")
            if isinstance(layer, int):
                layer = layer + LAYER_OFFSET
            if node["kind"] == "group":
                layer = GROUP_LAYER
            writer.writerow(
                {
                    "key": node["key"],
                    "name": node["name"],
                    "description": "",
                    "attached to": node.get("attached_to", ""),
                    "layer": layer,
                    "type": "" if node["kind"] == "group" else DEFAULT_TOPIC_TYPE,
                    "kind": node["kind"],
                    "url": node.get("url", ""),
                }
            )

    print(f"Wrote {len(nodes)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
