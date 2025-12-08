package org.schoolsystem.application.tag;

import org.schoolsystem.domain.model.Tag;

import java.util.List;
import java.util.Objects;

/**
 * Use Case: "Tags anzeigen" / GET /api/v1/tags.
 */
public interface TagQueryService {

    TagListResult listTags();

    record TagListResult(
            List<Tag> items
    ) {
        public TagListResult {
            Objects.requireNonNull(items, "items must not be null");
        }
    }
}
