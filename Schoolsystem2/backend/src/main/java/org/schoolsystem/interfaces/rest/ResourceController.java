package org.schoolsystem.interfaces.rest;

import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.interfaces.rest.dto.ResourceSummaryDto;

/**
 * Logische REST-Schnittstelle für Ressourcen-Endpunkte.
 *
 * Entspricht GET /api/v1/resources/{resourceId}.
 */
public interface ResourceController {

    /**
     * Liefert die Kurzdetails zu einer Ressource.
     *
     * Im HTTP-Adapter wird bei "nicht gefunden"
     * ein 404 mit ErrorResponseDto erzeugt.
     */
    ResourceSummaryDto getResourceById(
            int resourceId,
            LanguageCode language
    );
}
