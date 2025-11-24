package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class InteractionTypeTest {

    @Test
    void fromIdReturnsCorrectEnumConstant() {
        assertEquals(InteractionType.SEEN, InteractionType.fromId(0));
        assertEquals(InteractionType.VIEWED, InteractionType.fromId(1));
        assertEquals(InteractionType.VISITED, InteractionType.fromId(2));
        assertEquals(InteractionType.DOWNLOADED, InteractionType.fromId(3));
        assertEquals(InteractionType.WATCHED, InteractionType.fromId(4));
        assertEquals(InteractionType.PARTLY_SOLVED, InteractionType.fromId(5));
        assertEquals(InteractionType.SOLVED, InteractionType.fromId(6));
    }

    @Test
    void fromIdRejectsUnknownIds() {
        assertThrows(IllegalArgumentException.class, () -> InteractionType.fromId(-1));
        assertThrows(IllegalArgumentException.class, () -> InteractionType.fromId(7));
    }

    @Test
    void labelsAreStable() {
        assertEquals("seen", InteractionType.SEEN.label());
        assertEquals("solved", InteractionType.SOLVED.label());
    }
}
