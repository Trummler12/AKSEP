// Global styles (Reihenfolge: Basis, Theme, Layout, Komponenten)
import './styles/globals.css';
import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';

import { initTheme } from './state/themeStore.js';
import { initLanguage } from './state/languageStore.js';
import { createAppShell } from './components/layout/AppShell.js';
import { initRouter } from './router/index.js';

function bootstrap() {
  // 1) globale Stores initialisieren (Theme + Sprache)
  initTheme();
  initLanguage();

  // 2) AppShell in #app einhängen
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    console.error('Root element #app not found');
    return;
  }

  const appShell = createAppShell();
  appRoot.appendChild(appShell.root);

  // 3) Router initialisieren – Router rendert jeweils in die Shell
  initRouter((viewElement) => {
    appShell.setContent(viewElement);
  });
}

bootstrap();
