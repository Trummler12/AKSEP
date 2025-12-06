package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.WebUrl;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

/**
 * Repräsentiert eine Quelle, z.B. YouTube-Video, Studie, Webseite.
 *
 * Entspricht t_source:
 *  - sourceID       (INT, PK)
 *  - source_typeID  (SourceType)
 *  - source_URL     (WebUrl, optional)
 *  - sauthorID      (SourceAuthor, optional)
 *  - source_title   (String, optional)
 *  - description    (String, optional)
 *  - created        (LocalDateTime, optional)
 *  - updated        (LocalDateTime, optional)
 *  - sa_resource    (TINYINT(1)) wird nur im CSV-Mapping ausgewertet,
 *                    ist aber kein Bestandteil des Domänenmodells
 *  - version        (int >= 1)
 */
public final class Source {

    private final int id;
    private final SourceType type;
    private final WebUrl url;                // optional
    private final SourceAuthor author;       // optional
    private final String title;              // optional
    private final String description;        // optional
    private final LocalDateTime created;     // optional
    private final LocalDateTime updated;     // optional
    private final int version;

    private Source(
            int id,
            SourceType type,
            WebUrl url,
            SourceAuthor author,
            String title,
            String description,
            LocalDateTime created,
            LocalDateTime updated,
            int version
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException("Source id must be > 0, but was: " + id);
        }
        this.type = Objects.requireNonNull(type, "type must not be null");

        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.id = id;
        this.url = url;
        this.author = author;
        this.title = title == null ? null : title.trim();
        this.description = description == null ? null : description.trim();
        this.created = created;
        this.updated = updated;
        this.version = version;
    }

    /**
     * Vollständige Fabrikmethode für eine Source.
     */
    public static Source of(
            int id,
            SourceType type,
            WebUrl url,
            SourceAuthor author,
            String title,
            String description,
            LocalDateTime created,
            LocalDateTime updated,
            int version
    ) {
        return new Source(
                id,
                type,
                url,
                author,
                title,
                description,
                created,
                updated,
                version
        );
    }

    /**
     * Minimal-Variante mit nur Pflichtfeldern.
     */
    public static Source minimal(int id, SourceType type, int version) {
        return new Source(
                id,
                type,
                null,
                null,
                null,
                null,
                null,
                null,
                version
        );
    }

    public int id() {
        return id;
    }

    public SourceType type() {
        return type;
    }

    public Optional<WebUrl> url() {
        return Optional.ofNullable(url);
    }

    public Optional<SourceAuthor> author() {
        return Optional.ofNullable(author);
    }

    public Optional<String> title() {
        return Optional.ofNullable(title)
                .filter(s -> !s.isEmpty());
    }

    public Optional<String> description() {
        return Optional.ofNullable(description)
                .filter(s -> !s.isEmpty());
    }

    public Optional<LocalDateTime> created() {
        return Optional.ofNullable(created);
    }

    public Optional<LocalDateTime> updated() {
        return Optional.ofNullable(updated);
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "Source{" +
               "id=" + id +
               ", type=" + type +
               ", url=" + url +
               ", author=" + author +
               ", title='" + title + '\'' +
               ", version=" + version +
               '}';
    }
}
