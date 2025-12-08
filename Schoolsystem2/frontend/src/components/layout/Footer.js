export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';

  const inner = document.createElement('div');
  inner.className = 'app-footer__inner';

  const text = document.createElement('p');
  text.className = 'app-footer__text';
  text.textContent = 'Schoolsystem2 — explore topics, resources & interests.';

  inner.appendChild(text);
  footer.appendChild(inner);

  return footer;
}
