package org.schoolsystem.interfaces.rest.mapper;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.interfaces.rest.dto.ResourceSummaryDto;

import java.util.Objects;

/**
 * Mapper für Resource → ResourceSummaryDto.
 *
 * Die konkrete URL wird von einem Service aus Source/RVersion/RLangVersion ermittelt
 * und hier nur noch gesetzt.
 */
public final class ResourceDtoMapper {

    private ResourceDtoMapper() {
        // utility
    }

    public static ResourceSummaryDto toDto(Resource resource, String url) {
        Objects.requireNonNull(resource, "resource must not be null");

        String title = resource.title().orElse("");
        String description = resource.description().orElse("");

        return new ResourceSummaryDto(
                resource.id(),
                title,
                description,
                resource.type().name(),
                resource.isActive(),
                url
        );
    }
}
