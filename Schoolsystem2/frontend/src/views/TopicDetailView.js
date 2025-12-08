import { fetchTopicById } from '../services/topicsService.js';

/**
 * /topics/:topicId — Detailansicht eines Topics.
 * Lädt die Daten vom Backend und zeigt eine einfache Ansicht (Name, Type, Layer, Tags).
 */
export function createTopicDetailView(context) {
  const { topicId } = context.params;

  const container = document.createElement('div');
  container.className = 'view view--topic-detail';

  const heading = document.createElement('h1');
  heading.textContent = `Topic details: ${topicId}`;

  const status = document.createElement('p');
  status.textContent = 'Loading topic data...';
  container.appendChild(heading);
  container.appendChild(status);

  loadTopic(topicId, container, status);

  return container;
}

async function loadTopic(topicId, container, statusEl) {
  try {
    const response = await fetchTopicById(topicId);
    if (response.resolutionStatus === 'AMBIGUOUS') {
      statusEl.textContent = 'Multiple topics matched this ID:';
      const list = document.createElement('ul');
      response.candidates.forEach((cand) => {
        const li = document.createElement('li');
        li.textContent = `${cand.id} — ${cand.name} (${cand.type}, layer ${cand.layer})`;
        list.appendChild(li);
      });
      container.appendChild(list);
      return;
    }

    if (!response.topic) {
      statusEl.textContent = 'No topic found.';
      return;
    }

    renderTopic(response.topic, container, statusEl);
  } catch (error) {
    statusEl.textContent = `Error loading topic: ${error.message || 'Unknown error'}`;
  }
}

function renderTopic(topic, container, statusEl) {
  statusEl.textContent = '';

  const meta = document.createElement('p');
  meta.textContent = `${topic.name} — ${topic.type} (Layer ${topic.layer})`;

  const description = document.createElement('p');
  description.textContent = topic.description || 'No description available.';

  const tagsHeading = document.createElement('h3');
  tagsHeading.textContent = 'Tags';
  const tagsList = document.createElement('ul');
  if (Array.isArray(topic.tags) && topic.tags.length > 0) {
    topic.tags.forEach((tag) => {
      const li = document.createElement('li');
      li.textContent = tag.label;
      tagsList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No tags';
    tagsList.appendChild(li);
  }

  const linksHeading = document.createElement('h3');
  linksHeading.textContent = 'Links';
  const linksList = document.createElement('ul');
  if (Array.isArray(topic.links) && topic.links.length > 0) {
    topic.links.forEach((link) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link;
      anchor.textContent = link;
      anchor.target = '_blank';
      anchor.rel = 'noreferrer';
      li.appendChild(anchor);
      linksList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No links available';
    linksList.appendChild(li);
  }

  container.appendChild(meta);
  container.appendChild(description);
  container.appendChild(tagsHeading);
  container.appendChild(tagsList);
  container.appendChild(linksHeading);
  container.appendChild(linksList);
}
