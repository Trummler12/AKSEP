package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.ResourceType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResourceTypeCsvLoaderTest {

    @Test
    void loadsResourceTypesFromCsv() {
        ResourceTypeCsvLoader loader = new ResourceTypeCsvLoader();

        List<ResourceType> types = loader.loadAll();

        ResourceType rt0 = types.get(0);
        assertEquals(0, rt0.id());
        assertEquals("Web Page", rt0.name());
        assertEquals(1, rt0.version());

        ResourceType rt1 = types.get(1);
        assertEquals(1, rt1.id());
        assertEquals("YouTube Video", rt1.name());
    }
}
