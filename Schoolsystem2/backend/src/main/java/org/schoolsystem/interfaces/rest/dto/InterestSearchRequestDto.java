package org.schoolsystem.interfaces.rest.dto;

/**
 * Request-Body für die interessensbasierte Topic-Suche.
 */
public record InterestSearchRequestDto(
        String interestsText,
        String language,
        Integer maxResults,
        Boolean explainMatches
) {
}
