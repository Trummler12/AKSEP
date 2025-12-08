package org.schoolsystem.interfaces.rest.dto;

/**
 * Zusammengefasste Darstellung einer Ressource, wie sie in Topic-Details
 * oder Resource-Details dargestellt wird.
 */
public record ResourceSummaryDto(
        int id,
        String title,
        String description,
        String type,
        boolean isActive,
        String url
) {
}
