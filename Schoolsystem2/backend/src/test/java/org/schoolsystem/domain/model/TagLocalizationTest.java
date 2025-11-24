package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TagLocalizationTest {

    @Test
    void emptyReturnsNoLanguagesAndEmptySynonyms() {
        TagLocalization loc = TagLocalization.empty();
        LanguageCode de = new LanguageCode("de");

        assertTrue(loc.languages().isEmpty());
        assertTrue(loc.synonyms(de).isEmpty());
    }

    @Test
    void ofBuildsImmutableStructureAndCleansInput() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("en");

        List<String> deSynonyms = new ArrayList<>();
        deSynonyms.add("  Physik ");
        deSynonyms.add("Physik");       // Duplikat
        deSynonyms.add("   ");          // leer -> ignorieren
        deSynonyms.add("Phy");          // weiterer valider Eintrag

        List<String> enSynonyms = List.of(" physics ", " PHY ");

        Map<LanguageCode, List<String>> map = new HashMap<>();
        map.put(de, deSynonyms);
        map.put(en, enSynonyms);

        TagLocalization loc = TagLocalization.of(map);

        // Original-Listen ändern -> darf keinen Einfluss haben
        deSynonyms.add("Manipulation");

        List<String> deResult = loc.synonyms(de);
        List<String> enResult = loc.synonyms(en);

        assertEquals(List.of("Physik", "Phy"), deResult);
        assertEquals(List.of("physics", "PHY"), enResult);

        // Rückgabewerte müssen unmodifizierbar sein
        assertThrows(UnsupportedOperationException.class, () -> deResult.add("Test"));
        assertThrows(UnsupportedOperationException.class, () -> enResult.add("Test"));
    }

    @Test
    void containsSynonymIsCaseInsensitive() {
        LanguageCode en = new LanguageCode("en");

        Map<LanguageCode, List<String>> map = new HashMap<>();
        map.put(en, List.of("Physics", "Astrophysics"));

        TagLocalization loc = TagLocalization.of(map);

        assertTrue(loc.containsSynonym(en, "physics"));
        assertTrue(loc.containsSynonym(en, "PHYSICS"));
        assertFalse(loc.containsSynonym(en, "chemistry"));
    }

    @Test
    void ofRejectsNullArguments() {
        assertThrows(NullPointerException.class, () -> TagLocalization.of(null));

        LanguageCode de = new LanguageCode("de");

        Map<LanguageCode, List<String>> nullKey = new HashMap<>();
        nullKey.put(null, List.of("Physik"));
        assertThrows(NullPointerException.class, () -> TagLocalization.of(nullKey));

        Map<LanguageCode, List<String>> nullList = new HashMap<>();
        nullList.put(de, null);
        assertThrows(NullPointerException.class, () -> TagLocalization.of(nullList));

        Map<LanguageCode, List<String>> nullSynonym = new HashMap<>();
        List<String> listWithNull = new ArrayList<>();
        listWithNull.add(null);
        nullSynonym.put(de, listWithNull);
        assertThrows(NullPointerException.class, () -> TagLocalization.of(nullSynonym));
    }

    @Test
    void ofWithOnlyEmptyOrBlankSynonymsReturnsEmptyLocalization() {
        LanguageCode de = new LanguageCode("de");

        Map<LanguageCode, List<String>> map = new HashMap<>();
        map.put(de, List.of("   ", "\t"));

        TagLocalization loc = TagLocalization.of(map);

        assertTrue(loc.languages().isEmpty());
        assertTrue(loc.synonyms(de).isEmpty());
    }
}
