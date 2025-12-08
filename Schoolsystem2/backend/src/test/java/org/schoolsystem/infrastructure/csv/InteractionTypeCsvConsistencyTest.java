package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.InteractionType;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class InteractionTypeCsvConsistencyTest {

    @Test
    void csvMatchesEnumDefinition() {
        CsvFileReader reader = new CsvFileReader();
        List<Map<String, String>> rows = reader.readWithHeader("csv/t_inter_type.csv");

        // 0..6 erwartet
        assertEquals(InteractionType.values().length, rows.size());

        for (Map<String, String> row : rows) {
            int id = Integer.parseInt(row.get("interaction_typeID").trim());
            String label = row.get("interaction").trim();

            InteractionType type = InteractionType.fromId(id);
            assertEquals(label, type.label(), "Label mismatch for id=" + id);
        }
    }
}
