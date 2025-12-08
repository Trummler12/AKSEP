package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.ResourceToTopic;
import org.schoolsystem.domain.ports.ResourceToTopicRepository;
import org.schoolsystem.domain.value.TopicId;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung des ResourceToTopicRepository.
 *
 * Fachlich: explizite Zuordnung "Ressource gehört zu Topic X".
 */
public final class InMemoryResourceToTopicRepository implements ResourceToTopicRepository {

    private final List<ResourceToTopic> allLinks;
    private final Map<TopicId, List<ResourceToTopic>> byTopicId;
    private final Map<Integer, List<ResourceToTopic>> byResourceId;

    public InMemoryResourceToTopicRepository(List<ResourceToTopic> links) {
        Objects.requireNonNull(links, "links must not be null");

        this.allLinks = Collections.unmodifiableList(new ArrayList<>(links));

        this.byTopicId = Collections.unmodifiableMap(
                links.stream()
                        .collect(Collectors.groupingBy(
                                ResourceToTopic::topicId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );

        this.byResourceId = Collections.unmodifiableMap(
                links.stream()
                        .collect(Collectors.groupingBy(
                                ResourceToTopic::resourceId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );
    }

    @Override
    public List<ResourceToTopic> findByTopicId(TopicId topicId) {
        if (topicId == null) {
            return List.of();
        }
        return byTopicId.getOrDefault(topicId, List.of());
    }

    @Override
    public List<ResourceToTopic> findByResourceId(int resourceId) {
        return byResourceId.getOrDefault(resourceId, List.of());
    }

    @Override
    public List<ResourceToTopic> findAll() {
        return allLinks;
    }
}
