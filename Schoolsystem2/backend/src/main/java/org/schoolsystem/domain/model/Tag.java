package org.schoolsystem.domain.model;

import java.util.Objects;

/**
 * Repräsentiert ein Schlagwort (Tag).
 *
 * Entspricht grob t_tag:
 *  - tagID      (INT, PK)
 *  - tag        (Name/Semantik, bei uns in TagLocalization abgebildet)
 *  - version    (int >= 1)
 *
 * Gewichtungen zu Topics oder Nutzer-Profilen werden separat modelliert
 * (z. B. über Zuordnungs-Entities mit TagWeight).
 */
public final class Tag {

    private final int id;
    private final TagLocalization localization;
    private final int version;

    private Tag(int id, TagLocalization localization, int version) {
        if (id <= 0) {
            throw new IllegalArgumentException("Tag id must be > 0, but was: " + id);
        }
        Objects.requireNonNull(localization, "localization must not be null");
        if (localization.languages().isEmpty()) {
            throw new IllegalArgumentException("Tag must have at least one localized synonym");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.id = id;
        this.localization = localization;
        this.version = version;
    }

    public static Tag of(int id, TagLocalization localization, int version) {
        return new Tag(id, localization, version);
    }

    public int id() {
        return id;
    }

    public TagLocalization localization() {
        return localization;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "Tag{id=" + id + ", localization=" + localization + ", version=" + version + "}";
    }
}
