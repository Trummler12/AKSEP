package org.schoolsystem.interfaces.rest;

import org.schoolsystem.interfaces.rest.dto.TagListResponseDto;

/**
 * Logische REST-Schnittstelle für Tag-Endpunkte.
 *
 * Entspricht GET /api/v1/tags.
 */
public interface TagController {

    /**
     * Liefert alle Tags inkl. total-Zähler.
     */
    TagListResponseDto listTags();
}
