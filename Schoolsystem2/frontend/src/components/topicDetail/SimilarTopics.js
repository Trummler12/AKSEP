/**
 * Renders a list of similar topics with internal links.
 * @param {{ similarTopics?: { id: string, name: string, type: string, layer: number }[] | null }} config
 */
export function createSimilarTopics({ similarTopics }) {
  const items = Array.isArray(similarTopics) ? similarTopics : [];
  if (items.length === 0) {
    return null;
  }

  const root = document.createElement('section');
  root.className = 'topic-similar';

  const heading = document.createElement('h3');
  heading.className = 'topic-section__heading';
  heading.textContent = 'Similar topics';

  const list = document.createElement('ul');
  list.className = 'topic-similar__list';

  items.forEach((t) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `/topics/${encodeURIComponent(t.id)}`;
    a.setAttribute('data-link', 'true');
    a.textContent = `${t.name} (${t.id})`;

    const meta = document.createElement('span');
    meta.className = 'text-muted';
    meta.textContent = ` — ${t.type}, layer ${t.layer}`;

    li.appendChild(a);
    li.appendChild(meta);
    list.appendChild(li);
  });

  root.appendChild(heading);
  root.appendChild(list);
  return root;
}

