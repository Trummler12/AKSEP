/**
 * Hero section configuration
 * Centralized content data for the hero section
 */

export interface HeroFeature {
  iconName: 'BookOpen' | 'Users' | 'Calendar';
  title: string;
  description: string;
  colorClass: 'primary' | 'secondary' | 'accent';
}

export interface HeroSection {
  title: string;
  subtitle: string;
  slogan: string;
  description: string;
  buttons: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  features: HeroFeature[];
}

// Hero Features
export const heroFeatures: HeroFeature[] = [
  {
    iconName: 'BookOpen',
    title: 'Bildung revolutionieren',
    description: 'Moderne, digitale und international vergleichbare Bildungsangebote schaffen',
    colorClass: 'primary',
  },
  {
    iconName: 'Users',
    title: 'AKSEPtanz leben',
    description: 'Gleiche Chancen für alle - unabhängig von Herkunft oder Umständen',
    colorClass: 'secondary',
  },
  {
    iconName: 'Calendar',
    title: 'Bürgernah agieren',
    description: 'Expertenwissen systematisch in Entscheidungsprozesse integrieren',
    colorClass: 'accent',
  },
];

// Hero Section Configuration
export const heroSection: HeroSection = {
  title: 'DIE AKSEP',
  subtitle: 'Für eine informierte und transparente Politik',
  slogan: 'Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei',
  description: 'Informationspolitik als Hauptfokus: Wir verbinden Bildung, Medien und Digitalisierung zu einem integrativen Ansatz für evidenzbasierte Politik und AKSEPtanz.',
  buttons: {
    primary: {
      text: 'Unser Programm',
      href: '/programm',
    },
    secondary: {
      text: 'Mitglied werden',
      href: '/mitglied-werden',
    },
  },
  features: heroFeatures,
};