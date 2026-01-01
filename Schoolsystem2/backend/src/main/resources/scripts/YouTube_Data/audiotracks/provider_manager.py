from __future__ import annotations

import sys
import time
from collections import deque

from .provider_types import ProviderResult


class ProviderManager:
    def __init__(self, providers: list, backoff_schedule: list[int]) -> None:
        self.providers = providers
        self.backoff_schedule = backoff_schedule
        self.backoff_index = 0
        self.blocked = set()
        self.disabled = set()
        self.error_window = deque(maxlen=50)

    def fetch(self, video_id: str) -> ProviderResult:
        last_error: ProviderResult | None = None
        while True:
            waited = False
            for provider in self.providers:
                if provider.name in self.blocked or provider.name in self.disabled:
                    continue
                result = provider.fetch(video_id)
                if result.rate_limited:
                    self.blocked.add(provider.name)
                    last_error = result
                    continue
                if result.error_type == "provider_missing":
                    self.disabled.add(provider.name)
                    last_error = result
                    continue
                if result.ok:
                    self.error_window.clear()
                    return result

                last_error = result
                if self._should_wait_on_error(result):
                    self._wait()
                    self.error_window.clear()
                    waited = True
                    break
                return result

            if waited:
                continue

            if self.blocked and len(self.blocked) >= len(self.providers):
                self._wait()
                self.blocked.clear()
                continue

            if self.disabled and len(self.disabled) >= len(self.providers):
                return ProviderResult(
                    ok=False,
                    source="manager",
                    error_type="provider_missing",
                    error="no_providers_available",
                )

            if last_error:
                return last_error

            return ProviderResult(
                ok=False,
                source="manager",
                error_type="error",
                error="no_provider_available",
            )

    def _should_wait_on_error(self, result: ProviderResult) -> bool:
        if result.error_type in ("invalid",):
            return False
        self.error_window.append(result.error)
        if len(self.error_window) < 20:
            return False
        matches = sum(1 for err in self.error_window if err == result.error)
        return matches / len(self.error_window) >= 0.5

    def _wait(self) -> None:
        wait_seconds = self.backoff_schedule[min(self.backoff_index, len(self.backoff_schedule) - 1)]
        print(f"WAIT: backoff {wait_seconds}s before retrying providers", file=sys.stderr)
        time.sleep(wait_seconds)
        if self.backoff_index < len(self.backoff_schedule) - 1:
            self.backoff_index += 1
