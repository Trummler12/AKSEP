package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.TopicId;
import org.schoolsystem.domain.value.WebUrl;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TopicTest {

    @Test
    void createsBasicTopicAndAllowsAddingLevelsAndUrls() {
        LanguageCode de = new LanguageCode("de");
        TopicId id = TopicId.of("BIO1");

        LocalizedText name = LocalizedText.of(de, "Biologie");
        TopicType type = TopicType.of(0, LocalizedText.of(de, "Allgemeines Fach"), 1);

        Topic topic = Topic.createBasic(id, name, type, 0, 1);

        assertEquals(id, topic.id());
        assertEquals(0, topic.layer());
        assertEquals(1, topic.version());
        assertTrue(topic.levels().isEmpty());
        assertTrue(topic.urls().isEmpty());
        assertTrue(topic.description().isEmpty());

        TopicLevel level1 = TopicLevel.of(id, org.schoolsystem.domain.value.LevelNumber.of(1), 1);
        Topic topicWithLevel = topic.addLevel(level1);

        assertEquals(1, topicWithLevel.levels().size());
        assertEquals(level1, topicWithLevel.levels().get(0));

        WebUrl url = WebUrl.fromString("https://de.wikipedia.org/wiki/Biologie");
        Topic topicWithUrl = topicWithLevel.addUrl(url);

        assertEquals(1, topicWithUrl.urls().size());
        assertEquals(url, topicWithUrl.urls().get(0));

        // Immutabilität: ursprüngliches Topic bleibt unverändert
        assertTrue(topic.urls().isEmpty());
        assertTrue(topic.levels().isEmpty());
    }

    @Test
    void rejectsNullArgumentsAndInvalidLayerOrVersion() {
        LanguageCode de = new LanguageCode("de");
        TopicId id = TopicId.of("BIO1");
        LocalizedText name = LocalizedText.of(de, "Biologie");
        TopicType type = TopicType.of(0, LocalizedText.of(de, "Allgemeines Fach"), 1);

        assertThrows(NullPointerException.class,
                () -> Topic.of(null, name, type, 0, null, 1, List.of(), List.of()));
        assertThrows(NullPointerException.class,
                () -> Topic.of(id, null, type, 0, null, 1, List.of(), List.of()));
        assertThrows(NullPointerException.class,
                () -> Topic.of(id, name, null, 0, null, 1, List.of(), List.of()));

        assertThrows(IllegalArgumentException.class,
                () -> Topic.of(id, name, type, -1, null, 1, List.of(), List.of()));
        assertThrows(IllegalArgumentException.class,
                () -> Topic.of(id, name, type, 0, null, 0, List.of(), List.of()));
    }
}
