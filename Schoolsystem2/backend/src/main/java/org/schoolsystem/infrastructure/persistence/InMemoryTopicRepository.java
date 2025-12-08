package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.ports.TopicRepository;
import org.schoolsystem.domain.value.TopicId;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Einfache In-Memory-Implementierung des TopicRepository-Ports.
 *
 * Erwartet eine bereits vollständig geladene Topic-Liste (z.B. aus CSV-Bootstrap).
 */
public final class InMemoryTopicRepository implements TopicRepository {

    private final Map<TopicId, Topic> topicsById;
    private final List<Topic> allTopics;

    public InMemoryTopicRepository(List<Topic> topics) {
        Objects.requireNonNull(topics, "topics must not be null");

        // defensive copy + unmodifiable view
        this.allTopics = Collections.unmodifiableList(new ArrayList<>(topics));
        this.topicsById = topics.stream()
                .collect(Collectors.toUnmodifiableMap(
                        Topic::id,
                        t -> t
                ));
    }

    @Override
    public List<Topic> findAll() {
        return allTopics;
    }

    @Override
    public Optional<Topic> findById(TopicId id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(topicsById.get(id));
    }
}
