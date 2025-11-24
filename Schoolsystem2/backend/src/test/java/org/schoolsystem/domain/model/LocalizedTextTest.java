package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class LocalizedTextTest {

    @Test
    void ofSingleLanguageStoresTrimmedText() {
        LanguageCode de = new LanguageCode("de");
        LocalizedText text = LocalizedText.of(de, "  Hallo Welt  ");

        assertEquals("Hallo Welt", text.get(de).orElseThrow());
        assertTrue(text.languages().contains(de));
        assertEquals(1, text.languages().size());
    }

    @Test
    void ofMapTrimsValuesAndIsImmutable() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("en");

        Map<LanguageCode, String> map = new HashMap<>();
        map.put(de, "  Hallo ");
        map.put(en, " World  ");

        LocalizedText text = LocalizedText.of(map);

        // Original-Map ändern -> sollte keinen Einfluss mehr haben
        map.put(de, "Geändert");

        assertEquals("Hallo", text.get(de).orElseThrow());
        assertEquals("World", text.get(en).orElseThrow());

        // asMap darf nicht modifizierbar sein
        assertThrows(UnsupportedOperationException.class,
                () -> text.asMap().put(new LanguageCode("fr"), "Bonjour"));
    }

    @Test
    void ofMapRejectsNullArguments() {
        LanguageCode de = new LanguageCode("de");

        assertThrows(NullPointerException.class, () -> LocalizedText.of(null));

        Map<LanguageCode, String> withNullKey = new HashMap<>();
        withNullKey.put(null, "Hallo");
        assertThrows(NullPointerException.class, () -> LocalizedText.of(withNullKey));

        Map<LanguageCode, String> withNullValue = new HashMap<>();
        withNullValue.put(de, null);
        assertThrows(NullPointerException.class, () -> LocalizedText.of(withNullValue));
    }

    @Test
    void ofMapRejectsEmptyMap() {
        Map<LanguageCode, String> empty = Map.of();
        assertThrows(IllegalArgumentException.class, () -> LocalizedText.of(empty));
    }

    @Test
    void withReturnsNewInstanceWithAdditionalLanguage() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("en");

        LocalizedText text = LocalizedText.of(de, "Hallo");
        LocalizedText extended = text.with(en, "Hello");

        assertTrue(text.languages().contains(de));
        assertFalse(text.languages().contains(en));

        assertTrue(extended.languages().contains(de));
        assertTrue(extended.languages().contains(en));

        assertEquals("Hallo", extended.get(de).orElseThrow());
        assertEquals("Hello", extended.get(en).orElseThrow());
    }
}
