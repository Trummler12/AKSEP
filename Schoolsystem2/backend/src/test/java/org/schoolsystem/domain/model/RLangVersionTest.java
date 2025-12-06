package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.WebUrl;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class RLangVersionTest {

    @Test
    void createsMinimalWebAndFileLanguageVersions() {
        LanguageCode en = new LanguageCode("en");
        WebUrl url = WebUrl.fromString("https://example.com/resource");

        WebRLangVersion web = WebRLangVersion.minimal(
                1,
                en,
                100,
                1,
                url
        );

        assertEquals(1, web.id());
        assertEquals(en, web.language());
        assertEquals(100, web.authorId());
        assertEquals(RLangVersion.Kind.WEB, web.kind());
        assertEquals(url, web.url());
        assertTrue(web.publicationDate().isEmpty());
        assertTrue(web.translatorInfo().isEmpty());
        assertTrue(web.ownShare().isEmpty());
        assertTrue(web.restBelongsToAuthorId().isEmpty());
        assertEquals(1, web.version());

        FileRLangVersion file = FileRLangVersion.minimal(
                2,
                en,
                200,
                2,
                "  material.pdf  "
        );

        assertEquals(2, file.id());
        assertEquals(en, file.language());
        assertEquals(200, file.authorId());
        assertEquals(RLangVersion.Kind.FILE, file.kind());
        assertEquals("material.pdf", file.fileName());
        assertEquals(2, file.version());
    }

    @Test
    void normalizesAndValidatesOptionalFields() {
        LanguageCode de = new LanguageCode("de");
        WebUrl url = WebUrl.fromString("https://example.com/de");

        BigDecimal share = new BigDecimal("33.333");

        LocalDateTime pubDate = LocalDateTime.of(2024, 1, 1, 12, 0);

        WebRLangVersion web = WebRLangVersion.of(
                10,
                de,
                5,
                pubDate,
                "  translated from EN  ",
                share,
                7,
                3,
                url
        );

        assertEquals(pubDate, web.publicationDate().orElseThrow());
        assertEquals("translated from EN", web.translatorInfo().orElseThrow());

        BigDecimal normalized = web.ownShare().orElseThrow();
        assertEquals(new BigDecimal("33.33"), normalized);
        assertEquals(7, web.restBelongsToAuthorId().orElseThrow());
        assertEquals(3, web.version());
    }

    @Test
    void rejectsInvalidCoreFields() {
        LanguageCode en = new LanguageCode("en");
        WebUrl url = WebUrl.fromString("https://example.com");

        // id <= 0
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.minimal(0, en, 1, 1, url));

        // authorId <= 0
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.minimal(1, en, 0, 1, url));

        // version < 1
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.minimal(1, en, 1, 0, url));

        // null language
        assertThrows(NullPointerException.class,
                () -> WebRLangVersion.minimal(1, null, 1, 1, url));
    }

    @Test
    void rejectsInvalidSharesAndRestBelongsTo() {
        LanguageCode en = new LanguageCode("en");
        WebUrl url = WebUrl.fromString("https://example.com");

        BigDecimal negativeShare = new BigDecimal("-1.00");
        BigDecimal tooHighShare = new BigDecimal("100.01");

        // ownShare < 0
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.of(
                        1, en, 1, null, null, negativeShare, null, 1, url
                ));

        // ownShare > 100
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.of(
                        1, en, 1, null, null, tooHighShare, null, 1, url
                ));

        // restBelongsToAuthorId <= 0
        assertThrows(IllegalArgumentException.class,
                () -> WebRLangVersion.of(
                        1, en, 1, null, null, null, 0, 1, url
                ));
    }

    @Test
    void fileVersionRejectsEmptyFileName() {
        LanguageCode en = new LanguageCode("en");

        assertThrows(IllegalArgumentException.class,
                () -> FileRLangVersion.minimal(1, en, 1, 1, "   "));
    }
}
