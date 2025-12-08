/**
 * Generische Pagination.
 * @param {{
 *   page: number,           // 0-based
 *   pageSize: number,
 *   totalItems: number,
 *   onChange: (nextPage: number) => void
 * }} config
 */
export function createPagination({ page, pageSize, totalItems, onChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) {
    // Bei nur einer Seite keine Pagination anzeigen
    const placeholder = document.createElement('div');
    placeholder.className = 'pagination pagination--hidden';
    return placeholder;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'pagination';

  const info = document.createElement('span');
  info.className = 'pagination__info';

  const start = page * pageSize + 1;
  const end = Math.min(totalItems, (page + 1) * pageSize);
  info.textContent = `${start}–${end} of ${totalItems}`;

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'button button--secondary pagination__btn';
  prevBtn.textContent = 'Prev';
  prevBtn.disabled = page <= 0;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'button button--secondary pagination__btn';
  nextBtn.textContent = 'Next';
  nextBtn.disabled = page >= totalPages - 1;

  prevBtn.addEventListener('click', () => {
    if (page > 0 && typeof onChange === 'function') {
      onChange(page - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (page < totalPages - 1 && typeof onChange === 'function') {
      onChange(page + 1);
    }
  });

  wrapper.appendChild(info);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);

  return wrapper;
}
