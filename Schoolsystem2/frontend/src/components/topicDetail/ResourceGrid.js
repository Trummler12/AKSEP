import { createResourceCard } from './ResourceCard.js';

/**
 * Grid of scored resources with simple paging (client-side).
 * @param {{
 *   resources: any[],
 *   page: number,
 *   pageSize: number,
 *   onPageChange?: (nextPage: number) => void
 * }} config
 */
export function createResourceGrid({ resources, page, pageSize, onPageChange }) {
  const root = document.createElement('section');
  root.className = 'resource-grid';

  const items = Array.isArray(resources) ? resources : [];

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'resource-grid__empty text-muted';
    empty.textContent = 'No resources available for this topic yet.';
    root.appendChild(empty);
    return root;
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);

  const header = document.createElement('div');
  header.className = 'resource-grid__header';

  const heading = document.createElement('h2');
  heading.className = 'resource-grid__title';
  heading.textContent = 'Resources';

  const info = document.createElement('div');
  info.className = 'resource-grid__info text-muted';
  info.textContent = `Showing ${items.length} resources • page ${safePage + 1}/${totalPages}`;

  header.appendChild(heading);
  header.appendChild(info);
  root.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'resource-grid__items';

  const startIndex = safePage * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);
  pageItems.forEach((entry) => {
    grid.appendChild(createResourceCard({ entry }));
  });
  root.appendChild(grid);

  if (totalPages > 1) {
    const pager = document.createElement('div');
    pager.className = 'resource-grid__pager';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'button button--secondary pagination__btn';
    prev.textContent = 'Prev';
    prev.disabled = safePage === 0;
    prev.addEventListener('click', () => {
      if (typeof onPageChange === 'function') onPageChange(safePage - 1);
    });

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'button button--secondary pagination__btn';
    next.textContent = 'Next';
    next.disabled = safePage >= totalPages - 1;
    next.addEventListener('click', () => {
      if (typeof onPageChange === 'function') onPageChange(safePage + 1);
    });

    pager.appendChild(prev);
    pager.appendChild(next);
    root.appendChild(pager);
  }

  return root;
}

