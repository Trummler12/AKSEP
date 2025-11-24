package org.schoolsystem.domain.value;

/**
 * Repräsentiert einen Topic-Level im Bereich 1..9.
 */
public record LevelNumber(int value) {

    public static final int MIN = 1;
    public static final int MAX = 9;

    public LevelNumber {
        if (value < MIN || value > MAX) {
            throw new IllegalArgumentException(
                "LevelNumber must be between " + MIN + " and " + MAX + ", but was: " + value
            );
        }
    }

    public static LevelNumber of(int value) {
        return new LevelNumber(value);
    }

    public int asInt() {
        return value;
    }

    @Override
    public String toString() {
        return Integer.toString(value);
    }
}
