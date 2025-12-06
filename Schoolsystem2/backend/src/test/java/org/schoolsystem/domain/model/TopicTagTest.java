package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.TagWeight;
import org.schoolsystem.domain.value.TopicId;

import static org.junit.jupiter.api.Assertions.*;

class TopicTagTest {

    @Test
    void createsValidTopicTag() {
        TopicId topicId = TopicId.of("BIO1");
        TagWeight weight = TagWeight.of(3);

        TopicTag topicTag = TopicTag.of(topicId, 10, weight, 1);

        assertEquals(topicId, topicTag.topicId());
        assertEquals(10, topicTag.tagId());
        assertEquals(weight, topicTag.weight());
        assertEquals(1, topicTag.version());
    }

    @Test
    void rejectsInvalidArguments() {
        TopicId topicId = TopicId.of("BIO1");
        TagWeight weight = TagWeight.of(2);

        assertThrows(NullPointerException.class,
                () -> TopicTag.of(null, 10, weight, 1));

        assertThrows(IllegalArgumentException.class,
                () -> TopicTag.of(topicId, 0, weight, 1));

        assertThrows(IllegalArgumentException.class,
                () -> TopicTag.of(topicId, -1, weight, 1));

        assertThrows(NullPointerException.class,
                () -> TopicTag.of(topicId, 10, null, 1));

        assertThrows(IllegalArgumentException.class,
                () -> TopicTag.of(topicId, 10, weight, 0));
    }
}
