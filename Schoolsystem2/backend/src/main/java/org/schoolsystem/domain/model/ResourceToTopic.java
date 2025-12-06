package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.TopicId;

import java.util.Objects;

/**
 * Verknüpfung zwischen Ressource und Topic.
 *
 * Für den aktuellen Projekt-Scope ohne Level/Sublevel:
 *  - resourceId -> Resource.id() (int > 0)
 *  - topicId    -> TopicId
 *  - version    -> technische Version (int >= 1)
 */
public final class ResourceToTopic {

    private final int resourceId;
    private final TopicId topicId;
    private final int version;

    private ResourceToTopic(int resourceId, TopicId topicId, int version) {
        if (resourceId <= 0) {
            throw new IllegalArgumentException("resourceId must be > 0, but was: " + resourceId);
        }
        this.topicId = Objects.requireNonNull(topicId, "topicId must not be null");
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.resourceId = resourceId;
        this.version = version;
    }

    public static ResourceToTopic of(int resourceId, TopicId topicId, int version) {
        return new ResourceToTopic(resourceId, topicId, version);
    }

    public int resourceId() {
        return resourceId;
    }

    public TopicId topicId() {
        return topicId;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "ResourceToTopic{" +
               "resourceId=" + resourceId +
               ", topicId=" + topicId +
               ", version=" + version +
               '}';
    }
}
