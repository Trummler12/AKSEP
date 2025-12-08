package org.schoolsystem.domain.model;

import java.util.Objects;

/**
 * Typ einer Ressource, z.B. "Arbeitsblatt", "Video", "Quiz".
 *
 * Entspricht t_resource_type:
 *  - rstypeID     (INT, PK)
 *  - rstype_name  (String)
 *  - version      (int >= 1)
 */
public final class ResourceType {

    private final int id;
    private final String name;
    private final int version;

    private ResourceType(int id, String name, int version) {
        if (id < 0) {
            throw new IllegalArgumentException("ResourceType id must be >= 0, but was: " + id);
        }
        Objects.requireNonNull(name, "name must not be null");
        String trimmed = name.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("ResourceType name must not be empty");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.id = id;
        this.name = trimmed;
        this.version = version;
    }

    public static ResourceType of(int id, String name, int version) {
        return new ResourceType(id, name, version);
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
        return "ResourceType{id=" + id + ", name='" + name + "', version=" + version + "}";
    }
}
