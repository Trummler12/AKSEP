package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.WebUrl;

import static org.junit.jupiter.api.Assertions.*;

class SourceAuthorTest {

    @Test
    void createsAuthorWithOnlyRequiredFields() {
        SourceAuthor author = SourceAuthor.ofRequired(1, " Veritasium ", 1);

        assertEquals(1, author.id());
        assertEquals("Veritasium", author.name());
        assertEquals(1, author.version());
        assertTrue(author.authorUrl().isEmpty());
        assertTrue(author.description().isEmpty());
        assertTrue(author.impressumUrl().isEmpty());
    }

    @Test
    void createsAuthorWithOptionalFields() {
        WebUrl channelUrl = WebUrl.fromString("https://www.youtube.com/@veritasium");
        WebUrl impressum = WebUrl.fromString("https://example.com/impressum");

        SourceAuthor author = SourceAuthor.of(
                2,
                "  Some Channel  ",
                channelUrl,
                "  Science channel  ",
                impressum,
                2
        );

        assertEquals(2, author.id());
        assertEquals("Some Channel", author.name());
        assertEquals("Science channel", author.description().orElseThrow());
        assertEquals(channelUrl, author.authorUrl().orElseThrow());
        assertEquals(impressum, author.impressumUrl().orElseThrow());
        assertEquals(2, author.version());
    }

    @Test
    void rejectsInvalidIdNameAndVersion() {
        assertThrows(IllegalArgumentException.class, () -> SourceAuthor.ofRequired(0, "Name", 1));
        assertThrows(IllegalArgumentException.class, () -> SourceAuthor.ofRequired(-1, "Name", 1));
        assertThrows(NullPointerException.class, () -> SourceAuthor.ofRequired(1, null, 1));
        assertThrows(IllegalArgumentException.class, () -> SourceAuthor.ofRequired(1, "   ", 1));
        assertThrows(IllegalArgumentException.class, () -> SourceAuthor.ofRequired(1, "Name", 0));
    }
}
