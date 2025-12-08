package org.schoolsystem.infrastructure.interest;

import org.schoolsystem.application.interest.TagMatchingClient;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.value.LanguageCode;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * OpenAI-basierte Implementierung des TagMatchingClient.
 *
 * Diese Implementierung:
 *  - baut ein Prompt mit allen Tags (inkl. Synonymen)
 *  - ruft die Chat-Completions-API von OpenAI auf (einmal pro Anfrage)
 *  - erwartet eine reine JSON-Array-Antwort: [18, 42, 7, ...]
 *  - filtert auf gültige Tag-IDs
 *  - vergibt diskrete Gewichte 5..1 für die Top-N Tags (Triangular-Schema)
 */
public final class OpenAiTagMatchingClient implements TagMatchingClient {

    private static final String DEFAULT_MODEL = "gpt-4.1-mini";
    private static final int DEFAULT_MAX_TAGS = 15;

    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final boolean dryRun;

    /**
     * Standardkonstruktor für Produktivcode.
     * Erwartet, dass OPENAI_API_KEY als Environment-Variable gesetzt ist.
     */
    public OpenAiTagMatchingClient() {
        this(System.getenv("OPENAI_API_KEY"), System.getenv("OPENAI_MODEL"), false);
    }

    /**
     * Paket-sichtbarer Konstruktor, z.B. für Tests.
     */
    OpenAiTagMatchingClient(String apiKey, String model, boolean forceDryRun) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.apiKey = apiKey != null && !apiKey.isBlank() ? apiKey.trim() : null;
        this.model = (model != null && !model.isBlank()) ? model.trim() : DEFAULT_MODEL;
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

        int effectiveMaxTags = maxTags > 0 ? maxTags : DEFAULT_MAX_TAGS;

        if (candidateTags.isEmpty()) {
            return Map.of();
        }

        // Fallback: kein API-Key -> deterministisch einige Tags wählen
        if (dryRun) {
            return fallbackDeterministicWeights(candidateTags, effectiveMaxTags);
        }

        String prompt = buildPrompt(interestsText, language, candidateTags, effectiveMaxTags);
        String responseBody;
        try {
            responseBody = callOpenAi(prompt);
        } catch (IOException | InterruptedException e) {
            // Defensive: im Fehlerfall lieber ein deterministischer Fallback, als die Suche komplett zu brechen
            return fallbackDeterministicWeights(candidateTags, effectiveMaxTags);
        }

        List<Integer> tagIds = parseTagIdsFromJsonArray(responseBody);
        if (tagIds.isEmpty()) {
            return fallbackDeterministicWeights(candidateTags, effectiveMaxTags);
        }

        // Nur vorhandene Tag-IDs berücksichtigen
        Set<Integer> validTagIds = candidateTags.stream()
                .map(Tag::id)
                .collect(Collectors.toSet());

        List<Integer> filtered = tagIds.stream()
                .filter(validTagIds::contains)
                .distinct()
                .limit(effectiveMaxTags)
                .toList();

