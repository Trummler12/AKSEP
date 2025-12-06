package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.TagWeight;

import java.util.Objects;

/**
 * Verknüpfung zwischen Resource und Tag mit Gewichtung.
 *
 * Fachlich analog zu TopicTag, aber für Ressourcen:
 *  - resourceId (int > 0)
 *  - tagId      (int > 0)
 *  - weight     (TagWeight 1..5)
 *  - version    (int >= 1)
 */
public final class ResourceTag {

    private final int resourceId;
    private final int tagId;
    private final TagWeight weight;
    private final int version;

    private ResourceTag(int resourceId, int tagId, TagWeight weight, int version) {
        if (resourceId <= 0) {
            throw new IllegalArgumentException("resourceId must be > 0, but was: " + resourceId);
        }
        if (tagId <= 0) {
            throw new IllegalArgumentException("tagId must be > 0, but was: " + tagId);
        }
        this.weight = Objects.requireNonNull(weight, "weight must not be null");

        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.resourceId = resourceId;
        this.tagId = tagId;
        this.version = version;
    }

    public static ResourceTag of(int resourceId, int tagId, TagWeight weight, int version) {
        return new ResourceTag(resourceId, tagId, weight, version);
    }

    public int resourceId() {
        return resourceId;
    }

    public int tagId() {
        return tagId;
    }

    public TagWeight weight() {
        return weight;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "ResourceTag{" +
               "resourceId=" + resourceId +
               ", tagId=" + tagId +
               ", weight=" + weight +
               ", version=" + version +
               '}';
    }
}
