package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.ResourceTag;
import org.schoolsystem.domain.value.TagWeight;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Minimaler Integrations-Test für ResourceTagCsvLoader.
 *
 * Achtung: Der Test ist robust gegen ein (noch) leeres ct_resource_tags.csv.
 * Er prüft:
 *  - Loader läuft ohne Exception durch
 *  - jede geladene Zeile respektiert die Domain-Regeln
 */
class ResourceTagCsvLoaderTest {

    @Test
    void loadAll_shouldRespectDomainConstraintsEvenIfFileIsExtendedLater() {
        ResourceTagCsvLoader loader = new ResourceTagCsvLoader();

        List<ResourceTag> resourceTags = loader.loadAll();
        assertNotNull(resourceTags, "resourceTags list must not be null");

        for (ResourceTag rt : resourceTags) {
            assertTrue(rt.resourceId() > 0, "resourceId must be > 0");
            assertTrue(rt.tagId() > 0, "tagId must be > 0");

            int value = rt.weight().value();
            assertTrue(
                    value >= TagWeight.MIN && value <= TagWeight.MAX,
                    () -> "weight must be between " + TagWeight.MIN + " and " + TagWeight.MAX + " but was " + value
            );

            assertEquals(1, rt.version(), "version is expected to be 1 for CSV-imported ResourceTags");
        }
    }
}
