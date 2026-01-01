# Overview of how YouTube Data API Quota is being consumed

This doc summarizes list/search quota costs and batch sizing based on official YouTube Data API docs.

## Key rules (from official docs)
- Quota is charged **per request**, not per item. A request that returns multiple items still costs the same as a request that returns one item.
- Most **list** methods cost **1 unit** per request.
- **search.list** costs **100 units** per request.
- Each **additional page** (nextPageToken) costs the **same** as the first page.

## Method cost reference (list-only, relevant to this project)
| Resource        | Method | Cost per request |
|-----------------|--------|------------------|
| channels        | list   | 1                |
| videos          | list   | 1                |
| playlists       | list   | 1                |
| playlistItems   | list   | 1                |
| commentThreads  | list   | 1                |
| videoCategories | list   | 1                |
| search          | list   | 100              |

## Batch sizing and thresholds
The tables below show:
- **Per-request max** for a single response page.
- **Batch sweet spot** = largest batch size with the same cost as requesting 1 item.
- **Next threshold** = batch size that forces another request (cost +1).

### channels.list
| Scenario                                      |  Max items in one request | Cost |
|-----------------------------------------------|--------------------------:|-----:|
| Using `id` (up to 50 channel IDs per request) |                        50 |    1 |
| 1 item                                        |                         1 |    1 |
| Batch sweet spot                              |                        50 |    1 |
| Next threshold                                | 51 (requires 2nd request) |    2 |

### videos.list
| Scenario                                    |  Max items in one request | Cost |
|---------------------------------------------|--------------------------:|-----:|
| Using `id` (up to 50 video IDs per request) |                        50 |    1 |
| 1 item                                      |                         1 |    1 |
| Batch sweet spot                            |                        50 |    1 |
| Next threshold                              | 51 (requires 2nd request) |    2 |
Notes:
- `maxResults` does **not** apply when using `id`. It only applies with `myRating`.

### playlists.list
| Scenario                                       |  Max items in one request |       Cost |
|------------------------------------------------|--------------------------:|-----------:|
| Using `id` (up to 50 playlist IDs per request) |                        50 |          1 |
| Using `channelId` (paged)                      |               50 per page | 1 per page |
| 1 item                                         |                         1 |          1 |
| Batch sweet spot                               |                        50 |          1 |
| Next threshold                                 | 51 (requires 2nd request) |          2 |

### playlistItems.list
| Scenario                   |  Max items in one request |       Cost |
|----------------------------|--------------------------:|-----------:|
| Using `playlistId` (paged) |               50 per page | 1 per page |
| 1 item                     |                         1 |          1 |
| Batch sweet spot           |                        50 |          1 |
| Next threshold             | 51 (requires 2nd request) |          2 |

### commentThreads.list
| Scenario                |   Max items in one request |       Cost |
|-------------------------|---------------------------:|-----------:|
| Using `videoId` (paged) |               100 per page | 1 per page |
| 1 item                  |                          1 |          1 |
| Batch sweet spot        |                        100 |          1 |
| Next threshold          | 101 (requires 2nd request) |          2 |
Notes:
- `maxResults` is **not** supported when using `id`.

### videoCategories.list
| Scenario                            | Max items in one request | Cost |
|-------------------------------------|-------------------------:|-----:|
| Using `regionCode` (all categories) |           all categories |    1 |
| 1 item                              |                        1 |    1 |
| Batch sweet spot                    |           all categories |    1 |
| Next threshold                      |                      n/a |  n/a |
Notes:
- This endpoint returns the full category list for a region; no `maxResults` parameter.

### search.list
| Scenario          |  Max items in one request |         Cost |
|-------------------|--------------------------:|-------------:|
| Using `q` (paged) |               50 per page | 100 per page |
| 1 item            |                         1 |          100 |
| Batch sweet spot  |                        50 |          100 |
| Next threshold    | 51 (requires 2nd request) |          200 |

## Implications for testing
- For **id-based batching** (videos/channels/playlists), pull **50 IDs at once** to maximize value per unit.
- For **paged list methods** (playlistItems/commentThreads/search), set `maxResults` to the maximum per page.
- Avoid `search.list` in tests unless it is needed for discovery (high cost).

## youtube_transcript_api quota / rate limits (non-YouTube Data API)
- `youtube_transcript_api` does **not** consume YouTube Data API quota because it does **not** call the official Data API endpoints.
- It fetches transcript data by calling YouTube's web endpoints. There is **no published quota table**; practical limits are enforced by rate limits, throttling, or temporary blocking.
- Risks: requests can fail with `TooManyRequests`, `NoTranscriptFound`, or `TranscriptsDisabled`. Availability differs per video and per language.
- Recommended approach: keep requests low-volume, add retries with exponential backoff, and consider proxy rotation only if necessary and compliant.
- Decision (for now): **do not** fetch transcripts during testing runs; only record the presence/absence once we confirm acceptable rate limits.

## Sources
- https://developers.google.com/youtube/v3/determine_quota_cost
- https://developers.google.com/youtube/v3/docs/videos/list
- https://developers.google.com/youtube/v3/docs/channels/list
- https://developers.google.com/youtube/v3/docs/playlists/list
- https://developers.google.com/youtube/v3/docs/playlistItems/list
- https://developers.google.com/youtube/v3/docs/commentThreads/list
- https://developers.google.com/youtube/v3/docs/search/list
- https://developers.google.com/youtube/v3/docs/videoCategories/list
