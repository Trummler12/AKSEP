import { getLanguage, setLanguage, subscribe } from '../../state/languageStore.js';

export function createLanguageSelector() {
  const wrapper = document.createElement('div');
  wrapper.className = 'language-selector';

  const select = document.createElement('select');
  select.className = 'language-selector__select';
  select.setAttribute('aria-label', 'Select language');

  // aktuell nur EN; aber Struktur ist erweiterbar
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' }
  ];

  for (const lang of languages) {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.label;
    select.appendChild(option);
  }

  select.value = getLanguage();

  select.addEventListener('change', () => {
    setLanguage(select.value);
  });

  // falls Sprache programmgesteuert geändert wird
  subscribe((lang) => {
    if (select.value !== lang) {
      select.value = lang;
    }
  });

  wrapper.appendChild(select);
  return wrapper;
}
