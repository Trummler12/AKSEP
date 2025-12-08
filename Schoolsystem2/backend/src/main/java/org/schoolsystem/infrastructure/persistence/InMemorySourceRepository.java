package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.Source;
import org.schoolsystem.domain.ports.SourceRepository;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung von SourceRepository.
 *
 * Erwartet eine Liste von Source-Domainobjekten (z.B. aus t_source.csv + Author-Mapping).
 */
public final class InMemorySourceRepository implements SourceRepository {

    private final Map<Integer, Source> sourcesById;
    private final List<Source> allSources;

    public InMemorySourceRepository(List<Source> sources) {
        Objects.requireNonNull(sources, "sources must not be null");

        this.allSources = Collections.unmodifiableList(new ArrayList<>(sources));
        this.sourcesById = sources.stream()
                .collect(Collectors.toUnmodifiableMap(
                        Source::id,
                        s -> s
                ));
    }

    @Override
    public Optional<Source> findById(int id) {
        return Optional.ofNullable(sourcesById.get(id));
    }

    @Override
    public List<Source> findByIds(Collection<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        List<Source> result = new ArrayList<>();
        for (Integer id : ids) {
            if (id == null) {
                continue;
            }
            Source source = sourcesById.get(id);
            if (source != null) {
                result.add(source);
            }
        }
        return Collections.unmodifiableList(result);
    }

    @Override
    public List<Source> findAll() {
        return allSources;
    }
}
