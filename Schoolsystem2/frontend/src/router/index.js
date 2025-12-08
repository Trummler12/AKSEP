import { createStartView } from '../views/StartView.js';
import { createTopicsListView } from '../views/TopicsListView.js';
import { createTopicDetailView } from '../views/TopicDetailView.js';
import { createInterestView } from '../views/InterestView.js';
import { createNotFoundView } from '../views/NotFoundView.js';

/**
 * Route-Definition:
 * path: String mit optionalen Parametern ":paramName"
 * name: interne Bezeichnung (optional, aber praktisch)
 * createView: Funktion, die ein HTMLElement zurückgibt
 */
const routes = [
  {
    path: '/start',
    name: 'start',
    createView: createStartView
  },
  {
    path: '/topics',
    name: 'topics-list',
    createView: createTopicsListView
  },
  {
    path: '/topics/:topicId',
    name: 'topic-detail',
    createView: createTopicDetailView
  },
  {
    path: '/interesting',
    name: 'interest',
    createView: createInterestView
  }
];

let renderCallback = null;

/**
 * Public: Initialisiert Router.
 * @param {(viewElement: HTMLElement) => void} onRender
 */
export function initRouter(onRender) {
  renderCallback = onRender;

  // Link-Intercept für <a data-link>
  document.addEventListener('click', handleLinkClick);

  // Browser-Navigation (Back/Forward)
  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname + window.location.search, { replace: true });
  });

  // Erste Route rendern
  const initialPath = window.location.pathname + window.location.search;
  handleRoute(initialPath, { replace: true });
}

/**
 * Public: Navigiert programmatisch zu einem Pfad.
 * @param {string} path
 */
export function navigateTo(path) {
  handleRoute(path, { push: true });
}

/**
 * Intercept-Handler für Links mit data-link.
 */
function handleLinkClick(event) {
  const anchor = event.target.closest('a[data-link]');
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return; // externe Links nicht intercepten
  }

  event.preventDefault();
  navigateTo(href);
}

/**
 * Zentraler Routing-Handler.
 * @param {string} urlPath
 * @param {{push?: boolean, replace?: boolean}} options
 */
function handleRoute(urlPath, options = {}) {
  if (!renderCallback) {
    console.error('Router not initialized: missing render callback');
    return;
  }

  const url = new URL(urlPath, window.location.origin);

  // Root "/" → "/start"
  let pathname = url.pathname;
  if (pathname === '/') {
    pathname = '/start';
  }

  const match = matchRoute(pathname);
  const query = url.searchParams;

  // History aktualisieren
  if (options.push) {
    window.history.pushState({}, '', pathname + url.search);
  } else if (options.replace) {
    window.history.replaceState({}, '', pathname + url.search);
  }

  const context = {
    path: pathname,
    params: match?.params ?? {},
    query
  };

  let viewElement;
  if (match && match.route && typeof match.route.createView === 'function') {
    viewElement = match.route.createView(context);
  } else {
    viewElement = createNotFoundView(context);
  }

  if (!(viewElement instanceof HTMLElement)) {
    console.error('View did not return an HTMLElement for path', pathname);
    const fallback = document.createElement('div');
    fallback.textContent = 'Unexpected error rendering view.';
    viewElement = fallback;
  }

  renderCallback(viewElement);
}

/**
 * Versucht, eine Route passend zum Path zu finden.
 * Unterstützt Param-Segmente wie ":topicId".
 * @param {string} pathname
 */
function matchRoute(pathname) {
  const urlSegments = trimAndSplit(pathname);

  for (const route of routes) {
    const routeSegments = trimAndSplit(route.path);
    if (routeSegments.length !== urlSegments.length) {
      continue;
    }

    const params = {};
    let isMatch = true;

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSeg = routeSegments[i];
      const urlSeg = urlSegments[i];

      if (routeSeg.startsWith(':')) {
        const paramName = routeSeg.slice(1);
        params[paramName] = decodeURIComponent(urlSeg);
      } else if (routeSeg !== urlSeg) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { route, params };
    }
  }

  return null;
}

function trimAndSplit(path) {
  return path
    .replace(/\/+$/, '') // trailing slash entfernen
    .split('/')
    .filter(Boolean); // leere Segmente raus
}
