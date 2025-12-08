package org.schoolsystem.devserver;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import org.schoolsystem.application.tag.TagQueryService;
import org.schoolsystem.application.tag.TagQueryServiceImpl;
import org.schoolsystem.domain.ports.TagRepository;
import org.schoolsystem.infrastructure.csv.CsvBootstrapResult;
import org.schoolsystem.infrastructure.csv.CsvDataBootstrapper;
import org.schoolsystem.infrastructure.persistence.InMemoryTagRepository;
import org.schoolsystem.interfaces.rest.dto.TagDto;
import org.schoolsystem.interfaces.rest.dto.TagListResponseDto;
import org.schoolsystem.interfaces.rest.mapper.TagDtoMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Einfacher Dev-Server:
 *  - bootstrapped CSV-Daten
 *  - verdrahtet In-Memory-Repositories + TagQueryService
 *  - startet einen minimalen HTTP-Server auf Port 8080
 *
 * Endpoints:
 *  - GET /health          -> 200 OK, Text "OK"
 *  - GET /api/v1/tags     -> 200 OK, JSON TagListResponseDto
 */
public final class DevServer {

    private DevServer() {
        // no instances
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Starting SchoolSystem DevServer ...");

        // 1) CSV-Daten laden
        CsvBootstrapResult bootstrapResult = new CsvDataBootstrapper().loadAll();
        System.out.printf(
                "Bootstrap completed: %d tags, %d topics, %d resources%n",
                bootstrapResult.tags().size(),
                bootstrapResult.topics().size(),
                bootstrapResult.resources().size()
        );

        // 2) Repositories aufbauen
        TagRepository tagRepository = new InMemoryTagRepository(bootstrapResult.tags());

        // 3) Application-Services
        TagQueryService tagQueryService = new TagQueryServiceImpl(tagRepository);

        // 4) HTTP-Server starten
        int port = 8080;
        HttpServer httpServer = HttpServer.create(new InetSocketAddress(port), 0);

        // Health-Endpoint
        httpServer.createContext("/health", exchange -> {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }
            sendText(exchange, 200, "OK");
        });

        // Tags-Endpoint: GET /api/v1/tags
        httpServer.createContext("/api/v1/tags", exchange -> {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendMethodNotAllowed(exchange);
                return;
            }

            try {
                TagQueryService.TagListResult result = tagQueryService.listTags();
                List<TagDto> tagDtos = result.items().stream()
                        .map(TagDtoMapper::toDto)
                        .collect(Collectors.toList());

                TagListResponseDto responseDto = new TagListResponseDto(tagDtos, tagDtos.size());

                String json = JsonWriter.toJson(responseDto);
                sendJson(exchange, 200, json);
            } catch (Exception ex) {
                ex.printStackTrace();
                String json = "{\"error\":\"Internal server error\"}";
                sendJson(exchange, 500, json);
            }
        });

        // CORS + KeepAlive
        httpServer.setExecutor(null); // Default-Executor

        httpServer.start();
        System.out.printf("DevServer started on http://localhost:%d 🚀%n", port);
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

    private static void addCorsHeaders(Headers headers) {
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
    }

    /**
     * Minimaler JSON-Writer für TagListResponseDto / TagDto.
     * Keine generische Lösung, sondern bewusst schmal für den Dev-Server.
     */
    private static final class JsonWriter {

        private JsonWriter() {
        }

        public static String toJson(TagListResponseDto dto) {
            StringBuilder sb = new StringBuilder();
            sb.append("{\"items\":[");
            List<TagDto> items = dto.items();
            for (int i = 0; i < items.size(); i++) {
                if (i > 0) {
                    sb.append(',');
                }
                sb.append(toJson(items.get(i)));
            }
            sb.append("],\"total\":").append(dto.total()).append('}');
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
                if (i > 0) {
                    sb.append(',');
                }
                sb.append(toJsonString(synonyms.get(i)));
            }
            sb.append("]}");
            return sb.toString();
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
                    case '"':
                        sb.append("\\\"");
                        break;
                    case '\\':
                        sb.append("\\\\");
                        break;
                    case '\b':
                        sb.append("\\b");
                        break;
                    case '\f':
                        sb.append("\\f");
                        break;
                    case '\n':
                        sb.append("\\n");
                        break;
                    case '\r':
                        sb.append("\\r");
                        break;
                    case '\t':
                        sb.append("\\t");
                        break;
                    default:
                        if (c < 0x20) {
                            sb.append(String.format("\\u%04x", (int) c));
                        } else {
                            sb.append(c);
                        }
                }
            }
            sb.append('"');
            return sb.toString();
        }
    }
}
