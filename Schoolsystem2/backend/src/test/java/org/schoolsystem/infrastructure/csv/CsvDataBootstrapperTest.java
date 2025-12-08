package org.schoolsystem.infrastructure.csv;

import java.io.IOException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CsvDataBootstrapperTest {
    @Test
    void loadAll_shouldLoadNonEmptyCoreData() throws IOException {
        CsvDataBootstrapper bootstrapper = new CsvDataBootstrapper();

        CsvBootstrapResult result = bootstrapper.loadAll();
        assertNotNull(result, "Result must not be null");

        // Nur Minimalerwartungen, da sich CSV-Inhalte ändern dürfen
        assertFalse(result.sourceTypes().isEmpty(), "sourceTypes should not be empty");
        assertFalse(result.resourceTypes().isEmpty(), "resourceTypes should not be empty");
        assertFalse(result.topicTypes().isEmpty(), "topicTypes should not be empty");
        assertFalse(result.tags().isEmpty(), "tags should not be empty");
        assertFalse(result.topics().isEmpty(), "topics should not be empty");
        assertFalse(result.sources().isEmpty(), "sources should not be empty");
        assertFalse(result.resources().isEmpty(), "resources should not be empty");
    }
}
