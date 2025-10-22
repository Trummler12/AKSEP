/**
 * StartPage content configuration
 * Centralized content data for the start page
 */

export interface NewsItem {
  title: string;
  description: string;
  date: string;
  href: string;
  label: string;
}

export interface ProgramHighlight {
  iconName: 'Lightbulb' | 'Globe' | 'Heart' | 'Users' | 'FileText' | 'Calendar' | 'ArrowRight';
  title: string;
  description: string;
  href: string;
  label: string;
}

export interface StartPageContent {
  newsItems: NewsItem[];
  programHighlights: ProgramHighlight[];
  aksepDescription: {
    title: string;
    subtitle: string;
    description: string;
  };
  informationPolitics: {
    title: string;
    description: string;
    quote: string;
  };
  programSection: {
    title: string;
    description: string;
  };
  newsSection: {
    title: string;
    description: string;
  };
  participationSection: {
    title: string;
    description: string;
  };
}

// News Items
export const newsItems: NewsItem[] = [
  {
    title: 'Bildungsreform: Grundreformierung des Bildungssystems',
    description: 'Moderne, digitale und international vergleichbare Bildungsangebote schaffen',
    date: '15. März 2024',
    href: '/programm/bildung',
    label: 'Bildungsreform',
  },
  {
    title: 'Discord-Server: Bürgernähe digital leben',
    description: 'Plattform für Austausch, Ressourcen-Sharing und demokratische Teilhabe',
    date: '8. März 2024',
    href: 'https://discord.gg/5nBmmbqSPH',
    label: 'Discord Server',
  },
  {
    title: 'AKSEPtanz: Gleiche Chancen für alle',
    description: 'Unser Ideal einer Gesellschaft ohne systemische Benachteiligung',
    date: '1. März 2024',
    href: '/praeambel',
    label: 'AKSEPtanz',
  },
];

// Program Highlights
export const programHighlights: ProgramHighlight[] = [
  {
    iconName: 'Lightbulb',
    title: 'Bildungsreform',
    description: 'Grundreformierung des Bildungssystems mit digitalen, international vergleichbaren Angeboten',
    href: '/programm/bildung',
    label: 'Bildungsreform',
  },
  {
    iconName: 'Globe',
    title: 'Klimapolitik',
    description: 'Klimatologisch und soziologisch - für Umwelt und gute Gesprächskultur',
    href: '/programm/klimaschutz',
    label: 'Klimapolitik',
  },
  {
    iconName: 'Heart',
    title: 'Sozialpolitik',
    description: 'Effiziente, barrierefreie Unterstützung ohne bürokratische Hürden',
    href: '/programm/soziales',
    label: 'Sozialpolitik',
  },
  {
    iconName: 'Users',
    title: 'Europa & Migration',
    description: 'Grenzübergreifende Zusammenarbeit und menschenwürdige Migrationspolitik',
    href: '/programm/europa-migration',
    label: 'Europa & Migration',
  },
];

// Start Page Content Configuration
export const startPageContent: StartPageContent = {
  newsItems,
  programHighlights,
  aksepDescription: {
    title: 'Was bedeutet AKSEP?',
    subtitle: 'Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei',
    description: 'Wir vereinen formelle Politik mit informeller Aufklärungsarbeit und setzen auf evidenzbasierte Entscheidungen mit Expertenwissen statt auf reine Ideologie.',
  },
  informationPolitics: {
    title: 'Informationspolitik',
    description: 'Unser Hauptfokus für gesellschaftlichen Wandel',
    quote: 'In einer Zeit des Informationsüberflusses setzen wir uns für einen verantwortungsvollen Umgang mit Daten ein. Information bildet die Grundlage für jeden gesellschaftlichen Wandel...',
  },
  programSection: {
    title: 'Programm-Highlights',
    description: 'Unsere Arbeitsgruppen entwickeln evidenzbasierte Lösungen für die wichtigsten gesellschaftlichen Herausforderungen.',
  },
  newsSection: {
    title: 'Aktuelles',
    description: 'Die neuesten Entwicklungen und Positionen von DIE AKSEP',
  },
  participationSection: {
    title: 'Gemeinsam für AKSEPtanz',
    description: 'Unterstützen Sie uns dabei, eine Gesellschaft zu schaffen, in der jede Person die gleichen Chancen hat. Aktivistisch, klimafreundlich, sozialdemokratisch - für ein vereintes Europa.',
  },
};