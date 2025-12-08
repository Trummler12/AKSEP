/**
 * Filterleiste für /topics.
 * maxLayer, showCourses, showAchievements, sortBy, sortDirection, searchText
 *
 * @param {{
 *   maxLayer: number,
 *   showCourses: boolean,
 *   showAchievements: boolean,
 *   sortBy: 'name' | 'layer',
 *   sortDirection: 'asc' | 'desc',
 *   searchText: string
 * }} initialFilters
 * @param {{ onChange?: (filters: any) => void }} opts
 */
export function createTopicFilters(initialFilters, { onChange } = {}) {
  const state = { ...initialFilters };

  const root = document.createElement('section');
  root.className = 'topics-filters';

  const form = document.createElement('div');
  form.className = 'topics-filters__grid';

  // maxLayer
  const maxLayerWrap = document.createElement('label');
  maxLayerWrap.className = 'topics-filters__field';
  maxLayerWrap.textContent = 'Max layer';

  const maxLayerInput = document.createElement('input');
  maxLayerInput.type = 'number';
  maxLayerInput.min = '0';
  maxLayerInput.max = '7';
  maxLayerInput.step = '1';
  maxLayerInput.value = String(state.maxLayer ?? 2);
  maxLayerInput.className = 'topics-filters__input topics-filters__input--number';

  maxLayerInput.addEventListener('input', () => {
    const value = parseInt(maxLayerInput.value, 10);
    state.maxLayer = Number.isNaN(value) ? 2 : value;
    emitChange();
  });

  maxLayerWrap.appendChild(maxLayerInput);

  // showCourses
  const coursesWrap = document.createElement('label');
  coursesWrap.className = 'topics-filters__field topics-filters__field--checkbox';

  const coursesCheckbox = document.createElement('input');
  coursesCheckbox.type = 'checkbox';
  coursesCheckbox.checked = state.showCourses ?? true;

  const coursesText = document.createElement('span');
  coursesText.textContent = 'Show courses';

  coursesCheckbox.addEventListener('change', () => {
    state.showCourses = !!coursesCheckbox.checked;
    emitChange();
  });

  coursesWrap.appendChild(coursesCheckbox);
  coursesWrap.appendChild(coursesText);

  // showAchievements
  const achievementsWrap = document.createElement('label');
  achievementsWrap.className = 'topics-filters__field topics-filters__field--checkbox';

  const achievementsCheckbox = document.createElement('input');
  achievementsCheckbox.type = 'checkbox';
  achievementsCheckbox.checked = state.showAchievements ?? false;

  const achievementsText = document.createElement('span');
  achievementsText.textContent = 'Show achievements';

  achievementsCheckbox.addEventListener('change', () => {
    state.showAchievements = !!achievementsCheckbox.checked;
    emitChange();
  });

  achievementsWrap.appendChild(achievementsCheckbox);
  achievementsWrap.appendChild(achievementsText);

  // sortBy
  const sortByWrap = document.createElement('label');
  sortByWrap.className = 'topics-filters__field';
  sortByWrap.textContent = 'Sort by';

  const sortBySelect = document.createElement('select');
  sortBySelect.className = 'topics-filters__input';

  const optName = document.createElement('option');
  optName.value = 'name';
  optName.textContent = 'Name';

  const optLayer = document.createElement('option');
  optLayer.value = 'layer';
  optLayer.textContent = 'Layer';

  sortBySelect.appendChild(optName);
  sortBySelect.appendChild(optLayer);

  sortBySelect.value = state.sortBy || 'name';

  sortBySelect.addEventListener('change', () => {
    state.sortBy = sortBySelect.value;
    emitChange();
  });

  sortByWrap.appendChild(sortBySelect);

  // sortDirection
  const sortDirWrap = document.createElement('label');
  sortDirWrap.className = 'topics-filters__field';
  sortDirWrap.textContent = 'Direction';

  const sortDirSelect = document.createElement('select');
  sortDirSelect.className = 'topics-filters__input';

  const optAsc = document.createElement('option');
  optAsc.value = 'asc';
  optAsc.textContent = 'Asc';

  const optDesc = document.createElement('option');
  optDesc.value = 'desc';
  optDesc.textContent = 'Desc';

  sortDirSelect.appendChild(optAsc);
  sortDirSelect.appendChild(optDesc);

  sortDirSelect.value = state.sortDirection || 'asc';

  sortDirSelect.addEventListener('change', () => {
    state.sortDirection = sortDirSelect.value;
    emitChange();
  });

  sortDirWrap.appendChild(sortDirSelect);

  // Freitext-Suche
  const searchWrap = document.createElement('label');
  searchWrap.className = 'topics-filters__field topics-filters__field--grow';

  const searchLabel = document.createElement('span');
  searchLabel.textContent = 'Search';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Name, ID, description, tags…';
  searchInput.className = 'topics-filters__input topics-filters__input--search';
  searchInput.value = state.searchText || '';

  let searchTimeout = null;
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim();
    state.searchText = value;
    // kleines Debounce, damit nicht bei jedem Keypress neu gefiltert wird
    if (searchTimeout) window.clearTimeout(searchTimeout);
    searchTimeout = window.setTimeout(() => {
      emitChange();
    }, 150);
  });

  searchWrap.appendChild(searchLabel);
  searchWrap.appendChild(searchInput);

  // Zusammenbauen
  form.appendChild(maxLayerWrap);
  form.appendChild(coursesWrap);
  form.appendChild(achievementsWrap);
  form.appendChild(sortByWrap);
  form.appendChild(sortDirWrap);
  form.appendChild(searchWrap);

  root.appendChild(form);

  function emitChange() {
    if (typeof onChange === 'function') {
      onChange({ ...state });
    }
  }

  return root;
}
