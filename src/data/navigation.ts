import type { NavItem, NavChildGroup } from '../types/navigation';

/**
 * Navigation data configuration
 * Centralized navigation structure for consistent UI behavior
 */

const createBegriffeGroups = (): NavChildGroup[] => [
  {
    key: 'begriffe-intro',
    items: [
      {
        label: 'Warum Begriffklärungen wichtig sind',
        href: '/begriffe/warum-begriffklaerungen-wichtig-sind',
      },
    ],
  },
  {
    key: 'begriffe-wichtige',
    items: [
      { label: 'Rechts vs. Links', href: '/begriffe/rechts-vs-links' },
      { label: 'Radikal', href: '/begriffe/radikal' },
      { label: 'Pädophil vs. Pädokriminell', href: '/begriffe/paedophil-vs-paedokriminell' },
      { label: 'Faschismus', href: '/begriffe/faschismus' },
    ],
    showTopBorder: true,
  },
  {
    key: 'begriffe-weitere',
    items: [{ label: 'Weitere Begriffe...', href: '/begriffe/weitere' }],
    showTopBorder: true,
  },
];

const createProgrammGroups = (): NavChildGroup[] => [
  {
    key: 'programm-praeambel',
    items: [{ label: 'Präambel', href: '/praeambel' }],
  },
  {
    key: 'programm-ags',
    items: [
      { label: 'AG Regierung', href: '/programm/regierung' },
      { label: 'AG Innere Sicherheit', href: '/programm/innere-sicherheit' },
      { label: 'AG Klimaschutz', href: '/programm/klimaschutz' },
      { label: 'AG Umweltschutz', href: '/programm/umweltschutz' },
      { label: 'AG Gesundheit', href: '/programm/gesundheit' },
      { label: 'AG Forschung und KI', href: '/programm/forschung-ki' },
      { label: 'AG Wirtschaft', href: '/programm/wirtschaft' },
      { label: 'AG Bildung', href: '/programm/bildung' },
      { label: 'AG Soziales', href: '/programm/soziales' },
      { label: 'AG Europa und Migration', href: '/programm/europa-migration' },
      { label: 'AG Außenpolitik', href: '/programm/aussenpolitik' },
      { label: 'AG Tierrechte', href: '/programm/tierrechte' },
      { label: 'AG Agrarpolitik', href: '/programm/agrarpolitik' },
      { label: 'AG Sonstiges', href: '/programm/sonstiges' },
    ],
    showTopBorder: true,
  },
];

const createUeberUnsGroups = (): NavChildGroup[] => [
  {
    key: 'ueber-uns-organisation',
    items: [
      { label: 'Satzung', href: '/satzung' },
      { label: 'Projekte', href: '/projekte' },
      { label: 'Partner-Projekte', href: '/partner-projekte' },
      { label: 'Finanzen & Transparenz', href: '/finanzen-transparenz' },
    ],
  },
];

const createAktuellGroups = (): NavChildGroup[] => [
  {
    key: 'aktuelles-updates',
    items: [
      { label: 'Termine', href: '/termine' },
      { label: 'Presse', href: '/presse' },
    ],
  },
];

const createMitmachenGroups = (): NavChildGroup[] => [
  {
    key: 'mitmachen-options',
    items: [
      { label: 'Mitglied werden', href: '/mitglied-werden' },
      { label: 'Mitmachen', href: '/mitmachen' },
      { label: 'Unterstützen', href: '/unterstuetzen' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
  },
];

export const navigationItems: NavItem[] = [
  { key: 'begriffe', label: 'Begriffe', href: '/begriffe', groups: createBegriffeGroups() },
  { key: 'programm', label: 'Programm', href: '/programm', groups: createProgrammGroups() },
  { key: 'ueber-uns', label: 'Über uns', href: '/ueber-uns', groups: createUeberUnsGroups() },
  { key: 'aktuelles', label: 'Aktuelles', href: '/termine', groups: createAktuellGroups() },
  { key: 'mitmachen', label: 'Mitmachen', href: '/mitmachen', groups: createMitmachenGroups() },
  { key: 'datenschutz', label: 'Datenschutz', href: '/datenschutz', displayInPrimary: false },
  { key: 'impressum', label: 'Impressum', href: '/impressum', displayInPrimary: false },
];

/**
 * Get navigation items filtered by display preference
 */
export const getPrimaryNavItems = (): NavItem[] => {
  return navigationItems.filter((item) => item.displayInPrimary !== false);
};

/**
 * Find navigation item by key
 */
export const findNavItemByKey = (key: string): NavItem | undefined => {
  return navigationItems.find((item) => item.key === key);
};

/**
 * Get all child hrefs for a navigation item
 */
export const getChildHrefs = (item: NavItem): string[] => {
  return item.groups?.flatMap((group) => group.items.map((child) => child.href)) ?? [];
};