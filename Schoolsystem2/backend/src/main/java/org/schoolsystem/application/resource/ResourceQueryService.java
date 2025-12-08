package org.schoolsystem.application.resource;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.Objects;

/**
 * Use Case: GET /api/v1/resources/{resourceId}.
 *
 * Liefert Ressource + aufgelöste URL (aus Source/RVersion/RLangVersion).
 */
public interface ResourceQueryService {

    ResourceDetailsView getResource(ResourceDetailsQuery query);

    /**
     * Eingabeparameter für den Use Case.
     */
    record ResourceDetailsQuery(
            int resourceId,
            LanguageCode language
    ) {
        public ResourceDetailsQuery {
            if (resourceId <= 0) {
                throw new IllegalArgumentException("resourceId must be > 0, but was: " + resourceId);
            }
        }
    }

    /**
     * Ergebnisansicht: Resource-Domainobjekt + URL.
     */
    record ResourceDetailsView(
            Resource resource,
            String url
    ) {
        public ResourceDetailsView {
            Objects.requireNonNull(resource, "resource must not be null");
            Objects.requireNonNull(url, "url must not be null");
        }
    }
}
