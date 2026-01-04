# Video Transcripts


## Table of Contents

- [Conversation](#conversation)
  - [Prompt 1](#prompt-1)
  - [Answer 1](#answer-1)
- [Evaluation](#evaluation)

## Conversation

Conversation with GPT 5.2:

### Prompt 1

Please again ultrathink hard on this:
Vielen Dank, du warst mir eine grosse Hilfe. Ich habe Kodex darum beauftragt, eine Evaluation durchzuführen bezüglich der geeigneten APIs, um an die Audio-Tracks von YouTube-Videos zu kommen und Folgendes war das Ergebnis der Evaluation und folgender Planungen:
"""
-## Evaluation
-### YouTube Data API v3 (official)
- `videos.list` exposes only `snippet.defaultAudioLanguage` for the default audio track. It does not list all audio-track languages. Source: https://developers.google.com/youtube/v3/docs/videos
- `fileDetails` (owner-only) includes `audioStreams` technical details, but no per-track language. Source: https://developers.google.com/youtube/v3/docs/videos

-### YouTube Data API v3 - captions (official, but not audio tracks)
- `captions.list` returns caption tracks with `snippet.language`, `snippet.trackKind`, and `snippet.audioTrackType`, but this is subtitle metadata, not audio-track language. Source: https://developers.google.com/youtube/v3/docs/captions
- `captions.list` requires OAuth scopes and returns 403 if not authorized. Source: https://developers.google.com/youtube/v3/docs/captions/list

-### yt-dlp (unofficial, player JSON)
- Supports subtitle discovery and extraction (`--list-subs`, `--all-subs`, `--write-subs`) and JSON output (`-j/--dump-json`). Source: https://github.com/yt-dlp/yt-dlp
- Audio-track languages are not a documented output field; they require parsing the player response. This is unofficial and can break when YouTube changes internals.

-### ytdl-core (unofficial, Node/TS)
- `getInfo()` returns formats and metadata; rate limiting (HTTP 429) is documented and mitigated via proxies/cookies. Source: https://github.com/fent/node-ytdl-core
- Repository is in community-maintenance mode (paused upstream). Source: https://github.com/fent/node-ytdl-core

-### YouTube.js / InnerTube (unofficial, Node/TS)
- A client for YouTube's private API (InnerTube); not affiliated with YouTube. Source: https://github.com/LuanRT/YouTube.js

-### pytube (unofficial, Python)
- Advertises caption track support and outputs captions to SRT. Source: https://github.com/pytube/pytube

-### Summary ranking (audio-track languages)
1) **yt-dlp** (Python, active, large community). Best fit for our stack, but still unofficial.
2) **YouTube.js (InnerTube)** if we later want a Node service.
3) **ytdl-core** only as a fallback (paused upstream, ratelimit-heavy).
4) **pytube** mainly for captions, not audio tracks.
5) **YouTube Data API** cannot deliver multi-audio language lists for third-party videos.

-### Exclusions / not fit for purpose
- **YouTube Data API**: no multi-audio language list for public videos; only default audio language.
- **Captions API**: captions are not audio tracks; useful as a fallback for language hints only.

-### Implementation Plan
-#### Goal
Build a resilient, multi-provider audio-track extractor with clear failover and backoff behavior, while keeping output consistent.

-#### Provider order and fallback
1) **yt-dlp** (primary)
2) **YouTube.js (InnerTube)**
3) **ytdl-core**
4) **Wait queue** (60 min, 3h, 6h, 12h)

-#### Rate-limit detection and failover rules
- A provider is considered "rate-limited" when it returns explicit 429/403 responses, or known throttling error strings from that tool.
- When rate-limited, mark provider unavailable with a timestamp and immediately try the next provider.
- When all providers are unavailable, enter wait queue (60 min, then 3h, 6h, 12h).
- After each wait period, test providers top-down until one succeeds; resume from that provider.

-#### Output rules (per video)
- Always write one row on success.
- If only a primary audio track exists, store that primary language (do not leave language fields empty).
- Only write error rows for non-rate-limit errors (invalid ID, removed, private, age-gate without cookies).
- Do not write rows on rate-limit errors (so they will be retried).

-#### Resume behavior
- On startup, skip videos that already have a successful row.
- Re-try rows marked with non-fatal errors (configurable).
- Use append-only writes with periodic file flush after each row.

-#### Implementation steps (script level)
1) Add per-provider adapters in `scripts/YouTube_Data/Audiotracks/`.
2) Add a provider manager in `audiotrack_query.py` to handle failover and backoff.
3) Standardize a common response schema across providers.
4) Add test mode to run a small batch and validate expected multi-audio samples.
"""
Nun haben wir die Umsetzung so gehandhabt, dass wir ein Audio Track Query Python-Script haben und eine Zahl von acht Tochter-Scripts, jeweils zwei bis 3 pro API-Anbieter. Und soweit funktioniert das mit den Audio-Track Erfassungen schon einwandfrei nach anfänglichen Problemen, die wir aber mittlerweile behoben haben.

Nun ist der Plan, dass wir ein ähnliches System aufbauen zum Anfragen der Video-Transcripts beziehungsweise Video-Untertitel. Zwar hatten wir damals vor knapp einem Jahr bereits ein Skript gebaut, welches mit der YouTube Transcript API und Transkripte beschert hat und soweit ich das gesehen habe, da hat das Skript vor knapp einem Monat auch noch immer funktioniert, wobei ich dem mittlerweile ein paar Zweifel entgegenbringe, weil seit paar Wochen ist aufgefallen, dass das Skript hinten vorne nicht mehr funktionstüchtig ist. Was den Verdacht erregt, dass die Abstracts, also die Zusammenfassungen der Videos alleine auf Basis des Titels und der Beschreibung zustande gekommen sind in den jüngsten Versuchen. So oder so wollen wir nochmals von Grund auf Skripte und zusammenbasteln, die uns für die Videos, die wir erfasst haben, die Transkripte (bzw. Untertitel, beschränkt jeweils auf die primäre Sprache des Videos) uns zieht.
Mein Auftrag an dich ist nun, bitte starte eine möglichst ausgiebige Recherche zu möglichen APIs, die wir für dieses Vorhaben verwenden könnten (Offizielles gibt es wohl leider nicht, das hierfür herhalten könnte); mache im Idealfall bitte gleich auch noch ausfindig, wie die computative Umsetzung der API-Calls jeweils aussieht (also wie man die APIs über eine YouTube-Vide-ID entsprechend ansteuern und in welcher Form die Transkripte zurückgegeben werden können). Und was auch noch eine recht brauchbare Information wäre: ob man in einer Anfrage jeweils auch mehr als nur ein Video angeben kann oder nicht. Bei der YouTube Data API beispielsweise kann man direkt eine ganze Seite à 50 Items uns zurückgeben lassen. Und wenn es so etwas auch für die Transkripte gäbe, ohne dabei die Quotas/Rate-Limitierung signifikant mehr-zu-belasten, wäre das natürlich sehr praktisch.

### Answer 1

Short answer:

* Für fremde Channels wie 3Blue1Brown gibt es nach wie vor **keine offizielle YouTube-API**, die dir zuverlässig Transkripte liefert.
* Praktisch alle funktionierenden Lösungen basieren auf **inoffiziellen Endpoints** der Web- oder Mobile-Clients oder auf Drittanbieter-APIs, die genau das für dich wrappen.
* Es gibt aber inzwischen ein paar sehr brauchbare, recht stabile Optionen – sowohl als Python-Libs (self-hosted) als auch als externe HTTP-APIs.

Ich gehe erst kurz über die offiziellen Möglichkeiten, dann über die brauchbaren inoffiziellen und schliesse mit einem Vorschlag, wie du das in dein bestehendes Mehr-Provider-System (wie bei den Audiotracks) integrieren kannst.

---

## 1. Offizielle YouTube Data API (Status 2025)

### 1.1 captions.list / captions.download

* `captions.list` gibt dir **nur Metadaten** der Untertitelspuren (ID, Sprache, Typ etc.), **nicht** den Text. ([Google for Developers][1])
* Den eigentlichen Text bekommt man nur über `captions.download`. Dieser Call:

  * hat eine hohe Quotakosten (200 Units / Call),
  * und laut Doku und Praxisbeispielen setzt er **Edit-Berechtigung am Video** voraus. ([Google for Developers][2])
* In der Praxis: Bei fremden Videos bekommst du oft 403 („permissions not sufficient“) oder 404.

**Batch-Support:**

* `captions.list` arbeitet **immer nur für ein `videoId` pro Request**.
* `captions.download` sowieso nur pro einzelner Caption-ID.

Für dein Projekt (Vsauce, Veritasium, 3Blue1Brown, …) ist das also realistisch **keine tragfähige Basis** – höchstens als Zusatz, falls ihr später eigene Videos habt.

---

## 2. Self-hosted Python-Lösungen (dein naheliegendster Weg)

### 2.1 `youtube-transcript-api` (jdepoix) – der Platzhirsch

**Was es macht**

* Python-Lib, die die von YouTube ausgelieferten Untertitel über einen inoffiziellen Web-Endpoint abholt.
* Unterstützt:

  * automatisch generierte & manuell erstellte Untertitel
  * Sprachauswahl nach Prioritätenliste
  * Auswahl, ob man manuelle oder automatische Untertitel bevorzugt
  * optional Übersetzung über YouTubes eigene Subtitle-Translation
* Kein API-Key nötig. ([GitHub][3])

**Programmier-Schnittstelle (neues API nach README)** ([GitHub][3])

```python
from youtube_transcript_api import YouTubeTranscriptApi

ytt = YouTubeTranscriptApi()

# 1) Direkt eine Transcript-Version holen (mit Sprach-Prioritäten)
fetched = ytt.fetch(
    video_id,
    languages=['de', 'en']  # Prioritätenliste
)

# fetched ist ein FetchedTranscript-Objekt
raw = fetched.to_raw_data()
# raw: List[{"text": str, "start": float, "duration": float}, ...]
language = fetched.language_code   # z.B. "de"
is_generated = fetched.is_generated  # bool
```

**Verfügbare Sprachen ermitteln und manuelle vs. auto auswählen**

```python
from youtube_transcript_api import YouTubeTranscriptApi

ytt = YouTubeTranscriptApi()

transcript_list = ytt.list(video_id)

# z.B. "manuell bevorzugen, wenn vorhanden"
t = transcript_list.find_manually_created_transcript(['de', 'en'])
data = t.fetch().to_raw_data()

# Metadaten:
print(
    t.video_id,
    t.language_code,
    t.is_generated,
    t.is_translatable,
    t.translation_languages,
)
```

Damit kannst du sehr präzise:

* „nur manuell erstellte Untertitel“ oder
* „nur automatisch generierte“ oder
* gemischt, aber mit definierter Priorität

abfragen. ([GitHub][3])

**Mehrere Videos pro Request?**

* In der **Python-API**: Nein, **immer ein Video pro Call**.
* In der **CLI** kannst du zwar mehrere IDs angeben (`youtube_transcript_api <id1> <id2> ...`), aber intern sind das auch nur Einzelrequests nacheinander. ([GitHub][3])
* Für dein Batch-System bedeutet das: Schleife / Parallelisierung selbst bauen (so wie du es bei den Audiotracks machst).

**Output-Format**

* Entweder `FetchedTranscript` (Iterable von Snippets) oder mit `to_raw_data()` eine Liste von Dicts:

```python
[
  {"text": "Hey there",      "start": 0.0,  "duration": 1.54},
  {"text": "how are you",    "start": 1.54, "duration": 4.16},
  ...
]
```

Genau das, was du für Summarizer, Topic-Mapping etc. brauchst. ([GitHub][3])

**Stabilität & IP-Thema**

* Projekt ist aktiv gepflegt (Release z.B. v1.2.3 im Oktober 2025, ~6,6k Stars). ([GitHub][3])
* Maintainer dokumentiert explizit, dass YouTube **Cloud-IPs und hohes Request-Volumen** verstärkt blockt (RequestBlocked / IpBlocked) und dafür Proxy-Unterstützung eingebaut wurde. ([GitHub][3])
* Dein altes Script, das „plötzlich nichts mehr gefunden hat“, passt genau zu diesem Muster: YouTube hat seine Anti-Bot-Mechanik verschärft; ohne Anpassung läuft man in Fehler.

---

### 2.2 `simple-yt-api` (Python Wrapper)

Das ist ein relativ neues, leichtgewichtiges Wrapper-Projekt, das genau dein Use-Case-Profil im Blick hat: „Video-Metadata + Transcript, kein API-Key“. ([GitHub][4])

**Features (laut README)** ([GitHub][4])

* Video-Metadaten (Titel, Thumbnail, Kurzbeschreibung)
* Transkripte in verschiedenen Sprachen
* Kein API-Key, verwendet ebenfalls inoffizielle Endpoints
* Convenience-Methode, die beides in einem Rutsch liefert

**API-Beispiel**

```python
from simple_yt_api import YouTubeAPI

yt = YouTubeAPI()

metadata, transcript = yt.fetch_all(
    url_or_id="dQw4w9WgXcQ",
    language_code="en",
    output_format="json",  # oder "text"
)

print(metadata.to_dict())
print(transcript)  # List[Dict] oder String
```

Oder nur das Transcript:

```python
transcript = yt.fetch_transcript(
    url_or_id="dQw4w9WgXcQ",
    language_code="de",
    output_format="json",
)
```

**Fehlerbehandlung**

* Hat spezialisierte Exceptions wie `TranscriptsDisabled`, `NoTranscriptFound`, `IpBlocked`, `RequestBlocked`. ([GitHub][4])

**Batch / mehrere Videos**

* Kein Multi-ID-Endpunkt, wieder: **ein Video pro Call**, Schleife in deiner Logik.

**Pro / Contra im Vergleich zu `youtube-transcript-api`**

* Pro: Sehr einfache, high-level API; du bekommst Metadaten+Transcript in einem Schritt.
* Contra: Kleines Projekt, wenige Stars; funktional aber vergleichsweise „dünne“ Community im Vergleich zu `youtube-transcript-api`. ([GitHub][4])

Für dein Setup würde ich das **höchstens als sekundären Provider** nach `youtube-transcript-api` verwenden.

---

### 2.3 `yt-dlp` – „Catch-all“-Fallback über Untertitel-Download

`yt-dlp` kennst du schon von deiner Audio-Evaluation; es kann auch Untertitel sehr zuverlässig erkennen und in unterschiedliche Formate speichern. ([GitHub][5])

**Beispiel: Untertitel einer Sprache als VTT holen**

Command-Line:

```bash
yt-dlp \
  --skip-download \
  --write-subs \
  --sub-lang "de" \
  --sub-format "vtt" \
  -o "%(id)s.%(ext)s" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

In Python (vereinfacht):

```python
import yt_dlp

def fetch_subtitles(video_id: str, lang="de"):
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        "skip_download": True,
        "writesubtitles": True,
        "subtitleslangs": [lang],
        "subtitlesformat": "vtt",
        "outtmpl": "%(id)s.%(ext)s",
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
    # danach VTT-Datei einlesen und parsen
```

**Batch**

* `yt-dlp` kann mit einer Textdatei voller URLs oder mit kompletten Playlists umgehen, aber **aus Sicht von YouTube** sind das trotzdem Einzelrequests pro Video.
* Für dein Rate-Limit-Konzept kann es aber als **„schwerer Hammer“** dienen, falls alle anderen Librarien an einzelnen Videos scheitern, du aber *unbedingt* irgendein Subtitle-Artefakt haben möchtest.

---

## 3. Node / TypeScript (falls du einen kleinen Transkript-Service daneben stellst)

### 3.1 `youtubei.js` (YouTube.js / Innertube)

Das ist eine Node-Client-Bibliothek für YouTubes interne „InnerTube“-API, mit der man u.a. auch Transkripte bekommt. ([Medium][6])

**Beispiel (aus einem aktuellen Gist)** ([Gist][7])

```ts
import { Innertube } from "youtubei.js";

async function getVideo(videoId: string) {
  const youtube = await Innertube.create();
  const info = await youtube.getInfo(videoId);

  let transcript = null;

  try {
    const transcriptData = await info.getTranscript();
    const segments = transcriptData.transcript.content.body.initial_segments;

    if (segments && segments.length > 0) {
      transcript = segments
        .filter((segment) => segment.snippet && segment.snippet.text)
        .map((segment) => ({
          text: segment.snippet.text,
          start_ms: segment.start_ms,
        }));
    }
  } catch (e) {
    console.warn("No transcript:", e.message);
  }

  return {
    id: info.basic_info.id,
    title: info.basic_info.title,
    transcript, // Array<{ text, start_ms }>
  };
}
```

**Batch**

* Auch hier: **ein Video pro `getInfo`-Call**; Batch-Processing baust du selbst über eine Queue / Worker-Pool.

**Einsatz in deinem System**

* Du könntest – analog zu deiner Audio-Provider-Kette – einen Node-Service hinstellen, der via HTTP `GET /transcript?videoId=...` anbietet und intern `youtubei.js` nutzt.
* Vorteil: Wieder ein **technologisch unabhängiger Provider** zu den Python-Libs.

---

### 3.2 `youtube-caption-extractor` (Node)

Im RoundProxies-Artikel zu YouTube-Captions wird `youtube-caption-extractor` als „reliable in 2026“ genannt. ([Roundproxies][8])

**Minimalbeispiel aus dem Artikel** ([Roundproxies][8])

```js
const { getSubtitles } = require('youtube-caption-extractor');

const videoID = 'dQw4w9WgXcQ';

getSubtitles({ videoID, lang: 'en' })
  .then(captions => {
    captions.forEach(c => {
      console.log(`[${c.start}s] ${c.text}`);
    });
  })
  .catch(err => console.error('Error:', err));
```

* Output: Liste von Objekten `{ text, start, duration }`.
* Multi-Video: wieder nein, ein Video pro Aufruf.

Für dich eher interessant, wenn du sowieso noch Node-Komponenten baust; ansonsten ist `youtube-transcript-api` in Python die direktere Lösung.

---

## 4. Gehostete Transcript-APIs (SaaS)

Wenn du dir Proxy-Handling, IP-Bans und YouTube-Änderungen nicht ans Bein binden willst, gibt es inzwischen einige spezialisierte Dienste. Wichtig: Kosten, Vendor-Lock-in und Datenschutz für dein Bildungsprojekt kritisch prüfen.

### 4.1 youtube-transcript.io

* Bietet eine dedizierte REST-API mit Batch-Support:

  * `POST /api/transcripts`
  * JSON-Body mit `ids: [ ... ]`, bis zu **50 Video-IDs pro Request**.
  * Rate-Limit laut Doku: z.B. 5 Requests / 10 Sekunden.
* Antwort ist JSON mit Transkripten je Video (Segment-Liste mit Text + Zeit).

**Beispiel (vereinfacht)**

```http
POST https://youtube-transcript.io/api/transcripts
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "ids": ["VIDEO_ID_1", "VIDEO_ID_2"],
  "lang": "de"
}
```

Antwort: ungefähr

```json
{
  "VIDEO_ID_1": [
    { "text": "...", "start": 0.0, "duration": 2.1 },
    ...
  ],
  "VIDEO_ID_2": [
    ...
  ]
}
```

**Batch-Fähigkeit:**

* Ja, echte **Multi-Video-Requests (bis 50 IDs)**; das ist genau das, was du dir gewünscht hast.

---

### 4.2 SerpApi – YouTube Video Transcript API

* SerpApi (bekannt von „Google Search API“) bietet auch einen „youtube_video_transcript“-Engine. ([YouTube Transcript][9])
* Aufruf (schematisch):

```http
GET https://serpapi.com/search
  ?engine=youtube_video_transcript
  &v=VIDEO_ID
  &api_key=YOUR_API_KEY
```

* Antwort ist JSON mit Transkript-Segmenten. ([YouTube Transcript][9])

**Batch**

* Offiziell: **ein Video pro Request**; du musst parallelisieren oder queue-basiert arbeiten.

---

### 4.3 Scrapingdog – YouTube Transcript API

Scrapingdog hat einen dedizierten YouTube-Transcript-Endpoint und zeigt in einem Python-Tutorial, wie man ihn nutzt. ([scrapingdog][10])

**Beispiel-Code** ([scrapingdog][10])

```python
import requests

api_key = "your-api-key"
url = "https://api.scrapingdog.com/youtube/transcripts/"

params = {
    "api_key": api_key,
    "v": "deXSHXI8HuU",   # Video-ID
    # optional: "language": "de"
}

r = requests.get(url, params=params)
data = r.json()
```

* Output: JSON mit Transkript (Segmentliste); im Tutorial wird explizit gezeigt, dass man mit einem `language`-Parameter die Sprache wählen kann. ([scrapingdog][10])

**Batch**

* Laut Doku: Parameter `v` ist eine einzelne Video-ID → **kein Multi-Video-Request**, also Loop.

---

### 4.4 Weitere: SupaData, SearchAPI etc.

* `supadata.ai` wirbt mit einer „YouTube Transcript API“ mit REST-Interface; sie sind u.a. Sponsor von `youtube-transcript-api`. ([Supadata][11])
* `searchapi.io` hat ebenfalls einen YouTube-Transcript-Endpunkt (wird im README von `youtube-transcript-api` erwähnt). ([GitHub][3])

Die Muster sind immer ähnlich:

* HTTP-Request mit `video_id` oder `url`, optional `language`.
* JSON-Antwort mit Segmentliste.
* Preis- und Rate-Limitservice-spezifisch.

---

## 5. Was heisst das konkret für dein Projekt?

Du hast bereits:

* Ein Python-basiertes Multi-Provider-System für **Audiotracks** mit Failover, Rate-Limit-Erkennung, Backoff und Append-only-CSV.
* Ein klar strukturiertes Ziel: **Pro Video genau ein Transcript** in der primären Sprache der Ressource („Primärsprache“ vermutlich via Audiotrack-Erfassung bekannt).

Ich würde für Transkripte analog folgendes vorschlagen:

### 5.1 Provider-Ranking für Transkripte

1. **`youtube-transcript-api` (Python, self-hosted)**

   * Primärer Provider.
   * Du nutzt:

     * `list(video_id)` → Sprachen + `is_generated`
     * `find_manually_created_transcript([primary_lang, 'en', ...])` als idealer Weg
     * Fallback auf `find_generated_transcript` falls keine manuellen Untertitel vorliegen. ([GitHub][3])

2. **`simple-yt-api` (Python Wrapper)**

   * Zweiter Provider im Stack.
   * Gleiche Input-/Output-Struktur (ID rein, Segment-Liste raus). ([GitHub][4])

3. **Node-Service mit `youtubei.js`**

   * Dritter Provider, um eine **technisch andere Codebasis** zu haben (hilft, wenn eine Lib kurzzeitig kaputtgepatcht ist). ([Gist][7])

4. **SaaS-API (z.B. youtube-transcript.io)**

   * Optional als „Escape Hatch“, wenn:

     * Self-hosted IP-Pools/Proxies zu aufwendig sind
     * du für einen gewissen Teil der Videos ein hochwertiges, SLA-gestütztes Transcript brauchst
   * Besonders attraktiv, wenn du **Batch-Requests** (bis 50 IDs) ausnutzen willst, um dein Backlog schneller abzubauen.

5. **`yt-dlp`-Subtitles**

   * Ganz am Ende der Chain, wenn alle anderen Wege scheitern.
   * Du bekommst dann immerhin VTT/SRT, die du notfalls selbst parst.

### 5.2 Typischer Ablauf pro Video (Schema)

Für jede Video-ID:

1. Prüfen, ob bereits ein erfolgreiches Transcript in deiner DB vorliegt → wenn ja, überspringen.
2. Provider 1 (`youtube-transcript-api`):

   * `list(video_id)`
   * Versuchen: manuell in `primary_lang`
   * Sonst: auto-generated in `primary_lang`
   * Sonst: Fallback-Sprachen (z.B. `['en']`)
   * Erfolgreich → row schreiben, fertig.
   * Bestimmte Exceptions (TranscriptsDisabled/NoTranscriptFound) als „finaler Fehler“ markieren. ([GitHub][3])
3. Provider 2 (`simple-yt-api`) mit gleicher Sprachlogik. ([GitHub][4])
4. Provider 3 (`youtubei.js` Service)
5. Provider 4 (z.B. youtube-transcript.io, ggf. batched für ein Set von Videos) ([YouTube Transcript][9])
6. Provider 5 (`yt-dlp`) als letzte Option.

Rate-Limit-Handling, Backoff, „Wait Queue“ etc. kannst du praktisch 1:1 aus deinem Audiotrack-System übernehmen.

### 5.3 Batch-Fähigkeit – Übersicht

| Lösung                    | Multi-Video pro Request?                                          |
| ------------------------- | ----------------------------------------------------------------- |
| YouTube Data API captions | Nein, 1 Video / Request              ([Google for Developers][1]) |
| youtube-transcript-api    | Python-API: nein; CLI: ja, aber intern 1/Video ([GitHub][3])      |
| simple-yt-api             | Nein (1 URL/ID pro Call) ([GitHub][4])                            |
| youtubei.js / Innertube   | Nein (1 `getInfo` pro Video) ([Gist][7])                          |
| youtube-caption-extractor | Nein (1 VideoID pro Call) ([Roundproxies][8])                     |
| youtube-transcript.io     | **Ja, bis 50 IDs pro Request**                                    |
| SerpApi                   | Nein, 1 Video pro Request ([YouTube Transcript][9])               |
| Scrapingdog               | Nein, 1 Video pro Request (Param `v`) ([scrapingdog][10])         |

---

Wenn du magst, kann ich im nächsten Schritt direkt:

* ein kleines Schema für deine gemeinsame **Transcript-Tabelle** (CSV/DB) skizzieren, die sich sauber mit deiner bestehenden Audiotrack-Tabelle verbinden lässt (z.B. via `videoID`, `primary_audio_lang`, `primary_transcript_lang`, `is_generated`, `provider`, …),
* oder einen konkreten Prototyp-Adapter für `youtube-transcript-api` in deinem bestehenden Skript-Layout ausformulieren.

[1]: https://developers.google.com/youtube/v3/docs/captions/list?utm_source=chatgpt.com "Captions: list | YouTube Data API"
[2]: https://developers.google.com/youtube/v3/docs/captions/download?utm_source=chatgpt.com "Captions: download | YouTube Data API"
[3]: https://github.com/jdepoix/youtube-transcript-api "GitHub - jdepoix/youtube-transcript-api: This is a python API which allows you to get the transcript/subtitles for a given YouTube video. It also works for automatically generated subtitles and it does not require an API key nor a headless browser, like other selenium based solutions do!"
[4]: https://github.com/SoAp9035/simple-yt-api "GitHub - SoAp9035/simple-yt-api: A simple and easy-to-use YouTube API Wrapper."
[5]: https://github.com/jdepoix?utm_source=chatgpt.com "Jonas Depoix jdepoix"
[6]: https://medium.com/%40aqib-2/extract-youtube-transcripts-using-innertube-api-2025-javascript-guide-dc417b762f49?utm_source=chatgpt.com "📜 Extract YouTube Transcripts Using Innertube API (2025 ..."
[7]: https://gist.github.com/kellenmace/2b597319990cf0c3c1fb525e90b7b5bd "get-youtube-video-with-transcript.js · GitHub"
[8]: https://roundproxies.com/blog/scrape-youtube-captions/ "How to Scrape Captions from YouTube"
[9]: https://www.youtube-transcript.io/api "Youtube Transcript API"
[10]: https://www.scrapingdog.com/blog/scraping-youtube-transcript-using-python/ "How to Scrape YouTube Transcript using Python"
[11]: https://supadata.ai/youtube-transcript-api "Free API to Get the Transcript of a YouTube Video (2026)"

<Ende der Conversation>


## Discord Coversation with TranscriptsHQ Dev

heyo — 01.01.2026 08:50
Hey bro, saw you hanging out in the transcribe discord, I was also a previous user of youtube-transcripts until recently when it kept going down with a bunch of errors.

I also realised that it only extracts native captions and cannot actually like transcribe from audio as a fallback.

I made my own saas called https://transcripthq.io/ to combat this

It's free to get started with and you can extract thousands of transcripts from not just youtube (many more platforms supported)

that's all, feel free to try it out 🙂
TranscriptHQ
TranscriptHQ
Extract word-for-word transcripts in bulk from YouTube, TikTok, Twitter & more. AI-powered transcription with noise reduction, 100+ language translation, and 95% accuracy. Simple API, credit-based pricing.
TranscriptHQ
Trummler 🌱

 — 01.01.2026 09:13
Oh wow! Gotta try this out then!
Wait, have you seen my Use Case?
heyo — 01.01.2026 09:23
yup, you'd need the title, description of the video and the transcript right? in bulk 
Answering your questions: 

Best approach for 10K+ videos:

Use our batch API, submit video IDs (or full URLs), we handle everything
We use proxy rotation internally, so no rate limiting issues
Response includes: title, description, transcript, segments (with timestamps), language

What counts toward usage:
1 credit = 1 video with native YouTube captions (flat rate, regardless of length)

If a video has no captions then we auto transcribe with Whisper at 1 credit/minute

Educational channels like Vsauce/Kurzgesagt almost always have captions, so expect ~1 credit per video

Bulk discounts:
No per-request overhead - submit 50 or 500 video IDs in one call, same credit cost

For 10K videos: ~$100-150 total (mostly native captions)

We can discuss enterprise pricing if you're scaling beyond that

Videos without transcripts:
Automatic Whisper fallback:  you don't need to do anything
We download audio, transcribe via Groq Whisper, return same format
Billed per-minute for these (typically ~5-10% of educational videos)
Speed estimate for 10K videos:
~3-5 hours with Business tier (5 parallel workers)
Can bump to 20+ workers for enterprise if needed

API response example:

{
  "video_id": "abc123",
  "title": "What Is The Speed of Dark?",
  "channel": "Vsauce",
  "description": "Hey Vsauce, Michael here...",
  "transcript": "Hey Vsauce, Michael here. Light travels at...",
  "segments": [{"text": "Hey Vsauce", "start": 0.0, "end": 1.2}, ...],
  "language": "en"
}
Trummler 🌱

 — 01.01.2026 10:18
Title and Description are already present from the YouTube Data API;
Also, I'm just an applicant and pretty much required to keep investments at a minimum;
And those "more than 10k Videos" are just a status Quo (current sample of 25k Videos minus the expected number of Videos that are below a certain threshold in length);
We're planning to add LOTS of more YouTube Channels onto our list, so in the long terms, 100k+ Videos shouldn't be unrealistic;
So even though one Video only needs to have its Transcript pulled at most once per project version as soon as all the logic is standing and distributing all Requests across different days/months also isn't a problem, investments beyond 10$ in total currently aren't really feasible and based on your description, we'd need to plan for a 4-digit investment :/
Which is... ouf
and also looking similar to the problems we're having with most other alternatives we've tried to look at
So it pretty much looks like we currently need to live with the 2000 Videos we've already 'abstracted' about a year ago for the time being - which is kind of a bummer, but the overall idea isn't that hurt regarding the Proof-Of-Concept version we're working on 🤔
heyo — 01.01.2026 12:21
Hey, I totally get where you're coming from, budget constraints are real and I've been there.

So here's the thing: I actually just launched this service and I'm looking for early users to stress test it with real bulk workloads. Your 25K video use case is exactly the kind of thing I want to battle test.

 I can do $25 one time for 25K YouTube transcripts (25,000 credits).

Most YouTube educational content already has captions baked in, I'm just extracting them, not running expensive AI transcription so your cost ends up being ~$0.001 per video in most cases.

How it'd work:

Pay $25 (I'll manually add 25K credits to your account) using this link
https://dodo.pe/transcripthq-25000
Hit the API with skip_metadata: true for fast bulk processing
1 video with native captions = 1 credit

Honestly, I'd love to see how the system handles a real 25K job from someone building something cool. If you hit any issues, I'll work with you to fix them,  that's the value I get from this.

If you're down, just shoot me your email and let me know.
TranscriptHQ | Checkout | Dodo Payments
TranscriptHQ - 25,000 Credits (One-time) | TranscriptHQ
Complete your checkout with TranscriptHQ
TranscriptHQ - 25,000 Credits (One-time) - TranscriptHQ
Trummler 🌱

 — 01.01.2026 17:50
That actually sounds pretty interesting 👀
(UPDATE: The concerns described below are unjustified)
However, I'll first have to build the Script that wires everything together;
The Logic I've planned so far in this regard:
**`\scripts\video_to_source.py`** [PLANNED]
For each entry in `\csv\youtube\videos.csv`:
=> if `this.duration` < `MIN_DURATION` (e.g. 60s ~ 3min): discard the video.
  => `\csv\youtube\video_to_source_log.csv` (status: too short); Go to next Video.
=> `str this.transcript` = `get_transcript(this.video_id)`;
=> `str[] this.comments` = `this.transcript.length()` < [THRESHOLD] ? `get_comments(this.video_id)` : `[]` (Uses the YouTube Data API to pull the first page of best rated comments of this video, _unless_ the length of the transcript itself is already above a certain threshold)
=> `str ai_input1` = (video title + video description + [video transcript + as many top comments as needed to get above the 'transcript length THRESHOLD'])
=> `str ai_input2` = (video title + video description + [the 'transcript length THRESHOLD' worth of top comments])
=> `int poison_rating` = [OpenAI text-embedding-3-small score between "nonsensical" and `ai_input1`]
=> `int edu_rating` = [OpenAI text-embedding-3-small score between "educational" and `ai_input1`]
=> `int edu_rating2` = [OpenAI text-embedding-3-small score between "educational" and `ai_input2`]
=> `boolean poisoned` = [high `poison_rating`]
  => if (low `edu_rating` & `poisoned`) OR (low `edu_rating2` & `poisoned`): discard the video.
    => `\csv\youtube\video_to_source_log.csv` (bad status); Go to next Video.
  => else: proceed.
=> `abstract` = `get_abstract(poisoned ? ai_input2 : ai_input1)` (ai interface creates a scientific-ish abstract for this video)
=> `\csv\youtube\t_source_PLANNING.csv` (new preparational Source entry with this video's metadata + `abstract` as 'description'; Will then be manually migrated to `\csv\t_source.csv` as soon as approved)
However, it will take some time until everything is standing as planned to properly ad-hoc-use the transcripts.

The reason for this ad-hoc-approach instead of saving all those Transcripts in a file and then use it later is WAS that I was worried that saving all those Transcripts would be more than what my Laptop would be able to handle,
BUT I've just realized that 400GB of free storage should be MORE than enough for the Transcripts of say >1 Million videos, given that 400GB = 400'000MB and 10 Transcripts appear to require around 500KB...
Well, that appears to suffice WAY easier than I could have ever expected 😅
Okay, my plan shall now be as follows:
Wire everything up so I can bulk-request ALL the Transcripts I can to then save them into my video_transcripts.csv (I'll probably have to .gitignore that file, don't I? Doesn't git have some limits to the total file size of a project?)
condition: contentDetails.caption == "true"
QUESTION (for future extension of the requesting script): In case contentDetails.caption == "false", in what cases might it reasonable to generate a Transcript? One Guard might be to ask an embedding model for the distance between [the Video's Title + Description + Top 50 comments] and "educational video"; Below certain value: => empty Transcript with error code "low educational score"; Also, if a video has no default_audio_language and/or no default_language (or whatever might be the most valuable indicator here), the video might not even have any speech to begin with. BUT I guess this problem can easily be postoned since pretty much every successful video has captions; And in case a Video has NOT been successful (or no audio to begin with), it's very likely to NOT be very educational and thus not deserving any captions

Well, if you'd like to add anything beyond that: feel free!
I'll now to proceed tinkering and prepare to have all transcript-related stuff wired up (and tested) as soon as possible!
heyo — gestern um 06:01 Uhr
Nice pipeline design! A few thoughts on your workflow: Your embedding-based filtering is clever. 

One suggestion: run the edu_rating check after getting transcripts rather than before - the transcript content is much stronger signal than title/description/comments for determining educational value.
Comments especially can be noisy. 

On storage: Yes, .gitignore it. GitHub has a 100MB per-file limit and repos soft-cap at 1GB. For 1M+ transcripts, you'll want to store them in a database or object storage anyway (easier to query/filter later). 

On contentDetails.caption == "false": Cases where Whisper transcription makes sense:
Much Older educational channels without auto captions
Non-English content (many languages lack auto-captions)
Podcast-style videos where audio is primary
Channels that disabled auto-captions for some reason
Your "check if educational first" approach is smart for cost savings. Though honestly, if you're bulk-processing, the simpler approach is: try native captions first (free/cheap), only fall back to Whisper for high-value videos you've already validated. On the bulk workflow: When you're ready to pull transcripts at scale, our API has a skip_metadata mode that creates jobs instantly without upfront validation - useful when you already know which video IDs you want. Just POST an array of video IDs and we process them in parallel. 

Hit me up when you're ready to test at scale, happy to help you optimize the pipeline. 
Trummler 🌱

 — 10:11
Is there any max batch size or at least a recommended one to define in my script?
heyo — 11:05
Here are the limits: 

Per-request batch size:
No hard max on video IDs per request
Recommended: 100-500 videos per job for manageability
We process them in parallel internally based on your tier

I'll assign your account to business tier which gives you:
5 concurrent jobs
500 req/min rate limit

Practical recommendation:

Batch size: 100-200 videos per job
Parallel jobs: Up to 5 at once
So you could fire off 5 jobs of 200 videos each (1,000 total) and they'll all process in parallel. For 10K+ videos, chunk them into batches and submit sequentially as jobs complete. Use skip_metadata=true for instant job creation - no validation bottleneck. Example flow for 10K videos:
Split into 50 batches of 200
Submit 5 batches initially (fills your concurrent slots)
Poll /v1/jobs/{id} for completion
As each finishes, submit next batch
Collect results from /v1/jobs/{id}/result
Trummler 🌱

 — 11:57
Ok wow, with finally implementing a FULLY-ID-based approach, I could get the YouTube Data API Usage down to 4% of the daily quote when doing an Update Run with around 5 new Channels;
And for an 'idle' Update Run (Checking through all Channel's first page of Videos and through all their Playlists for any changes), it's even less than 2%;
And a FULL Run across all 96 Channels currently only takes about 33% of the Daily Quota!
=> The YouTube Data API can't ever be our bottleneck anymore unless I'm starting to reach a Channel Count of >1000-2000
Bild
Trummler 🌱

 — 13:06
Hahahahaha
Bild
This was the Video:
https://www.youtube.com/shorts/8E0xpctNfxs?feature=share
YouTube
Atlas Pro
not the flowers i was looking for
Bild
heyo — 13:15
lol
Just so you know, your account is still on the free tier so only one concurrent process will take place meaning it'll be slower, once you're ready to scale to business tier and you'll be able to process 5 videos at once
Also, most of Atlas Pro's shorts have no spoken content - they're just repurposed clips from his long-form videos. You might want to limit or skip shorts entirely, and this applies to other channels too since shorts are usually just recycled material
Trummler 🌱

 — 13:26
I know, but for testing purposes, this was sufficient;
But gotta say, every transcript takes what feels like around a minute, even when it's just an AtlasPro Short without any Speech in it; So even with 5 tasks running in parallel, 10000 videos would take around 34h to be fully processed 🤔
So apparently, 30 req/min rate limit and 500 req/min rate limit can only be reached when Multi-Threading with around 30 and 100 Threads respectively?
~for my case, in case the behavior I'm experiencing is different from what it should be
Seriously, how is there something,
why do those shorts have Subtitles defined on them
Bild
"rest be west"
heyo — 13:31
Hey I just checked the logs and it seems like you didn't add the skip_metadata:true parameter which is what's causing the delay, it's taking like 20-40 seconds and does the upfront scan of duration of vid, try it out with skip metadata turned on and let me know how it looks
it should realistically take like 2-4 seconds per vid max
heyo — 13:33
These vids won't have native subs so the audio is downloaded and processed in backend which could return something like this
Trummler 🌱

 — 13:36
Aaaah, okay xD
Trummler 🌱

 — 13:36
I should deactivate that
Trummler 🌱

 — 14:35
Is it possible to have the API return the language_code of the Transcript after choosing "auto"?
This is all fields I'd like to have in my videos_transcripts.csv:
video_id,duration,language_code,is_generated,is_translatable,status,error,transcript

Which of there are possible and which aren't?
Trummler 🌱

 — 15:01
Important Questions so I can wire your API cleanly:
1) What is the exact request flag name to force **native captions only** (disable Whisper fallback)?
2) In the per-video response, what field should I read for language? (`language` vs `language_code`?)
3) Is there a field that tells me whether the transcript is **auto-generated vs manual**, and/or **Whisper**? (e.g. `is_generated`, `generated`, `source`, `engine`, `transcript_source`)
4) Is there a field that tells me **translatable** status? (`is_translatable` / `translatable`?)

Docs gaps I ran into (so I can document this correctly on my side):
- Public docs only show a minimal response (video_id/status/title/duration_seconds/transcript/segments) and don't list a full field schema.
- Public blog says "up to 100 IDs per request," while you said "no hard max, recommended 100–200."
- I couldn’t find any mention of a native-only flag or Whisper source indicator in the docs.

If you can confirm the exact field names + native-only flag, I’ll implement it right away. Thanks!
heyo — 16:22
1. native_only should be set to true in API (Just pushed this update so this flag won't be in docs)

2. "language" (also note that we return "whisper" for transcribed from audio but the actual language code for native captioned vids (looking on ways to improve this for whisper, but I'm assuming this wouldn't matter for your use case now))

3. Yes, I've pushed an update to get is_generated which differentiates between whether if it was auto made by yt or if it was done by manual human intervention. (Not sure if this is what you asked for, if you're looking to diff between if it's native or whisper, you can make use of isNative field which is a bool)
isGenerated will be null if its native captions

4. All transcripts are translatable since once we get the original transcript, if you'd have set the "translate to" to some language, it'll translate it

Docs gaps - clarifications:
Full response schema - You're right, we need to document this better. Here's the complete per-video response:

{
  "video_id": {
    "status": "done|failed|processing|pending",
    "title": "Video Title",
    "channel": "Channel Name",
    "description": "...",
    "durationSeconds": 212.5,
    "transcript": "Full transcript text...",
    "segments": [{"text": "...", "start": 0, "duration": 5.2}],
    "wordCount": 500,
    "language": "en",
    "isNative": true,
    "isGenerated": true,
    "error": null
  }
}
If translation was applied:

{
  "language": "en",
  "originalLanguage": "ta",
  "transcript": "Translated text",
  "originalTranscript": "Original Tamil text"
}


Batch size - Docs is probably outdated. No hard max, recommended 100-200 for optimal performance. Larger batches work but may timeout on validation if not using skip_metadata: true.

Transcript source indicators:
isNative: true = YouTube captions, false = Whisper
isGenerated: true = YouTube auto-captions, false = manual/human captions, null = Whisper

Will update the docs soon...
Trummler 🌱

 — 16:58
This is a response I've got from the API; No isGenerated field (which I need for some Info on Caption Quality when going for the Abstract later)

Might I have done something wrong?
{
  "completed_at": "2026-01-03T15:54:21.723000",
  "created_at": "2026-01-03T15:54:12.713000",
  "credits_used": 1,
  "job_id": "69593ba4839372efabd19858",
  "service_type": "youtube",... (45 kB verbleibend)
Mehr anzeigen
temp_transcripthq_response.json
95 kB
heyo — 17:04
Hey I've revised the response method on my end, you can try it out now and it should properly respond 

(...)

Trummler 🌱

 — 15:12
Something appears to be stuck
https://www.transcripthq.io/dashboard/jobs/695a72dc33001e7179065730
TranscriptHQ
TranscriptHQ
Extract word-for-word transcripts in bulk from YouTube, TikTok, Twitter & more. AI-powered transcription with noise reduction, 100+ language translation, and 95% accuracy. Simple API, credit-based pricing.
TranscriptHQ
heyo — 15:19
I think the actual vids are done, has to be a problem with the summary calculation
cuz i can see that it says 99 done and 1 failed underneath but uptop it says still processing with 98 vids which must be an error 
Trummler 🌱

 — 15:20
Bild
heyo — 15:20
Bild
Trummler 🌱

 — 15:20
Do I need to do something or is it something to solve on your side?
Shall a ctrl+c the script and restart it or should I just wait?
heyo — 15:21
wait i dont understand? is it stuck at processing for you now?
you can repoll and get all the vids data right?
Trummler 🌱

 — 15:21
Ah, with no extra quota usage?
Okay, wait 
heyo — 15:21
yep one sec
im pushing an update to make sure this doesnt happen again
sys will be down for a sec
should be up now
Trummler 🌱

 — 15:23
Looks like it didn't recognize the already processed Videos of the previous batch
I'll get back to you as soon as something seems weird again
Trummler 🌱

 — 15:38
There appears to be a hangup again:
https://www.transcripthq.io/dashboard/jobs/695a79d32d5ec3cb10631cfd
But of a different type this time: 2 Videos stuck in Processing
TranscriptHQ
TranscriptHQ
Extract word-for-word transcripts in bulk from YouTube, TikTok, Twitter & more. AI-powered transcription with noise reduction, 100+ language translation, and 95% accuracy. Simple API, credit-based pricing.
TranscriptHQ
Wait, one of them has just finished
Nah, the other one is still processing
Trummler 🌱

 — 15:41
Bild
heyo — 15:42
It must've got dropped mid-request (proxy timeout or something like that since there's nothing in my logs). Just submit a new job with just that one video ID.
Trummler 🌱

 — 15:44
"Just submit a new job with just that one video ID."
I'd have to restructure the whole Script

Oh, and I'm just seeing the Video has finally processed;
Apparantly, you've just been a little too late to see it xD
Trummler 🌱

 — 16:08
There's again something being stuck:
https://www.transcripthq.io/dashboard/jobs/695a7fec2d5ec3cb10631d00
TranscriptHQ
TranscriptHQ
Extract word-for-word transcripts in bulk from YouTube, TikTok, Twitter & more. AI-powered transcription with noise reduction, 100+ language translation, and 95% accuracy. Simple API, credit-based pricing.
TranscriptHQ
Trummler 🌱

 — 16:09
Bild
I've now set the DEFAULT_POLL_TIMEOUT to 1800 (seconds) = 30min for the next runs;
Ready when you tell me to re-run the script
(The current run is still waiting)
heyo — 16:15
All 100 videos are actually complete, you can see 'Done (100)' in the video list. There's a display bug in the job summary counter that's showing 99 instead of 100. If your script is checking the job status/summary to decide when to poll results, just poll the videos directly instead and like count the number of vids maybe, all transcripts are ready. I'll check what's wrong and deploy a fix for the summary counter soon.

<Ende der Conversation>

### Actionable Notes (from Discord)
- Use `skip_metadata: true` to avoid the 20-40s upfront scan; expected 2-4s per video for job creation.
- Batch size: no hard max; recommended 100-200 videos per job for manageability.
- Job summary counters can be wrong; if a job looks stuck in summary, poll per-video results instead of relying on the summary status.
- Business tier: 5 concurrent jobs, 500 req/min. Fill 5 slots, poll results, then submit next batch.
- If no native captions, TranscriptHQ auto-transcribes via Whisper (billed per minute); expect non-empty transcripts even for videos without captions unless `native_captions_only` is enabled.
- Shorts often have no spoken content; consider skipping shorts for efficiency.
- Default recommendation: use `native_captions_only: true` during bulk runs to avoid Whisper costs; enable Whisper only for long, high-value videos.

## Evaluation
<UPDATED - TRANSCRIPTHQ STRESS-TEST PATH; REPLACES LEGACY PROVIDER PLAN>

### TranscriptHQ (primary for stress test)
- REST API: `POST https://api.transcripthq.io/v1/transcripts` with JSON `{ "service_type": "youtube", "videos": ["<video_id>"] }` and header `X-API-Key`.
- Async job: response includes `job_id`, `status: processing`, `credits_charged`, and `poll_url`. Poll `GET /v1/transcripts/{job_id}` until `status: completed`.
- Result payload: `summary` counts and per-video entries with `video_id`, `status`, `duration_seconds`, `transcript`, `segments`. `credits_used` is returned for completed jobs.
- Batch: docs recommend submitting multiple videos per request (no public max documented).
- Options: `noise_reduction`, `target_language`, `word_timestamps` (Pro).

### Operational notes (test phase)
- Enforce batch size 1 for initial runs; use `MAX_TOTAL_BATCH_SIZE` for the per-run cap.
- Map TranscriptHQ per-video status to CSV `status`/`error` fields; treat missing transcript as `missing`.
- Because limits/status taxonomy are not fully documented, keep conservative polling and record any non-completed state.

### Legacy / superseded options (fallback only)
- Official YouTube Data API captions: requires owner OAuth for `captions.download`, not viable for public videos.
- Unofficial libraries (youtube-transcript-api, yt-dlp, pytube) and SaaS like youtube-transcript.io / SerpApi were previously evaluated but are now secondary for this phase. Keep notes for historical context and potential fallback if TranscriptHQ becomes unavailable.

### Sources
- TranscriptHQ docs: https://transcripthq.io/docs
- YouTube captions download: https://developers.google.com/youtube/v3/docs/captions/download
