package org.schoolsystem.domain.model;

import java.util.Arrays;

/**
 * Interaktionstyp zwischen User und Ressource.
 *
 * Entspricht t_inter_type:
 *  0 seen
 *  1 viewed
 *  2 visited
 *  3 downloaded
 *  4 watched
 *  5 partly solved
 *  6 solved
 */
public enum InteractionType {

    SEEN(0, "seen"),
    VIEWED(1, "viewed"),
    VISITED(2, "visited"),
    DOWNLOADED(3, "downloaded"),
    WATCHED(4, "watched"),
    PARTLY_SOLVED(5, "partly solved"),
    SOLVED(6, "solved");

    private final int id;
    private final String label;

    InteractionType(int id, String label) {
        this.id = id;
        this.label = label;
    }

    public int id() {
        return id;
    }

    public String label() {
        return label;
    }

    public static InteractionType fromId(int id) {
        return Arrays.stream(values())
                .filter(t -> t.id == id)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown InteractionType id: " + id));
    }
}
