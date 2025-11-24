package org.schoolsystem.domain.value;

import java.util.Objects;

/**
 * Repräsentiert einen Sprachcode wie "de" oder "en".
 * Intern immer in Kleinbuchstaben gespeichert.
 */
public record LanguageCode(String value) {

    public static final String[] supportedLanguages = new String[] {"de", "en"};

    public LanguageCode {
        Objects.requireNonNull(value, "Language code must not be null");
        String normalized = value.trim().toLowerCase();

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("Language code must not be empty");
        }
        if (normalized.length() < 2 || normalized.length() > 3) {
            throw new IllegalArgumentException(
                "Language code must have length 2 or 3, but was: " + normalized
            );
        }
        if (!normalized.chars().allMatch(ch -> ch >= 'a' && ch <= 'z')) {
            throw new IllegalArgumentException(
                "Language code must contain only letters a-z, but was: " + normalized
            );
        }

        value = normalized;
    }

    public static LanguageCode[] getSupportedLanguages() {
        LanguageCode[] codes = new LanguageCode[supportedLanguages.length];
        for (int i = 0; i < supportedLanguages.length; i++) {
            codes[i] = new LanguageCode(supportedLanguages[i]);
        }
        return codes;
    }

    public static String getSupportedLanguagesString() {
        return String.join(", ", supportedLanguages);
    }

    public boolean isGerman() {
        return "de".equals(value);
    }

    public boolean isEnglish() {
        return "en".equals(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
