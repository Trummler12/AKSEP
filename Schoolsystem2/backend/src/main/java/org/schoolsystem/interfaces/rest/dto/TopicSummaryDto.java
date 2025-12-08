package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Kurzansicht eines Topics, z.B. für /topics und Interest-Suche.
 */
public record TopicSummaryDto(
        String id,
        String name,
        String type,
        int layer,
        String shortDescription,
        List<String> tags,
        List<String> links
) {
}
