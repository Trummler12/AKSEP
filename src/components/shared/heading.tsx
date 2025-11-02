import '@/styles/components/shared/heading.css';
/**
 * Heading Component
 * Reusable heading with optional description
 * Used for section titles and main page headings
 */
import React from 'react';

type HeadingSize = 'xl' | 'lg';
type DescriptionSize = 'wide' | 'compact' | 'base';

interface HeadingProps {
  title: string;
  description?: React.ReactNode;
  descriptionSize?: DescriptionSize;
  children?: React.ReactNode;
  centered?: boolean;
}

/**
 * Heading - Main heading with optional description
 * @example
 * <Heading title="Unsere Mission" description="Beschreibung hier" centered />
 */
const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  descriptionSize = 'wide',
  children,
  centered = true,
}) => {
  const headerClass = centered ? 'content-header' : '';
  const descriptionClass = description ? `content-description-${descriptionSize}` : '';

  return (
    <div className={headerClass}>
      <h2 className="content-heading-xl">{title}</h2>
      {description && <p className={descriptionClass}>{description}</p>}
      {children}
    </div>
  );
};

/**
 * Subheading - Secondary heading for sections
 * @example
 * <Subheading>Unsere Säulen</Subheading>
 */
interface SubheadingProps {
  children: React.ReactNode;
}

const Subheading: React.FC<SubheadingProps> = ({ children }) => (
  <h3 className="content-subheading">{children}</h3>
);

export { Heading, Subheading };
export type { HeadingProps, SubheadingProps };
