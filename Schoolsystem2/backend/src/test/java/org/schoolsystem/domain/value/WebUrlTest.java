package org.schoolsystem.domain.value;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class WebUrlTest {

    @Test
    void acceptsValidHttpAndHttpsUrls() {
        assertDoesNotThrow(() -> WebUrl.fromString("http://example.com"));
        assertDoesNotThrow(() -> WebUrl.fromString("https://example.com/path?query=1"));

        WebUrl url = WebUrl.fromString("https://example.org/resource");
        assertEquals("https://example.org/resource", url.asString());
    }

    @Test
    void rejectsNullOrEmptyStrings() {
        assertThrows(NullPointerException.class, () -> WebUrl.fromString(null));
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> WebUrl.fromString("   ")
        );
        assertTrue(ex.getMessage().toLowerCase().contains("empty"));
    }

    @Test
    void rejectsNonHttpSchemes() {
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("ftp://example.com"));
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("mailto:info@example.com"));
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("file:///tmp/test.txt"));
    }

    @Test
    void rejectsUrlsWithoutHost() {
        // Kein Host: nur Pfad
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("https:///only/path"));
        // Oder seltsame Dinge wie das hier
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("https://"));
    }

    @Test
    void rejectsUrlsWithInvalidSyntax() {
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("ht!tp://exa mple.com"));
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("://example.com"));
        assertThrows(IllegalArgumentException.class, () -> WebUrl.fromString("not a url"));
    }
}
