import { useCallback, useEffect, useMemo, useState } from 'react';
import PageShell from './components/page-shell';
import PagePlaceholder from './content/page-placeholder';
import StartPageContent from './content/start';

interface PlaceholderRoute {
  title: string;
  description?: string;
}

const PLACEHOLDER_ROUTES: Record<string, PlaceholderRoute> = {
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
  '/satzung': { title: 'Satzung', description: 'Die rechtlichen Grundlagen unserer Organisation.' },
  '/projekte': { title: 'Projekte', description: 'Aktuelle Initiativen und Vorhaben von DIE AKSEP.' },
  '/partner-projekte': {
    title: 'Partner-Projekte',
    description: 'Gemeinsame Projekte mit Organisationen, die unsere Ziele teilen.'
  },
  '/termine': { title: 'Termine', description: 'Wichtige Veranstaltungen und Treffen im Überblick.' },
  '/presse': { title: 'Presse', description: 'Ansprechpartner und Pressemitteilungen.' },
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
  '/kontakt': { title: 'Kontakt', description: 'So erreichen Sie uns direkt.' },
  '/finanzen-transparenz': {
    title: 'Finanzen & Transparenz',
    description: 'Nachvollziehbare Informationen über Mittelverwendung und Finanzierung.'
  },
  '/datenschutz': {
    title: 'Datenschutz',
    description: 'Unsere Richtlinien zum Umgang mit personenbezogenen Daten.'
  },
  '/impressum': { title: 'Impressum', description: 'Verantwortliche für Inhalte und Angaben gemäß §5 TMG.' },
  '/start': {
    title: 'Startseite',
    description: 'Übersicht über aktuelle Inhalte der Partei DIE AKSEP.'
  }
};

const normalizePath = (path: string) => {
  if (!path) return '/';
  const url = new URL(path, window.location.origin);
  const normalized = url.pathname.replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
};

const Router = () => {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));

  const navigate = useCallback(
    (path: string) => {
      const target = normalizePath(path);
      if (target === currentPath) {
        return;
      }

      window.history.pushState({}, '', target);
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentPath]
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      const download = anchor.hasAttribute('download');
      const targetAttr = anchor.getAttribute('target');

      if (!href || download || (targetAttr && targetAttr !== '_self')) {
        return;
      }

      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      navigate(url.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  const routeKey = useMemo(() => {
    if (currentPath === '/start') {
      return '/';
    }

    return currentPath;
  }, [currentPath]);

  const placeholder = PLACEHOLDER_ROUTES[routeKey];
  const isStartPage = routeKey === '/';

  return (
    <PageShell currentPath={routeKey}>
      {isStartPage ? (
        <StartPageContent />
      ) : placeholder ? (
        <PagePlaceholder {...placeholder} />
      ) : (
        <PagePlaceholder title="Seite nicht gefunden" description="Die aufgerufene Seite existiert nicht." />
      )}
    </PageShell>
  );
};

export default Router;
