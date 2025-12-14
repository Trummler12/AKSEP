import { createTagChip } from '../topics/TagChip.js';

/**
 * Renders the main header section for a topic detail page.
 * @param {{
 *   topic: {
 *     id: string,
 *     name: string,
 *     type: string,
 *     layer: number,
 *     description?: string | null,
 *     links?: string[] | null,
 *     tags?: { tagId: number, label: string }[] | null
 *   },
 *   onTagClick?: (tagLabel: string) => void
 * }} config
 */
export function createTopicHeader({ topic, onTagClick }) {
  const root = document.createElement('section');
  root.className = 'topic-header';

  const titleRow = document.createElement('div');
  titleRow.className = 'topic-header__title-row';

  const h1 = document.createElement('h1');
  h1.className = 'topic-header__title';
  h1.textContent = topic?.name || topic?.id || 'Topic';

  const meta = document.createElement('div');
  meta.className = 'topic-header__meta';
  meta.textContent = `${topic?.type || 'Unknown type'} • Layer ${topic?.layer ?? '?'} • ${topic?.id || ''}`;

  titleRow.appendChild(h1);
  titleRow.appendChild(meta);

  const description = document.createElement('p');
  description.className = 'topic-header__description';
  description.textContent = topic?.description || 'No description available.';

  root.appendChild(titleRow);
  root.appendChild(description);

  // Links
  const links = Array.isArray(topic?.links) ? topic.links.filter(Boolean) : [];
  if (links.length > 0) {
    const linksHeading = document.createElement('h3');
    linksHeading.className = 'topic-section__heading';
    linksHeading.textContent = 'Links';

    const linksList = document.createElement('ul');
    linksList.className = 'topic-links';
    links.forEach((link) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = link;
      li.appendChild(a);
      linksList.appendChild(li);
    });

    root.appendChild(linksHeading);
    root.appendChild(linksList);
  }

  // Tags
  const tags = Array.isArray(topic?.tags) ? topic.tags : [];
  if (tags.length > 0) {
    const tagsHeading = document.createElement('h3');
    tagsHeading.className = 'topic-section__heading';
    tagsHeading.textContent = 'Tags';

    const chips = document.createElement('div');
    chips.className = 'topic-tags';

    tags.forEach((tag) => {
      const chip = createTagChip({
        label: tag.label,
        active: false,
        onToggle: () => {
          if (typeof onTagClick === 'function') {
            onTagClick(tag.label);
          }
        }
      });
      chips.appendChild(chip);
    });

    root.appendChild(tagsHeading);
    root.appendChild(chips);
  }

  return root;
}

