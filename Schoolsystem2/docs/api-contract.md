# Schoolsystem2 – HTTP API Contract (v1)

> Read-only JSON API for the HTML/CSS/JS frontend.  
> Backend is a Java 17 application with a CSV-based domain model for Topics, Tags, Resources, Sources, etc.

---

## 1. General

- **Base URL**: `/api/v1`
- **Format**: JSON only
- **Authentication**: none (anonymous use, no login in this iteration)
- **Character encoding**: UTF-8
- **Language**:
  - All texts are effectively delivered in English (`en`) for now.
  - API supports a `lang` query parameter and/or `Accept-Language` header for future extensions.
  - If a requested language is not available, English is used as fallback.
- **Versioning**:
  - URL-based versioning: `/api/v1/...`
  - Backwards-incompatible changes will use `/api/v2/...`

### 1.1 Error format

All non-2xx responses return:

```json
{
  "error": "ErrorCode",
  "message": "Human readable message",
  "status": 404,
  "path": "/api/v1/topics/ABC2",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

Common `error` values:

* `TopicNotFound`
* `ResourceNotFound`
* `BadRequest`
* `InternalError`

---

## 2. Frontend vs. API routes

### 2.1 Frontend routes (HTML)

These are the user-facing URLs the browser navigates to:

* `/start` – Start page
* `/topics` – List of all topics with user filters
* `/topics/{TopicID}` – Detail view for a specific topic; shows:

  * Topic info
  * Table of all relevant resources for this topic (5 resources per table page in the UI)
  * Resources sorted descending by score for this topic
* `/interesting` – Page for interest-based topic search

### 2.2 API endpoints (JSON)

The frontend will call the following endpoints:

* `GET /api/v1/topics`
* `GET /api/v1/topics/{topicId}`
* `GET /api/v1/tags`
* `GET /api/v1/resources/{resourceId}` (optional)
* `POST /api/v1/topics/interest-search`

---

## 3. Data models (DTOs)

Domain objects like `Topic`, `Tag`, `Resource`, `TopicTag`, `ResourceTag` etc. live in the backend domain layer and are mapped to these DTOs.

All textual fields in DTOs are already localized to a single language (currently `en`).

### 3.1 TopicSummaryDto

Used for topic lists (e.g. `/topics`, interest search results):

```json
{
  "id": "AST2",
  "name": "Astrobiology",
  "type": "Specialization",
  "layer": 2,
  "shortDescription": "Explore the intersection of astronomy and biology.",
  "tags": ["astronomy", "biology", "space"],
  "links": [
    "https://en.wikipedia.org/wiki/Astrobiology"
  ]
}
```

**Fields:**

* `id` (string) – TopicId, e.g. `AST2`, `ABC0`, `Abc1` (subject/course/achievement schema).
* `name` (string) – localized topic name.
* `type` (string) – topic type name, e.g. `"General Subject"`, `"Specialization"`.
* `layer` (integer) – non-negative layer (0, 1, 2, …).
* `shortDescription` (string, optional) – short UI description (may be derived from full description).
* `tags` (string[]) – list of tag labels (primary labels) associated with this topic.
* `links` (string[]) – URLs relevant to the topic (e.g. Wikipedia links).

---

### 3.2 TopicDetailDto

Used for `/topics/{topicId}` detail view:

```json
{
  "id": "AST2",
  "name": "Astrobiology",
  "type": "Specialization",
  "layer": 2,
  "description": "Longer description of astrobiology...",
  "links": [
    "https://en.wikipedia.org/wiki/Astrobiology"
  ],
  "tags": [
    {
      "tagId": 42,
      "label": "astronomy"
    },
    {
      "tagId": 77,
      "label": "biology"
    }
  ],
  "resources": [
    {
      "resource": {
        "id": 101,
        "title": "Astrobiology Crash Course",
        "description": "Video introduction...",
        "type": "YouTube Video",
        "isActive": true,
        "url": "https://example.com/astro-course"
      },
      "score": 73,
      "matchedTags": [
        {
          "tagId": 42,
          "label": "astronomy",
          "topicWeight": 5,
          "resourceWeight": 4,
          "contribution": 20
        }
      ]
    }
  ],
  "similarTopics": [
    {
      "id": "AST1",
      "name": "Astronomy",
      "type": "General Subject",
      "layer": 1
    }
  ]
}
```

**Fields:**

Same base fields as `TopicSummaryDto`:

* `id`, `name`, `type`, `layer`, `description`, `links`

Additional fields:

* `tags` – list of tags linked to this topic:

  * `tagId` (integer)
  * `label` (string)
* `resources` – list of resources considered relevant for this topic, each with a score:

  * `resource` – `ResourceSummaryDto` (see below)
  * `score` (integer ≥ 0) – relevance of this resource for this specific topic
  * `matchedTags` (optional, array) – explanation of how the score was built:

    * `tagId` (integer)
    * `label` (string)
    * `topicWeight` (integer 1–5) – TagWeight for this tag on the topic.
    * `resourceWeight` (integer 1–5) – TagWeight for this tag on the resource.
    * `contribution` (integer) – contribution of this tag to the total score for the resource.
* `similarTopics` (optional, array of small objects):

  * `id`, `name`, `type`, `layer` – short info about related topics (e.g. same subject family).

**Resource scoring semantics (informal):**

* Each topic has `TopicTag` entries: `(topicId, tagId, topicWeight)`.
* Each resource has `ResourceTag` entries: `(resourceId, tagId, resourceWeight)`.
* For a given topic `T` and resource `R`:

  * Consider all tags that are attached both to `T` and to `R`.
  * For each such tag, compute a tag contribution like `topicWeight * resourceWeight`.
  * `score` is the sum of all contributions for that resource.

The API guarantees:

* `score` ≥ 0
* `resources` are returned sorted descending by `score` (ties can be broken by recency, e.g. last update).

The actual scoring algorithm may evolve internally as long as these guarantees hold.

---

### 3.3 ResourceSummaryDto

Used in topic details and other lists.

For this iteration, only URL-based resources (e.g. web pages, YouTube videos) are expected. File-based resources are reserved for later versions.

```json
{
  "id": 101,
  "title": "Astrobiology Crash Course",
  "description": "Video introduction...",
  "type": "YouTube Video",
  "isActive": true,
  "url": "https://example.com/astro-course"
}
```

**Fields:**

* `id` (integer) – resource ID, corresponds to `t_resource.resourceID`.
* `title` (string) – localized title.
* `description` (string, optional) – localized short description.
* `type` (string) – resource type name, e.g. `"Web Page"`, `"YouTube Video"`.
* `isActive` (boolean) – from `t_resource.is_active`.
* `url` (string, optional) – URL to open the resource (derived from the underlying Source / RLangVersion).

---

### 3.4 TagDto

```json
{
  "id": 42,
  "label": "astronomy",
  "synonyms": ["space science", "astrophysics basics"]
}
```

**Fields:**

* `id` (integer > 0)
* `label` (string) – primary label (English).
* `synonyms` (string[]) – optional list of synonyms (English).

---

### 3.5 InterestSearchRequestDto

Request body for interest-based topic search:

```json
{
  "interestsText": "I like astronomy and physics experiments.",
  "language": "en",
  "maxResults": 100,
  "explainMatches": true
}
```

**Fields:**

* `interestsText` (string) – free-text description of the person’s interests.
* `language` (string, optional) – language code, currently `"en"`.
* `maxResults` (integer, optional) – max number of topics to return; default `100`.
* `explainMatches` (boolean, optional) – if `true`, the API includes explainability data about matched tags.

---

### 3.6 InterestSearchResponseDto

Response body for interest search:

```json
{
  "interestsText": "I like astronomy and physics experiments.",
  "usedLanguage": "en",
  "matchedTags": [
    {
      "tagId": 42,
      "label": "astronomy",
      "interestWeight": 5
    },
    {
      "tagId": 55,
      "label": "physics",
      "interestWeight": 4
    }
  ],
  "topics": [
    {
      "topic": {
        "id": "AST2",
        "name": "Astrobiology",
        "type": "Specialization",
        "layer": 2,
        "shortDescription": "Explore the intersection of astronomy and biology.",
        "tags": ["astronomy", "biology", "space"],
        "links": [
          "https://en.wikipedia.org/wiki/Astrobiology"
        ]
      },
      "score": 73,
      "matchedTags": [
        {
          "tagId": 42,
          "label": "astronomy",
          "interestWeight": 5,
          "topicWeight": 4,
          "contribution": 20
        }
      ]
    }
  ]
}
```

**Top-level fields:**

* `interestsText` (string) – echo of the input.
* `usedLanguage` (string) – resolved language (e.g. after fallback).
* `matchedTags` – list of tags found as relevant to the interests:

  * `tagId` (integer)
  * `label` (string)
  * `interestWeight` (integer 1–5) – relevance of this tag to the interests.
* `topics` – list of scored topics:

  * `topic` – `TopicSummaryDto`
  * `score` (integer ≥ 0) – relevance score of this topic for the interests.
  * `matchedTags` (optional array) – explanation per topic:

    * `tagId`, `label`
    * `interestWeight`
    * `topicWeight`
    * `contribution` – contribution of this tag to the topic’s score.

**Scoring semantics (informal):**

* Internally, an interest-processing service assigns `interestWeight` in [1..5] to some subset of all tags (based on names and synonyms).
* For each topic, overlapping tags between:

  * interestTagList (from this service) and
  * topicTagList (`ct_topic_tags`)
    are combined to compute a score.

The exact algorithm is internal and can evolve without changing the contract, as long as:

* `score` is an integer ≥ 0.
* `topics` is sorted descending by `score`.

---

## 4. Endpoints

### 4.1 `GET /api/v1/topics` – List topics

List all topics, with optional filters for the `/topics` frontend page.

**Request**

```text
GET /api/v1/topics?maxLayer=2&showCourses=true&showAchievements=false&sortBy=name&sortDirection=asc&lang=en
```

> Hinweis: Im fachlichen USE_CASES-Dokument werden die Filter als `max_layer`, `show_courses`, `show_achievements` beschrieben.
> Für die HTTP-API sind die Query-Parameter in `camelCase` (`maxLayer`, `showCourses`, `showAchievements`).

**Query parameters:**

* `maxLayer` (integer, optional, default: `2`)

  * Only topics with `layer <= maxLayer` are returned.
* `showCourses` (`true`|`false`, optional, default: `true`)

  * Whether to include course-type topics (derived from TopicId / TopicType).
* `showAchievements` (`true`|`false`, optional, default: `false`)

  * Whether to include achievement-type topics.
* `sortBy` (`name`|`layer`, optional, default: `name`)
* `sortDirection` (`asc`|`desc`, optional, default: `asc`)
* `lang` (string, optional, default: `en`)

  * Target language; falls back to English if unsupported.

**Response 200**

```json
{
  "items": [
    {
      "id": "PHY0",
      "name": "Physics",
      "type": "General Subject",
      "layer": 0,
      "shortDescription": "Basics of physics.",
      "tags": ["physics", "experiments"],
      "links": []
    },
    {
      "id": "AST2",
      "name": "Astrobiology",
      "type": "Specialization",
      "layer": 2,
      "shortDescription": "Explore the intersection of astronomy and biology.",
      "tags": ["astronomy", "biology", "space"],
      "links": [
        "https://en.wikipedia.org/wiki/Astrobiology"
      ]
    }
  ],
  "total": 812
}
```

---

### 4.2 `GET /api/v1/topics/{topicId}` – Topic details + scored resources

Used by `/topics/{TopicID}` frontend route.

**Path parameter:**

* `topicId` (string) – Topic ID as entered by the person using the system (may differ in case).

**Query parameters:**

* `lang` (string, optional, default: `en`)

The endpoint also handles ID resolution logic (exact match, ambiguous, not found) in line with the USE_CASES document.

#### 4.2.1 Exact match

If a single topic is clearly identified:

**Response 200**

```json
{
  "resolutionStatus": "EXACT",
  "topic": {
    "...": "see TopicDetailDto above"
  }
}
```

Here, `topic` is a full `TopicDetailDto` including scored `resources` and `similarTopics`.

#### 4.2.2 Ambiguous ID

If multiple topics match the given `topicId` (e.g. case-insensitive variants or related IDs):

**Response 200**

```json
{
  "resolutionStatus": "AMBIGUOUS",
  "candidates": [
    {
      "id": "ABC2",
      "name": "Astrobiology (subject)",
      "type": "General Subject",
      "layer": 2
    },
    {
      "id": "Abc2",
      "name": "Astrobiology (course)",
      "type": "Course",
      "layer": 2
    }
  ]
}
```

The frontend should then display a “Which one did you mean?” selector.

#### 4.2.3 Not found

If no topic can be resolved:

**Response 404**

```json
{
  "error": "TopicNotFound",
  "message": "No topic found for id 'xyz'",
  "status": 404,
  "path": "/api/v1/topics/xyz",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

---

### 4.3 `GET /api/v1/tags` – List tags

Useful for:

* Debugging
* Building tag-based filters in the UI
* Future UI features (autocomplete)

**Request**

```text
GET /api/v1/tags
```

**Response 200**

```json
{
  "items": [
    {
      "id": 42,
      "label": "astronomy",
      "synonyms": ["space science", "astrophysics basics"]
    },
    {
      "id": 55,
      "label": "physics",
      "synonyms": ["mechanics", "experiments"]
    }
  ],
  "total": 123
}
```

Tags come from `t_tag.csv` and are modeled as `Tag` in the domain.

---

### 4.4 `GET /api/v1/resources/{resourceId}` – Resource details (optional)

This endpoint is optional for the current scope, because `/topics/{topicId}` already returns resource URLs and basic information. It can be used for:

* Direct deep links to resources
* More detailed metadata views

**Path parameter:**

* `resourceId` (integer)

**Query parameters:**

* `lang` (string, optional, default: `en`)

**Response 200**

```json
{
  "id": 101,
  "title": "Astrobiology Crash Course",
  "description": "Video introduction...",
  "type": "YouTube Video",
  "isActive": true,
  "url": "https://example.com/astro-course"
}
```

If the resource is not found:

**Response 404**

```json
{
  "error": "ResourceNotFound",
  "message": "No resource found for id '9999'",
  "status": 404,
  "path": "/api/v1/resources/9999",
  "timestamp": "2025-01-01T12:00:00Z"
}
```

---

### 4.5 `POST /api/v1/topics/interest-search` – Interest-based topic search

Backs the `/interesting` frontend page.

The endpoint encapsulates all KI calls and scoring logic; the frontend only deals with:

* text in,
* scored topics out.

**Request**

```text
POST /api/v1/topics/interest-search
```

Body: `InterestSearchRequestDto`, see section 3.5.

**Behavior (high level):**

1. Backend calls an internal service that:

   * Sends `interestsText` and all registered tags (with synonyms) to a KI endpoint (or a stub/service that mimics it).
   * Receives a ranked list of tag IDs with relevance.
   * Assigns discrete `interestWeight` values (1–5).
2. Using `TopicTag` data per topic, a score is computed for each topic using overlapping tags and their weights.
3. Topics are sorted descending by `score`.

**Response 200**

Body: `InterestSearchResponseDto`, see section 3.6.

**Notes for frontend:**

* Display topics in the order returned (already sorted).
* Use `score` to show relative relevance (e.g. in a “Score” column or as bars).
* Optionally display `matchedTags` per topic for explainability (“Why am I seeing this topic?”).

---

## 5. Non-goals (this iteration)

Explicitly out of scope for this API version (v1):

* User accounts, authentication, authorization.
* Tracking of resource interactions (`ct_rinteraction`, `t_inter_type`).
* Mutating endpoints (no POST/PUT/PATCH/DELETE for topics, tags, resources).
* Resource-to-Level-specific assignment logic in the API.
* Multi-language content beyond `en` (internal model supports it, but v1 API serves English only).

---

## 6. Summary for frontend implementation

* Use `/topics` (HTML) to show the topic list:

  * `GET /api/v1/topics`
* Use `/topics/{TopicID}` (HTML) to show detailed info and a table of resources:

  * `GET /api/v1/topics/{topicId}`
  * Resources come pre-scored and sorted for that topic.
  * Frontend paginates resources (5 per page).
* Use `/interesting` (HTML) for interest-based exploration:

  * `POST /api/v1/topics/interest-search` with free text.
  * Render returned topics, sort as given, show scores and optionally explanations.
* Tags and resources can be further inspected via:

  * `GET /api/v1/tags`
  * `GET /api/v1/resources/{resourceId}` (optional convenience).

This contract should be stable enough for the HTML/CSS/JS frontend to be developed independently of internal changes in the CSV/domain/KI implementation.
