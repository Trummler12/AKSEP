import { navigateTo } from '../router/index.js';

/**
 * 404 — Seite nicht gefunden.
 * Wird auch für "Topic nicht gefunden" o.ä. genutzt, wenn der Router keinen Match findet.
 */
export function createNotFoundView(context) {
  const container = document.createElement('div');
  container.className = 'view view--not-found';

  const heading = document.createElement('h1');
  heading.textContent = '404 — Page not found';

  const info = document.createElement('p');
  info.textContent =
    'The page you are looking for does not exist.';

  const buttonRow = document.createElement('div');
  buttonRow.className = 'view-not-found__actions';

  const startButton = document.createElement('button');
  startButton.type = 'button';
  startButton.className = 'button button--primary';
  startButton.textContent = 'Back to start';
  startButton.addEventListener('click', () => {
    navigateTo('/start');
  });

  const topicsButton = document.createElement('button');
  topicsButton.type = 'button';
  topicsButton.className = 'button button--secondary';
  topicsButton.textContent = 'Browse topics';
  topicsButton.addEventListener('click', () => {
    navigateTo('/topics');
  });

  buttonRow.appendChild(startButton);
  buttonRow.appendChild(topicsButton);

  container.appendChild(heading);
  container.appendChild(info);
  container.appendChild(buttonRow);

  return container;
}
