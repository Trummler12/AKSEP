import { createHeader } from './Header.js';
import { createFooter } from './Footer.js';

export function createAppShell() {
  const root = document.createElement('div');
  root.className = 'app-shell';

  const header = createHeader();

  const main = document.createElement('main');
  main.className = 'app-main';
  main.setAttribute('role', 'main');

  const footer = createFooter();

  root.appendChild(header);
  root.appendChild(main);
  root.appendChild(footer);

  return {
    root,
    /**
     * Ersetzt den Inhalt von <main> durch die übergebene View.
     * @param {HTMLElement} viewElement
     */
    setContent(viewElement) {
      main.innerHTML = '';
      if (viewElement) {
        main.appendChild(viewElement);
      }
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
}
