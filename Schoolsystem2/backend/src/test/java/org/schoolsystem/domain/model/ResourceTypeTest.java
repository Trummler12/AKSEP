package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResourceTypeTest {

    @Test
    void createsValidResourceType() {
        ResourceType type = ResourceType.of(1, "  Video  ", 1);

        assertEquals(1, type.id());
        assertEquals("Video", type.name());
        assertEquals(1, type.version());
    }

    @Test
    void rejectsInvalidIdNameAndVersion() {
        assertThrows(IllegalArgumentException.class, () -> ResourceType.of(0, "Name", 1));
        assertThrows(IllegalArgumentException.class, () -> ResourceType.of(-1, "Name", 1));
        assertThrows(NullPointerException.class, () -> ResourceType.of(1, null, 1));
        assertThrows(IllegalArgumentException.class, () -> ResourceType.of(1, "   ", 1));
        assertThrows(IllegalArgumentException.class, () -> ResourceType.of(1, "Name", 0));
    }
}
