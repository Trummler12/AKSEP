package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.TopicId;

import static org.junit.jupiter.api.Assertions.*;

class ResourceToTopicTest {

    @Test
    void createsValidResourceToTopic() {
        TopicId topicId = TopicId.of("MAT0");

        ResourceToTopic rtt = ResourceToTopic.of(100, topicId, 1);

        assertEquals(100, rtt.resourceId());
        assertEquals(topicId, rtt.topicId());
        assertEquals(1, rtt.version());
    }

    @Test
    void rejectsInvalidArguments() {
        TopicId topicId = TopicId.of("MAT0");

        assertThrows(IllegalArgumentException.class,
                () -> ResourceToTopic.of(0, topicId, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceToTopic.of(-1, topicId, 1));

        assertThrows(NullPointerException.class,
                () -> ResourceToTopic.of(1, null, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceToTopic.of(1, topicId, 0));
    }
}
