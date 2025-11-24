package org.schoolsystem.domain.value;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LevelNumberTest {

    @Test
    void acceptsValuesBetween1And9() {
        for (int i = 1; i <= 9; i++) {
            LevelNumber level = new LevelNumber(i);
            assertEquals(i, level.value());
        }
    }

    @Test
    void rejectsValuesBelow1OrAbove9() {
        assertThrows(IllegalArgumentException.class, () -> new LevelNumber(0));
        assertThrows(IllegalArgumentException.class, () -> new LevelNumber(10));
        assertThrows(IllegalArgumentException.class, () -> new LevelNumber(-1));
    }
}
