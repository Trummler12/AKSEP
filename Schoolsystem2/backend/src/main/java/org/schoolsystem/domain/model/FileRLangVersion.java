package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Sprachversion einer Ressource, deren Inhalt als Datei vorliegt.
 *
 * Aktuell wird nur ein Dateiname (oder Pfad) gespeichert.
 * Ein echtes Blob-Handling kann später ergänzt werden.
 */
public final class FileRLangVersion extends RLangVersion {

    private final String fileName;  // Later: could be a path or blob reference

    private FileRLangVersion(
            int id,
            LanguageCode language,
            int authorId,
            LocalDateTime publicationDate,
            String translatorInfo,
            BigDecimal ownShare,
            Integer restBelongsToAuthorId,
            int version,
            String fileName
    ) {
        super(id, language, authorId, publicationDate, translatorInfo, ownShare, restBelongsToAuthorId, version);
        Objects.requireNonNull(fileName, "fileName must not be null");
        String trimmed = fileName.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("fileName must not be empty");
        }
        this.fileName = trimmed;
    }

    /**
     * Vollständige Fabrikmethode für eine File-Sprachversion.
     */
    public static FileRLangVersion of(
            int id,
            LanguageCode language,
            int authorId,
            LocalDateTime publicationDate,
            String translatorInfo,
            BigDecimal ownShare,
            Integer restBelongsToAuthorId,
            int version,
            String fileName
    ) {
        return new FileRLangVersion(
                id,
                language,
                authorId,
                publicationDate,
                translatorInfo,
                ownShare,
                restBelongsToAuthorId,
                version,
                fileName
        );
    }

    /**
     * Minimal-Variante mit Pflichtfeldern plus Dateiname.
     */
    public static FileRLangVersion minimal(
            int id,
            LanguageCode language,
            int authorId,
            int version,
            String fileName
    ) {
        return new FileRLangVersion(
                id,
                language,
                authorId,
                null,
                null,
                null,
                null,
                version,
                fileName
        );
    }

    @Override
    public Kind kind() {
        return Kind.FILE;
    }

    public String fileName() {
        return fileName;
    }
}
