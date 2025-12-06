package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.WebUrl;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class RVersionTest {

    @Test
    void createsVersionWithLanguageVersionsAndNormalizesStrings() {
        LanguageCode en = new LanguageCode("en");
        WebUrl url = WebUrl.fromString("https://example.com/resource");

        WebRLangVersion langVersion = WebRLangVersion.minimal(
                10,
                en,
                5,
                1,
                url
        );

        RVersion rVersion = RVersion.of(
                1,
                "  1.0.0  ",
                "  Initial release  ",
                2,
                List.of(langVersion)
        );

        assertEquals(1, rVersion.id());
        assertEquals("1.0.0", rVersion.versionNumber());
        assertEquals(2, rVersion.version());
        assertEquals("Initial release", rVersion.changelog().orElseThrow());

        assertEquals(1, rVersion.languageVersions().size());
        assertEquals(langVersion, rVersion.languageVersions().get(0));

        // Liste muss unveränderlich sein
        assertThrows(UnsupportedOperationException.class,
                () -> rVersion.languageVersions().add(langVersion));
    }

    @Test
    void createsVersionWithoutLanguages() {
        RVersion rVersion = RVersion.withoutLanguages(2, "v2", 1);

        assertEquals(2, rVersion.id());
        assertEquals("v2", rVersion.versionNumber());
        assertEquals(1, rVersion.version());
        assertTrue(rVersion.languageVersions().isEmpty());
        assertTrue(rVersion.changelog().isEmpty());
    }

    @Test
    void rejectsInvalidIdVersionNumberVersionOrList() {
        LanguageCode en = new LanguageCode("en");
        WebUrl url = WebUrl.fromString("https://example.com");
        WebRLangVersion langVersion = WebRLangVersion.minimal(1, en, 1, 1, url);

        // ungültige IDs
        assertThrows(IllegalArgumentException.class,
                () -> RVersion.of(0, "1.0", null, 1, List.of(langVersion)));
        assertThrows(IllegalArgumentException.class,
                () -> RVersion.of(-1, "1.0", null, 1, List.of(langVersion)));

        // null / leere versionNumber
        assertThrows(NullPointerException.class,
                () -> RVersion.of(1, null, null, 1, List.of(langVersion)));
        assertThrows(IllegalArgumentException.class,
                () -> RVersion.of(1, "   ", null, 1, List.of(langVersion)));

        // ungültige technische Version
        assertThrows(IllegalArgumentException.class,
                () -> RVersion.of(1, "1.0", null, 0, List.of(langVersion)));

        // null-Liste
        assertThrows(NullPointerException.class,
                () -> RVersion.of(1, "1.0", null, 1, null));

        // Liste mit null-Element
        assertThrows(NullPointerException.class,
                () -> RVersion.of(1, "1.0", null, 1, List.of(langVersion, null)));
    }
}
