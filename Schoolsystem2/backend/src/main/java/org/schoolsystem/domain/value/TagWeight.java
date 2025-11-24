package org.schoolsystem.domain.value;

/**
 * Repräsentiert die Gewichtung eines Tags im Bereich 1..5.
 */
public record TagWeight(int value) {

    public static final int MIN = 1;
    public static final int MAX = 5;

    public TagWeight {
        if (value < MIN || value > MAX) {
            throw new IllegalArgumentException(
                "TagWeight must be between " + MIN + " and " + MAX + ", but was: " + value
            );
        }
    }

    public static TagWeight of(int value) {
        return new TagWeight(value);
    }

    public int asInt() {
        return value;
    }

    @Override
    public String toString() {
        return Integer.toString(value);
    }
}
