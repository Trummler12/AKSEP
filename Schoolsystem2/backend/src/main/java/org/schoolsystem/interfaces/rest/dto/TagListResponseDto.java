package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Wrapper für Tag-Listen-Responses (z.B. GET /api/v1/tags).
 */
public record TagListResponseDto(
        List<TagDto> items,
        int total
) {
}
