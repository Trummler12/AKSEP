import { getTheme, toggleTheme, subscribe } from '../../state/themeStore.js';

export function createThemeToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Toggle theme');

  const iconSpan = document.createElement('span');
  iconSpan.className = 'theme-toggle__icon';

  const textSpan = document.createElement('span');
  textSpan.className = 'theme-toggle__text';

  button.appendChild(iconSpan);
  button.appendChild(textSpan);

  function updateAppearance(theme) {
    if (theme === 'light') {
      iconSpan.textContent = '☀️';
      textSpan.textContent = 'Light';
    } else {
      iconSpan.textContent = '🌙';
      textSpan.textContent = 'Dark';
    }
  }

  // initialer Zustand
  updateAppearance(getTheme());
  // auf Änderungen hören
  subscribe((theme) => updateAppearance(theme));

  button.addEventListener('click', () => {
    toggleTheme();
  });

  return button;
}
