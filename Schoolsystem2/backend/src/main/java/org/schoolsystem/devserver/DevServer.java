package org.schoolsystem.devserver;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import org.schoolsystem.application.interest.InterestSearchService;
import org.schoolsystem.application.interest.InterestSearchServiceImpl;
import org.schoolsystem.application.interest.TagMatchingClient;
import org.schoolsystem.application.tag.TagQueryService;
import org.schoolsystem.application.tag.TagQueryServiceImpl;
import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.model.ResourceTag;
import org.schoolsystem.domain.model.RLangVersion;
import org.schoolsystem.domain.model.RVersion;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.model.WebRLangVersion;
import org.schoolsystem.domain.ports.TagRepository;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.infrastructure.csv.CsvBootstrapResult;
import org.schoolsystem.infrastructure.csv.CsvDataBootstrapper;
import org.schoolsystem.infrastructure.interest.OpenAiTagMatchingClient;
import org.schoolsystem.infrastructure.persistence.InMemoryTagRepository;
import org.schoolsystem.infrastructure.persistence.InMemoryTopicRepository;
import org.schoolsystem.infrastructure.persistence.InMemoryTopicTagRepository;
import org.schoolsystem.interfaces.rest.dto.ErrorResponseDto;
import org.schoolsystem.interfaces.rest.dto.InterestSearchRequestDto;
import org.schoolsystem.interfaces.rest.dto.InterestSearchResponseDto;
import org.schoolsystem.interfaces.rest.dto.TagDto;
import org.schoolsystem.interfaces.rest.dto.TagListResponseDto;
import org.schoolsystem.interfaces.rest.dto.TopicDetailDto;
import org.schoolsystem.interfaces.rest.dto.TopicListResponseDto;
import org.schoolsystem.interfaces.rest.dto.TopicResolutionResponseDto;
import org.schoolsystem.interfaces.rest.dto.TopicSummaryDto;
import org.schoolsystem.interfaces.rest.mapper.LocalizedTextMapper;
import org.schoolsystem.interfaces.rest.mapper.TagDtoMapper;
import org.schoolsystem.interfaces.rest.mapper.TopicDtoMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Simple dev server:
 * - bootstraps CSV data
 * - wires minimal in-memory repositories
 * - exposes a small HTTP API on port 8080
 *
 * Endpoints:
 * - GET /health
 * - GET /api/v1/tags
 * - GET /api/v1/topics
 * - GET /api/v1/topics/{topicId}
 * - POST /api/v1/topics/interest-search
 */
public final class DevServer {

