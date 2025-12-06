package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.WebUrl;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SourceTest {

    @Test
    void createsFullSourceAndNormalizesStrings() {
        SourceType type = SourceType.of(1, "YouTube Video", 1);
        SourceAuthor author = SourceAuthor.ofRequired(10, "Veritasium", 1);
        WebUrl url = WebUrl.fromString(" https://www.youtube.com/watch?v=dQw4w9WgXcQ ");
        LocalDateTime created = LocalDateTime.of(2024, 1, 1, 12, 0);
        LocalDateTime updated = LocalDateTime.of(2024, 1, 2, 13, 30);

        Source source = Source.of(
                42,
                type,
                url,
                author,
                "  Quantum Mechanics Basics  ",
                "  Nice intro video  ",
                created,
                updated,
                3
        );

        assertEquals(42, source.id());
        assertEquals(type, source.type());
        assertEquals(url, source.url().orElseThrow());
        assertEquals(author, source.author().orElseThrow());

        // Strings werden getrimmt
        assertEquals("Quantum Mechanics Basics", source.title().orElseThrow());
        assertEquals("Nice intro video", source.description().orElseThrow());

        assertEquals(created, source.created().orElseThrow());
        assertEquals(updated, source.updated().orElseThrow());
        assertEquals(3, source.version());
    }

    @Test
    void minimalCreatesSourceWithOnlyRequiredFields() {
        SourceType type = SourceType.of(1, "Webseite", 1);

        Source source = Source.minimal(1, type, 1);

        assertEquals(1, source.id());
        assertEquals(type, source.type());
        assertEquals(1, source.version());

        assertTrue(source.url().isEmpty());
        assertTrue(source.author().isEmpty());
        assertTrue(source.title().isEmpty());
        assertTrue(source.description().isEmpty());
        assertTrue(source.created().isEmpty());
        assertTrue(source.updated().isEmpty());
    }

    @Test
    void rejectsInvalidIdVersionOrNullType() {
        SourceType type = SourceType.of(1, "Webseite", 1);

        assertThrows(IllegalArgumentException.class,
                () -> Source.minimal(0, type, 1));

        assertThrows(IllegalArgumentException.class,
                () -> Source.minimal(-1, type, 1));

        assertThrows(IllegalArgumentException.class,
                () -> Source.minimal(1, type, 0));

        assertThrows(NullPointerException.class,
                () -> Source.minimal(1, null, 1));
    }
}
