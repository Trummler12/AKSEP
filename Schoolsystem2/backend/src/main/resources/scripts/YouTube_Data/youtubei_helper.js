const fs = require("fs");
const path = require("path");
const { Innertube, Endpoints } = require("youtubei.js");

const RATE_LIMIT_TOKENS = [
  "rate limit",
  "too many requests",
  "http error 429",
  "temporarily blocked",
  "unusual traffic",
  "slow down",
];

const INVALID_ID_TOKENS = [
  "invalid video id",
  "invalid url",
  "unsupported url",
  "not a valid url",
];

function parseArgs(argv) {
  const args = {
    videoIds: [],
    mode: "audio",
    client: "WEB_EMBEDDED",
    cookies: "",
    jsonl: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--video-id") {
      const value = argv[i + 1];
      if (value) {
        args.videoIds.push(value.trim());
      }
      i += 1;
    } else if (arg === "--video-ids") {
      const value = argv[i + 1];
      if (value) {
        args.videoIds.push(
          ...value
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        );
      }
      i += 1;
    } else if (arg === "--mode") {
      const value = argv[i + 1];
      if (value) {
        args.mode = value.trim();
      }
      i += 1;
    } else if (arg === "--client") {
      const value = argv[i + 1];
      if (value) {
        args.client = value.trim();
      }
      i += 1;
    } else if (arg === "--cookies") {
      const value = argv[i + 1];
      if (value) {
        args.cookies = value.trim();
      }
      i += 1;
    } else if (arg === "--jsonl") {
      args.jsonl = true;
    }
  }

  args.videoIds = args.videoIds.filter(Boolean);
  return args;
}

function isRateLimitMessage(message) {
  const lower = String(message || "").toLowerCase();
  return RATE_LIMIT_TOKENS.some((token) => lower.includes(token));
}

function isInvalidIdMessage(message) {
  const lower = String(message || "").toLowerCase();
  return INVALID_ID_TOKENS.some((token) => lower.includes(token));
}

function readCookiesFile(filePath) {
  if (!filePath) {
    return "";
  }
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    return "";
  }
  const lines = fs.readFileSync(resolved, "utf-8").split(/\r?\n/);
  const cookies = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    if (line.includes("\t")) {
      const parts = line.split("\t");
      if (parts.length >= 7) {
        const name = parts[5];
        const value = parts[6];
        if (name && value) {
          cookies.push(`${name}=${value}`);
        }
      }
      continue;
    }
    if (line.includes("=")) {
      cookies.push(line.replace(/;$/, ""));
    }
  }
  return cookies.join("; ");
}

async function createClient(cookieHeader) {
  return Innertube.create({
    retrieve_player: false,
    generate_session_locally: true,
    cookie: cookieHeader || undefined,
  });
}

function parseAudioTracks(playerResponse) {
  const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer || {};
  const captionTracks = captions.captionTracks || [];
  const audioTracks = captions.audioTracks || [];
  const formats = playerResponse?.streamingData?.adaptiveFormats || [];

  const autoDubMap = new Map();
  const trackLanguageMap = new Map();
  for (const fmt of formats) {
    const audioTrack = fmt?.audioTrack || {};
    const trackId = audioTrack.audioTrackId || audioTrack.id || "";
    const mimeType = fmt?.mimeType || "";
    const langFromId = trackId.includes(".") ? trackId.split(".")[0] : "";
    if (trackId && mimeType.includes("audio/")) {
      const lang = langFromId || fmt?.language || "";
      if (lang) {
        trackLanguageMap.set(trackId, lang);
      }
    }
    if (trackId && Object.prototype.hasOwnProperty.call(audioTrack, "isAutoDubbed")) {
      autoDubMap.set(trackId, Boolean(audioTrack.isAutoDubbed));
      if (langFromId) {
        autoDubMap.set(langFromId, Boolean(audioTrack.isAutoDubbed));
      }
    }
  }

  const languagesAll = new Set();
  const languagesNonAuto = new Set();
  let hasAutoDub = "unknown";

  if (audioTracks.length > 1) {
    for (const track of audioTracks) {
      const trackId = track.audioTrackId || "";
      const fallbackLang = trackId && trackId.includes(".") ? trackId.split(".")[0] : "";
      const indices = track.captionTrackIndices || [];
      const langCodes = [];
      for (const idx of indices) {
        if (!Number.isInteger(idx) || idx < 0 || idx >= captionTracks.length) {
          continue;
        }
        const lang = captionTracks[idx]?.languageCode || "";
        if (lang) {
          langCodes.push(lang);
          languagesAll.add(lang);
        }
      }
      if (fallbackLang) {
        langCodes.length = 0;
        langCodes.push(fallbackLang);
        languagesAll.add(fallbackLang);
      }

      const autoDubValue = autoDubMap.has(trackId)
        ? autoDubMap.get(trackId)
        : autoDubMap.get(fallbackLang);
      if (typeof autoDubValue !== "undefined") {
        if (autoDubValue === true) {
          hasAutoDub = "true";
        } else {
          if (hasAutoDub !== "true") {
            hasAutoDub = "false";
          }
          for (const lang of langCodes) {
            languagesNonAuto.add(lang);
          }
        }
      } else {
        if (hasAutoDub !== "true") {
          hasAutoDub = "unknown";
        }
        for (const lang of langCodes) {
          languagesNonAuto.add(lang);
        }
      }
    }
  }

  for (const [trackId, lang] of trackLanguageMap.entries()) {
    if (!lang) {
      continue;
    }
    languagesAll.add(lang);
    const isAuto = autoDubMap.get(trackId);
    if (isAuto === true) {
      hasAutoDub = "true";
    } else {
      if (hasAutoDub !== "true") {
        hasAutoDub = "false";
      }
      languagesNonAuto.add(lang);
    }
  }

  if (languagesAll.size === 0 && trackLanguageMap.size === 0) {
    for (const fmt of formats) {
      const mimeType = fmt?.mimeType || "";
      if (!mimeType.includes("audio/")) {
        continue;
      }
      const lang = fmt?.language || "";
      if (lang) {
        languagesAll.add(lang);
        languagesNonAuto.add(lang);
      }
    }
  }

  if (languagesAll.size === 0 && audioTracks.length > 0) {
    const defaultAudioIndex = Number.isInteger(captions.defaultAudioTrackIndex)
      ? captions.defaultAudioTrackIndex
      : 0;
    const defaultAudioTrack = audioTracks[defaultAudioIndex] || audioTracks[0];
    let captionIndex = defaultAudioTrack?.defaultCaptionTrackIndex;
    if (!Number.isInteger(captionIndex) && Array.isArray(defaultAudioTrack?.captionTrackIndices)) {
      captionIndex = defaultAudioTrack.captionTrackIndices[0];
    }
    if (Number.isInteger(captionIndex)) {
      const fallbackLang = captionTracks[captionIndex]?.languageCode || "";
      if (fallbackLang) {
        languagesAll.add(fallbackLang);
        languagesNonAuto.add(fallbackLang);
      }
    }
  }

  const microformat = playerResponse?.microformat?.playerMicroformatRenderer || {};
  const defaultLanguage =
    microformat.defaultAudioLanguage ||
    microformat.defaultLanguage ||
    "";

  return {
    languages_all: Array.from(languagesAll),
    languages_non_auto: Array.from(languagesNonAuto),
    has_auto_dub: hasAutoDub,
    default_audio_language: defaultLanguage,
    source: "youtubei.js",
  };
}

