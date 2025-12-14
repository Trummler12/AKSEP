import { fetchTopicsList } from '../services/topicsService.js';
import { ApiError } from '../services/apiClient.js';
import { createTopicFilters } from '../components/topics/TopicFilters.js';
import { createTopicTable } from '../components/topics/TopicTable.js';
import { createPagination } from '../components/topics/Pagination.js';
import { navigateTo } from '../router/index.js';

/**
 * /topics — Übersicht mit Filtern & Tabelle
 * @param {{ path: string, params: object, query: URLSearchParams }} context
 */
export function createTopicsListView(context) {
  const container = document.createElement('div');
  container.className = 'view view--topics-list';

  const heading = document.createElement('h1');
  heading.textContent = 'Topics';

  const intro = document.createElement('p');
  intro.textContent =
    'Browse all available topics, adjust filters and click any topic to see detailed resources.';

  const statusBar = document.createElement('div');
  statusBar.className = 'topics-status';

  const errorBox = document.createElement('div');
  errorBox.className = 'alert alert--error';
  errorBox.style.display = 'none';

  const filtersHost = document.createElement('div');
  filtersHost.className = 'topics-filters__host';

  const tableHost = document.createElement('div');
  tableHost.className = 'topics-table__host';

  const paginationHost = document.createElement('div');
  paginationHost.className = 'topics-pagination__host';

  container.appendChild(heading);
  container.appendChild(intro);
  container.appendChild(errorBox);
  container.appendChild(statusBar);
  container.appendChild(filtersHost);
  container.appendChild(tableHost);
  container.appendChild(paginationHost);

  // --- State ---

  const state = {
    loading: false,
    error: null,
    topicsFromBackend: [],
    totalBackend: 0,
    // Filter, die ans Backend gehen:
    maxLayer: 2,
    showCourses: true,
    showAchievements: false,
    sortBy: 'name',
    sortDirection: 'asc',
    // Clientseitige Filter:
    searchText: '',
    selectedTags: [],
    // Pagination:
    page: 0,
    pageSize: 25,
    // Lucky-Flag:
    luckyHandled: false
  };

  // Filter-Komponente
  const filtersEl = createTopicFilters(
    {
      maxLayer: state.maxLayer,
      showCourses: state.showCourses,
      showAchievements: state.showAchievements,
      sortBy: state.sortBy,
      sortDirection: state.sortDirection,
      searchText: state.searchText
    },
    {
      onChange: (filters) => {
        const backendRelevantChanged =
          state.maxLayer !== filters.maxLayer ||
          state.showCourses !== filters.showCourses ||
          state.showAchievements !== filters.showAchievements ||
          state.sortBy !== filters.sortBy ||
          state.sortDirection !== filters.sortDirection;

        state.maxLayer = filters.maxLayer;
        state.showCourses = filters.showCourses;
        state.showAchievements = filters.showAchievements;
        state.sortBy = filters.sortBy;
        state.sortDirection = filters.sortDirection;
        state.searchText = filters.searchText ?? '';

        // Bei jeder Filteränderung auf Seite 0 springen
        state.page = 0;

        if (backendRelevantChanged) {
          loadTopics(); // neue Anfrage ans Backend
        } else {
          renderTableAndPagination();
        }
      }
    }
  );

  filtersHost.appendChild(filtersEl);

  // Initial: laden
  loadTopics();

  return container;

  // --- Helper-Funktionen ---

  async function loadTopics() {
    state.loading = true;
    state.error = null;
    updateStatus();
    renderError();

    try {
      const response = await fetchTopicsList({
        maxLayer: state.maxLayer,
        showCourses: state.showCourses,
        showAchievements: state.showAchievements,
        sortBy: state.sortBy,
        sortDirection: state.sortDirection
      });

      state.topicsFromBackend = Array.isArray(response.items) ? response.items : [];
      state.totalBackend =
        typeof response.total === 'number' ? response.total : state.topicsFromBackend.length;

      state.loading = false;
      updateStatus();
      renderTableAndPagination();

      // Lucky-Mode: einmalig nach dem ersten erfolgreichen Load
      const lucky = context.query && context.query.get('lucky');
      if (lucky === '1' && !state.luckyHandled) {
        state.luckyHandled = true;
        triggerFeelingLucky();
      }
    } catch (err) {
      state.loading = false;
      let message = 'Unexpected error while loading topics.';

      if (err instanceof ApiError) {
        if (err.status === null) {
          message =
            'Backend not reachable. Please ensure the server is running and try again.';
        } else {
          message = err.message || message;
        }
      } else if (err && err.message) {
        message = err.message;
      }

      state.error = message;
      state.topicsFromBackend = [];
      state.totalBackend = 0;

      updateStatus();
      renderError();
      renderTableAndPagination();
    }
  }

  function updateStatus() {
    if (state.loading) {
      statusBar.textContent = 'Loading topics…';
      return;
    }

    const total = state.topicsFromBackend.length;
    if (!total) {
      statusBar.textContent = 'No topics available for the current backend filters.';
      return;
    }

    const filteredCount = getFilteredTopics().length;

    if (filteredCount === total) {
      statusBar.textContent = `Showing all ${filteredCount} topics.`;
    } else {
      statusBar.textContent = `Showing ${filteredCount} of ${total} topics (after search/tag filters).`;
    }
  }

  function renderError() {
    if (!state.error) {
      errorBox.style.display = 'none';
      errorBox.textContent = '';
      return;
    }

    errorBox.style.display = 'block';
    errorBox.textContent = state.error;
  }

  function getFilteredTopics() {
    let list = state.topicsFromBackend;

    const search = state.searchText.trim().toLowerCase();
    if (search) {
      list = list.filter((t) => {
        const id = (t.id || '').toLowerCase();
        const name = (t.name || '').toLowerCase();
        const type = (t.type || '').toLowerCase();
        const desc = (t.shortDescription || '').toLowerCase();
        const tags = Array.isArray(t.tags) ? t.tags.join(' ').toLowerCase() : '';
        return (
          id.includes(search) ||
          name.includes(search) ||
          type.includes(search) ||
          desc.includes(search) ||
          tags.includes(search)
        );
      });
    }

    if (Array.isArray(state.selectedTags) && state.selectedTags.length > 0) {
      const selected = state.selectedTags
        .map((t) => (t || '').trim().toLowerCase())
        .filter(Boolean);

      if (selected.length > 0) {
        list = list.filter((t) => {
          if (!Array.isArray(t.tags) || t.tags.length === 0) return false;
          const topicTags = new Set(t.tags.map((tag) => (tag || '').toLowerCase()));
          return selected.every((sel) => topicTags.has(sel));
        });
      }
    }

    return list;
  }

  function renderTableAndPagination() {
    const topics = getFilteredTopics();

    // page innerhalb der Grenzen halten
    const totalPages = Math.max(1, Math.ceil(topics.length / state.pageSize));
    if (state.page >= totalPages) {
      state.page = totalPages - 1;
    }
    if (state.page < 0) state.page = 0;

    // Tabelle
    tableHost.innerHTML = '';
    const tableEl = createTopicTable({
      topics,
      page: state.page,
      pageSize: state.pageSize,
      selectedTags: state.selectedTags,
      onTagToggle: (tagLabel) => {
        const normalized = (tagLabel || '').trim();
        if (!normalized) return;

        const lower = normalized.toLowerCase();
        const next = Array.isArray(state.selectedTags) ? [...state.selectedTags] : [];
        const idx = next.findIndex((t) => (t || '').toLowerCase() === lower);
        if (idx >= 0) {
          next.splice(idx, 1);
        } else {
          next.push(normalized);
        }
        state.selectedTags = next;
        state.page = 0;
        updateStatus();
        renderTableAndPagination();
      }
    });
    tableHost.appendChild(tableEl);

    // Pagination
    paginationHost.innerHTML = '';
    const paginationEl = createPagination({
      page: state.page,
      pageSize: state.pageSize,
      totalItems: topics.length,
      onChange: (nextPage) => {
        state.page = nextPage;
        renderTableAndPagination();
      }
    });
    paginationHost.appendChild(paginationEl);

    updateStatus();
  }

  function triggerFeelingLucky() {
    const topics = getFilteredTopics();
    if (!topics.length) {
      // wenn wir keine Topics haben, macht lucky keinen Sinn
      return;
    }

    const idx = Math.floor(Math.random() * topics.length);
    const chosen = topics[idx];
    if (!chosen || !chosen.id) return;

    navigateTo(`/topics/${encodeURIComponent(chosen.id)}`);
  }
}
