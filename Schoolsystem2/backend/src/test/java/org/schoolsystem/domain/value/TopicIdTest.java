package org.schoolsystem.domain.value;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TopicIdTest {

    @Test
    void acceptsValidGeneralSubjectAndSpecializationPatterns() {
        TopicId id1 = TopicId.of("ABC0");  // General Subject / Spezialisierung
        TopicId id2 = TopicId.of("MTH9");

        assertEquals("ABC0", id1.value());
        assertEquals("MTH9", id2.value());
    }

    @Test
    void acceptsValidCoursePatterns() {
        TopicId id1 = TopicId.of("Bio1");  // Course
        TopicId id2 = TopicId.of("Mat0");

        assertEquals("Bio1", id1.value());
        assertEquals("Mat0", id2.value());
    }

    @Test
    void acceptsValidAchievementPattern() {
        TopicId id = TopicId.of("math");   // Achievement
        assertEquals("math", id.value());
    }

    @Test
    void rejectsEmptyOrBlankIds() {
        assertThrows(IllegalArgumentException.class, () -> TopicId.of(""));
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("   "));
    }

    @Test
    void rejectsIdsWithWrongLength() {
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("AB1"));    // zu kurz
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("ABCDE"));  // zu lang
    }

    @Test
    void rejectsIdsWithInvalidCharactersOrPatterns() {
        // falsche Groß-/Kleinschreibung oder Zeichen
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("abC1"));
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("AB_1"));
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("1234"));
        assertThrows(IllegalArgumentException.class, () -> TopicId.of("ABCx"));
    }
}
