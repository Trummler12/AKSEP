from __future__ import annotations

ANSI_RESET = "\033[0m"
ANSI_GREEN = "\033[32m"
ANSI_YELLOW = "\033[33m"
ANSI_RED = "\033[31m"
ANSI_ORANGE = "\033[38;5;208m"


def set_ansi_colors(
    reset: str,
    green: str,
    yellow: str,
    red: str,
    orange: str,
) -> None:
    global ANSI_RESET, ANSI_GREEN, ANSI_YELLOW, ANSI_RED, ANSI_ORANGE
    ANSI_RESET = reset
    ANSI_GREEN = green
    ANSI_YELLOW = yellow
    ANSI_RED = red
    ANSI_ORANGE = orange


def record_change(changes: dict[str, int], key: str, amount: int = 1) -> None:
    changes[key] = changes.get(key, 0) + amount


def record_total(totals: dict[str, int], key: str, amount: int) -> None:
    totals[key] = totals.get(key, 0) + amount


def has_changes(changes: dict[str, int]) -> bool:
    return any(value for value in changes.values())


def format_change_summary(changes: dict[str, int], totals: dict[str, int] | None = None) -> str:
    parts = []
    for key, value in changes.items():
        if totals and key in totals and totals[key] != value:
            parts.append(f"{key}={value}/{totals[key]}")
        else:
            parts.append(f"{key}={value}")
    return ", ".join(parts)


def use_ansi_color(enabled: bool) -> bool:
    if not enabled:
        return False
    if __import__("os").getenv("NO_COLOR"):
        return False
    return __import__("sys").stdout.isatty()


def color_for_change_key(key: str) -> str:
    if key.endswith("_added") or key.endswith("_updated"):
        return ANSI_GREEN
    if key.endswith("_removed"):
        return ANSI_RED
    if key.endswith("_missing") or key.endswith("_replaced"):
        return ANSI_ORANGE
    return ANSI_YELLOW


def format_change_summary_colored(
    changes: dict[str, int],
    totals: dict[str, int] | None = None,
    use_color: bool = False,
) -> str:
    if not use_color:
        return format_change_summary(changes, totals)
    parts = []
    for key, value in changes.items():
        total = totals.get(key) if totals else None
        if total is not None and total != value:
            value_str = f"{value}/{total}"
        else:
            value_str = str(value)
        color = color_for_change_key(key)
        parts.append(f"{key}={color}{value_str}{ANSI_RESET}")
    return ", ".join(parts)
