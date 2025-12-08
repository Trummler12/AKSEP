package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.UsesSource;
import org.schoolsystem.domain.ports.UsesSourceRepository;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung für die Resource <-> Source Verknüpfungen
 * (fachlich: ct_uses_source).
 */
public final class InMemoryUsesSourceRepository implements UsesSourceRepository {

    private final List<UsesSource> allLinks;
    private final Map<Integer, List<UsesSource>> byResourceId;
    private final Map<Integer, List<UsesSource>> bySourceId;

    public InMemoryUsesSourceRepository(List<UsesSource> usesSources) {
        Objects.requireNonNull(usesSources, "usesSources must not be null");

        this.allLinks = Collections.unmodifiableList(new ArrayList<>(usesSources));

        this.byResourceId = Collections.unmodifiableMap(
                usesSources.stream()
                        .collect(Collectors.groupingBy(
                                UsesSource::resourceId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );

        this.bySourceId = Collections.unmodifiableMap(
                usesSources.stream()
                        .collect(Collectors.groupingBy(
                                UsesSource::sourceId,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        Collections::unmodifiableList
                                )
                        ))
        );
    }

    @Override
    public List<UsesSource> findByResourceId(int resourceId) {
        return byResourceId.getOrDefault(resourceId, List.of());
    }

    @Override
    public List<UsesSource> findBySourceId(int sourceId) {
        return bySourceId.getOrDefault(sourceId, List.of());
    }

    @Override
    public List<UsesSource> findAll() {
        return allLinks;
    }
}
