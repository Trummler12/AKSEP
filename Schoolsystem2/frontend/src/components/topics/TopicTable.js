import { createTagChip } from './TagChip.js';

/**
 * Tabelle für Topics (25 Einträge pro Seite).
 *
 * @param {{
 *   topics: any[],
 *   page: number,                  // 0-based
 *   pageSize?: number,
 *   selectedTag?: string | null,
 *   onTagToggle?: (tag: string) => void
 * }} config
 */
export function createTopicTable({
  topics,
  page,
  pageSize = 25,
  selectedTag = null,
  onTagToggle
}) {
  const wrapper = document.createElement('section');
  wrapper.className = 'topics-table';

  if (!topics || topics.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'topics-table__empty';
    empty.textContent = 'No topics match your current filters.';
    wrapper.appendChild(empty);
    return wrapper;
  }

  const table = document.createElement('table');
  table.className = 'topics-table__table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');

  const headers = ['Topic', 'ID', 'Type', 'Layer', 'Description', 'Tags'];

  headers.forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  const startIndex = page * pageSize;
  const endIndex = Math.min(topics.length, (page + 1) * pageSize);
  const pageItems = topics.slice(startIndex, endIndex);

  pageItems.forEach((topic) => {
    const tr = document.createElement('tr');

    // Name (mit Link)
    const nameTd = document.createElement('td');
    const nameLink = document.createElement('a');
    nameLink.href = `/topics/${encodeURIComponent(topic.id)}`;
    nameLink.setAttribute('data-link', 'true');
    nameLink.textContent = topic.name || topic.id;
    nameTd.appendChild(nameLink);
    tr.appendChild(nameTd);

    // ID
    const idTd = document.createElement('td');
    idTd.textContent = topic.id;
    tr.appendChild(idTd);

    // Type
    const typeTd = document.createElement('td');
    typeTd.textContent = topic.type || '';
    tr.appendChild(typeTd);

    // Layer
    const layerTd = document.createElement('td');
    layerTd.textContent = String(topic.layer ?? '');
    tr.appendChild(layerTd);

    // Short description
    const descTd = document.createElement('td');
    descTd.textContent = topic.shortDescription || '';
    tr.appendChild(descTd);

    // Tags
    const tagsTd = document.createElement('td');
    tagsTd.className = 'topics-table__tags';

    if (Array.isArray(topic.tags) && topic.tags.length > 0) {
      topic.tags.forEach((tagLabel) => {
        const isActive =
          selectedTag &&
          tagLabel &&
          tagLabel.toLowerCase() === selectedTag.toLowerCase();

        const chip = createTagChip({
          label: tagLabel,
          active: !!isActive,
          onToggle: () => {
            if (typeof onTagToggle === 'function') {
              onTagToggle(tagLabel);
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
  wrapper.appendChild(table);

  return wrapper;
}
