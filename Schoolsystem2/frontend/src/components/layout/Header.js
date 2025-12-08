import { createThemeToggle } from '../ui/ThemeToggle.js';
import { createLanguageSelector } from '../ui/LanguageSelector.js';

export function createHeader() {
  const header = document.createElement('header');
  header.className = 'app-header';

  const inner = document.createElement('div');
  inner.className = 'app-header__inner';

  // Brand / Start-Link
  const brand = document.createElement('div');
  brand.className = 'app-header__brand';

  const brandLink = document.createElement('a');
  brandLink.href = '/start';
  brandLink.setAttribute('data-link', 'true');
  brandLink.className = 'app-header__brand-link';
  brandLink.innerHTML =
    '<span class="app-header__brand-icon">🏠</span><span class="app-header__brand-text">START</span>';
  brand.appendChild(brandLink);

  // Navigation
  const nav = document.createElement('nav');
  nav.className = 'app-header__nav';

  const navList = document.createElement('ul');
  navList.className = 'app-header__nav-list';

  // Topics mit Dropdown
  const topicsItem = document.createElement('li');
  topicsItem.className = 'app-header__nav-item app-header__nav-item--has-dropdown';

  const topicsLink = document.createElement('a');
  topicsLink.href = '/topics';
  topicsLink.setAttribute('data-link', 'true');
  topicsLink.className = 'app-header__nav-link';
  topicsLink.textContent = 'Topics';

  const topicsDropdown = document.createElement('div');
  topicsDropdown.className = 'app-header__dropdown';

  const luckyLink = document.createElement('a');
  // wir verwenden einen Query-Parameter, um später in der Topics-View "lucky" zu erkennen
  luckyLink.href = '/topics?lucky=1';
  luckyLink.setAttribute('data-link', 'true');
  luckyLink.className = 'app-header__dropdown-link';
  luckyLink.textContent = "I'm feeling lucky";

  topicsDropdown.appendChild(luckyLink);

  topicsItem.appendChild(topicsLink);
  topicsItem.appendChild(topicsDropdown);

  // "interesting" Link
  const interestItem = document.createElement('li');
  interestItem.className = 'app-header__nav-item';

  const interestLink = document.createElement('a');
  interestLink.href = '/interesting';
  interestLink.setAttribute('data-link', 'true');
  interestLink.className = 'app-header__nav-link';
  interestLink.textContent = 'interesting';

  interestItem.appendChild(interestLink);

  navList.appendChild(topicsItem);
  navList.appendChild(interestItem);
  nav.appendChild(navList);

  // Right side: language + theme
  const controls = document.createElement('div');
  controls.className = 'app-header__controls';

  const languageSelector = createLanguageSelector();
  const themeToggle = createThemeToggle();

  controls.appendChild(languageSelector);
  controls.appendChild(themeToggle);

  inner.appendChild(brand);
  inner.appendChild(nav);
  inner.appendChild(controls);

  header.appendChild(inner);
  return header;
}
