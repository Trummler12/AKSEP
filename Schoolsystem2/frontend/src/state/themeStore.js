const STORAGE_KEY = 'schoolsystem2.theme';
const VALID_THEMES = ['dark', 'light'];

let currentTheme = 'dark';
const listeners = new Set();

/**
 * Wählt initiales Theme:
 * 1) localStorage
 * 2) data-theme Attribut auf <html>
 * 3) System-Preference
 * 4) Fallback: 'dark'
 */
function detectInitialTheme() {
  // 1) localStorage
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  // 2) HTML data-theme
  const html = document.documentElement;
  const attrTheme = html.getAttribute('data-theme');
  if (attrTheme && VALID_THEMES.includes(attrTheme)) {
    return attrTheme;
  }

  // 3) System preference
  if (window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      return 'dark';
    }
  }

  // 4) Fallback
  return 'dark';
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);

  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }

  currentTheme = theme;
  for (const fn of listeners) {
    try {
      fn(theme);
    } catch (err) {
      console.error('Theme subscriber failed', err);
    }
  }
}

export function initTheme() {
  const theme = detectInitialTheme();
  applyTheme(theme);
}

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  if (!VALID_THEMES.includes(theme)) return;
  if (theme === currentTheme) return;
  applyTheme(theme);
}

export function toggleTheme() {
  const next = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

/**
 * Simple subscription; gibt Unsubscribe-Funktion zurück
 * @param {(theme: string) => void} fn
 */
export function subscribe(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
