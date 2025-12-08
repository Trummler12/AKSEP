package org.schoolsystem.interfaces.rest.dto;

/**
 * Standard-Fehlerformat für alle nicht-2xx-Responses.
 * Entspricht Abschnitt 1.1 im API-Contract.
 */
public record ErrorResponseDto(
        String error,
        String message,
        int status,
        String path,
        String timestamp
) {
}
