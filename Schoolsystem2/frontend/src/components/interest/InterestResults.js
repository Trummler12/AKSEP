import { createTagChip } from '../topics/TagChip.js';

function normalizeTagLabel(label) {
  return (label || '').trim();
}

function selectedLowerSet(selectedTags) {
  return new Set(
    (Array.isArray(selectedTags) ? selectedTags : [])
      .map((t) => normalizeTagLabel(t).toLowerCase())
      .filter(Boolean)
  );
}

function renderMatchedTags(tags, selectedTags, onTagToggle) {
  const items = Array.isArray(tags) ? tags : [];
  const selectedLower = selectedLowerSet(selectedTags);

  const root = document.createElement('div');
  root.className = 'interest-results__matched-tags';

  const heading = document.createElement('h3');
  heading.className = 'topic-section__heading';
  heading.textContent = 'Matched tags';
  root.appendChild(heading);

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-muted';
    empty.textContent = 'No tags matched your interests.';
    root.appendChild(empty);
    return root;
  }

  const chips = document.createElement('div');
  chips.className = 'topics-table__tags';

  items.forEach((t) => {
    const label = normalizeTagLabel(t?.label);
    if (!label) return;

    const isActive = selectedLower.has(label.toLowerCase());
    const chip = createTagChip({
      label,
      active: !!isActive,
      onToggle: () => {
        if (typeof onTagToggle === 'function') {
          onTagToggle(label);
        }
      }
    });
    const w = t?.interestWeight;
    if (typeof w === 'number') {
      chip.title = `weight ${w}`;
    }
    chips.appendChild(chip);
  });

  root.appendChild(chips);
  return root;
}

/**
 * Results table for interest search.
 * @param {{
 *   response: {
 *     interestsText: string,
 *     usedLanguage: string,
 *     matchedTags: any[],
 *     topics: { topic: any, score: number, matchedTags?: any[] }[]
 *   },
 *   selectedTags?: string[],
 *   onTagToggle?: (tagLabel: string) => void,
 *   onClearTags?: () => void
 * }} config
 */
export function createInterestResults({ response, selectedTags = [], onTagToggle, onClearTags }) {
  const root = document.createElement('section');
  root.className = 'interest-results';

  const topics = Array.isArray(response?.topics) ? response.topics : [];
  const selectedLower = selectedLowerSet(selectedTags);

  const filteredTopics =
    selectedLower.size === 0
      ? topics
      : topics.filter((row) => {
          const topic = row?.topic || {};
          if (!Array.isArray(topic.tags) || topic.tags.length === 0) return false;
          const topicTags = new Set(topic.tags.map((tag) => normalizeTagLabel(tag).toLowerCase()));
          for (const sel of selectedLower.values()) {
            if (!topicTags.has(sel)) return false;
          }
          return true;
        });

  root.appendChild(renderMatchedTags(response?.matchedTags, selectedTags, onTagToggle));

  const heading = document.createElement('h2');
  heading.className = 'interest-results__heading';
  heading.textContent = 'Topics';
  root.appendChild(heading);

  if (selectedLower.size > 0) {
    const filters = document.createElement('div');
    filters.className = 'interest-results__filters text-muted';

    const countText = `${filteredTopics.length}/${topics.length}`;
    filters.textContent = `Filtered by ${selectedTags.length} tag(s) — showing ${countText} topics.`;

    if (typeof onClearTags === 'function') {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'button button--secondary interest-results__clear';
      clearBtn.textContent = 'Clear filters';
      clearBtn.addEventListener('click', () => onClearTags());
      filters.appendChild(document.createTextNode(' '));
      filters.appendChild(clearBtn);
    }

    root.appendChild(filters);
  }

  if (filteredTopics.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-muted';
    empty.textContent =
      topics.length === 0
        ? 'No matching topics found.'
        : 'No topics match your current tag filters.';
    root.appendChild(empty);
    return root;
  }

  const table = document.createElement('table');
  table.className = 'topics-table__table';

  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  ['Topic', 'Score', 'Type', 'Layer', 'Tags'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  filteredTopics.forEach((row) => {
    const topic = row.topic || {};

    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    const a = document.createElement('a');
    a.href = `/topics/${encodeURIComponent(topic.id)}`;
    a.setAttribute('data-link', 'true');
    a.textContent = topic.name || topic.id;
    nameTd.appendChild(a);
    tr.appendChild(nameTd);

    const scoreTd = document.createElement('td');
    scoreTd.textContent = String(row.score ?? 0);
    tr.appendChild(scoreTd);

    const typeTd = document.createElement('td');
    typeTd.textContent = topic.type || '';
    tr.appendChild(typeTd);

    const layerTd = document.createElement('td');
    layerTd.textContent = String(topic.layer ?? '');
    tr.appendChild(layerTd);

    const tagsTd = document.createElement('td');
    tagsTd.className = 'topics-table__tags';

    if (Array.isArray(topic.tags) && topic.tags.length > 0) {
      topic.tags.forEach((tagLabel) => {
        const label = normalizeTagLabel(tagLabel);
        if (!label) return;

        const isActive = selectedLower.has(label.toLowerCase());
        const chip = createTagChip({
          label,
          active: !!isActive,
          onToggle: () => {
            if (typeof onTagToggle === 'function') {
              onTagToggle(label);
            }
          }
        });
        tagsTd.appendChild(chip);
      });
    } else {
      const span = document.createElement('span');
      span.className = 'text-muted';
      span.textContent = '—';
      tagsTd.appendChild(span);
    }
    tr.appendChild(tagsTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  root.appendChild(table);
  return root;
}
