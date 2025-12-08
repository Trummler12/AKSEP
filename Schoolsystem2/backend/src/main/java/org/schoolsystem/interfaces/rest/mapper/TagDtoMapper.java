package org.schoolsystem.interfaces.rest.mapper;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.interfaces.rest.dto.TagDto;

import java.util.List;
import java.util.Objects;

/**
 * Mapper für Tag → TagDto.
 */
public final class TagDtoMapper {

    private TagDtoMapper() {
        // utility
    }

    public static TagDto toDto(Tag tag) {
        Objects.requireNonNull(tag, "tag must not be null");

        List<String> labels = tag.labels();
        String primary = labels.isEmpty() ? "" : labels.get(0);
        List<String> synonyms = labels.size() <= 1
                ? List.of()
                : labels.subList(1, labels.size());

        return new TagDto(
                tag.id(),
                primary,
                List.copyOf(synonyms)
        );
    }
}