    private DevServer() {
        // no instances
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Starting SchoolSystem DevServer ...");

        // 1) Load CSV data
        CsvBootstrapResult bootstrapResult = new CsvDataBootstrapper().loadAll();
        System.out.printf(
                "Bootstrap completed: %d tags, %d topics, %d resources%n",
                bootstrapResult.tags().size(),
                bootstrapResult.topics().size(),
                bootstrapResult.resources().size()
        );

        // 2) Repositories / services
        TagRepository tagRepository = new InMemoryTagRepository(bootstrapResult.tags());
        TagQueryService tagQueryService = new TagQueryServiceImpl(tagRepository);
        var topicRepository = new InMemoryTopicRepository(bootstrapResult.topics());
        var topicTagRepository = new InMemoryTopicTagRepository(bootstrapResult.topicTags());
        TagMatchingClient tagMatchingClient = new OpenAiTagMatchingClient();
        InterestSearchService interestSearchService = new InterestSearchServiceImpl(
                tagRepository,
                topicRepository,
                topicTagRepository,
                tagMatchingClient
        );

        // 3) Lookups for topic endpoints
        Map<Integer, Tag> tagsById = bootstrapResult.tags().stream()
                .collect(Collectors.toUnmodifiableMap(Tag::id, t -> t));
        Map<String, List<Topic>> topicsByLowerId = indexTopicsByLowerId(bootstrapResult.topics());
        Map<String, List<Tag>> tagsByTopicLowerId = indexTagsByTopicLowerId(bootstrapResult.topicTags(), tagsById);
        Map<String, List<TopicTag>> topicTagLinksByLowerTopicId = indexTopicTagsByTopicLowerId(bootstrapResult.topicTags());

        Map<Integer, Resource> resourcesById = bootstrapResult.resources().stream()
                .collect(Collectors.toUnmodifiableMap(Resource::id, r -> r));
        Map<Integer, List<ResourceTag>> resourceTagsByResourceId = indexResourceTagsByResourceId(bootstrapResult.resourceTags());

        // 4) HTTP server
        int port = 8080;
        HttpServer httpServer = HttpServer.create(new InetSocketAddress(port), 0);

        // Health
        httpServer.createContext("/health", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }
            sendText(exchange, 200, "OK");
        });

        // Shutdown (loopback-only): POST /shutdown
        httpServer.createContext("/shutdown", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            var remote = exchange.getRemoteAddress();
            var remoteAddr = remote == null ? null : remote.getAddress();
            if (remoteAddr == null || !remoteAddr.isLoopbackAddress()) {
                sendError(exchange, 403, "Forbidden", "Shutdown is only allowed from localhost");
                return;
            }

            sendText(exchange, 200, "Shutting down");

            new Thread(() -> {
                try {
                    httpServer.stop(0);
                } catch (Exception ignored) {
                    // best-effort shutdown
                }
            }, "devserver-shutdown").start();
        });

        // Tags: GET /api/v1/tags
        httpServer.createContext("/api/v1/tags", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            try {
                TagQueryService.TagListResult result = tagQueryService.listTags();
                List<TagDto> tagDtos = result.items().stream()
                        .map(TagDtoMapper::toDto)
                        .toList();

                TagListResponseDto responseDto = new TagListResponseDto(tagDtos, tagDtos.size());
                sendJson(exchange, 200, JsonWriter.toJson(responseDto));
            } catch (Exception ex) {
                ex.printStackTrace();
                sendError(exchange, 500, "InternalError", "Internal server error");
            }
        });

        // Topics list: GET /api/v1/topics
        httpServer.createContext("/api/v1/topics", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            try {
                QueryParams qp = QueryParams.fromExchange(exchange);
                LanguageCode lang = parseLanguage(qp.getFirst("lang"), exchange.getRequestHeaders().getFirst("Accept-Language"));

                int maxLayer = qp.getInt("maxLayer").orElse(2);
                boolean showCourses = qp.getBoolean("showCourses").orElse(true);
                boolean showAchievements = qp.getBoolean("showAchievements").orElse(false);
                String sortBy = qp.getFirst("sortBy").orElse("name");
                String sortDirection = qp.getFirst("sortDirection").orElse("asc");

                List<Topic> filtered = bootstrapResult.topics().stream()
                        .filter(t -> t.layer() <= maxLayer)
                        .filter(t -> showCourses || !t.id().isCourse())
                        .filter(t -> showAchievements || !t.id().isAchievement())
                        .toList();

                Comparator<Topic> comparator = buildTopicComparator(sortBy, sortDirection, lang);

                List<TopicSummaryDto> items = filtered.stream()
                        .sorted(comparator)
                        .map(topic -> {
                            List<Tag> tagsForTopic = tagsByTopicLowerId.getOrDefault(
                                    topic.id().value().toLowerCase(Locale.ROOT),
                                    List.of()
                            );
                            return TopicDtoMapper.toSummaryDto(topic, tagsForTopic, lang);
                        })
                        .toList();

                TopicListResponseDto response = new TopicListResponseDto(items, items.size());
                sendJson(exchange, 200, JsonWriter.toJson(response));
            } catch (BadRequestException bre) {
                sendError(exchange, 400, "BadRequest", bre.getMessage());
            } catch (Exception ex) {
                ex.printStackTrace();
                sendError(exchange, 500, "InternalError", "Internal server error");
            }
        });

        // Interest search: POST /api/v1/topics/interest-search
        httpServer.createContext("/api/v1/topics/interest-search", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            try {
                String body = readRequestBody(exchange);
                InterestSearchRequestDto request = parseInterestSearchRequest(body);

                LanguageCode lang = safeLanguage(request.language() == null ? "en" : request.language());
                String interestsText = request.interestsText() == null ? "" : request.interestsText().trim();

                int maxResults = request.maxResults() == null ? 50 : request.maxResults();
                if (maxResults < 1 || maxResults > 200) {
                    throw new BadRequestException("maxResults must be between 1 and 200");
                }

                boolean explainMatches = request.explainMatches() == null || request.explainMatches();

                if (interestsText.length() < 12 || interestsText.length() > 2048) {
                    throw new BadRequestException("interestsText length must be between 12 and 2048");
                }

                InterestSearchService.InterestSearchResult result = interestSearchService.search(
                        new InterestSearchService.InterestSearchQuery(interestsText, lang, maxResults, explainMatches)
                );
                InterestSearchResponseDto response = toInterestSearchResponseDto(result, lang);

                sendJson(exchange, 200, JsonWriter.toJson(response));
            } catch (BadRequestException bre) {
                sendError(exchange, 400, "BadRequest", bre.getMessage());
            } catch (Exception ex) {
                ex.printStackTrace();
                sendError(exchange, 500, "InternalError", "Internal server error");
            }
        });

        // Topic detail: GET /api/v1/topics/{topicId}
        httpServer.createContext("/api/v1/topics/", exchange -> {
            if (handlePreflight(exchange)) return;
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            try {
                String path = exchange.getRequestURI().getPath();
                String rawIdEncoded = path.substring("/api/v1/topics/".length());
                if (rawIdEncoded.isBlank()) {
                    throw new BadRequestException("Missing topicId in path");
                }

                String rawId = URLDecoder.decode(rawIdEncoded, StandardCharsets.UTF_8);
                String lower = rawId.toLowerCase(Locale.ROOT);

                QueryParams qp = QueryParams.fromExchange(exchange);
                LanguageCode lang = parseLanguage(qp.getFirst("lang"), exchange.getRequestHeaders().getFirst("Accept-Language"));

                List<Topic> candidates = topicsByLowerId.getOrDefault(lower, List.of());
                if (candidates.isEmpty()) {
                    sendError(exchange, 404, "TopicNotFound", "No topic found for id '" + rawId + "'");
                    return;
                }

                if (candidates.size() > 1) {
                    List<TopicResolutionResponseDto.TopicResolutionCandidateDto> candidateDtos = candidates.stream()
                            .sorted(Comparator.comparing(t -> t.id().value()))
                            .map(t -> new TopicResolutionResponseDto.TopicResolutionCandidateDto(
                                    t.id().value(),
                                    LocalizedTextMapper.toLocalizedString(t.name(), lang),
                                    t.type().name().getOrDefault(lang, new LanguageCode("en")),
                                    t.layer()
                            ))
                            .toList();

                    TopicResolutionResponseDto response = new TopicResolutionResponseDto(
                            TopicResolutionResponseDto.TopicResolutionStatus.AMBIGUOUS,
                            null,
                            candidateDtos
                    );

                    sendJson(exchange, 200, JsonWriter.toJson(response));
                    return;
                }

                Topic topic = candidates.get(0);
                List<Tag> tagsForTopic = tagsByTopicLowerId.getOrDefault(lower, List.of());

                List<TopicDtoMapper.ScoredResource> scoredResources = buildScoredResources(
                        topic,
                        lang,
                        topicTagLinksByLowerTopicId,
                        resourceTagsByResourceId,
                        resourcesById,
                        tagsById
                );
                List<TopicDtoMapper.SimilarTopicInfo> similarTopics = buildSimilarTopics(topic, bootstrapResult.topics(), lang);

                TopicDetailDto detail = TopicDtoMapper.toDetailDto(
                        topic,
                        tagsForTopic,
                        scoredResources,
                        similarTopics,
                        lang
                );

                TopicResolutionResponseDto response = new TopicResolutionResponseDto(
                        TopicResolutionResponseDto.TopicResolutionStatus.EXACT,
                        detail,
                        List.of()
                );

                sendJson(exchange, 200, JsonWriter.toJson(response));
            } catch (BadRequestException bre) {
                sendError(exchange, 400, "BadRequest", bre.getMessage());
            } catch (Exception ex) {
                ex.printStackTrace();
                sendError(exchange, 500, "InternalError", "Internal server error");
            }
        });

        httpServer.setExecutor(null);
        httpServer.start();
        System.out.printf("DevServer started on http://localhost:%d%n", port);
    }

    private static Map<String, List<Topic>> indexTopicsByLowerId(List<Topic> topics) {
        Map<String, List<Topic>> map = new HashMap<>();
        for (Topic t : topics) {
            String lower = t.id().value().toLowerCase(Locale.ROOT);
            map.computeIfAbsent(lower, ignored -> new ArrayList<>()).add(t);
        }

        Map<String, List<Topic>> frozen = new HashMap<>();
        for (Map.Entry<String, List<Topic>> entry : map.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private static Map<String, List<Tag>> indexTagsByTopicLowerId(List<TopicTag> topicTags, Map<Integer, Tag> tagsById) {
        Map<String, List<Tag>> map = new HashMap<>();
        for (TopicTag link : topicTags) {
            Tag tag = tagsById.get(link.tagId());
            if (tag == null) {
                continue;
            }
            String lower = link.topicId().value().toLowerCase(Locale.ROOT);
            map.computeIfAbsent(lower, ignored -> new ArrayList<>()).add(tag);
        }

        Map<String, List<Tag>> frozen = new HashMap<>();
        for (Map.Entry<String, List<Tag>> entry : map.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private static Map<String, List<TopicTag>> indexTopicTagsByTopicLowerId(List<TopicTag> topicTags) {
        Map<String, List<TopicTag>> map = new HashMap<>();
        for (TopicTag link : topicTags) {
            String lower = link.topicId().value().toLowerCase(Locale.ROOT);
            map.computeIfAbsent(lower, ignored -> new ArrayList<>()).add(link);
        }

        Map<String, List<TopicTag>> frozen = new HashMap<>();
        for (Map.Entry<String, List<TopicTag>> entry : map.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private static Map<Integer, List<ResourceTag>> indexResourceTagsByResourceId(List<ResourceTag> resourceTags) {
        Map<Integer, List<ResourceTag>> map = new HashMap<>();
        for (ResourceTag link : resourceTags) {
            map.computeIfAbsent(link.resourceId(), ignored -> new ArrayList<>()).add(link);
        }

        Map<Integer, List<ResourceTag>> frozen = new HashMap<>();
        for (Map.Entry<Integer, List<ResourceTag>> entry : map.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private static List<TopicDtoMapper.ScoredResource> buildScoredResources(
            Topic topic,
            LanguageCode lang,
            Map<String, List<TopicTag>> topicTagLinksByLowerTopicId,
            Map<Integer, List<ResourceTag>> resourceTagsByResourceId,
            Map<Integer, Resource> resourcesById,
            Map<Integer, Tag> tagsById
    ) {
        String topicLower = topic.id().value().toLowerCase(Locale.ROOT);
        List<TopicTag> topicLinks = topicTagLinksByLowerTopicId.getOrDefault(topicLower, List.of());

        Map<Integer, Integer> topicWeightByTagId = new HashMap<>();
        for (TopicTag tt : topicLinks) {
            topicWeightByTagId.put(tt.tagId(), tt.weight().asInt());
        }

        List<TopicDtoMapper.ScoredResource> result = new ArrayList<>();

        for (Map.Entry<Integer, List<ResourceTag>> entry : resourceTagsByResourceId.entrySet()) {
            int resourceId = entry.getKey();
            Resource resource = resourcesById.get(resourceId);
            if (resource == null || !resource.isActive()) {
                continue;
            }

            int score = 0;
            List<TopicDtoMapper.MatchedTag> matched = new ArrayList<>();

            for (ResourceTag rt : entry.getValue()) {
                Integer topicWeight = topicWeightByTagId.get(rt.tagId());
                if (topicWeight == null) {
                    continue;
                }

                int resourceWeight = rt.weight().asInt();
                int contribution = topicWeight * resourceWeight;
                score += contribution;

                Tag tag = tagsById.get(rt.tagId());
                String label = tag != null ? tag.primaryLabel() : ("tag#" + rt.tagId());

                matched.add(new TopicDtoMapper.MatchedTag(
                        rt.tagId(),
                        label,
                        topicWeight,
                        resourceWeight,
                        contribution
                ));
            }

            if (score <= 0) {
                continue;
            }

            matched.sort(Comparator.comparingInt(TopicDtoMapper.MatchedTag::contribution).reversed());

            String url = resolveResourceUrl(resource, lang);
            result.add(new TopicDtoMapper.ScoredResource(resource, url, score, List.copyOf(matched)));
        }

        result.sort(Comparator
                .comparingInt((TopicDtoMapper.ScoredResource sr) -> sr.score()).reversed()
                .thenComparing(sr -> sr.resource().id())
        );

        return List.copyOf(result);
    }

    private static String resolveResourceUrl(Resource resource, LanguageCode requestedLanguage) {
        LanguageCode effective = requestedLanguage != null ? requestedLanguage : new LanguageCode("en");

        for (RVersion v : resource.versions()) {
            for (RLangVersion lv : v.languageVersions()) {
                if (lv instanceof WebRLangVersion web && web.language().equals(effective)) {
                    return web.url().asString();
                }
            }
        }
        for (RVersion v : resource.versions()) {
            for (RLangVersion lv : v.languageVersions()) {
                if (lv instanceof WebRLangVersion web) {
                    return web.url().asString();
                }
            }
        }
        return "";
    }

    private static Comparator<Topic> buildTopicComparator(String sortBy, String sortDirection, LanguageCode lang) {
        String effectiveSortBy = sortBy == null ? "name" : sortBy.trim().toLowerCase(Locale.ROOT);
        String effectiveDirection = sortDirection == null ? "asc" : sortDirection.trim().toLowerCase(Locale.ROOT);

        Comparator<Topic> comparator;
        switch (effectiveSortBy) {
            case "id" -> comparator = Comparator.comparing(t -> t.id().value());
            case "layer" -> comparator = Comparator.comparingInt(Topic::layer);
            case "type" -> comparator = Comparator.comparing(t -> t.type().name().getOrDefault(lang, new LanguageCode("en")));
            case "name" -> comparator = Comparator.comparing(t -> LocalizedTextMapper.toLocalizedString(t.name(), lang), String.CASE_INSENSITIVE_ORDER);
            default -> throw new BadRequestException("Invalid sortBy. Allowed: name,type,layer,id");
        }

        if (!"asc".equals(effectiveDirection) && !"desc".equals(effectiveDirection)) {
            throw new BadRequestException("Invalid sortDirection. Allowed: asc,desc");
        }

        return "desc".equals(effectiveDirection) ? comparator.reversed() : comparator;
    }

    private static List<TopicDtoMapper.SimilarTopicInfo> buildSimilarTopics(Topic topic, List<Topic> allTopics, LanguageCode lang) {
        String id = topic.id().value();
        String stem = id.length() >= 3 ? id.substring(0, 3).toLowerCase(Locale.ROOT) : id.toLowerCase(Locale.ROOT);

        return allTopics.stream()
                .filter(t -> !t.id().value().equals(id))
                .filter(t -> t.id().value().toLowerCase(Locale.ROOT).startsWith(stem))
                .sorted(Comparator.comparing(t -> t.id().value()))
                .limit(25)
                .map(t -> new TopicDtoMapper.SimilarTopicInfo(
                        t.id().value(),
                        LocalizedTextMapper.toLocalizedString(t.name(), lang),
                        t.type().name().getOrDefault(lang, new LanguageCode("en")),
                        t.layer()
                ))
                .toList();
    }

    private static InterestSearchResponseDto toInterestSearchResponseDto(
            InterestSearchService.InterestSearchResult result,
            LanguageCode language
    ) {
        List<InterestSearchResponseDto.InterestMatchedTagDto> matchedTags = result.matchedTags().stream()
                .map(mt -> new InterestSearchResponseDto.InterestMatchedTagDto(
                        mt.tag().id(),
                        mt.tag().primaryLabel(),
                        mt.interestWeight()
                ))
                .toList();

        List<InterestSearchResponseDto.InterestTopicScoreDto> topics = result.topics().stream()
                .map(ts -> {
                    var topic = ts.topicWithTags().topic();
                    var tagsForTopic = ts.topicWithTags().tags();
                    TopicSummaryDto summary = TopicDtoMapper.toSummaryDto(topic, tagsForTopic, language);

                    List<InterestSearchResponseDto.InterestTopicMatchedTagDto> contributions = ts.matchedTags().stream()
                            .map(c -> new InterestSearchResponseDto.InterestTopicMatchedTagDto(
                                    c.tag().id(),
                                    c.tag().primaryLabel(),
                                    c.interestWeight(),
                                    c.topicWeight(),
                                    c.contribution()
                            ))
                            .toList();

                    return new InterestSearchResponseDto.InterestTopicScoreDto(summary, ts.score(), contributions);
                })
                .toList();

        return new InterestSearchResponseDto(
                result.interestsText(),
                result.usedLanguage().value(),
                matchedTags,
                topics
        );
    }

    private static InterestSearchRequestDto parseInterestSearchRequest(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            throw new BadRequestException("Request body must be JSON");
        }

        Object parsed = SimpleJson.parse(rawJson);
        if (!(parsed instanceof Map<?, ?> map)) {
            throw new BadRequestException("Request body must be a JSON object");
        }

        String interestsText = asString(map.get("interestsText")).orElse("");
        String language = asString(map.get("language")).orElse("en");
        Integer maxResults = asInteger(map.get("maxResults")).orElse(null);
        Boolean explainMatches = asBoolean(map.get("explainMatches")).orElse(null);

        return new InterestSearchRequestDto(interestsText, language, maxResults, explainMatches);
    }

    private static Optional<String> asString(Object value) {
        if (value == null) return Optional.empty();
        if (value instanceof String s) return Optional.of(s);
        return Optional.of(value.toString());
    }

    private static Optional<Integer> asInteger(Object value) {
        if (value == null) return Optional.empty();
        if (value instanceof Number n) return Optional.of(n.intValue());
        if (value instanceof String s) {
            try {
                return Optional.of(Integer.parseInt(s.trim()));
            } catch (NumberFormatException ignored) {
                return Optional.empty();
            }
        }
        return Optional.empty();
    }

    private static Optional<Boolean> asBoolean(Object value) {
        if (value == null) return Optional.empty();
        if (value instanceof Boolean b) return Optional.of(b);
        if (value instanceof String s) {
            String n = s.trim().toLowerCase(Locale.ROOT);
            if ("true".equals(n)) return Optional.of(true);
            if ("false".equals(n)) return Optional.of(false);
        }
        return Optional.empty();
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            byte[] bytes = is.readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        }
    }

    private static void sendMethodNotAllowed(HttpExchange exchange) throws IOException {
        sendText(exchange, 405, "Method Not Allowed");
    }

    private static void sendText(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", "text/plain; charset=utf-8");
        addCorsHeaders(headers);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        } finally {
            exchange.close();
        }
    }

    private static void sendJson(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", "application/json; charset=utf-8");
        addCorsHeaders(headers);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        } finally {
            exchange.close();
        }
    }

    private static void sendError(HttpExchange exchange, int statusCode, String errorCode, String message) throws IOException {
        String path = exchange.getRequestURI().getPath();
        ErrorResponseDto dto = new ErrorResponseDto(
                errorCode,
                message,
                statusCode,
                path,
                Instant.now().toString()
        );
        sendJson(exchange, statusCode, JsonWriter.toJson(dto));
    }

    private static boolean handlePreflight(HttpExchange exchange) throws IOException {
        if (!"OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            return false;
        }

        Headers headers = exchange.getResponseHeaders();
        addCorsHeaders(headers);
        exchange.sendResponseHeaders(204, -1);
        exchange.close();
        return true;
    }

    private static void addCorsHeaders(Headers headers) {
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Accept, Accept-Language");
        headers.set("Access-Control-Max-Age", "600");
    }

    private static LanguageCode parseLanguage(Optional<String> queryLang, String acceptLanguageHeader) {
        if (queryLang != null && queryLang.isPresent() && !queryLang.get().isBlank()) {
            return safeLanguage(queryLang.get());
        }

        if (acceptLanguageHeader != null && !acceptLanguageHeader.isBlank()) {
            String first = acceptLanguageHeader.split(",")[0].trim();
            String base = first.split("-")[0].trim();
            if (!base.isBlank()) {
                return safeLanguage(base);
            }
        }

        return new LanguageCode("en");
    }

    private static LanguageCode safeLanguage(String raw) {
        try {
            return new LanguageCode(raw);
        } catch (IllegalArgumentException ex) {
            return new LanguageCode("en");
        }
    }

    private static final class BadRequestException extends RuntimeException {
        BadRequestException(String message) {
            super(message);
        }
    }

    private static final class QueryParams {
        private final Map<String, List<String>> params;

        private QueryParams(Map<String, List<String>> params) {
            this.params = params;
        }

        static QueryParams fromExchange(HttpExchange exchange) {
            return new QueryParams(parseQuery(exchange.getRequestURI().getRawQuery()));
        }

        Optional<String> getFirst(String key) {
            List<String> values = params.get(key);
            if (values == null || values.isEmpty()) {
                return Optional.empty();
            }
            return Optional.ofNullable(values.get(0));
        }

        Optional<Integer> getInt(String key) {
            Optional<String> v = getFirst(key);
            if (v.isEmpty() || v.get().isBlank()) {
                return Optional.empty();
            }
            try {
                return Optional.of(Integer.parseInt(v.get().trim()));
            } catch (NumberFormatException ex) {
                throw new BadRequestException("Invalid integer for '" + key + "'");
            }
        }

        Optional<Boolean> getBoolean(String key) {
            Optional<String> v = getFirst(key);
            if (v.isEmpty() || v.get().isBlank()) {
                return Optional.empty();
            }

            String normalized = v.get().trim().toLowerCase(Locale.ROOT);
            if ("true".equals(normalized)) {
                return Optional.of(true);
            }
            if ("false".equals(normalized)) {
                return Optional.of(false);
            }
            throw new BadRequestException("Invalid boolean for '" + key + "' (use true/false)");
        }

        private static Map<String, List<String>> parseQuery(String rawQuery) {
            if (rawQuery == null || rawQuery.isBlank()) {
                return Map.of();
            }

            Map<String, List<String>> map = new HashMap<>();
            for (String pair : rawQuery.split("&")) {
                if (pair.isBlank()) {
                    continue;
                }
                String[] parts = pair.split("=", 2);
                String key = urlDecode(parts[0]);
                String value = parts.length > 1 ? urlDecode(parts[1]) : "";

                if (key == null || key.isBlank()) {
                    continue;
                }

                map.computeIfAbsent(key, ignored -> new ArrayList<>()).add(value);
            }

            Map<String, List<String>> frozen = new HashMap<>();
            for (Map.Entry<String, List<String>> entry : map.entrySet()) {
                frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
            }
            return Map.copyOf(frozen);
        }

        private static String urlDecode(String s) {
            if (s == null) {
                return null;
            }
            return URLDecoder.decode(s, StandardCharsets.UTF_8);
        }
    }

    private static final class SimpleJson {
        private final String s;
        private int i;

        private SimpleJson(String s) {
            this.s = s;
        }

        static Object parse(String s) {
            if (s == null) {
                throw new BadRequestException("Invalid JSON");
            }
            SimpleJson p = new SimpleJson(s);
            Object value = p.parseValue();
            p.skipWs();
            if (!p.eof()) {
                throw new BadRequestException("Invalid JSON: trailing characters");
            }
            return value;
        }

        private Object parseValue() {
            skipWs();
            if (eof()) {
                throw new BadRequestException("Invalid JSON: unexpected end");
            }

            char c = s.charAt(i);
            if (c == '{') return parseObject();
            if (c == '"') return parseString();
            if (c == 't' || c == 'f') return parseBoolean();
            if (c == 'n') return parseNull();
            if (c == '-' || (c >= '0' && c <= '9')) return parseNumber();
            throw new BadRequestException("Invalid JSON: unexpected character");
        }

        private Map<String, Object> parseObject() {
            expect('{');
            skipWs();
            Map<String, Object> map = new HashMap<>();
            if (peek('}')) {
                expect('}');
                return Map.copyOf(map);
            }

            while (true) {
                skipWs();
                String key = parseString();
                skipWs();
                expect(':');
                Object value = parseValue();
                map.put(key, value);
                skipWs();
                if (peek(',')) {
                    expect(',');
                    continue;
                }
                expect('}');
                return Map.copyOf(map);
            }
        }

        private String parseString() {
            expect('"');
            StringBuilder out = new StringBuilder();
            while (!eof()) {
                char c = s.charAt(i++);
                if (c == '"') {
                    return out.toString();
                }
                if (c == '\\') {
                    if (eof()) throw new BadRequestException("Invalid JSON: bad escape");
                    char e = s.charAt(i++);
                    switch (e) {
                        case '"': out.append('"'); break;
                        case '\\': out.append('\\'); break;
                        case '/': out.append('/'); break;
                        case 'b': out.append('\b'); break;
                        case 'f': out.append('\f'); break;
                        case 'n': out.append('\n'); break;
                        case 'r': out.append('\r'); break;
                        case 't': out.append('\t'); break;
                        case 'u': {
                            if (i + 4 > s.length()) throw new BadRequestException("Invalid JSON: bad unicode escape");
                            String hex = s.substring(i, i + 4);
                            i += 4;
                            try {
                                out.append((char) Integer.parseInt(hex, 16));
                            } catch (NumberFormatException ex) {
                                throw new BadRequestException("Invalid JSON: bad unicode escape");
                            }
                            break;
                        }
                        default:
                            throw new BadRequestException("Invalid JSON: bad escape");
                    }
                } else {
                    out.append(c);
                }
            }
            throw new BadRequestException("Invalid JSON: unterminated string");
        }

        private Boolean parseBoolean() {
            if (match("true")) return true;
            if (match("false")) return false;
            throw new BadRequestException("Invalid JSON: bad boolean");
        }

        private Object parseNull() {
            if (match("null")) return null;
            throw new BadRequestException("Invalid JSON: bad null");
        }

        private Number parseNumber() {
            int start = i;
            if (peek('-')) i++;
            while (!eof() && Character.isDigit(s.charAt(i))) i++;
            // ignore fraction/exponent for this dev server
            String num = s.substring(start, i);
            try {
                return Integer.parseInt(num);
            } catch (NumberFormatException ex) {
                throw new BadRequestException("Invalid JSON: bad number");
            }
        }

        private boolean match(String literal) {
            if (s.regionMatches(i, literal, 0, literal.length())) {
                i += literal.length();
                return true;
            }
            return false;
        }

        private void skipWs() {
            while (!eof()) {
                char c = s.charAt(i);
                if (c == ' ' || c == '\n' || c == '\r' || c == '\t') {
                    i++;
                } else {
                    break;
                }
            }
        }

        private void expect(char c) {
            if (eof() || s.charAt(i) != c) {
                throw new BadRequestException("Invalid JSON");
            }
            i++;
        }

        private boolean peek(char c) {
            return !eof() && s.charAt(i) == c;
        }

        private boolean eof() {
            return i >= s.length();
        }
    }

    /**
     * Minimal JSON writer for the dev server.
     * Not a generic JSON library; intentionally narrow.
     */
    private static final class JsonWriter {

        private JsonWriter() {
        }

        public static String toJson(TagListResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append("{\"items\":[");
            List<TagDto> items = dto.items();
            for (int i = 0; i < items.size(); i++) {
                if (i > 0) sb.append(',');
                sb.append(toJson(items.get(i)));
            }
            sb.append("],\"total\":").append(dto.total()).append('}');
            return sb.toString();
        }

        public static String toJson(TopicListResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append("{\"items\":[");
            List<TopicSummaryDto> items = dto.items();
            for (int i = 0; i < items.size(); i++) {
                if (i > 0) sb.append(',');
                sb.append(toJson(items.get(i)));
            }
            sb.append("],\"total\":").append(dto.total()).append('}');
            return sb.toString();
        }

        public static String toJson(TopicResolutionResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"resolutionStatus\":").append(toJsonString(dto.resolutionStatus().name())).append(',');
            sb.append("\"topic\":");
            if (dto.topic() == null) {
                sb.append("null,");
            } else {
                sb.append(toJson(dto.topic())).append(',');
            }
            sb.append("\"candidates\":[");
            List<TopicResolutionResponseDto.TopicResolutionCandidateDto> candidates = dto.candidates();
            for (int i = 0; i < candidates.size(); i++) {
                if (i > 0) sb.append(',');
                sb.append(toJson(candidates.get(i)));
            }
            sb.append("]}");
            return sb.toString();
        }

        public static String toJson(ErrorResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"error\":").append(toJsonString(dto.error())).append(',');
            sb.append("\"message\":").append(toJsonString(dto.message())).append(',');
            sb.append("\"status\":").append(dto.status()).append(',');
            sb.append("\"path\":").append(toJsonString(dto.path())).append(',');
            sb.append("\"timestamp\":").append(toJsonString(dto.timestamp()));
            sb.append('}');
            return sb.toString();
        }

        public static String toJson(InterestSearchResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"interestsText\":").append(toJsonString(dto.interestsText())).append(',');
            sb.append("\"usedLanguage\":").append(toJsonString(dto.usedLanguage())).append(',');

            sb.append("\"matchedTags\":").append(toJsonInterestMatchedTags(dto.matchedTags())).append(',');
            sb.append("\"topics\":").append(toJsonInterestTopics(dto.topics()));

            sb.append('}');
            return sb.toString();
        }

        private static String toJsonInterestMatchedTags(List<InterestSearchResponseDto.InterestMatchedTagDto> tags) {
            if (tags == null) {
                return "[]";
            }
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < tags.size(); i++) {
                if (i > 0) sb.append(',');
                var t = tags.get(i);
                sb.append('{')
                        .append("\"tagId\":").append(t.tagId()).append(',')
                        .append("\"label\":").append(toJsonString(t.label())).append(',')
                        .append("\"interestWeight\":").append(t.interestWeight())
                        .append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonInterestTopics(List<InterestSearchResponseDto.InterestTopicScoreDto> topics) {
            if (topics == null) {
                return "[]";
            }
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < topics.size(); i++) {
                if (i > 0) sb.append(',');
                var t = topics.get(i);
                sb.append('{');
                sb.append("\"topic\":").append(toJson(t.topic())).append(',');
                sb.append("\"score\":").append(t.score()).append(',');
                sb.append("\"matchedTags\":").append(toJsonInterestTopicMatchedTags(t.matchedTags()));
                sb.append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonInterestTopicMatchedTags(List<InterestSearchResponseDto.InterestTopicMatchedTagDto> matchedTags) {
            if (matchedTags == null) {
                return "[]";
            }
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < matchedTags.size(); i++) {
                if (i > 0) sb.append(',');
                var mt = matchedTags.get(i);
                sb.append('{')
                        .append("\"tagId\":").append(mt.tagId()).append(',')
                        .append("\"label\":").append(toJsonString(mt.label())).append(',')
                        .append("\"interestWeight\":").append(mt.interestWeight()).append(',')
                        .append("\"topicWeight\":").append(mt.topicWeight()).append(',')
                        .append("\"contribution\":").append(mt.contribution())
                        .append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJson(TagDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"id\":").append(dto.id()).append(',');
            sb.append("\"label\":").append(toJsonString(dto.label())).append(',');
            sb.append("\"synonyms\":[");
            List<String> synonyms = dto.synonyms();
            for (int i = 0; i < synonyms.size(); i++) {
                if (i > 0) sb.append(',');
                sb.append(toJsonString(synonyms.get(i)));
            }
            sb.append("]}");
            return sb.toString();
        }

        private static String toJson(TopicSummaryDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"id\":").append(toJsonString(dto.id())).append(',');
            sb.append("\"name\":").append(toJsonString(dto.name())).append(',');
            sb.append("\"type\":").append(toJsonString(dto.type())).append(',');
            sb.append("\"layer\":").append(dto.layer()).append(',');
            sb.append("\"shortDescription\":").append(toJsonNullableString(dto.shortDescription())).append(',');
            sb.append("\"tags\":").append(toJsonStringArray(dto.tags())).append(',');
            sb.append("\"links\":").append(toJsonStringArray(dto.links()));
            sb.append('}');
            return sb.toString();
        }

        private static String toJson(TopicResolutionResponseDto.TopicResolutionCandidateDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"id\":").append(toJsonString(dto.id())).append(',');
            sb.append("\"name\":").append(toJsonString(dto.name())).append(',');
            sb.append("\"type\":").append(toJsonString(dto.type())).append(',');
            sb.append("\"layer\":").append(dto.layer());
            sb.append('}');
            return sb.toString();
        }

        private static String toJson(TopicDetailDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"id\":").append(toJsonString(dto.id())).append(',');
            sb.append("\"name\":").append(toJsonString(dto.name())).append(',');
            sb.append("\"type\":").append(toJsonString(dto.type())).append(',');
            sb.append("\"layer\":").append(dto.layer()).append(',');
            sb.append("\"description\":").append(toJsonNullableString(dto.description())).append(',');
            sb.append("\"links\":").append(toJsonStringArray(dto.links())).append(',');
            sb.append("\"tags\":").append(toJsonTags(dto.tags())).append(',');
            sb.append("\"resources\":").append(toJsonResources(dto.resources())).append(',');
            sb.append("\"similarTopics\":").append(toJsonSimilarTopics(dto.similarTopics()));
            sb.append('}');
            return sb.toString();
        }

        private static String toJsonTags(List<TopicDetailDto.TopicTagDto> tags) {
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < tags.size(); i++) {
                if (i > 0) sb.append(',');
                TopicDetailDto.TopicTagDto tag = tags.get(i);
                sb.append('{')
                        .append("\"tagId\":").append(tag.tagId()).append(',')
                        .append("\"label\":").append(toJsonString(tag.label()))
                        .append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonResources(List<TopicDetailDto.TopicResourceScoreDto> resources) {
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < resources.size(); i++) {
                if (i > 0) sb.append(',');
                TopicDetailDto.TopicResourceScoreDto r = resources.get(i);
                sb.append('{');
                sb.append("\"resource\":").append(toJson(r.resource())).append(',');
                sb.append("\"score\":").append(r.score()).append(',');
                sb.append("\"matchedTags\":").append(toJsonMatchedTags(r.matchedTags()));
                sb.append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonMatchedTags(List<TopicDetailDto.TopicResourceMatchedTagDto> matchedTags) {
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < matchedTags.size(); i++) {
                if (i > 0) sb.append(',');
                TopicDetailDto.TopicResourceMatchedTagDto mt = matchedTags.get(i);
                sb.append('{')
                        .append("\"tagId\":").append(mt.tagId()).append(',')
                        .append("\"label\":").append(toJsonString(mt.label())).append(',')
                        .append("\"topicWeight\":").append(mt.topicWeight()).append(',')
                        .append("\"resourceWeight\":").append(mt.resourceWeight()).append(',')
                        .append("\"contribution\":").append(mt.contribution())
                        .append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonSimilarTopics(List<TopicDetailDto.SimilarTopicDto> similarTopics) {
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < similarTopics.size(); i++) {
                if (i > 0) sb.append(',');
                TopicDetailDto.SimilarTopicDto st = similarTopics.get(i);
                sb.append('{')
                        .append("\"id\":").append(toJsonString(st.id())).append(',')
                        .append("\"name\":").append(toJsonString(st.name())).append(',')
                        .append("\"type\":").append(toJsonString(st.type())).append(',')
                        .append("\"layer\":").append(st.layer())
                        .append('}');
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJson(org.schoolsystem.interfaces.rest.dto.ResourceSummaryDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append('{');
            sb.append("\"id\":").append(dto.id()).append(',');
            sb.append("\"title\":").append(toJsonString(dto.title())).append(',');
            sb.append("\"description\":").append(toJsonString(dto.description())).append(',');
            sb.append("\"type\":").append(toJsonString(dto.type())).append(',');
            sb.append("\"isActive\":").append(dto.isActive()).append(',');
            sb.append("\"url\":").append(toJsonString(dto.url()));
            sb.append('}');
            return sb.toString();
        }

        private static String toJsonStringArray(List<String> items) {
            if (items == null) {
                return "[]";
            }
            StringBuilder sb = new StringBuilder();
            sb.append('[');
            for (int i = 0; i < items.size(); i++) {
                if (i > 0) sb.append(',');
                sb.append(toJsonString(items.get(i)));
            }
            sb.append(']');
            return sb.toString();
        }

        private static String toJsonNullableString(String value) {
            if (value == null) {
                return "null";
            }
            return toJsonString(value);
        }

        private static String toJsonString(String value) {
            if (value == null) {
                return "null";
            }
            StringBuilder sb = new StringBuilder();
            sb.append('"');
            for (int i = 0; i < value.length(); i++) {
                char c = value.charAt(i);
                switch (c) {
                    case '"' -> sb.append("\\\"");
                    case '\\' -> sb.append("\\\\");
                    case '\b' -> sb.append("\\b");
                    case '\f' -> sb.append("\\f");
                    case '\n' -> sb.append("\\n");
                    case '\r' -> sb.append("\\r");
                    case '\t' -> sb.append("\\t");
                    default -> {
                        if (c < 0x20) {
                            sb.append(String.format("\\u%04x", (int) c));
                        } else {
                            sb.append(c);
                        }
                    }
                }
            }
            sb.append('"');
            return sb.toString();
        }
    }
}
