// src/test/java/org/schoolsystem/infrastructure/csv/SourceCsvLoaderTest.java
package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SourceCsvLoaderTest {

    @Test
    void loadsSourcesAndStandaloneResourcesFromCsv() throws IOException {
        CsvFileReader reader = new CsvFileReader();

        // Lookup-Typen aus ihren CSVs laden
        SourceTypeCsvLoader sourceTypeLoader = new SourceTypeCsvLoader(reader);
        List<SourceType> sourceTypes = sourceTypeLoader.loadAll();

        ResourceTypeCsvLoader resourceTypeLoader = new ResourceTypeCsvLoader(reader);
        List<ResourceType> resourceTypes = resourceTypeLoader.loadAll();

        SourceCsvLoader loader = new SourceCsvLoader(reader, sourceTypes, resourceTypes);

        SourceImportResult result = loader.loadAll();

        List<Source> sources = result.sources();
        List<Resource> resources = result.resources();
        List<UsesSource> usesSources = result.usesSources();

        assertFalse(sources.isEmpty(), "sources should not be empty");

        // Beispiel: Source mit ID 42000 muss existieren (siehe t_source.csv)
        Optional<Source> maybe42000 = sources.stream()
                .filter(s -> s.id() == 42000)
                .findFirst();

        assertTrue(maybe42000.isPresent(), "Expected sourceID 42000 to be loaded");

        Source src42000 = maybe42000.orElseThrow();
        assertTrue(src42000.url().isPresent(), "source 42000 should have a URL");
        assertFalse(src42000.title().isEmpty(), "source 42000 should have a title");

        // Für jede Resource muss es eine passende UsesSource-Beziehung geben
        for (Resource resource : resources) {
            int resId = resource.id();
            assertTrue(
                    usesSources.stream().anyMatch(us -> us.resourceId() == resId),
                    () -> "Expected UsesSource for resourceId " + resId
            );
        }

        // Ressourcenanzahl darf nicht größer sein als Anzahl Sources
        assertTrue(
                resources.size() <= sources.size(),
                "resources.size() must not exceed sources.size()"
        );
    }
}
