package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.Tag;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Lädt Tag-Daten aus csv/t_tag.csv.
 *
 * Entspricht t_tag:
 *  - tagID      -> id (int > 0)
 *  - name       -> erster Eintrag in labels
 *  - synonyms   -> optional weitere labels
 *  - version    -> hier: immer 1
 *
 * CSV-Header (Stand jetzt):
 *   tagID,name,synonyms
 */
public final class TagCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;

    public TagCsvLoader() {
        this(new CsvFileReader(), "csv/t_tag.csv");
    }

    TagCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    public List<Tag> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<Tag> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            int id = Integer.parseInt(row.get("tagID").trim());
            String name = safeTrim(row.get("name"));
            String synonymsRaw = safeTrim(row.get("synonyms"));

            // Labels: immer mindestens der Name, Synonyme optional dazu
            Set<String> labels = new LinkedHashSet<>();

            if (!name.isEmpty()) {
                labels.add(name);
            }

            if (!synonymsRaw.isEmpty()) {
                for (String s : parseSynonyms(synonymsRaw)) {
                    if (!s.isEmpty()) {
                        labels.add(s);
                    }
                }
            }

            int version = 1;

            result.add(Tag.of(id, List.copyOf(labels), version));
        }

        return Collections.unmodifiableList(result);
    }

    private static String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    /**
     * Parsen der Synonym-Spalte.
     *
     * Unterstützt:
     *  - Leer / ""          -> leere Liste
     *  - "acanthology"     -> ["acanthology"]
     *  - "["a","b"]"       -> ["a","b"] (falls du später auf JSON-ähnliches Format umstellst)
     */
    static List<String> parseSynonyms(String raw) {
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return List.of();
        }

        // JSON-Array-ähnliches Format: ["a","b"] oder [a,b]
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            String inner = trimmed.substring(1, trimmed.length() - 1).trim();
            if (inner.isEmpty()) {
                return List.of();
            }

            String[] parts = inner.split(",");
            List<String> result = new ArrayList<>(parts.length);
            for (String part : parts) {
                String p = part.trim();
                if (p.startsWith("\"") && p.endsWith("\"") && p.length() >= 2) {
                    p = p.substring(1, p.length() - 1);
                }
                if (!p.isEmpty()) {
                    result.add(p);
                }
            }
            return result;
        }

        // Einfacher String: direkt als einzelnes Synonym
        return List.of(trimmed);
    }
}
