package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;

import java.util.*;

/**
 * Repräsentiert einen lokalisierten Text, z.B. einen Titel oder eine Beschreibung,
 * als Mapping von LanguageCode -> Text.
 *
 * Die Instanz ist unveränderlich (immutable).
 */
public final class LocalizedText {

    private final Map<LanguageCode, String> localizations;

    private LocalizedText(Map<LanguageCode, String> localizations) {
        // localizations muss bereits bereinigt sein
        this.localizations = Map.copyOf(localizations);
    }

    /**
     * Erzeugt einen LocalizedText aus einem Mapping.
     * Null-Keys oder Null-Werte sind nicht erlaubt.
    *  Werte werden getrimmt.
     */
    public static LocalizedText of(Map<LanguageCode, String> rawLocalizations) {
        Objects.requireNonNull(rawLocalizations, "localizations must not be null");
        if (rawLocalizations.isEmpty()) {
            throw new IllegalArgumentException("localizations must not be empty");
        }

        Map<LanguageCode, String> normalized = new HashMap<>();
        for (Map.Entry<LanguageCode, String> entry : rawLocalizations.entrySet()) {
            LanguageCode lang = Objects.requireNonNull(entry.getKey(), "language must not be null");
            String text = Objects.requireNonNull(entry.getValue(), "text must not be null");
            String trimmed = text.trim();
            normalized.put(lang, trimmed);
        }

        return new LocalizedText(normalized);
    }

    /**
     * Bequeme Factory-Methode für genau einen Eintrag.
     */
    public static LocalizedText of(LanguageCode language, String text) {
        Objects.requireNonNull(language, "language must not be null");
        Objects.requireNonNull(text, "text must not be null");
        Map<LanguageCode, String> map = new HashMap<>();
        map.put(language, text.trim());
        return new LocalizedText(map);
    }

    /**
     * Liefert den Text für eine gegebene Sprache, sofern vorhanden.
     */
    public Optional<String> get(LanguageCode language) {
        Objects.requireNonNull(language, "language must not be null");
        return Optional.ofNullable(localizations.get(language));
    }

    /**
     * Liefert den Text für die gewünschte Sprache oder,
     * falls nicht vorhanden, für die Fallback-Sprache.
     *
     * Falls weder gewünschte noch Fallback-Sprache vorhanden sind,
     * wird irgendein vorhandener Wert zurückgegeben (oder ein leerer String,
     * wenn gar nichts vorhanden ist – sollte in deinem Modell nicht vorkommen).
     */
    public String getOrDefault(LanguageCode requested, LanguageCode fallback) {
        Objects.requireNonNull(requested, "requested language must not be null");
        Objects.requireNonNull(fallback, "fallback language must not be null");

        return get(requested)
                .or(() -> get(fallback))
                .orElseGet(() -> localizations.values().stream()
                        .findFirst()
                        .orElse(""));
    }

    /**
     * Liefert die Menge aller verfügbaren Sprachen.
     */
    public Set<LanguageCode> languages() {
        return localizations.keySet();
    }

    /**
     * Fügt einen weiteren Sprach-Eintrag hinzu (oder ersetzt ihn) und gibt eine neue Instanz zurück.
     */
    public LocalizedText with(LanguageCode language, String text) {
        Objects.requireNonNull(language, "language must not be null");
        Objects.requireNonNull(text, "text must not be null");

        Map<LanguageCode, String> copy = new HashMap<>(this.localizations);
        copy.put(language, text.trim());
        return new LocalizedText(copy);
    }

    /**
     * Gibt das interne Mapping als unmodifizierbare Map zurück.
     */
    public Map<LanguageCode, String> asMap() {
        return localizations;
    }

    @Override
    public String toString() {
        return "LocalizedText" + localizations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LocalizedText that)) return false;
        return localizations.equals(that.localizations);
    }

    @Override
    public int hashCode() {
        return localizations.hashCode();
    }
}
