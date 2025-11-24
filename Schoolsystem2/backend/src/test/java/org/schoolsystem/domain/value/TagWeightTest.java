package org.schoolsystem.domain.value;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TagWeightTest {

    @Test
    void acceptsValuesBetweenMinAndMax() {
        for (int i = TagWeight.MIN; i <= TagWeight.MAX; i++) {
            TagWeight weight = TagWeight.of(i);
            assertEquals(i, weight.value());
        }
    }

    @Test
    void rejectsValuesBelowMinOrAboveMax() {
        assertThrows(IllegalArgumentException.class, () -> TagWeight.of(TagWeight.MIN - 1));
        assertThrows(IllegalArgumentException.class, () -> TagWeight.of(TagWeight.MAX + 1));
    }

    @Test
    void toStringReturnsNumericValue() {
        TagWeight weight = TagWeight.of(3);
        assertEquals("3", weight.toString());
    }
}
