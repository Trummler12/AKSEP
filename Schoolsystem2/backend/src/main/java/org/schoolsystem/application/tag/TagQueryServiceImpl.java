package org.schoolsystem.application.tag;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.ports.TagRepository;

import java.util.List;
import java.util.Objects;

/**
 * Einfache Implementierung des TagQueryService.
 *
 * Use Case: "Tags anzeigen" / GET /api/v1/tags.
 */
public final class TagQueryServiceImpl implements TagQueryService {

    private final TagRepository tagRepository;

    public TagQueryServiceImpl(TagRepository tagRepository) {
        this.tagRepository = Objects.requireNonNull(tagRepository, "tagRepository must not be null");
    }

    @Override
    public TagListResult listTags() {
        List<Tag> allTags = tagRepository.findAll();
        // Contract garantiert Non-Null und kapselt die Liste
        return new TagListResult(allTags);
    }
}
