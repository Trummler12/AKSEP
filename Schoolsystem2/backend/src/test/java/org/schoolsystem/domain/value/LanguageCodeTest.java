package org.schoolsystem.domain.value;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LanguageCodeTest {

    @Test
    void validLanguageCodesAreNormalizedToLowercase() {
        LanguageCode de = new LanguageCode("DE");
        LanguageCode en = new LanguageCode(" en ");

        assertEquals("de", de.value());
        assertEquals("en", en.value());
    }

    @Test
    void invalidLanguageCodeThrowsExceptionWhenEmpty() {
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> new LanguageCode("   ")
        );
        assertTrue(ex.getMessage().toLowerCase().contains("empty"));
    }

    @Test
    void invalidLanguageCodeThrowsExceptionWhenTooLong() {
        assertThrows(IllegalArgumentException.class, () -> new LanguageCode("gerd"));
    }

    @Test
    void invalidLanguageCodeThrowsExceptionWhenContainsNonLetters() {
        assertThrows(IllegalArgumentException.class, () -> new LanguageCode("d3"));
        assertThrows(IllegalArgumentException.class, () -> new LanguageCode("e-"));
    }

    @Test
    void helperMethodsWorkAsExpected() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("EN");

        assertTrue(de.isGerman());
        assertFalse(de.isEnglish());

        assertTrue(en.isEnglish());
        assertFalse(en.isGerman());
    }
}
