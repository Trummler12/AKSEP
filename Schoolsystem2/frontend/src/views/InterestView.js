/**
 * /interesting — Freitext-Interessen, Ergebnisse nach Score.
 * Hier nur Grundgerüst mit kleinem Platzhaltertext für Form & Result-Tabelle.
 */
export function createInterestView(context) {
  const container = document.createElement('div');
  container.className = 'view view--interest';

  const heading = document.createElement('h1');
  heading.textContent = 'Interest-based topic search';

  const intro = document.createElement('p');
  intro.textContent =
    'Describe your interests in free text — the system will suggest matching topics sorted by a relevance score.';

  const placeholder = document.createElement('div');
  placeholder.className = 'view__placeholder';
  placeholder.textContent =
    'The interest form & result table will be implemented here using the /api/v1/topics/interest-search endpoint.';

  container.appendChild(heading);
  container.appendChild(intro);
  container.appendChild(placeholder);

  return container;
}
