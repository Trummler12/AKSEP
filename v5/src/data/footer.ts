/**
 * Footer configuration data
 * Centralized footer content for easy maintenance
 */

import type { LinkItem, SocialLink } from '../types/navigation'

export interface ContactInfo {
  type: 'email' | 'discord' | 'phone';
  iconName: 'Mail' | 'MessageCircle' | 'Phone';
  label: string;
  href: string;
  display: string;
}

export interface FooterConfig {
  contactInfo: ContactInfo[];
  socialLinks: SocialLink[];
  participationLinks: LinkItem[];
  legalLinks: LinkItem[];
  copyright: string;
}

// Contact Information
export const contactInfo: ContactInfo[] = [
  {
    type: 'email',
    iconName: 'Mail',
    label: 'E-Mail Kontakt',
    href: 'mailto:kontakt@aksep.ch',
    display: 'kontakt@aksep.ch',
  },
  {
    type: 'discord',
    iconName: 'MessageCircle',
    label: 'Discord Server',
    href: 'https://discord.gg/5nBmmbqSPH',
    display: 'Discord beitreten',
  },
];

export const socialLinks: SocialLink[] = [
  {
    iconName: 'MessageCircle',
    label: 'Discord',
    href: 'https://discord.gg/5nBmmbqSPH',
  },
  {
    iconName: 'Facebook',
    label: 'Facebook',
    href: 'https://facebook.com/dieaksep',
  },
  {
    iconName: 'Twitter',
    label: 'Twitter',
    href: 'https://twitter.com/dieaksep',
  },
  {
    iconName: 'Youtube',
    label: 'YouTube',
    href: 'https://youtube.com/dieaksep',
  },
];

// Participation Links
export const participationLinks: LinkItem[] = [
  { label: 'Mitglied werden', href: '/mitglied-werden' },
  { label: 'Mitmachen', href: '/mitmachen' },
  { label: 'Unterstützen', href: '/unterstuetzen' },
];

// Legal Links
export const legalLinks: LinkItem[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'Finanzen & Transparenz', href: '/finanzen-transparenz' },
];

// Footer Configuration
export const footerConfig: FooterConfig = {
  contactInfo,
  socialLinks,
  participationLinks,
  legalLinks,
  copyright: '© 2024 die Aktivistische Klimafreundliche Sozialdemokratische Europa-Partei (AKSEP). Alle Rechte vorbehalten.',
};
