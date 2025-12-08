package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.model.RLangVersion;
import org.schoolsystem.domain.model.RVersion;
import org.schoolsystem.domain.model.Source;
import org.schoolsystem.domain.model.UsesSource;

import java.util.List;

public record SourceImportResult(
        List<Source> sources,
        List<Resource> resources,
        List<RVersion> resourceVersions,
        List<RLangVersion> languageVersions,
        List<UsesSource> usesSources
) {
}