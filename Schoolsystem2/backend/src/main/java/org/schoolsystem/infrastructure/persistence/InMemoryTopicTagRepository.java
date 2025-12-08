package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.ports.TopicTagRepository;
import org.schoolsystem.domain.value.TopicId;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung des TopicTagRepository.
 *
 * Erwartet die bereits geparste Liste der TopicTag-Verknüpfungen
 * (fachlich: ct_topic_tags).
 */
public final class InMemoryTopicTagRepository implements TopicTagRepository {

    private final List<TopicTag> allLinks;
    private final Map<TopicId, List<TopicTag>> byTopicId;
    private final Map<Integer, List<TopicTag>> byTagId;

    public InMemoryTopicTagRepository(List<TopicTag> topicTags) {
        Objects.requireNonNull(topicTags, "topicTags must not be null");

        this.allLinks = Collections.unmodifiableList(new ArrayList<>(topicTags));

        this.byTopicId = Collections.unmodifiableMap(
                topicTags.stream()
                        .collect(Collectors.groupingBy(
                                TopicTag::topicId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );

        this.byTagId = Collections.unmodifiableMap(
                topicTags.stream()
                        .collect(Collectors.groupingBy(
                                TopicTag::tagId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );
    }

    @Override
    public List<TopicTag> findByTopicId(TopicId topicId) {
        if (topicId == null) {
            return List.of();
        }
        return byTopicId.getOrDefault(topicId, List.of());
    }

    @Override
    public List<TopicTag> findByTagId(int tagId) {
        return byTagId.getOrDefault(tagId, List.of());
    }

    @Override
    public List<TopicTag> findAll() {
        return allLinks;
    }
}
