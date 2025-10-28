/**
 * Route configuration for the application
 * Centralized route definitions with metadata
 */

export interface RouteConfig {
  title: string;
  description?: string;
}

export type RouteMap = Record<string, RouteConfig>;

export const ROUTES: RouteMap = {
  '/begriffe': {
    title: 'Begriffe',
    description: 'Ein Glossar zentraler Begriffe unserer Informationspolitik.'
  },
  '/begriffe/rechts-vs-links': {
    title: 'Begriffe · Rechts vs. Links',
    description: 'Wie wir die traditionellen politischen Achsen einordnen.'
  },
  '/begriffe/radikal': {
    title: 'Begriffe · Radikal',
    description: 'Was wir unter radikalem Denken verstehen.'
  },
  '/begriffe/paedophil-vs-paedokriminell': {
    title: 'Begriffe · Pädophil vs. Pädokriminell',
    description: 'Präzise Begrifflichkeiten für eine sensible Debatte.'
  },
  '/begriffe/nationalsozialismus': {
    title: 'Begriffe · Nationalsozialismus',
    description: 'Historische Einordnung und klare Abgrenzung.'
  },
  '/begriffe/faschismus': {
    title: 'Begriffe · Faschismus',
    description: 'Merkmale und Gefahren autoritärer Ideologien.'
  },
  '/begriffe/weitere': {
    title: 'Begriffe · Weitere Begriffe',
    description: 'Weitere Begriffe in Aufbereitung.'
  },
  '/begriffe/warum-begriffklaerungen-wichtig-sind': {
    title: 'Warum Begriffklärungen wichtig sind',
    description: 'Einordnung, weshalb präzise Begrifflichkeiten zentral für unsere Politik sind.'
  },
  '/programm': {
    title: 'Programm',
    description: 'Unser vollständiges Parteiprogramm mit allen Arbeitsgruppen und politischen Positionen.'
  },
  '/programm/regierung': { title: 'AG Regierung' },
  '/programm/innere-sicherheit': { title: 'AG Innere Sicherheit' },
  '/programm/klimaschutz': { title: 'AG Klimaschutz' },
  '/programm/umweltschutz': { title: 'AG Umweltschutz' },
  '/programm/gesundheit': { title: 'AG Gesundheit' },
  '/programm/forschung-ki': { title: 'AG Forschung und KI' },
  '/programm/wirtschaft': { title: 'AG Wirtschaft' },
  '/programm/bildung': { title: 'AG Bildung' },
  '/programm/soziales': { title: 'AG Soziales' },
  '/programm/europa-migration': { title: 'AG Europa & Migration' },
  '/programm/aussenpolitik': { title: 'AG Außenpolitik' },
  '/programm/tierrechte': { title: 'AG Tierrechte' },
  '/programm/sonstiges': { title: 'AG Sonstiges' },
  '/programm/agrarpolitik': { title: 'AG Agrarpolitik' },
  '/praeambel': {
    title: 'Präambel',
    description: 'Unsere Grundsätze: Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei'
  },
  '/ueber-uns': {
    title: 'Über uns',
    description: 'Lernen Sie die Menschen hinter DIE AKSEP kennen.'
  },
  '/satzung': { 
    title: 'Satzung', 
    description: 'Die rechtlichen Grundlagen unserer Organisation.' 
  },
  '/projekte': { 
    title: 'Projekte', 
    description: 'Aktuelle Initiativen und Vorhaben von DIE AKSEP.' 
  },
  '/partner-projekte': {
    title: 'Partner-Projekte',
    description: 'Gemeinsame Projekte mit Organisationen, die unsere Ziele teilen.'
  },
  '/termine': { 
    title: 'Termine', 
    description: 'Wichtige Veranstaltungen und Treffen im Überblick.' 
  },
  '/presse': { 
    title: 'Presse', 
    description: 'Ansprechpartner und Pressemitteilungen.' 
  },
  '/mitglied-werden': {
    title: 'Mitglied werden',
    description: 'Werden Sie Teil von DIE AKSEP und gestalten Sie aktiv mit.'
  },
  '/mitmachen': {
    title: 'Mitmachen',
    description: 'Beteiligen Sie sich in unseren Arbeitsgruppen und Projekten.'
  },
  '/unterstuetzen': {
    title: 'Unterstützen',
    description: 'Unterstützen Sie uns durch Spenden, Zeit oder Expertise.'
  },
  '/kontakt': { 
    title: 'Kontakt', 
    description: 'So erreichen Sie uns direkt.' 
  },
  '/finanzen-transparenz': {
    title: 'Finanzen & Transparenz',
    description: 'Nachvollziehbare Informationen über Mittelverwendung und Finanzierung.'
  },
  '/datenschutz': {
    title: 'Datenschutz',
    description: 'Unsere Richtlinien zum Umgang mit personenbezogenen Daten.'
  },
  '/impressum': { 
    title: 'Impressum', 
    description: 'Verantwortliche für Inhalte und Angaben gemäß §5 TMG.' 
  },
  '/.start': {
    title: 'Startseite',
    description: 'Übersicht über aktuelle Inhalte der Partei DIE AKSEP.'
  }
};

/**
 * Get route configuration by path
 */
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return ROUTES[path];
};

/**
 * Check if a route exists
 */
export const routeExists = (path: string): boolean => {
  return path in ROUTES;
};

/**
 * Get all registered routes
 */
export const getAllRoutes = (): string[] => {
  return Object.keys(ROUTES);
};