        return toTriangularWeights(filtered);
    }

    // -------------------------------------------------------------------------
    // Prompt-Aufbau
    // -------------------------------------------------------------------------

    private static String buildPrompt(String interestsText,
                                      LanguageCode language,
                                      List<Tag> candidateTags,
                                      int maxTags) {

        String langCode = language.toString();
        StringBuilder sb = new StringBuilder();

        sb.append("You are an assistant that selects up to ")
          .append(maxTags)
          .append(" tags that best match the given interests.\n\n");

        sb.append("USER INTERESTS (language=")
          .append(langCode)
          .append("):\n")
          .append(interestsText)
          .append("\n\n");

        sb.append("AVAILABLE TAGS:\n");
        for (Tag tag : candidateTags) {
            String name = tag.primaryLabel();
            String synonymsStr = "";
            List<String> labels = tag.labels();
            if (labels.size() > 1) {
                List<String> synonyms = labels.subList(1, labels.size());
                synonymsStr = " [" + String.join(", ", synonyms) + "]";
            }
            sb.append(tag.id()).append(": ").append(name).append(synonymsStr).append("\n");
        }

        sb.append("""
                
                RESPONSE FORMAT:
                - Only output a JSON array of tag IDs
                - Example: [1, 5, 9, 12]
                """);

        return sb.toString();
    }

    // -------------------------------------------------------------------------
    // HTTP-Call
    // -------------------------------------------------------------------------

    private String callOpenAi(String prompt) throws IOException, InterruptedException {
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
                  ],
                  "temperature": 0.2
                }
                """.formatted(model, toJsonString(prompt));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(30))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        int status = response.statusCode();
        if (status < 200 || status >= 300) {
            throw new IOException("OpenAI API returned status " + status + ": " + response.body());
        }

        return response.body();
    }

    /**
     * Minimalistische JSON-String-Escaping-Funktion für den Prompt.
     */
    private static String toJsonString(String value) {
        String escaped = value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
        return "\"" + escaped + "\"";
    }

    // -------------------------------------------------------------------------
    // Parsing & Gewichtung
    // -------------------------------------------------------------------------

    /**
     * Sucht die erste JSON-Array-ähnliche Struktur im OpenAI-Response und parst daraus Integer.
     *
     * Erwartetes Format (z.B. aus choices[0].message.content):
     *   [1, 5, 9]
     */
    private static List<Integer> parseTagIdsFromJsonArray(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return List.of();
        }

        // Sehr einfache Heuristik:
        //  1) das erste "[" . "]" suchen
        int start = responseBody.indexOf('[');
        int end = responseBody.indexOf(']', start + 1);
        if (start < 0 || end < 0 || end <= start) {
            return List.of();
        }

        String arrayPart = responseBody.substring(start + 1, end);

        // Alle Integer per Regex einsammeln
        Pattern intPattern = Pattern.compile("-?\\d+");
        Matcher matcher = intPattern.matcher(arrayPart);

        List<Integer> result = new ArrayList<>();
        while (matcher.find()) {
            try {
                result.add(Integer.parseInt(matcher.group()));
            } catch (NumberFormatException ignore) {
                // einfach überspringen
            }
        }
        return result;
    }

    /**
     * Weist den Tag-IDs diskrete Gewichte 5..1 zu (Triangular-Schema).
     */
    private static Map<Integer, Integer> toTriangularWeights(List<Integer> tagIds) {
        if (tagIds.isEmpty()) {
            return Map.of();
        }

        int n = tagIds.size();

        // Wir definieren eine einfache Dreiecks-Gewichtung:
        // - 1. Tag: Gewicht 5
        // - 2.-3. Tag: Gewicht 4
        // - 4.-6. Tag: Gewicht 3
        // - 7.-10. Tag: Gewicht 2
        // - Rest: Gewicht 1
        Map<Integer, Integer> result = new LinkedHashMap<>();

        for (int i = 0; i < n; i++) {
            int index = i + 1;
            int weight;
            if (index == 1) {
                weight = 5;
            } else if (index <= 3) {
                weight = 4;
            } else if (index <= 6) {
                weight = 3;
            } else if (index <= 10) {
                weight = 2;
            } else {
                weight = 1;
            }
            result.put(tagIds.get(i), weight);
        }

        return result;
    }

    /**
     * Fallback-Implementierung, falls kein API-Key vorhanden ist.
     * Wählt deterministisch die ersten N Tags und gewichtet sie ebenfalls mit dem Triangular-Schema.
     */
    private static Map<Integer, Integer> fallbackDeterministicWeights(List<Tag> candidateTags, int maxTags) {
        List<Integer> sortedIds = candidateTags.stream()
                .map(Tag::id)
                .sorted()
                .limit(maxTags)
                .toList();

        return toTriangularWeights(sortedIds);
    }
}
