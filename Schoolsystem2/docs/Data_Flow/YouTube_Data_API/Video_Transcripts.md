# Video Transcripts

## Evaluation
### YouTube Data API v3 - captions (official)
- `captions.list` returns caption track metadata, and the response does not contain the actual captions. `captions.download` is required to retrieve the caption track content. Source: https://developers.google.com/youtube/v3/docs/captions/list
- `captions.list` requires OAuth scopes and can return 403 if not authorized. Source: https://developers.google.com/youtube/v3/docs/captions/list
- Quota impact for `captions.list` is 50 units per call. Source: https://developers.google.com/youtube/v3/docs/captions/list

### youtube_transcript_api (unofficial, Python)
- Fetches transcripts (including auto-generated) without an API key, supports language selection and transcript listing. Source: https://github.com/jdepoix/youtube-transcript-api
- Uses an undocumented YouTube API and warns it may break; IP bans are possible and proxies may be needed. Source: https://github.com/jdepoix/youtube-transcript-api

### yt-dlp (unofficial, CLI/Python)
- Supports subtitle discovery and download (`--list-subs`, `--all-subs`, `--write-subs`) and JSON output (`-j/--dump-json`). Source: https://github.com/yt-dlp/yt-dlp
- Outputs subtitles in formats like VTT/SRT which need parsing for transcript text. (Extraction is unofficial.)

### ytdl-core (unofficial, Node/TS)
- `getInfo()` returns formats/metadata; rate limiting (HTTP 429) is documented and mitigated via proxies/cookies. Source: https://github.com/fent/node-ytdl-core
- Repository is in community-maintenance mode (paused upstream). Source: https://github.com/fent/node-ytdl-core

### pytube (unofficial, Python)
- Features caption track support and outputs captions to SRT. Source: https://github.com/pytube/pytube

### YouTube.js / InnerTube (unofficial, Node/TS)
- A client for YouTube's private API (InnerTube); not affiliated with YouTube. Source: https://github.com/LuanRT/YouTube.js

### Subsequent additions
To add to our Fallback arsenal:
- https://www.transcripthq.io/ (60 credits per month)

### Summary ranking (transcripts)
1) **YouTube Data API captions.download** when we have owner OAuth. This is the only official path.
2) **youtube_transcript_api** for public videos: lightweight, but subject to IP blocks and breakage.
3) **yt-dlp** for public videos when robustness matters and heavier tooling is acceptable.
4) **YouTube.js / ytdl-core / pytube** as fallbacks only (private API or paused upstream).

### Exclusions / not fit for purpose
- **Public transcripts via official API**: captions text is not available without OAuth access to the video.

### Implementation Plan
#### Provider fallback (staged / triangular)
Stages are evaluated top-down. A blocking error in the primary provider of a stage skips the rest of that stage and moves to the next stage (starting from its primary provider).

Stage 1: `youtube_transcript_api` => `yt-dlp` => `youtubei.js` => `ytdl-core` => `pytube`  
Stage 2: `yt-dlp` => `youtubei.js` => `ytdl-core` => `pytube`  
Stage 3: `youtubei.js` => `ytdl-core` => `pytube`  
Stage 4: `ytdl-core` => `pytube`  
Stage 5: `pytube`  
Stage 6: Wait queue (60m, 3h, 6h, 12h)

#### Error taxonomy
- Blocking: rate-limit / IP block / captcha / HTTP 403/429 (provider-specific tokens).
- Non-blocking:
  - `invalid` (bad video ID) => write row with status `invalid`.
  - `no_transcript` / `unavailable` => keep probing remaining providers in the same stage; if all providers return `no_transcript`, write row with status `missing` and error `no_transcript`.
  - `tool_error` / `parse_error` / `empty` => keep probing within stage; if stage exhausted without a transcript and without any `no_transcript`, enter wait queue.

#### Wait queue rule
Enter wait queue as soon as a stage exhausts without any success and without any `no_transcript` result. After waiting, retry from the top of the current stage. If the primary provider returns a blocking error, advance to the next stage immediately.

#### CSV mapping (videos_transcripts.csv)
`video_id,duration,language_code,is_generated,is_translatable,transcript,status,error`
- `duration`: derived from `videos.csv` (ISO 8601 to `H:MM:SS` or `M:SS`)
- `status`: `ok | missing | invalid | error`
- `error`: store provider error string for all non-ok rows

#### Implementation notes
- `youtube_transcript_api` may expose `list()`/`fetch()` instead of `list_transcripts()` depending on version; handle both.
- Cookies can be injected via a custom requests.Session, but upstream notes cookie auth may be unreliable.
- Optional proxy env vars: `YT_TRANSCRIPT_PROXY`, `YT_TRANSCRIPT_HTTP_PROXY`, `YT_TRANSCRIPT_HTTPS_PROXY` (used by testing scripts).
