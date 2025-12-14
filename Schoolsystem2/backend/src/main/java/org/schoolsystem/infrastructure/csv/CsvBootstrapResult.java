package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.*;

import java.util.List;
import java.util.Objects;

/**
 * Aggregat aller aus CSV geladenen Domain-Objekte.
 *
 * Dient als Übergabeobjekt vom CSV-Layer hin zur
 * eigentlichen Anwendung (z.B. zur Befüllung von Repositories).
 */
public record CsvBootstrapResult(
        // Lookups
        List<SourceType> sourceTypes,
        List<ResourceType> resourceTypes,
        List<TopicType> topicTypes,
        List<InteractionType> interactionTypes,

        // Topics
        List<Tag> tags,
        List<Topic> topics,
        List<TopicLevel> topicLevels,
        List<TopicTag> topicTags,

        // Sources & Resources
        List<ResourceTag> resourceTags,
        List<SourceAuthor> sourceAuthors,
        List<Source> sources,
        List<Resource> resources,
        List<RVersion> resourceVersions,
        List<RLangVersion> languageVersions,
        List<UsesSource> usesSources
) {

    public CsvBootstrapResult {
        Objects.requireNonNull(sourceTypes, "sourceTypes must not be null");
        Objects.requireNonNull(resourceTypes, "resourceTypes must not be null");
        Objects.requireNonNull(topicTypes, "topicTypes must not be null");
        Objects.requireNonNull(tags, "tags must not be null");
        Objects.requireNonNull(topics, "topics must not be null");
        Objects.requireNonNull(topicLevels, "topicLevels must not be null");
        Objects.requireNonNull(topicTags, "topicTags must not be null");
        Objects.requireNonNull(resourceTags, "resourceTags must not be null");
        Objects.requireNonNull(sourceAuthors, "sourceAuthors must not be null");
        Objects.requireNonNull(sources, "sources must not be null");
        Objects.requireNonNull(resources, "resources must not be null");
        Objects.requireNonNull(resourceVersions, "resourceVersions must not be null");
        Objects.requireNonNull(languageVersions, "languageVersions must not be null");
        Objects.requireNonNull(usesSources, "usesSources must not be null");
    }

    public boolean hasAnyTopics() {
        return !topics.isEmpty();
    }

    public boolean hasAnyResources() {
        return !resources.isEmpty();
    }
}
