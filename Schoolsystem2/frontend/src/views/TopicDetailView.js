import { fetchTopicById } from '../services/topicsService.js';
import { navigateTo } from '../router/index.js';
import { createTopicHeader } from '../components/topicDetail/TopicHeader.js';
import { createResourceGrid } from '../components/topicDetail/ResourceGrid.js';
import { createSimilarTopics } from '../components/topicDetail/SimilarTopics.js';

/**
 * /topics/:topicId – Topic detail view.
 * Loads the topic from the backend and renders metadata + resources.
 * @param {{ path: string, params: { topicId: string }, query: URLSearchParams }} context
 */
export function createTopicDetailView(context) {
  const { topicId } = context.params;

  const container = document.createElement('div');
  container.className = 'view view--topic-detail';

  const status = document.createElement('div');
  status.className = 'topic-detail__status text-muted';
  status.textContent = 'Loading topic data...';
  container.appendChild(status);

  loadTopic(topicId, container, status);
  return container;
}

async function loadTopic(topicId, container, statusEl) {
  try {
    const response = await fetchTopicById(topicId);

    if (response.resolutionStatus === 'AMBIGUOUS') {
      renderAmbiguous(response, container, statusEl, topicId);
      return;
    }

    if (!response.topic) {
      renderNotFound(container, statusEl, topicId);
      return;
    }

    renderTopic(response.topic, container, statusEl);
  } catch (error) {
    statusEl.textContent = '';
    const alert = document.createElement('div');
    alert.className = 'alert alert--error';
    alert.textContent = `Error loading topic: ${error.message || 'Unknown error'}`;
    container.appendChild(alert);
  }
}

function renderTopic(topic, container, statusEl) {
  statusEl.textContent = '';
  container.innerHTML = '';

  const header = createTopicHeader({ topic });
  container.appendChild(header);

  const resourcesState = { page: 0, pageSize: 5 };
  const resourcesHost = document.createElement('div');
  container.appendChild(resourcesHost);

  const similarEl = createSimilarTopics({ similarTopics: topic.similarTopics });
  if (similarEl) {
    container.appendChild(similarEl);
  }

  renderResources();

  function renderResources() {
    resourcesHost.innerHTML = '';
    resourcesHost.appendChild(
      createResourceGrid({
        resources: topic.resources,
        page: resourcesState.page,
        pageSize: resourcesState.pageSize,
        onPageChange: (nextPage) => {
          resourcesState.page = nextPage;
          renderResources();
        }
      })
    );
  }
}

function renderAmbiguous(response, container, statusEl, rawTopicId) {
  statusEl.textContent = '';
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = `Which topic did you mean for "${rawTopicId}"?`;

  const intro = document.createElement('p');
  intro.className = 'text-muted';
  intro.textContent = 'Multiple topics matched this ID. Please select one:';

  const list = document.createElement('ul');
  list.className = 'topic-ambiguous__list';

  (response.candidates || []).forEach((cand) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/topics/${encodeURIComponent(cand.id)}`;
    link.setAttribute('data-link', 'true');
    link.textContent = `${cand.name} (${cand.id})`;
    li.appendChild(link);

    const meta = document.createElement('span');
    meta.className = 'text-muted';
    meta.textContent = ` — ${cand.type}, layer ${cand.layer}`;
    li.appendChild(meta);

    list.appendChild(li);
  });

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'button button--secondary';
  back.textContent = 'Back to topics';
  back.addEventListener('click', () => navigateTo('/topics'));

  container.appendChild(heading);
  container.appendChild(intro);
  container.appendChild(list);
  container.appendChild(back);
}

function renderNotFound(container, statusEl, topicId) {
  statusEl.textContent = '';
  container.innerHTML = '';

  const heading = document.createElement('h1');
  heading.textContent = 'Topic not found';

  const info = document.createElement('p');
  info.className = 'text-muted';
  info.textContent = `No topic exists for id "${topicId}".`;

  const actions = document.createElement('div');
  actions.className = 'view-not-found__actions';

  const browse = document.createElement('button');
  browse.type = 'button';
  browse.className = 'button button--primary';
  browse.textContent = 'Browse topics';
  browse.addEventListener('click', () => navigateTo('/topics'));

  actions.appendChild(browse);

  container.appendChild(heading);
  container.appendChild(info);
  container.appendChild(actions);
}

