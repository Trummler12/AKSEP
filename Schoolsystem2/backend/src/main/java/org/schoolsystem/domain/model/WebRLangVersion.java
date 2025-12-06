package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.WebUrl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Sprachversion einer Ressource, deren Inhalt über eine Web-URL verfügbar ist.
 */
public final class WebRLangVersion extends RLangVersion {

    private final WebUrl url;

    private WebRLangVersion(
            int id,
            LanguageCode language,
            int authorId,
            LocalDateTime publicationDate,
            String translatorInfo,
            BigDecimal ownShare,
            Integer restBelongsToAuthorId,
            int version,
            WebUrl url
    ) {
        super(id, language, authorId, publicationDate, translatorInfo, ownShare, restBelongsToAuthorId, version);
        this.url = Objects.requireNonNull(url, "url must not be null");
    }

    /**
     * Vollständige Fabrikmethode für eine Web-Sprachversion.
     */
    public static WebRLangVersion of(
            int id,
            LanguageCode language,
            int authorId,
            LocalDateTime publicationDate,
            String translatorInfo,
            BigDecimal ownShare,
            Integer restBelongsToAuthorId,
            int version,
            WebUrl url
    ) {
        return new WebRLangVersion(
                id,
                language,
                authorId,
                publicationDate,
                translatorInfo,
                ownShare,
                restBelongsToAuthorId,
                version,
                url
        );
    }

    /**
     * Minimal-Variante mit den Pflichtfeldern plus URL.
     */
    public static WebRLangVersion minimal(
            int id,
            LanguageCode language,
            int authorId,
            int version,
            WebUrl url
    ) {
        return new WebRLangVersion(
                id,
                language,
                authorId,
                null,
                null,
                null,
                null,
                version,
                url
        );
    }

    @Override
    public Kind kind() {
        return Kind.WEB;
    }

    public WebUrl url() {
        return url;
    }
}
