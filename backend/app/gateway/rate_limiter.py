import time
from typing import Dict, List, Tuple

class SlidingWindowRateLimiter:
    """
    In-memory Sliding-Window Rate Limiting Engine.
    Maintains a sliding 60-second window of timestamps per API Key.
    """
    def __init__(self):
        # Map: api_key_hash -> list of request timestamps (epoch floats)
        self._request_history: Dict[str, List[float]] = {}

    def is_rate_limited(self, api_key_hash: str, rate_limit_per_min: int) -> Tuple[bool, int]:
        """
        Checks if the key has exceeded requests in the last 60 seconds.
        Returns: (is_limited: bool, retry_after_seconds: int)
        """
        now = time.time()
        window_start = now - 60.0

        timestamps = self._request_history.get(api_key_hash, [])
        # Prune timestamps older than 60 seconds
        fresh_timestamps = [ts for ts in timestamps if ts > window_start]

        if len(fresh_timestamps) >= rate_limit_per_min:
            # Calculate remaining seconds until the oldest request expires
            oldest_request = fresh_timestamps[0]
            retry_after = max(1, int(oldest_request + 60.0 - now))
            self._request_history[api_key_hash] = fresh_timestamps
            return True, retry_after

        # Record this request
        fresh_timestamps.append(now)
        self._request_history[api_key_hash] = fresh_timestamps
        return False, 0

    def reset(self, api_key_hash: str):
        if api_key_hash in self._request_history:
            del self._request_history[api_key_hash]

rate_limiter = SlidingWindowRateLimiter()
