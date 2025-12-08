package org.schoolsystem.application.resource;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.model.Source;
import org.schoolsystem.domain.model.UsesSource;
import org.schoolsystem.domain.ports.ResourceRepository;
import org.schoolsystem.domain.ports.SourceRepository;
import org.schoolsystem.domain.ports.UsesSourceRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Standard-Implementierung des ResourceQueryService.
 *
 * Orchestriert:
 * - Laden der Ressource
 * - Auflösung der zugehörigen Source(s) über UsesSource
 * - Auswahl einer URL für die gewünschte Sprache (v1: erste gefundene Web-URL)
 */
public final class ResourceQueryServiceImpl implements ResourceQueryService {

    private final ResourceRepository resourceRepository;
    private final UsesSourceRepository usesSourceRepository;
    private final SourceRepository sourceRepository;

    public ResourceQueryServiceImpl(ResourceRepository resourceRepository,
                                    UsesSourceRepository usesSourceRepository,
                                    SourceRepository sourceRepository) {

        this.resourceRepository = Objects.requireNonNull(resourceRepository, "resourceRepository must not be null");
        this.usesSourceRepository = Objects.requireNonNull(usesSourceRepository, "usesSourceRepository must not be null");
        this.sourceRepository = Objects.requireNonNull(sourceRepository, "sourceRepository must not be null");
    }

    @Override
    public ResourceDetailsView getResource(ResourceDetailsQuery query) {
        Objects.requireNonNull(query, "query must not be null");

        // 1) Ressource laden oder 404-ähnlichen Fehler werfen
        Resource resource = resourceRepository.findById(query.resourceId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Resource with id " + query.resourceId() + " not found"));

        // 2) Alle UsesSource-Einträge für diese Ressource laden
        List<UsesSource> usesSources = usesSourceRepository.findByResourceId(resource.id());

        // 3) Alle referenzierten Quellen holen
        List<Integer> sourceIds = usesSources.stream()
                .map(UsesSource::sourceId)
                .distinct()
                .sorted()
                .toList();

        String resolvedUrl = resolveUrl(sourceIds);

        // 4) Ergebnis-View aufbauen
        return new ResourceDetailsView(resource, resolvedUrl);
    }

    /**
     * Einfache URL-Auflösung:
     * - Lädt alle Sources zu den angegebenen IDs
     * - Wählt die erste Source mit vorhandener Web-URL
     * - Fällt andernfalls auf eine Dummy-/Fehler-URL zurück
     *
     * Diese Methode ist v1-bewusst simpel und kann später erweitert werden,
     * um z.B. LanguageCode, RVersion oder RLangVersion zu berücksichtigen.
     */
    private String resolveUrl(List<Integer> sourceIds) {
        if (sourceIds.isEmpty()) {
            // In v1 geben wir eine sprechende Fallback-URL zurück
            return "#no-source-url-configured";
        }

        List<Source> sources = sourceRepository.findByIds(sourceIds);

        return sources.stream()
                // zur Stabilität deterministisch sortieren
                .sorted(Comparator.comparingInt(Source::id))
                // erste Source mit URL nehmen
                .map(Source::url)
                .filter(Optional::isPresent)
                .map(optionalUrl -> optionalUrl.get().toString())
                .findFirst()
                // Fallback, falls keine Source eine URL hat
                .orElse("#no-web-url-found-for-sources-" + sourceIds);
    }
}
