# Enquiry about audio tracks in the YouTube Data API

## Table of Contents

- [Conversation](#conversation)
  - [Prompt 1](#prompt-1)
  - [Answer 1](#answer-1)
  - [Prompt 2](#prompt-2)
  - [Answer 2](#answer-2)
- [Evaluation](#evaluation)

## Conversation

Conversation with GPT 5.2:

### Prompt 1

Please ultrathink hard on this:
Given a Video ID: Is there a way to use the YouTube Data API to get the List of all Languages of *NON*-generated Audio Tracks available on that Video?

### Answer 1

Short answer: with the *official* YouTube Data API v3, **no – you cannot get a list of all non-generated audio track languages for a video**. You can only get:

* the **default audio language** of the main track, and
* the **languages of subtitle tracks** (where you *can* distinguish generated vs. non-generated captions).

A proper per-audio-track language list (plus “generated vs. non-generated”) is not exposed in the public Data API today.

---

## What the Data API *does* give you

### 1. Video resource: only one audio language, not per track

`videos.list` with `part=snippet,fileDetails` will give you e.g.:

* `snippet.defaultAudioLanguage` – a single BCP-47 language tag for the **default** audio track. ([Google for Developers][1])
* `fileDetails.audioStreams[]` – a list of audio streams (bitrate, codec, channels, vendor), **but no language info** at all. ([Google for Developers][1])

So even if the video has multiple dubbed audio tracks (multi-language audio), the Data API only tells you:

* “The default audio is X (e.g. `en`),”
* “There are N audio streams with these codecs/bitrates…”

It does **not** tell you “audio track #1 is English, #2 is Spanish, #3 is Japanese” etc., and it does **not** label any of them as auto-dubbed vs. manually uploaded.

### 2. Captions (subtitles): here you *can* filter auto-generated vs. non-generated

If by “generated” you actually meant **auto-generated subtitles**, then yes, you can get the language list of *non-generated* tracks:

* `captions.list` with `part=snippet&videoId=VIDEO_ID` returns a list of caption tracks. ([Google for Developers][2])
* For each caption:

  * `snippet.language` → BCP-47 language code
  * `snippet.trackKind` → `"ASR"` for auto-generated, `"standard"` / `"forced"` for manually provided
  * `snippet.audioTrackType` → `"primary"`, `"commentary"`, `"descriptive"`, `"unknown"`

You can therefore do:

* “all subtitle languages where `trackKind != 'ASR'`” → **all non-auto-generated subtitle languages**.

But again, that’s subtitles, not the audio tracks themselves.

---

## Multi-language audio / auto-dubbing: why you still cannot do it

YouTube’s newer “multi-language audio” and auto-dubbing features are managed in YouTube Studio and are visible in the player’s language selector for viewers. ([Google Help][3])

However:

* There is **no documented field** in the YouTube Data API v3 that:

  * lists all multi-language audio tracks and their languages, or
  * marks which tracks are **auto-dubbed** vs. manually uploaded.

Third-party tools that show “audioTracks” arrays typically **scrape the watch page** (e.g. `ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.audioTracks[...]`) or call internal, undocumented player APIs in the browser. ([GitHub][4]) That is **not** the official Data API and may violate YouTube’s ToS if used at scale or server-side.

---

## Practical summary

* **Official Data API v3:**

  * ✅ `snippet.defaultAudioLanguage` → single default audio language.
  * ✅ `captions.list` → all subtitle languages, with `trackKind` so you can exclude auto-generated subtitles.
  * ❌ No way to list all audio track languages.
  * ❌ No way to distinguish manual vs. auto-dubbed audio tracks.

* **Unofficial / scraping route:**

  * You can, in principle, parse `ytInitialPlayerResponse` or use `getAvailableAudioTracks()` in the web player to infer tracks and associated captions.
  * This is undocumented, unstable, and potentially ToS-sensitive, so not something I can recommend as a robust / compliant solution.

---

If you tell me whether you actually care about **subtitles** or really need **audio track** metadata for a backend service, I can sketch a concrete architecture:

* either a pure-Data-API solution using `captions.list`, or
* a browser-side helper (extension / userscript) that *locally* inspects `ytInitialPlayerResponse` to expose track info to the user without server-side scraping.

[1]: https://developers.google.com/youtube/v3/docs/videos "Videos  |  YouTube Data API  |  Google for Developers"
[2]: https://developers.google.com/youtube/v3/docs/captions?hl=de "Captions  |  YouTube Data API  |  Google for Developers"
[3]: https://support.google.com/youtube/answer/13338784?hl=en&utm_source=chatgpt.com "Add Multi-language audio tracks to your videos - YouTube ..."
[4]: https://github.com/b3-business/ytAudioSelector?utm_source=chatgpt.com "Chrome Extension to allow for custom audio track selection ..."

### Prompt 2

Please again ultrathink hard on this:
Okay, so there appears to be a possibility to give the *number* of available audio tracks? Okay, I guess that's already a pretty useful piece of information!
That way we can at least give the information whether multi-language support is available or not (if not => "no", and if yes => "[Number of languages supported]")

Just to be clear: if we want to get a list of all language codes of the languages of the audio tracks available for that video, we would need to rely on a third-party tool for that?
Can you please do some research and find the most trustworthy tools that would allow that? This information would be really, really helpful for us.
Ach, um dir etwas Kontext zu geben, um was für ein Projekt es sich handelt, woran ich am Arbeiten bin: Ich habe vor einiger Zeit ein neuartiges Bildungssystem konzipiert, welches nicht auf Schulnoten aufbaut, sondern auf Kompetenzlevel, die man sich erarbeiten kann wie in einem Skilltree, wie man ihn aus Videospielen kennt - Begonnen mit den Grundlagenfächern, gefolgt von wohin auch immer einen die eigenen Interessen führen mögen. Und für dieses kompetenzlevelbasierte Bildungssystem baue ich gerade eine Datenbank für Unterrichtsressourcen. Akademische Disziplinen (=> Topics) habe ich bereits eine Zahl von über 2200 erfasst. Und nun möchte ich auf der anderen Seite mögliche Unterrichtsressourcen sammeln, angefangen mit YouTube-Videos von wissenschaftsbasierten Kanälen wie Veritasium, Vsauce oder 3Blue1Brown. Und später will ich dann jede Ressource konkreten Topics zuweisen (vereinfacht beschrieben). Und wenn man dann die Seite eines Topics aufruft, dann erhält man eine Liste aller Ressourcen, die diesem Topic zugewiesen wurden. Und an dieser Stelle gilt zu erwähnen, dass diese Datenbank langfristig überall auf der Welt verfügbar sein soll. Und deswegen sollte die Datenbank nicht nur Englisch unterstützen, sondern so viele Sprachen wie möglich. Und an dieser Stelle wäre es sinnvoll, eine Funktion zu haben, mit welcher man Ressourcen nach Sprache filtern kann. Wenn man beispielsweise nur Deutsch und Französisch ausreichend gut versteht, so soll man nur Ressourcen angezeigt bekommen, die über eine deutsche und oder eine französische Sprachversion verfügen. Und bei YouTube-Videos sind es die Audio-Tracks, welche die Sprachversionen abbilden. Wenn die YouTube Data API keine direkte Möglichkeit bietet, eine Liste aller verfügbaren Audio-Track-Sprachen zurückzugeben, dann muss ich das wohl oder übel auf irgendeine andere Art automatisiert hinbekommen.

### Answer 2

Short version:

* Mit der **offiziellen YouTube Data API** bekommst du *weder* die Sprachen der Audiotracks *noch* zuverlässig die Anzahl der (Sprach-)Audiotracks eines beliebigen Videos.
* Wenn du wirklich eine Liste der Audio-Sprachen (und sogar „nicht auto-gedubbt“) brauchst, musst du auf **inoffizielle Player-Daten** zugreifen – entweder direkt oder über etablierte Open-Source-Tools wie **yt-dlp**, **ytdl-core** oder spezielle Wrapper wie **yt-get-info** bzw. Scraper wie den Apify-Actor.

Ich trenne das mal sauber:

---

## 1. Was die offizielle YouTube Data API kann – und was nicht

Die Data API kennt zwar `fileDetails.audioStreams[]`, aber:

* Die Struktur von `fileDetails.audioStreams[]` enthält **nur technische Infos** (Codec, Bitrate, Kanäle, Vendor), **keine Sprache**. ([Google for Developers][1])
* `fileDetails` ist nur abrufbar, wenn du **Eigentümer des Videos** bist („This data can only be retrieved by the video owner.“). ([Gist][2])
* Für fremde Videos (also Veritasium, Vsauce, 3Blue1Brown etc.) kannst du diese Infos nicht nutzen.

Die Data API dokumentiert außerdem **nirgends** Multi-Language-Audio oder Auto-Dubbing. Multi-Language-Audio und Auto-Dubbing sind nur in Hilfeartikeln erklärt, nicht als durchgängiger API-Teil. ([Google Help][3])

Fazit:

* **Nein**, mit der offiziellen Data API bekommst du **keine Liste von Audio-Sprachen** und auch **keine Filterung nach „nicht auto-gedubbt“** für beliebige Videos.
* Die Idee „wir zählen einfach die Audio-Streams“ funktioniert nur, wenn du der Uploader bist – und selbst dann sagt dir die API nur „es gibt X Audio-Streams“, aber nicht, welche Sprachen das sind.

---

## 2. Wo die Sprachinfos tatsächlich liegen: Player-JSON (inoffiziell)

Die echten Infos landen im **Player-Response**, der im Web-Client als `window.ytInitialPlayerResponse` verfügbar ist.

Dort gibt es u.a.:

```json
"captions": {
  "playerCaptionsTracklistRenderer": {
    "captionTracks": [
      {
        "baseUrl": "...",
        "languageCode": "es",
        "kind": "asr",
        "name": { "simpleText": "Español (generados automáticamente)" }
      }
    ],
    "audioTracks": [
      {
        "captionTrackIndices": [0],
        "audioTrackId": "es-ES-1"
      }
    ],
    "translationLanguages": [...]
  }
}
```

Solche Strukturen sind dokumentiert/abgedruckt in diversen Projekten (Scraper, Libs, Bugreports). ([pythonanywhere.com][4])

Wichtige Punkte:

* `captionTracks[]` enthält **Sprachcodes** (`languageCode`) – *auch* für automatisch generierte Untertitel (`kind: "asr"`).
* `audioTracks[]` hat `captionTrackIndices[]`, die auf `captionTracks` verweisen – über diesen Umweg kommst du an den **Sprachcode des zugehörigen Audio-Tracks**.
* In `streamingData.adaptiveFormats[]` gibt es zusätzliche Infos zu den einzelnen Streams; dort hängt ein `audioTrack`-Objekt mit Flags wie `isAutoDubbed`. Ein Userscript, das Auto-Dub deaktiviert, löscht explizit `audioTrack.isAutoDubbed` aus `adaptiveFormats`, d.h. dieses Flag existiert in der Praxis. ([greasyfork.org][5])

Damit kannst du theoretisch:

* alle Audiotracks auflisten,
* zu jedem die Sprachcodes ermitteln,
* und Auto-Dubs über `isAutoDubbed == true` herausfiltern.

Das ist aber alles **inoffiziell** und kann sich ändern; genau deshalb ist es sinnvoll, auf etablierte Tools zurückzugreifen, die diese internen Strukturen schon robust handhaben.

---

## 3. Vertrauenswürdige Dritttools / Libraries

Ich fokussiere mich auf Open-Source-Projekte mit großer Nutzerbasis und aktiver Pflege.

### 3.1 yt-dlp (CLI + Python-Library)

* Fork von `youtube-dl`, aktiv gepflegt, sehr verbreitet. ([GitHub][6])

* Bietet CLI *und* Python-API; kann ein Video ohne Download als JSON ausgeben:

  ```bash
  yt-dlp -J "https://www.youtube.com/watch?v=VIDEO_ID"
  ```

* Laut Manpage haben Formate ein `language`-Feld, das explizit als **Sprachcode** dokumentiert ist. ([Ubuntu Manpages][7])

* Im JSON unter `formats[]` liegen für YouTube üblicherweise Einträge mit u.a.

  * `acodec`, `vcodec`
  * `language`
  * `audio_track` / `audioTrack` (je nach Version)
  * evtl. weitere Felder, die aus dem internem `audioTrack`-Objekt kommen.

**Wie du damit Audio-Sprachen bekommst (konzeptionell):**

1. `yt-dlp -J` aufrufen und JSON parsen.
2. `formats[]` filtern auf **Audio-only** (`vcodec == "none"`).
3. Aus diesen Formaten das Feld `language` einsammeln, Set bilden → **Liste der Sprachcodes**.
4. Optional: `audioTrack`-Unterobjekt anschauen, mit Player-JSON abgleichen und solche Streams rauswerfen, bei denen `audioTrack.isAutoDubbed == true` ist (hier müsstest du teils noch ein bisschen reverse-engineeren; das Flag sehen wir definitiv im Player-JSON, das via uBlock/Userscript gefiltert wird ([greasyfork.org][5])).

Vorteile für dein Projekt:

* Läuft problemlos als **kleiner Microservice** neben deiner eigentlichen App (Docker-Container mit `yt-dlp` + minimalem Python-Script).
* Sehr große Nutzerbasis → Bugs im YouTube-Extractor werden relativ schnell gefixt.

---

### 3.2 ytdl-core (Node / TypeScript)

* Sehr verbreitete JS/TS-Library zum Abrufen von YouTube-Infos. ([tessl.io][8])
* `getInfo()` gibt dir u.a. den kompletten `player_response` zurück und `formats[]` (ähnlich wie yt-dlp).
* TypeScript-Typen enthalten explizit ein `audioTrack`-Interface mit `captionTrackIndices`, was exakt dem oben beschriebenen `audioTracks`-Mechanismus entspricht. ([GitHub][9])

**Vorgehen mit ytdl-core:**

1. `const info = await ytdl.getInfo(videoIdOrUrl);`

2. `const pr = info.player_response;`

3. Aus `pr.captions.playerCaptionsTracklistRenderer`:

   * `captionTracks[]` → enthält `languageCode`.
   * `audioTracks[]` → enthält `captionTrackIndices[]` und ggf. `audioTrackId`.

4. Für jeden Eintrag in `audioTracks`:

   * nimm `captionTrackIndices[0]` als „Hauptspur“,
   * hole `captionTracks[index].languageCode` → **Sprachcode dieses Audio-Tracks**.

5. Parallel kannst du in `pr.streamingData.adaptiveFormats[]` nach einem Matching-Eintrag suchen, der dieselbe `audioTrackId` hat und `audioTrack.isAutoDubbed` gesetzt – solche als Auto-Dubs markieren und bei Bedarf ausschließen. ([greasyfork.org][5])

Es gibt ein offenes Issue, dass das `audioTrack`-Feld in den Typdefinitionen nicht überall berücksichtigt wird, aber funktional sind die Daten im `player_response` vorhanden. ([GitHub][10])

Vorteil:

* Wenn dein Stack sowieso stark Node-/TypeScript-lastig ist, kannst du ohne zusätzlichen Prozess direkt im Backend auswerten.

---

### 3.3 yt-get-info (npm – leichtgewichtiger Wrapper)

* Kleines npm-Package, das explizit `ytInitialPlayerResponse` ausliest. ([jsDelivr][11])

* Im README siehst du genau den Pfad:

  ```js
  const { captionTracks, audioTracks } =
    playerResponse.captions.playerCaptionsTracklistRenderer;
  ```

* Du müsstest dann selbst `captionTracks[captionTrackIndices[0]].languageCode` verknüpfen, um Sprachcodes zu bekommen.

Das ist etwas „näher an der Metallplatte“ als ytdl-core, aber extrem simpel, wenn du ohnehin clientnah arbeitest (z.B. in einer Browser-Extension oder einem Headless-Browser-Setup).

---

### 3.4 Apify „YouTube video scraper“

* Der Apify-Actor „YouTube video scraper“ liefert dir für Videos ebenfalls den Player-Response-Teil inklusive `playerCaptionsTracklistRenderer.captionTracks` und `audioTracks`. ([Apify][12])
* Damit kannst du, ohne selbst Scraper zu betreiben, über eine gehostete Lösung an genau die gleichen Strukturen kommen.

Vorteil:

* Du musst dich nicht um IP-Rotation, Rate-Limits etc. kümmern, sondern kaufst das „Scraping“ praktisch als Service zu.

Nachteil:

* Externer Drittanbieter (Kosten, Datenschutz, Abhängigkeit).

---

## 4. Konkretes Schema: „Liste der nicht auto-generierten Audio-Sprachen“ bauen

Egal ob du yt-dlp, ytdl-core, yt-get-info oder Apify nimmst – der Kernalgorithmus sieht so aus:

1. **Player-JSON holen**

   * Entweder über

     * yt-dlp-JSON,
     * ytdl-core `info.player_response`,
     * yt-get-info,
     * Apify-Actor.

2. **Caption + Audio-Tracks extrahieren**

   * `captionTracks = playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks`
   * `audioTracks = playerResponse.captions.playerCaptionsTracklistRenderer.audioTracks` ([pythonanywhere.com][4])

3. **Sprachcode pro Audio-Track bestimmen**

   Für jeden `audioTrack` in `audioTracks`:

   * Nimm einen Index aus `audioTrack.captionTrackIndices` (typisch `[0]`).
   * Ermittle `lang = captionTracks[index].languageCode`.

4. **Auto-Dubs ausschließen**

   * Hole `adaptiveFormats = playerResponse.streamingData.adaptiveFormats`.
   * Suche alle Einträge, deren `audioTrack.audioTrackId` zu deinem `audioTrack.audioTrackId` passt.
   * Wenn in einem dieser Einträge `audioTrack.isAutoDubbed === true` ist → Track als **auto-gedubbt** markieren und nach Wunsch **ignorieren**. ([greasyfork.org][5])

5. **Resultat bauen**

   * Sammle alle `lang`-Werte, die nicht auto-gedubbt sind, in einem Set →
     `audio_languages_non_auto = sorted(unique(langCodes))`.

Dieses Resultat ist exakt das, was du für deine Filterlogik brauchst: „Welche Sprachen liegen als **echte** Audio-Spuren vor?“

---

## 5. ToS-/Rechts- und Robustheits-Hinweis

Alle genannten Tools (yt-dlp, ytdl-core, yt-get-info, Apify-Actor) arbeiten mit **nicht dokumentierten** YouTube-Endpunkten/Strukturen oder extrahieren Daten aus dem ausgelieferten HTML/JSON.

* YouTube unterscheidet in seinen Nutzungsbedingungen zwischen der **offiziellen API** und dem **Scrapen** der Website.
* Rechtlich/vertraglich kann es sein, dass du dich in einer **Grauzone** bewegst, je nachdem, was du genau machst, in welchem Umfang und in welcher Jurisdiktion du agierst. ([Wikipedia][13])

Für ein langfristig globales Bildungsprojekt wäre es sinnvoll:

* Das bewusst einzuplanen,
* ggf. mit einer juristisch versierten Person die ToS / Urheberrechtssituation durchzugehen,
* und den Scraping-Teil technisch so zu kapseln, dass du ihn jederzeit austauschen oder deaktivieren kannst, falls YouTube API-seitig nachbessert (oder neue offizielle Endpunkte anbietet).

---

## 6. Design-Vorschlag für dein Kompetenzlevel-System

Weil du das als globale Bildungsdatenbank planst, würde ich Sprache *mehrdimensional* modellieren:

1. **Primäre Video-Sprache (Meta):**

   * Aus `snippet.defaultAudioLanguage` oder `snippet.defaultLanguage` der Data API, falls gesetzt. ([blog.youtube][14])

2. **Untertitel-Sprachen (offizielle API, sehr gut unterstützt):**

   * Über `captions.list` → `snippet.language` und `snippet.trackKind` (`"asr"` = auto-generiert). ([Dubly AI][15])
   * Du kannst Felder halten wie:

     * `caption_languages_manual`
     * `caption_languages_auto`

3. **Multi-Audio-Sprachen (inoffiziell, wie oben beschrieben):**

   * Feld `audio_languages_non_auto` (per yt-dlp/ytdl-core/etc. ermittelt).
   * Optional: `audio_languages_auto` für Auto-Dubs, wenn du sie getrennt kennzeichnen willst.

Für deinen Filter „Zeig mir nur Ressourcen, die Deutsch oder Französisch unterstützen“ könntest du dann:

* primär nach `audio_languages_non_auto` filtern (wenn vorhanden),
* sonst fallback auf `caption_languages_manual` (oder auch auf auto-captions, je nach Qualitätsanspruch).

Damit hast du eine saubere, weltweit skalierbare Semantik, ohne dich vollständig auf fragile inoffizielle Endpunkte zu verlassen.

---

**Zusammenfassung**

* Ja: Für das, was du brauchst (Liste der Sprachcodes für **nicht generierte** Audiotracks), brauchst du praktisch **immer** ein Dritttool, das den Player-Response von YouTube parst.
* Die aus meiner Sicht technisch und praktisch vertrauenswürdigsten Optionen:

  1. **yt-dlp** (Python/CLI, extrem verbreitet, robust) ([GitHub][6])
  2. **ytdl-core** (Node/TS, wenn du sowieso JS-Backend fährst) ([GitHub][9])
  3. **yt-get-info** (npm) oder Apify-„YouTube video scraper“, wenn du einen high-level Wrapper bevorzugst. ([jsDelivr][11])

Wenn du möchtest, kann ich im nächsten Schritt für einen konkreten Stack (z.B. Spring-Backend mit separatem Python-Service oder Node-Microservice) einen sehr konkreten Workflow skizzieren: Endpunkt-Design, Caching-Strategie, wie du Ausfälle/Rate-Limits handhabst usw.

[1]: https://developers.google.com/youtube/v3/docs/videos?utm_source=chatgpt.com "Videos | YouTube Data API"
[2]: https://gist.github.com/JustinBeckwith/382e540e6342b9c68f12f6f7b7bd38f3?utm_source=chatgpt.com "youtube-v3.json"
[3]: https://support.google.com/youtube/answer/15569972?hl=en&utm_source=chatgpt.com "Use automatic dubbing - YouTube Help"
[4]: https://www.pythonanywhere.com/forums/topic/34959/?utm_source=chatgpt.com "youtube_transcript_api issue : Forums"
[5]: https://greasyfork.org/en/scripts/555043-anti-youtube-auto-dub/code?utm_source=chatgpt.com "Anti Youtube auto Dub - Source code"
[6]: https://github.com/yt-dlp/yt-dlp?utm_source=chatgpt.com "yt-dlp/yt-dlp: A feature-rich command-line audio/video ..."
[7]: https://manpages.ubuntu.com/manpages/jammy/man1/yt-dlp.1.html?utm_source=chatgpt.com "yt-dlp - A youtube-dl fork with additional features and patches"
[8]: https://tessl.io/registry/tessl/npm-ytdl-core?utm_source=chatgpt.com "tessl/npm-ytdl-core@4.11.x - Registry"
[9]: https://github.com/distubejs/ytdl-core/blob/master/typings/index.d.ts?utm_source=chatgpt.com "ytdl-core/typings/index.d.ts at master"
[10]: https://github.com/fent/node-ytdl-core/issues/1279?utm_source=chatgpt.com "`audioTrack` not in typescript type for `formats`, `lang` ..."
[11]: https://www.jsdelivr.com/package/npm/yt-get-info?utm_source=chatgpt.com "yt-get-info CDN by jsDelivr - A CDN for npm and GitHub"
[12]: https://apify.com/igolaizola/youtube-video-scraper?utm_source=chatgpt.com "Youtube Video Scraper (channels, playlists, searches)"
[13]: https://en.wikipedia.org/wiki/Youtube-dl?utm_source=chatgpt.com "Youtube-dl"
[14]: https://blog.youtube/news-and-events/multi-language-audio/?utm_source=chatgpt.com "Unlock a world of viewers with multi-language audio"
[15]: https://dubly.ai/blog/what-is-youtube-multi-language-audio?utm_source=chatgpt.com "What is YouTube Multi-Language Audio and how to use it?"


## Evaluation
### YouTube Data API v3 (official)
- `videos.list` exposes only `snippet.defaultAudioLanguage` for the default audio track. It does not list all audio-track languages. Source: https://developers.google.com/youtube/v3/docs/videos
- `fileDetails` (owner-only) includes `audioStreams` technical details, but no per-track language. Source: https://developers.google.com/youtube/v3/docs/videos

### YouTube Data API v3 - captions (official, but not audio tracks)
- `captions.list` returns caption tracks with `snippet.language`, `snippet.trackKind`, and `snippet.audioTrackType`, but this is subtitle metadata, not audio-track language. Source: https://developers.google.com/youtube/v3/docs/captions
- `captions.list` requires OAuth scopes and returns 403 if not authorized. Source: https://developers.google.com/youtube/v3/docs/captions/list

### yt-dlp (unofficial, player JSON)
- Supports subtitle discovery and extraction (`--list-subs`, `--all-subs`, `--write-subs`) and JSON output (`-j/--dump-json`). Source: https://github.com/yt-dlp/yt-dlp
- Audio-track languages are not a documented output field; they require parsing the player response. This is unofficial and can break when YouTube changes internals.

### ytdl-core (unofficial, Node/TS)
- `getInfo()` returns formats and metadata; rate limiting (HTTP 429) is documented and mitigated via proxies/cookies. Source: https://github.com/fent/node-ytdl-core
- Repository is in community-maintenance mode (paused upstream). Source: https://github.com/fent/node-ytdl-core

### YouTube.js / InnerTube (unofficial, Node/TS)
- A client for YouTube's private API (InnerTube); not affiliated with YouTube. Source: https://github.com/LuanRT/YouTube.js

### pytube (unofficial, Python)
- Advertises caption track support and outputs captions to SRT. Source: https://github.com/pytube/pytube

### Summary ranking (audio-track languages)
1) **yt-dlp** (Python, active, large community). Best fit for our stack, but still unofficial.
2) **YouTube.js (InnerTube)** if we later want a Node service.
3) **ytdl-core** only as a fallback (paused upstream, ratelimit-heavy).
4) **pytube** mainly for captions, not audio tracks.
5) **YouTube Data API** cannot deliver multi-audio language lists for third-party videos.

### Exclusions / not fit for purpose
- **YouTube Data API**: no multi-audio language list for public videos; only default audio language.
- **Captions API**: captions are not audio tracks; useful as a fallback for language hints only.

### Implementation Plan
#### Goal
Build a resilient, multi-provider audio-track extractor with clear failover and backoff behavior, while keeping output consistent.

#### Provider order and fallback
1) **yt-dlp** (primary)
2) **YouTube.js (InnerTube)**
3) **ytdl-core**
4) **Wait queue** (60 min, 3h, 6h, 12h)

#### Rate-limit detection and failover rules
- A provider is considered "rate-limited" when it returns explicit 429/403 responses, or known throttling error strings from that tool.
- When rate-limited, mark provider unavailable with a timestamp and immediately try the next provider.
- When all providers are unavailable, enter wait queue (60 min, then 3h, 6h, 12h).
- After each wait period, test providers top-down until one succeeds; resume from that provider.

#### Output rules (per video)
- Always write one row on success.
- If only a primary audio track exists, store that primary language (do not leave language fields empty).
- Only write error rows for non-rate-limit errors (invalid ID, removed, private, age-gate without cookies).
- Do not write rows on rate-limit errors (so they will be retried).

#### Resume behavior
- On startup, skip videos that already have a successful row.
- Re-try rows marked with non-fatal errors (configurable).
- Use append-only writes with periodic file flush after each row.

#### Implementation steps (script level)
1) Add per-provider adapters in `scripts/YouTube_Data/Audiotracks/`.
2) Add a provider manager in `audiotrack_query.py` to handle failover and backoff.
3) Standardize a common response schema across providers.
4) Add test mode to run a small batch and validate expected multi-audio samples.

