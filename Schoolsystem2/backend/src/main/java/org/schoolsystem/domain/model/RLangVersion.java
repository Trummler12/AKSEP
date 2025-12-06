package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

/**
 * Basis-Klasse für eine Sprachversion einer Ressource.
 *
 * Entspricht grob t_lang_version:
 *  - languageVersionID   (id)
 *  - versionID           (wird über RVersion abgebildet, nicht hier)
 *  - authorID            (authorId)
 *  - languageID          (language)
 *  - publication_date    (publicationDate)
 *  - translator_info     (translatorInfo)
 *  - own_share           (ownShare, 0..100, optional)
 *  - rest_belongs_to     (restBelongsToAuthorId, optional)
 *  - version             (version >= 1)
 *
 * Konkrete Unterklassen (z. B. WebRLangVersion, FileRLangVersion)
 * fügen medien-spezifische Felder hinzu.
 */
public abstract class RLangVersion {

    public enum Kind {
        WEB,
        FILE
    }

    private final int id;
    private final LanguageCode language;
    private final int authorId;
    private final LocalDateTime publicationDate;    // optional
    private final String translatorInfo;            // optional, getrimmt
    private final BigDecimal ownShare;             // optional, 0..100
    private final Integer restBelongsToAuthorId;   // optional
    private final int version;

    protected RLangVersion(
            int id,
            LanguageCode language,
            int authorId,
            LocalDateTime publicationDate,
            String translatorInfo,
            BigDecimal ownShare,
            Integer restBelongsToAuthorId,
            int version
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException("languageVersion id must be > 0, but was: " + id);
        }
        this.language = Objects.requireNonNull(language, "language must not be null");

        if (authorId <= 0) {
            throw new IllegalArgumentException("authorId must be > 0, but was: " + authorId);
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        BigDecimal normalizedShare = null;
        if (ownShare != null) {
            if (ownShare.signum() < 0 || ownShare.compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new IllegalArgumentException(
                        "ownShare must be between 0 and 100, but was: " + ownShare
                );
            }
            normalizedShare = ownShare.setScale(2, RoundingMode.HALF_UP);
        }

        if (restBelongsToAuthorId != null && restBelongsToAuthorId <= 0) {
            throw new IllegalArgumentException(
                    "restBelongsToAuthorId must be > 0 if present, but was: " + restBelongsToAuthorId
            );
        }

        this.id = id;
        this.authorId = authorId;
        this.publicationDate = publicationDate;
        this.translatorInfo = translatorInfo == null ? null : translatorInfo.trim();
        this.ownShare = normalizedShare;
        this.restBelongsToAuthorId = restBelongsToAuthorId;
        this.version = version;
    }

    // ---- abstrakte Typ-Information ----

    public abstract Kind kind();

    // ---- Getter mit Optional, wo sinnvoll ----

    public int id() {
        return id;
    }

    public LanguageCode language() {
        return language;
    }

    public int authorId() {
        return authorId;
    }

    public Optional<LocalDateTime> publicationDate() {
        return Optional.ofNullable(publicationDate);
    }

    public Optional<String> translatorInfo() {
        return Optional.ofNullable(translatorInfo)
                .filter(s -> !s.isEmpty());
    }

    public Optional<BigDecimal> ownShare() {
        return Optional.ofNullable(ownShare);
    }

    public Optional<Integer> restBelongsToAuthorId() {
        return Optional.ofNullable(restBelongsToAuthorId);
    }

    public int version() {
        return version;
    }
}
