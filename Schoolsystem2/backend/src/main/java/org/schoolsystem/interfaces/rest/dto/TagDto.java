package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Repräsentiert einen Tag inkl. Synonymen.
 */
public record TagDto(
        int id,
        String label,
        List<String> synonyms
) {
}
