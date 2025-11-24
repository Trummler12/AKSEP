package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Repräsentiert Synonyme eines Tags, gruppiert nach Sprache:
 * LanguageCode -> Liste von Synonymen (Strings).
 *
 * Die Instanz ist unveränderlich (immutable).
 */
public final class TagLocalization {

    private final Map<LanguageCode, List<String>> synonymsByLanguage;

    private TagLocalization(Map<LanguageCode, List<String>> synonymsByLanguage) {
        // Tiefenkopie + Unmodifiable
        Map<LanguageCode, List<String>> copy = new HashMap<>();
        for (Map.Entry<LanguageCode, List<String>> entry : synonymsByLanguage.entrySet()) {
            copy.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        this.synonymsByLanguage = Map.copyOf(copy);
    }

    /**
     * Erzeugt eine leere TagLocalization ohne Synonyme.
     */
    public static TagLocalization empty() {
        return new TagLocalization(Map.of());
    }

    /**
     * Erzeugt eine TagLocalization aus einem Mapping.
     * - Null-Keys oder Null-Listen sind nicht erlaubt.
     * - Null-Synonyme sind nicht erlaubt.
     * - Synonyme werden getrimmt.
     * - Leere Strings werden entfernt.
     * - Dubletten pro Sprache werden entfernt (Case-sensitive).
     */
    public static TagLocalization of(Map<LanguageCode, List<String>> rawSynonyms) {
        Objects.requireNonNull(rawSynonyms, "synonyms must not be null");

        if (rawSynonyms.isEmpty()) {
            return empty();
        }

        Map<LanguageCode, List<String>> normalized = new HashMap<>();

        for (Map.Entry<LanguageCode, List<String>> entry : rawSynonyms.entrySet()) {
            LanguageCode lang = Objects.requireNonNull(entry.getKey(), "language must not be null");
            List<String> list = Objects.requireNonNull(entry.getValue(), "synonym list must not be null");

            List<String> cleaned = new ArrayList<>();
            for (String synonym : list) {
                Objects.requireNonNull(synonym, "synonym must not be null");
                String trimmed = synonym.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                if (!cleaned.contains(trimmed)) {
                    cleaned.add(trimmed);
                }
            }

            if (!cleaned.isEmpty()) {
                normalized.put(lang, cleaned);
            }
        }

        if (normalized.isEmpty()) {
            return empty();
        }

        return new TagLocalization(normalized);
    }

    /**
     * Liefert die Synonyme für eine Sprache als unmodifizierbare Liste.
     * Gibt eine leere Liste zurück, wenn keine Synonyme vorhanden sind.
     */
    public List<String> synonyms(LanguageCode language) {
        Objects.requireNonNull(language, "language must not be null");
        return synonymsByLanguage.getOrDefault(language, List.of());
    }

    /**
     * Liefert alle Sprachen, für die Synonyme vorhanden sind.
     */
    public Set<LanguageCode> languages() {
        return synonymsByLanguage.keySet();
    }

    /**
     * Prüft, ob ein Synonym für eine Sprache existiert (case-insensitive).
     */
    public boolean containsSynonym(LanguageCode language, String term) {
        Objects.requireNonNull(language, "language must not be null");
        Objects.requireNonNull(term, "term must not be null");
        String normalizedTerm = term.trim().toLowerCase(Locale.ROOT);

        return synonyms(language).stream()
                .map(s -> s.toLowerCase(Locale.ROOT))
                .anyMatch(s -> s.equals(normalizedTerm));
    }

    /**
     * Gesamte Struktur als String, hilfreich für Debugging.
     */
    @Override
    public String toString() {
        String content = synonymsByLanguage.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining(", "));
        return "TagLocalization{" + content + "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TagLocalization that)) return false;
        return synonymsByLanguage.equals(that.synonymsByLanguage);
    }

    @Override
    public int hashCode() {
        return synonymsByLanguage.hashCode();
    }
}
