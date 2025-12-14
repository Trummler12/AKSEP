package org.schoolsystem.infrastructure.interest;

import org.schoolsystem.application.interest.TagMatchingClient;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.value.LanguageCode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * OpenAI-basierte Implementierung des TagMatchingClient.
 *
 * Diese Implementierung:
 *  - baut ein Prompt mit allen Tags (inkl. Synonymen)
 *  - ruft die Chat-Completions-API von OpenAI auf (optional mehrfach pro Anfrage)
 *  - erwartet eine JSON-Array-Antwort im Assistant-Content: [18, 42, 7, ...]
 *  - filtert auf gültige Tag-IDs
 *  - vergibt diskrete Gewichte (1..5), abhängig von der Länge des Eingabetextes:
 *      layerEq = 3 + max(0, floor(log2(len(text)/50)))
 *    und nutzt dafür die gleiche Gewichts-Matrix wie topic_tags_assignment.py (layers 3..8).
 */
public final class OpenAiTagMatchingClient implements TagMatchingClient {

    private static final String DEFAULT_MODEL = "gpt-4.1-mini";
    private static final int DEFAULT_MAX_TAGS = 15;

    private static final int MIN_TEXT_LEN = 12;
    private static final int MAX_TEXT_LEN = 2048;

    private static final int DEFAULT_MAX_ATTEMPTS = 3;
    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(30);

    private static final String ENV_SECONDARY_MODEL = "OPENAI_INTEREST_SECONDARY_MODEL";
    private static final String ENV_TERTIARY_MODEL = "OPENAI_INTEREST_TERTIARY_MODEL";
    private static final String ENV_REPEATS_A = "OPENAI_INTEREST_REPEATS_A";
    private static final String ENV_REPEATS_B = "OPENAI_INTEREST_REPEATS_B";
    private static final String ENV_REPEATS_C = "OPENAI_INTEREST_REPEATS_C";

    private static final int DEFAULT_REPEATS_A = 1;
    private static final int DEFAULT_REPEATS_B = 0;
    private static final int DEFAULT_REPEATS_C = 0;

    private static final int WEIGHT_A = 3;
    private static final int WEIGHT_B = 2;
    private static final int WEIGHT_C = 2;

    private final HttpClient httpClient;
    private final String apiKey;
    private final String modelA;
    private final String modelB;
    private final String modelC;
    private final int repeatsA;
    private final int repeatsB;
    private final int repeatsC;
    private final boolean dryRun;
    private static volatile boolean loggedDryRunOnce = false;
    private static volatile boolean loggedFallbackOnce = false;
    private static volatile boolean loggedSuccessOnce = false;
    private volatile Integer lastHttpStatus = null;

    public OpenAiTagMatchingClient() {
        this(System.getenv("OPENAI_API_KEY"), System.getenv("OPENAI_MODEL"), false);
    }

