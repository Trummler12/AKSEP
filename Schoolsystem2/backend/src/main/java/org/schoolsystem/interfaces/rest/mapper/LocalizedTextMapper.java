package org.schoolsystem.interfaces.rest.mapper;

import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.model.LocalizedText;

import java.util.Map;
import java.util.Objects;

/**
 * Hilfsklasse zur Konvertierung von LocalizedText in eine einsprachige String-Repräsentation
 * mit Fallback-Regeln entsprechend API-Contract.
 */
public final class LocalizedTextMapper {

    private static final LanguageCode ENGLISH = new LanguageCode("en");

    private LocalizedTextMapper() {
        // utility
    }

    public static String toLocalizedString(LocalizedText text, LanguageCode requestedLanguage) {
        Objects.requireNonNull(text, "text must not be null");

        LanguageCode effectiveLang = requestedLanguage != null ? requestedLanguage : ENGLISH;

        // 1. Versuche gewünschte Sprache
        return text.get(effectiveLang)
                // 2. Fallback: Englisch
                .or(() -> text.get(ENGLISH))
                // 3. Fallback: irgendeine vorhandene Sprache
                .orElseGet(() -> firstValueOrEmpty(text.asMap()));
    }

    private static String firstValueOrEmpty(Map<LanguageCode, String> map) {
        return map.values().stream()
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("");
    }
}
