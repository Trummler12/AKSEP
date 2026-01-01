const fs = require("fs");
const path = require("path");

const RATE_LIMIT_TOKENS = [
  "rate limit",
  "too many requests",
  "http error 429",
  "status code 429",
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
    videoId: "",
    cookies: "",
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--video-id") {
      args.videoId = argv[i + 1] || "";
      i += 1;
    } else if (arg === "--cookies") {
      args.cookies = argv[i + 1] || "";
      i += 1;
    }
  }
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

function parseAudioTracks(playerResponse) {
  const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer || {};
  const captionTracks = captions.captionTracks || [];
  const audioTracks = captions.audioTracks || [];
  const formats = playerResponse?.streamingData?.adaptiveFormats || [];

  const autoDubMap = new Map();
  const trackLanguageMap = new Map();
  for (const fmt of formats) {
    const audioTrack = fmt?.audioTrack || {};
    const trackId = audioTrack.audioTrackId;
    const mimeType = fmt?.mimeType || "";
    if (trackId && mimeType.includes("audio/")) {
      const lang = fmt?.language || audioTrack?.displayName?.simpleText || "";
      if (lang) {
        trackLanguageMap.set(trackId, lang);
      }
    }
    if (trackId && Object.prototype.hasOwnProperty.call(audioTrack, "isAutoDubbed")) {
      autoDubMap.set(trackId, Boolean(audioTrack.isAutoDubbed));
    }
  }

  const languagesAll = new Set();
  const languagesNonAuto = new Set();
  let hasAutoDub = "unknown";

  if (audioTracks.length > 1) {
    for (const track of audioTracks) {
      const trackId = track.audioTrackId || "";
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

      if (autoDubMap.has(trackId)) {
        if (autoDubMap.get(trackId) === true) {
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
    source: "ytdl-core",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.videoId) {
    process.stdout.write(JSON.stringify({ ok: false, error_type: "invalid", error: "missing_video_id" }));
    process.exit(0);
  }

  let ytdl;
  try {
    ytdl = require("ytdl-core");
  } catch (err) {
    process.stdout.write(JSON.stringify({ ok: false, error_type: "provider_missing", error: "ytdl-core not installed" }));
    process.exit(0);
  }

  if (!ytdl.validateID(args.videoId)) {
    process.stdout.write(JSON.stringify({ ok: false, error_type: "invalid", error: "invalid_video_id" }));
    process.exit(0);
  }

  const cookieHeader = readCookiesFile(args.cookies);
  const requestOptions = cookieHeader ? { headers: { cookie: cookieHeader } } : {};

  try {
    const info = await ytdl.getInfo(args.videoId, { requestOptions });
    const player = info.player_response || {};
    const audioTracks = parseAudioTracks(player);
    process.stdout.write(JSON.stringify({ ok: true, audio_tracks: audioTracks }));
  } catch (err) {
    const message = String(err?.message || err);
    if (isRateLimitMessage(message)) {
      process.stdout.write(JSON.stringify({ ok: false, error_type: "rate_limit", error: message }));
      return;
    }
    const errorType = isInvalidIdMessage(message) ? "invalid" : "error";
    process.stdout.write(JSON.stringify({ ok: false, error_type: errorType, error: message }));
  }
}

main().catch((err) => {
  const message = String(err?.message || err);
  process.stdout.write(JSON.stringify({ ok: false, error_type: "fatal", error: message }));
});
