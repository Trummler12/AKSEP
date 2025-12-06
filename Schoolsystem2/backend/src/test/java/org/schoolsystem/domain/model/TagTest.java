package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TagTest {

    @Test
    void createsValidTagAndNormalizesLabels() {
        List<String> inputLabels = List.of(
                " Physics ",   // wird getrimmt
                "physics",     // bleibt als zweites Label erhalten
                "  science  ", // wird getrimmt
                "   "          // wird entfernt
        );

        Tag tag = Tag.of(1, inputLabels, 1);

        assertEquals(1, tag.id());
        assertEquals(1, tag.version());

        // Labels wurden getrimmt und leere Einträge entfernt
        assertEquals(List.of("Physics", "physics", "science"), tag.labels());

        // primaryLabel ist das erste Element
        assertEquals("Physics", tag.primaryLabel());

        // Liste muss unveränderlich sein
        assertThrows(UnsupportedOperationException.class,
                () -> tag.labels().add("new label"));
    }

    @Test
    void rejectsInvalidIdLabelsAndVersion() {
        List<String> labels = List.of("Physics");

        // ungültige IDs
        assertThrows(IllegalArgumentException.class, () -> Tag.of(0, labels, 1));
        assertThrows(IllegalArgumentException.class, () -> Tag.of(-1, labels, 1));

        // null-Liste
        assertThrows(NullPointerException.class, () -> Tag.of(1, null, 1));

        // ungültige Version
        assertThrows(IllegalArgumentException.class, () -> Tag.of(1, labels, 0));

        // leere Liste
        assertThrows(IllegalArgumentException.class, () -> Tag.of(1, List.of(), 1));

        // nur leere/Blank-Labels
        assertThrows(IllegalArgumentException.class,
                () -> Tag.of(1, List.of("   ", "\t"), 1));

        // null-Element in der Liste
        assertThrows(NullPointerException.class,
                () -> Tag.of(1, List.of("Physics", null), 1));
    }
}