    OpenAiTagMatchingClient(String apiKey, String model, boolean forceDryRun) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        String key = normalizeNullable(apiKey);
        if (key == null) {
            key = loadEnvKeyFromFiles("OPENAI_API_KEY").orElse(null);
        }
        this.apiKey = key;
        this.modelA = normalizeNullable(model) != null ? normalizeNullable(model) : DEFAULT_MODEL;
        this.modelB = normalizeNullable(System.getenv(ENV_SECONDARY_MODEL));
        this.modelC = normalizeNullable(System.getenv(ENV_TERTIARY_MODEL));
        this.repeatsA = parseIntOrDefault(System.getenv(ENV_REPEATS_A), DEFAULT_REPEATS_A);
        this.repeatsB = parseIntOrDefault(System.getenv(ENV_REPEATS_B), DEFAULT_REPEATS_B);
        this.repeatsC = parseIntOrDefault(System.getenv(ENV_REPEATS_C), DEFAULT_REPEATS_C);
        this.dryRun = forceDryRun || this.apiKey == null;
    }

    @Override
    public Map<Integer, Integer> findBestMatchingTagWeights(
            String interestsText,
            LanguageCode language,
            List<Tag> candidateTags,
            int maxTags
    ) {
        Objects.requireNonNull(interestsText, "interestsText must not be null");
        Objects.requireNonNull(language, "language must not be null");
        Objects.requireNonNull(candidateTags, "candidateTags must not be null");

        String text = interestsText.trim();
        if (text.length() < MIN_TEXT_LEN || text.length() > MAX_TEXT_LEN) {
            throw new IllegalArgumentException(
                    "interestsText length must be between " + MIN_TEXT_LEN + " and " + MAX_TEXT_LEN
            );
        }

        if (candidateTags.isEmpty()) {
            return Map.of();
        }

        int effectiveMaxTags = maxTags > 0 ? Math.min(maxTags, DEFAULT_MAX_TAGS) : DEFAULT_MAX_TAGS;

        int layerEq = computeLayerEquivalent(text.length());
        int minTags = 4;
        int maxTagsByLayer = 6 + (layerEq / 2);
        int maxTagsForCall = Math.max(minTags, Math.min(effectiveMaxTags, maxTagsByLayer));
        List<Integer> outputWeights = weightsForLayerEquivalent(layerEq);
        int cutoff = outputWeights.size();

        if (dryRun) {
            if (!loggedDryRunOnce) {
                loggedDryRunOnce = true;
                System.err.println("[interest] OpenAiTagMatchingClient running in DRY-RUN mode (no OPENAI_API_KEY found).");
            }
            return fallbackDeterministicWeights(candidateTags, maxTagsForCall, outputWeights);
        }

        String prompt = buildPrompt(text, language, candidateTags, minTags, maxTagsForCall);

        Set<Integer> validTagIds = candidateTags.stream()
                .map(Tag::id)
                .collect(Collectors.toSet());

        List<WeightedList> weightedLists = new ArrayList<>();
        for (List<Integer> l : fetchRankedLists(modelA, repeatsA, prompt, validTagIds, maxTagsForCall)) {
            if (!l.isEmpty()) weightedLists.add(new WeightedList(WEIGHT_A, l));
        }
        for (List<Integer> l : fetchRankedLists(modelB, repeatsB, prompt, validTagIds, maxTagsForCall)) {
            if (!l.isEmpty()) weightedLists.add(new WeightedList(WEIGHT_B, l));
        }
        for (List<Integer> l : fetchRankedLists(modelC, repeatsC, prompt, validTagIds, maxTagsForCall)) {
            if (!l.isEmpty()) weightedLists.add(new WeightedList(WEIGHT_C, l));
        }

        if (weightedLists.isEmpty()) {
            if (!loggedFallbackOnce) {
                loggedFallbackOnce = true;
                String extra = (!dryRun && lastHttpStatus != null) ? (" lastStatus=" + lastHttpStatus) : "";
                System.err.println("[interest] OpenAI tag matching failed; falling back to deterministic tags (check API key, quota, and network)." + extra);
            }
            return fallbackDeterministicWeights(candidateTags, maxTagsForCall, outputWeights);
        }

        List<Integer> merged = mergeRanked(weightedLists);
        List<Integer> selected = merged.stream().limit(cutoff).toList();
        return toFixedWeights(selected, outputWeights);
    }

    private static String buildPrompt(
            String interestsText,
            LanguageCode language,
            List<Tag> candidateTags,
            int minTags,
            int maxTags
    ) {
        String langCode = language.toString();
        StringBuilder sb = new StringBuilder();

        sb.append("You are selecting tags that best match the given interests.\n");
        sb.append("- Choose between ").append(minTags).append(" and ").append(maxTags).append(" tag IDs.\n");
        sb.append("- Order tags by relevance (most relevant first).\n");
        sb.append("- Only return tag IDs from the catalog; never invent new IDs.\n");
        sb.append("- Respond with a plain JSON array of integers, e.g. [12,4,7,1].\n\n");

        sb.append("USER INTERESTS (language=").append(langCode).append("):\n");
        sb.append(interestsText).append("\n\n");

        sb.append("TAG CATALOG:\n");
        for (Tag tag : candidateTags) {
            String name = tag.primaryLabel();
            List<String> labels = tag.labels();
            if (labels.size() > 1) {
                List<String> synonyms = labels.subList(1, labels.size());
                sb.append("- ").append(tag.id()).append(": ").append(name)
                        .append(" (synonyms: ").append(String.join(", ", synonyms)).append(")\n");
            } else {
                sb.append("- ").append(tag.id()).append(": ").append(name).append("\n");
            }
        }

        return sb.toString();
    }

    private static final class ApiCompat {
        private boolean includeTemperature = true;

        void learnFromBadRequest(String responseBody) {
            Optional<OpenAiError> err = tryParseError(responseBody);
            if (err.isEmpty()) {
                return;
            }

            OpenAiError e = err.get();
            if ("temperature".equalsIgnoreCase(e.param())) {
                String msg = e.message() == null ? "" : e.message().toLowerCase(Locale.ROOT);
                if ("unsupported_value".equalsIgnoreCase(e.code()) || msg.contains("only the default")) {
                    includeTemperature = false;
                }
            }
        }
    }

    private record OpenAiError(String message, String type, String param, String code) {
    }

    private static Optional<OpenAiError> tryParseError(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return Optional.empty();
        }
        if (!responseBody.contains("\"error\"")) {
            return Optional.empty();
        }
        String message = extractJsonStringField(responseBody, "message").orElse("");
        String type = extractJsonStringField(responseBody, "type").orElse("");
        String param = extractJsonStringField(responseBody, "param").orElse("");
        String code = extractJsonStringField(responseBody, "code").orElse("");
        return Optional.of(new OpenAiError(message, type, param, code));
    }

    private static Optional<String> extractJsonStringField(String json, String fieldName) {
        Pattern p = Pattern.compile("\"" + Pattern.quote(fieldName) + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
        Matcher m = p.matcher(json);
        if (!m.find()) {
            return Optional.empty();
        }
        return Optional.of(unescapeJsonString(m.group(1)));
    }

    private static String unescapeJsonString(String escaped) {
        if (escaped == null || escaped.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder(escaped.length());
        for (int i = 0; i < escaped.length(); i++) {
            char c = escaped.charAt(i);
            if (c != '\\' || i == escaped.length() - 1) {
                sb.append(c);
                continue;
            }
            char n = escaped.charAt(++i);
            switch (n) {
                case 'n' -> sb.append('\n');
                case 'r' -> sb.append('\r');
                case 't' -> sb.append('\t');
                case '\\' -> sb.append('\\');
                case '"' -> sb.append('"');
                default -> sb.append(n);
            }
        }
        return sb.toString();
    }

    private HttpResponse<String> sendRequest(String modelName, String prompt, ApiCompat compat)
            throws IOException, InterruptedException {
        String temperatureLine = compat.includeTemperature ? ",\n  \"temperature\": 0.2" : "";
        String jsonBody = """
                {
                  "model": "%s",
                  "messages": [
                    {
                      "role": "system",
                      "content": "You are an assistant that only returns JSON arrays of integers."
                    },
                    {
                      "role": "user",
                      "content": %s
                    }
                  ]%s
                }
                """.formatted(modelName, toJsonString(prompt), temperatureLine);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .timeout(DEFAULT_TIMEOUT)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private List<List<Integer>> fetchRankedLists(
            String modelName,
            int repeats,
            String prompt,
            Set<Integer> validTagIds,
            int maxTags
    ) {
        if (modelName == null || modelName.isBlank() || repeats <= 0) {
            return List.of();
        }

        ApiCompat compat = new ApiCompat();
        List<List<Integer>> out = new ArrayList<>();

        for (int i = 0; i < repeats; i++) {
            String responseBody = null;
            Integer lastStatus = null;
            for (int attempt = 1; attempt <= DEFAULT_MAX_ATTEMPTS; attempt++) {
                try {
                    HttpResponse<String> resp = sendRequest(modelName, prompt, compat);
                    int status = resp.statusCode();
                    String body = resp.body();
                    lastStatus = status;
                    lastHttpStatus = status;

                    if (status >= 200 && status < 300) {
                        responseBody = body;
                        if (!loggedSuccessOnce) {
                            loggedSuccessOnce = true;
                            System.err.println("[interest] OpenAI tag matching succeeded (model=" + modelName + ").");
                        }
                        break;
                    }
                    if (status == 400) {
                        compat.learnFromBadRequest(body);
                    }
                    if (status == 429) {
                        sleepRetryAfter(resp, attempt);
                        continue;
                    }
                    if (status == 401 || status == 403) {
                        break;
                    }
                } catch (IOException e) {
                    // network/IO: retry with small backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }

                if (attempt < DEFAULT_MAX_ATTEMPTS) {
                    sleepMillis(500L * attempt);
                }
            }

            if (responseBody == null) {
                if (!dryRun && lastStatus != null) {
                    lastHttpStatus = lastStatus;
                }
                out.add(List.of());
                continue;
            }

            String content = extractAssistantContent(responseBody).orElse("");
            List<Integer> rawIds = parseTagIdsFromJsonArray(content);
            List<Integer> cleaned = rawIds.stream()
                    .filter(validTagIds::contains)
                    .distinct()
                    .limit(maxTags)
                    .toList();
            out.add(cleaned);
        }

        return List.copyOf(out);
    }

    private static void sleepRetryAfter(HttpResponse<String> resp, int attempt) {
        Optional<String> retryAfter = resp.headers().firstValue("Retry-After");
        if (retryAfter.isPresent()) {
            try {
                double seconds = Double.parseDouble(retryAfter.get().trim());
                sleepMillis((long) (seconds * 1000));
                return;
            } catch (NumberFormatException ignored) {
                // fall through
            }
        }
        sleepMillis(1000L * attempt);
    }

    private static void sleepMillis(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }

    private static Optional<String> extractAssistantContent(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return Optional.empty();
        }

        Pattern rolePattern = Pattern.compile("\"role\"\\s*:\\s*\"assistant\"");
        Matcher roleMatcher = rolePattern.matcher(responseBody);
        int searchFrom = 0;
        if (roleMatcher.find()) {
            searchFrom = roleMatcher.end();
        }

        int contentIdx = responseBody.indexOf("\"content\"", searchFrom);
        if (contentIdx < 0) {
            return Optional.empty();
        }

        int colon = responseBody.indexOf(':', contentIdx);
        if (colon < 0) {
            return Optional.empty();
        }

        int i = colon + 1;
        while (i < responseBody.length() && Character.isWhitespace(responseBody.charAt(i))) {
            i++;
        }
        if (i >= responseBody.length() || responseBody.charAt(i) != '"') {
            return Optional.empty();
        }

        StringBuilder sb = new StringBuilder();
        i++; // opening quote
        boolean escaping = false;
        while (i < responseBody.length()) {
            char c = responseBody.charAt(i++);
            if (escaping) {
                switch (c) {
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case '\\' -> sb.append('\\');
                    case '"' -> sb.append('"');
                    default -> sb.append(c);
                }
                escaping = false;
                continue;
            }
            if (c == '\\') {
                escaping = true;
                continue;
            }
            if (c == '"') {
                break;
            }
            sb.append(c);
        }

        return Optional.of(sb.toString());
    }

    private static String toJsonString(String value) {
        String escaped = value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
        return "\"" + escaped + "\"";
    }

    private static List<Integer> parseTagIdsFromJsonArray(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        int start = text.indexOf('[');
        int end = text.indexOf(']', start + 1);
        if (start < 0 || end < 0 || end <= start) {
            return List.of();
        }

        String arrayPart = text.substring(start + 1, end);

        Pattern intPattern = Pattern.compile("-?\\d+");
        Matcher matcher = intPattern.matcher(arrayPart);

        List<Integer> result = new ArrayList<>();
        while (matcher.find()) {
            try {
                result.add(Integer.parseInt(matcher.group()));
            } catch (NumberFormatException ignore) {
                // skip
            }
        }
        return result;
    }

    private static Map<Integer, Integer> fallbackDeterministicWeights(
            List<Tag> candidateTags,
            int maxTags,
            List<Integer> weights
    ) {
        List<Integer> sortedIds = candidateTags.stream()
                .map(Tag::id)
                .sorted()
                .limit(maxTags)
                .toList();

        int cutoff = weights.size();
        List<Integer> selected = sortedIds.stream().limit(cutoff).toList();
        return toFixedWeights(selected, weights);
    }

    private static Map<Integer, Integer> toFixedWeights(List<Integer> tagIds, List<Integer> weights) {
        Map<Integer, Integer> result = new LinkedHashMap<>();
        for (int i = 0; i < tagIds.size() && i < weights.size(); i++) {
            int w = weights.get(i);
            if (w < 1) w = 1;
            if (w > 5) w = 5;
            result.put(tagIds.get(i), w);
        }
        return result;
    }

    private record WeightedList(int weight, List<Integer> ids) {
    }

    private static List<Integer> mergeRanked(List<WeightedList> lists) {
        Set<Integer> all = new HashSet<>();
        for (WeightedList wl : lists) {
            all.addAll(wl.ids());
        }
        List<Integer> combined = new ArrayList<>(all);

        List<Map<Integer, Integer>> posMaps = new ArrayList<>();
        List<Integer> lengths = new ArrayList<>();
        List<Integer> weights = new ArrayList<>();
        for (WeightedList wl : lists) {
            Map<Integer, Integer> pos = new HashMap<>();
            List<Integer> ids = wl.ids();
            for (int i = 0; i < ids.size(); i++) {
                pos.put(ids.get(i), i);
            }
            posMaps.add(pos);
            lengths.add(ids.size());
            weights.add(wl.weight());
        }

        combined.sort(Comparator
                .comparingInt((Integer id) -> {
                    int total = 0;
                    for (int i = 0; i < posMaps.size(); i++) {
                        int pos = posMaps.get(i).getOrDefault(id, lengths.get(i));
                        total += pos * weights.get(i);
                    }
                    return total;
                })
                .thenComparingInt(Integer::intValue)
        );

        return List.copyOf(combined);
    }

    private static int computeLayerEquivalent(int inputLen) {
        double ratio = inputLen / 50.0;
        if (ratio <= 1.0) {
            return 3;
        }
        int pow = (int) Math.floor(Math.log(ratio) / Math.log(2));
        if (pow < 0) {
            pow = 0;
        }
        return 3 + pow;
    }

    private static List<Integer> weightsForLayerEquivalent(int layerEq) {
        Map<Integer, List<Integer>> map = Map.of(
                3, List.of(5, 4, 3, 1),
                4, List.of(5, 4, 3, 2, 1),
                5, List.of(5, 4, 3, 3, 1),
                6, List.of(5, 4, 3, 2, 2, 1),
                7, List.of(5, 4, 3, 3, 2, 1),
                8, List.of(5, 4, 3, 3, 2, 1, 1)
        );
        int normalized = Math.max(3, Math.min(8, layerEq));
        List<Integer> weights = map.get(normalized);

        int expectedCutoff = 3 + (normalized / 2);
        if (weights.size() != expectedCutoff) {
            throw new IllegalStateException(
                    "Interest weight matrix mismatch for layerEq=" + normalized +
                    " expected cutoff=" + expectedCutoff + " weights=" + weights.size()
            );
        }

        return weights;
    }

    private static String normalizeNullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static Optional<String> loadEnvKeyFromFiles(String key) {
        // Convenience for local dev: look for a .env file if the environment variable is missing.
        // Do not print the key value; only use it if present.
        Set<Path> candidates = new LinkedHashSet<>();
        candidates.add(Path.of(".env"));
        candidates.add(Path.of("src", "main", "resources", "scripts", ".env"));
        candidates.add(Path.of("backend", ".env"));
        candidates.add(Path.of("backend", "src", "main", "resources", "scripts", ".env"));

        for (Path path : candidates) {
            Optional<String> val = readEnvFile(path, key);
            if (val.isPresent()) {
                System.err.println("[interest] Loaded " + key + " from " + path.toString());
                return val;
            }
        }
        return Optional.empty();
    }

    private static Optional<String> readEnvFile(Path path, String key) {
        try {
            if (!Files.exists(path)) {
                return Optional.empty();
            }
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            for (String line : lines) {
                if (line == null) continue;
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                int eq = trimmed.indexOf('=');
                if (eq <= 0) {
                    continue;
                }
                String k = trimmed.substring(0, eq).trim();
                if (!key.equals(k)) {
                    continue;
                }
                String v = trimmed.substring(eq + 1).trim();
                if (v.startsWith("\"") && v.endsWith("\"") && v.length() >= 2) {
                    v = v.substring(1, v.length() - 1);
                }
                v = v.trim();
                if (!v.isEmpty()) {
                    return Optional.of(v);
                }
                return Optional.empty();
            }
        } catch (IOException ignored) {
            return Optional.empty();
        }
        return Optional.empty();
    }

    private static int parseIntOrDefault(String value, int defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ignored) {
            return defaultValue;
        }
    }
}
