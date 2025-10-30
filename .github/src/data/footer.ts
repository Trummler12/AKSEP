/**
 * Footer configuration data
 * Centralized footer content for easy maintenance
 */

import { LinkItem } from '../types/navigation';

export interface SocialLink extends LinkItem {
  iconName: 'MessageCircle' | 'Facebook' | 'Twitter' | 'Youtube' | 'Instagram';
  external?: boolean;
}

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
    href: 'mailto:kontakt@aksepp.ch',
    display: 'kontakt@aksepp.ch',
  },
  {
    type: 'discord',
    iconName: 'MessageCircle',
    label: 'Discord Server',
    href: 'https://discord.gg/5nBmmbqSPH',
    display: 'Discord beitreten',
  },
];

// Social Media Links
export const socialLinks: SocialLink[] = [
  {
    iconName: 'MessageCircle',
    label: 'Discord',
    href: 'https://discord.gg/5nBmmbqSPH',
    external: true,
  },
  {
    iconName: 'Facebook',
    label: 'Facebook',
    href: 'https://facebook.com/dieaksep',
    external: true,
  },
  {
    iconName: 'Twitter',
    label: 'Twitter',
    href: 'https://twitter.com/dieaksep',
    external: true,
  },
  {
    iconName: 'Youtube',
    label: 'YouTube',
    href: 'https://youtube.com/dieaksep',
    external: true,
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
