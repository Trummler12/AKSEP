package org.schoolsystem.domain.model;

import java.util.Objects;

/**
 * Typ einer Quelle, z.B. "YouTube-Video", "Webseite", "Studie".
 *
 * Entspricht t_source_type:
 *  - stypeID     (INT, PK)
 *  - stype_name  (String)
 *  - version     (int >= 1)
 */
public final class SourceType {

    private final int id;
    private final String name;
    private final int version;

    private SourceType(int id, String name, int version) {
        if (id <= 0) {
            throw new IllegalArgumentException("SourceType id must be > 0, but was: " + id);
        }
        Objects.requireNonNull(name, "name must not be null");
        String trimmed = name.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("SourceType name must not be empty");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.id = id;
        this.name = trimmed;
        this.version = version;
    }

    public static SourceType of(int id, String name, int version) {
        return new SourceType(id, name, version);
    }

    public int id() {
        return id;
    }

    public String name() {
        return name;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "SourceType{id=" + id + ", name='" + name + "', version=" + version + "}";
    }
}