function parseTranscriptSegments(transcriptInfo) {
  const segments =
    transcriptInfo?.transcript?.content?.body?.initial_segments || [];
  const parsed = [];
  for (const segment of segments) {
    if (typeof segment?.start_ms === "undefined") {
      continue;
    }
    parsed.push({
      start_ms: segment.start_ms,
      end_ms: segment.end_ms,
      text: segment.snippet?.toString() || "",
    });
  }
  return parsed;
}

async function fetchAudioTracks(yt, videoId, client) {
  const payload = Endpoints.PlayerEndpoint.build({
    video_id: videoId,
    client,
  });
  const response = await yt.actions.execute(Endpoints.PlayerEndpoint.PATH, payload);
  const data = response?.data || {};
  const statusCode = response?.status_code || 0;
  const playability = data.playabilityStatus || {};
  const status = playability.status || "";
  const reason = playability.reason || "";
  const errorMessage = data?.error?.message || "";

  if (statusCode === 429 || isRateLimitMessage(errorMessage)) {
    return {
      ok: false,
      error_type: "rate_limit",
      error: errorMessage || "rate_limited",
      http_status: statusCode,
    };
  }

  if (status && status !== "OK") {
    if (status === "LOGIN_REQUIRED") {
      return {
        ok: false,
        error_type: "login_required",
        error: reason || "login_required",
        http_status: statusCode,
      };
    }
    return {
      ok: false,
      error_type: "unavailable",
      error: reason || status,
      http_status: statusCode,
    };
  }

  return {
    ok: true,
    audio_tracks: parseAudioTracks(data),
    http_status: statusCode,
  };
}

async function fetchTranscript(yt, videoId, client) {
  const info = await yt.getInfo(videoId, client);
  const transcriptInfo = await info.getTranscript();
  const segments = parseTranscriptSegments(transcriptInfo);
  const selectedLanguage = transcriptInfo.selectedLanguage || "";
  let languageCode = "";
  const captionTracks = info?.captions?.caption_tracks || [];
  if (selectedLanguage) {
    const matched = captionTracks.find(
      (track) => track?.name?.toString() === selectedLanguage
    );
    if (matched?.language_code) {
      languageCode = matched.language_code;
    }
  }
  if (!languageCode && captionTracks.length) {
    languageCode = captionTracks[0]?.language_code || "";
  }
  return {
    ok: true,
    transcript: {
      language: selectedLanguage,
      language_code: languageCode,
      segments,
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.videoIds.length) {
    process.stderr.write("ERROR: --video-id is required\n");
    process.exit(2);
  }

  const cookieHeader = readCookiesFile(args.cookies);
  let yt;
  try {
    yt = await createClient(cookieHeader);
  } catch (err) {
    const message = String(err?.message || err);
    process.stdout.write(JSON.stringify({ ok: false, error_type: "init_error", error: message }));
    process.exit(0);
  }

  const results = [];
  for (const videoId of args.videoIds) {
    try {
      let result;
      if (args.mode === "transcript") {
        result = await fetchTranscript(yt, videoId, args.client);
      } else {
        result = await fetchAudioTracks(yt, videoId, args.client);
      }
      results.push({ video_id: videoId, ...result });
    } catch (err) {
      const message = String(err?.message || err);
      const errorType = isInvalidIdMessage(message) ? "invalid" : "unknown";
      results.push({
        video_id: videoId,
        ok: false,
        error_type: errorType,
        error: message,
      });
    }
  }

  if (args.jsonl) {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
    return;
  }

  if (results.length === 1) {
    process.stdout.write(JSON.stringify(results[0]));
  } else {
    process.stdout.write(JSON.stringify(results));
  }
}

main().catch((err) => {
  const message = String(err?.message || err);
  process.stdout.write(JSON.stringify({ ok: false, error_type: "fatal", error: message }));
});
