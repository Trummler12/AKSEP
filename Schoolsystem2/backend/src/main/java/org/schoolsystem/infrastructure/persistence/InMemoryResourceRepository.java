package org.schoolsystem.infrastructure.persistence;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.ports.ResourceRepository;

import java.util.*;
import java.util.stream.Collectors;

/**
 * In-Memory-Implementierung des ResourceRepository.
 *
 * Erwartet bereits zusammengesetzte Resource-Domainobjekte
 * (inkl. Version / Sprachversion laut Domainmodell).
 */
public final class InMemoryResourceRepository implements ResourceRepository {

    private final Map<Integer, Resource> resourcesById;
    private final List<Resource> allResources;

    public InMemoryResourceRepository(List<Resource> resources) {
        Objects.requireNonNull(resources, "resources must not be null");

        this.allResources = Collections.unmodifiableList(new ArrayList<>(resources));
        this.resourcesById = resources.stream()
                .collect(Collectors.toUnmodifiableMap(
                        Resource::id,
                        r -> r
                ));
    }

    @Override
    public Optional<Resource> findById(int id) {
        return Optional.ofNullable(resourcesById.get(id));
    }

    @Override
    public List<Resource> findAll() {
        return allResources;
    }
}
