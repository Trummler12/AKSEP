package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.WebUrl;

import java.util.Objects;
import java.util.Optional;

/**
 * Normalisierte Autoren-Informationen für Quellen (z.B. YouTube-Kanal).
 *
 * Entspricht t_source_author:
 *  - sauthorID          (INT, PK)
 *  - sauthor_name       (String, optional in DB, hier nicht null)
 *  - sauthor_URL        (TEXT, optional)
 *  - sauthor_description(TEXT, optional)
 *  - impressum_URL      (TEXT, optional)
 *  - version            (int >= 1)
 */
public final class SourceAuthor {

    private final int id;
    private final String name;
    private final WebUrl authorUrl;       // optional
    private final String description;     // optional
    private final WebUrl impressumUrl;    // optional
    private final int version;

    private SourceAuthor(
            int id,
            String name,
            WebUrl authorUrl,
            String description,
            WebUrl impressumUrl,
            int version
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException("SourceAuthor id must be > 0, but was: " + id);
        }
        Objects.requireNonNull(name, "name must not be null");
        String trimmedName = name.trim();
        if (trimmedName.isEmpty()) {
            throw new IllegalArgumentException("SourceAuthor name must not be empty");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.id = id;
        this.name = trimmedName;
        this.authorUrl = authorUrl;
        this.description = description == null ? null : description.trim();
        this.impressumUrl = impressumUrl;
        this.version = version;
    }

    public static SourceAuthor of(
            int id,
            String name,
            WebUrl authorUrl,
            String description,
            WebUrl impressumUrl,
            int version
    ) {
        return new SourceAuthor(id, name, authorUrl, description, impressumUrl, version);
    }

    public static SourceAuthor ofRequired(int id, String name, int version) {
        return new SourceAuthor(id, name, null, null, null, version);
    }

    public int id() {
        return id;
    }

    public String name() {
        return name;
    }

    public Optional<WebUrl> authorUrl() {
        return Optional.ofNullable(authorUrl);
    }

    public Optional<String> description() {
        return Optional.ofNullable(description).filter(s -> !s.isEmpty());
    }

    public Optional<WebUrl> impressumUrl() {
        return Optional.ofNullable(impressumUrl);
    }

    public int version() {
        return version;
    }
}
