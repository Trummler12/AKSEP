const STORAGE_KEY = 'schoolsystem2.language';
const SUPPORTED_LANGUAGES = ['en', 'de'];

let currentLanguage = 'en';
const listeners = new Set();

function detectInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
  } catch {
    // ignore
  }

  // Option: aus <html lang="..."> lesen
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang && SUPPORTED_LANGUAGES.includes(htmlLang)) {
    return htmlLang;
  }

  // Browser language (noch nicht wirklich wichtig, eher fürs spätere i18n)
  const navigatorLang = navigator.language?.slice(0, 2).toLowerCase();
  if (navigatorLang && SUPPORTED_LANGUAGES.includes(navigatorLang)) {
    return navigatorLang;
  }

  return 'en';
}

function applyLanguage(lang) {
  currentLanguage = lang;

  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }

  document.documentElement.setAttribute('lang', lang);

  for (const fn of listeners) {
    try {
      fn(lang);
    } catch (err) {
      console.error('Language subscriber failed', err);
    }
  }
}

export function initLanguage() {
  const lang = detectInitialLanguage();
  applyLanguage(lang);
}

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  if (lang === currentLanguage) return;
  applyLanguage(lang);
}

export function subscribe(fn) {
  if (typeof fn !== 'function') return () => {};
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
