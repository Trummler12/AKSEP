package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;

import static org.junit.jupiter.api.Assertions.*;

class TopicTypeTest {

    @Test
    void createsValidTopicTypeWithAndWithoutDefinition() {
        LanguageCode de = new LanguageCode("de");

        LocalizedText name = LocalizedText.of(de, "Allgemeines Fach");
        LocalizedText def  = LocalizedText.of(de, "Pflichtfach bis Jahrgang 9");

        TopicType withDef = TopicType.of(0, name, def, 1);
        TopicType withoutDef = TopicType.of(1, LocalizedText.of(de, "Spezialisierung"), 1);

        assertEquals(0, withDef.id());
        assertEquals(1, withoutDef.id());

        assertEquals("Allgemeines Fach", withDef.displayName(de).orElseThrow());
        assertTrue(withDef.definition().isPresent());
        assertEquals("Pflichtfach bis Jahrgang 9",
                withDef.definition().orElseThrow().get(de).orElseThrow());

        assertTrue(withoutDef.definition().isEmpty());
    }

    @Test
    void rejectsInvalidIdAndVersion() {
        LanguageCode de = new LanguageCode("de");
        LocalizedText name = LocalizedText.of(de, "Test");

        assertThrows(IllegalArgumentException.class, () -> TopicType.of(-1, name, 1));
        assertThrows(IllegalArgumentException.class, () -> TopicType.of(128, name, 1));
        assertThrows(IllegalArgumentException.class, () -> TopicType.of(0, name, 0));
    }

    @Test
    void rejectsNullName() {
        assertThrows(NullPointerException.class, () -> TopicType.of(0, null, 1));
    }
}
