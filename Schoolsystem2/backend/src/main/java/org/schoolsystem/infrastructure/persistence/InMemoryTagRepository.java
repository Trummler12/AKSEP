package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.ports.TagRepository;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung für TagRepository.
 *
 * Achtung: Diese Implementierung bildet nur die aktuell im Port definierten
 * Methoden ab (findAll, findById). Eine spätere Erweiterung des Ports
 * (z.B. um Name-Fragment-Suche) würde hier ergänzt werden.
 */
public final class InMemoryTagRepository implements TagRepository {

    private final Map<Integer, Tag> tagsById;
    private final List<Tag> allTags;

    public InMemoryTagRepository(List<Tag> tags) {
        Objects.requireNonNull(tags, "tags must not be null");

        this.allTags = Collections.unmodifiableList(new ArrayList<>(tags));
        this.tagsById = tags.stream()
                .collect(Collectors.toUnmodifiableMap(
                        Tag::id,
                        t -> t
                ));
    }

    @Override
    public List<Tag> findAll() {
        return allTags;
    }

    @Override
    public Optional<Tag> findById(int id) {
        return Optional.ofNullable(tagsById.get(id));
    }
}
