package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Wrapper für Topic-Listen-Responses.
 */
public record TopicListResponseDto(
        List<TopicSummaryDto> items,
        int total
) {
}
