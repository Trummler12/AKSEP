package org.schoolsystem.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Logische Ressource, der eine oder mehrere Versionen zugeordnet sind.
 *
 * Entspricht t_resource:
 *  - resourceID    -> id
 *  - title         -> title (optional)
 *  - description   -> description (optional)
 *  - resource_type -> type
 *  - is_active     -> active
 *  - version       -> version (technische Version, >= 1)
 *
 * Zusätzlich:
 *  - versions      -> Liste aller RVersion-Einträge zu dieser Ressource.
 */
public final class Resource {

    private final int id;
    private final ResourceType type;
    private final String title;         // optional, getrimmt
    private final String description;   // optional, getrimmt
    private final boolean active;
    private final int version;
    private final List<RVersion> versions;

    private Resource(
            int id,
            ResourceType type,
            String title,
            String description,
            boolean active,
            int version,
            List<RVersion> versions
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException("Resource id must be > 0, but was: " + id);
        }
        this.type = Objects.requireNonNull(type, "type must not be null");
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        Objects.requireNonNull(versions, "versions must not be null");
        List<RVersion> copy = new ArrayList<>(versions.size());
        for (RVersion v : versions) {
            copy.add(Objects.requireNonNull(v, "versions must not contain null elements"));
        }

        this.id = id;
        this.title = title == null ? null : title.trim();
        this.description = description == null ? null : description.trim();
        this.active = active;
        this.version = version;
        this.versions = List.copyOf(copy);
    }

    /**
     * Vollständige Fabrikmethode.
     */
    public static Resource of(
            int id,
            ResourceType type,
            String title,
            String description,
            boolean active,
            int version,
            List<RVersion> versions
    ) {
        return new Resource(id, type, title, description, active, version, versions);
    }

    /**
     * Minimal-Variante mit Pflichtfeldern.
     * Titel/Beschreibung können direkt mitgegeben werden, Versionen sind initial leer.
     */
    public static Resource minimal(
            int id,
            ResourceType type,
            String title,
            String description,
            int version
    ) {
        return new Resource(id, type, title, description, true, version, List.of());
    }

    public int id() {
        return id;
    }

    public ResourceType type() {
        return type;
    }

    public Optional<String> title() {
        return Optional.ofNullable(title)
                .filter(s -> !s.isEmpty());
    }

    public Optional<String> description() {
        return Optional.ofNullable(description)
                .filter(s -> !s.isEmpty());
    }

    public boolean isActive() {
        return active;
    }

    public int version() {
        return version;
    }

    /**
     * Unveränderliche Liste aller Versionen dieser Ressource.
     */
    public List<RVersion> versions() {
        return versions;
    }

    @Override
    public String toString() {
        return "Resource{" +
               "id=" + id +
               ", type=" + type +
               ", title='" + title + '\'' +
               ", active=" + active +
               ", version=" + version +
               ", versions=" + versions.size() +
               '}';
    }
}
