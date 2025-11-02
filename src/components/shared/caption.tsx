import '@/styles/components/shared/caption.css';
/**
 * Caption Component
 * Small descriptive text for cards, infoboxes, and details
 */
import React from 'react';

interface CaptionProps {
  children: React.ReactNode;
}

/**
 * Caption - Small text for card descriptions and details
 * @example
 * <Caption>Dieser Text ist eine kleine Beschreibung</Caption>
 */
const Caption: React.FC<CaptionProps> = ({ children }) => (
  <p className="bullet-caption">{children}</p>
);

export { Caption };
export type { CaptionProps };
