package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UsesSourceTest {

    @Test
    void createsUsageWithAndWithoutDate() {
        LocalDateTime now = LocalDateTime.of(2024, 1, 1, 12, 0);

        UsesSource withDate = UsesSource.of(10, 20, now, 1);
        assertEquals(10, withDate.resourceId());
        assertEquals(20, withDate.sourceId());
        assertEquals(now, withDate.usageDate().orElseThrow());
        assertEquals(1, withDate.version());

        UsesSource withoutDate = UsesSource.withoutUsageDate(11, 21, 2);
        assertEquals(11, withoutDate.resourceId());
        assertEquals(21, withoutDate.sourceId());
        assertTrue(withoutDate.usageDate().isEmpty());
        assertEquals(2, withoutDate.version());
    }

    @Test
    void rejectsInvalidArguments() {
        LocalDateTime now = LocalDateTime.of(2024, 1, 1, 12, 0);

        assertThrows(IllegalArgumentException.class,
                () -> UsesSource.of(0, 1, now, 1));

        assertThrows(IllegalArgumentException.class,
                () -> UsesSource.of(-1, 1, now, 1));

        assertThrows(IllegalArgumentException.class,
                () -> UsesSource.of(1, 0, now, 1));

        assertThrows(IllegalArgumentException.class,
                () -> UsesSource.of(1, -1, now, 1));

        assertThrows(IllegalArgumentException.class,
                () -> UsesSource.of(1, 1, now, 0));
    }
}
