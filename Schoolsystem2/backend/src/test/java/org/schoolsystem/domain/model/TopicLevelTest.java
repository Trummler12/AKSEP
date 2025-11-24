package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.LevelNumber;
import org.schoolsystem.domain.value.TopicId;

import static org.junit.jupiter.api.Assertions.*;

class TopicLevelTest {

    @Test
    void createsTopicLevelWithAndWithoutDescription() {
        TopicId topicId = TopicId.of("BIO1");
        LevelNumber level = LevelNumber.of(2);
        LanguageCode de = new LanguageCode("de");

        LocalizedText desc = LocalizedText.of(de, "Vertiefung in Biologie");

        TopicLevel withDesc = TopicLevel.of(topicId, level, desc, 1);
        TopicLevel withoutDesc = TopicLevel.of(topicId, level, 1);

        assertEquals(topicId, withDesc.topicId());
        assertEquals(level, withDesc.level());
        assertEquals("Vertiefung in Biologie",
                withDesc.description().orElseThrow().get(de).orElseThrow());

        assertTrue(withoutDesc.description().isEmpty());
    }

    @Test
    void rejectsNullTopicIdOrLevelAndInvalidVersion() {
        TopicId topicId = TopicId.of("BIO1");
        LevelNumber level = LevelNumber.of(1);
        LocalizedText desc = LocalizedText.of(new LanguageCode("de"), "Test");

        assertThrows(NullPointerException.class, () -> TopicLevel.of(null, level, desc, 1));
        assertThrows(NullPointerException.class, () -> TopicLevel.of(topicId, null, desc, 1));
        assertThrows(IllegalArgumentException.class, () -> TopicLevel.of(topicId, level, desc, 0));
    }
}
