package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.TagWeight;

import static org.junit.jupiter.api.Assertions.*;

class ResourceTagTest {

    @Test
    void createsValidResourceTag() {
        TagWeight weight = TagWeight.of(4);

        ResourceTag resourceTag = ResourceTag.of(5, 7, weight, 2);

        assertEquals(5, resourceTag.resourceId());
        assertEquals(7, resourceTag.tagId());
        assertEquals(weight, resourceTag.weight());
        assertEquals(2, resourceTag.version());
    }

    @Test
    void rejectsInvalidArguments() {
        TagWeight weight = TagWeight.of(3);

        assertThrows(IllegalArgumentException.class,
                () -> ResourceTag.of(0, 1, weight, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceTag.of(-1, 1, weight, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceTag.of(1, 0, weight, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceTag.of(1, -1, weight, 1));

        assertThrows(NullPointerException.class,
                () -> ResourceTag.of(1, 1, null, 1));

        assertThrows(IllegalArgumentException.class,
                () -> ResourceTag.of(1, 1, weight, 0));
    }
}
