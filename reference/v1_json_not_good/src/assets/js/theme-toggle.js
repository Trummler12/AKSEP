// Theme toggle for AKSEP site
// Default: dark mode. When toggled to light, store preference in a cookie.

/** Get cookie by name */
function getCookie(name) {
  return document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='))?.split('=')[1];
}

/** Set cookie for given days */
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + d.toUTCString();
  document.cookie = name + '=' + value + expires + '; path=/';
}

/** Delete cookie immediately */
function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const cookieName = 'aksep-theme';

  const saved = getCookie(cookieName);
  if (saved === 'light') {
    root.classList.add('light');
  } else {
    root.classList.add('dark');
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = root.classList.contains('dark');
    if (isDark) {
      root.classList.remove('dark');
      root.classList.add('light');
      setCookie(cookieName, 'light', 365);
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      deleteCookie(cookieName);
    }
  });
});