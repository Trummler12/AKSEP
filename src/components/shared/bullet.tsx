import '@/styles/components/shared/bullet.css';

/**
 * Bullet Component
 * Reusable bullet point with colored marker and content
 * Supports primary, secondary, and accent color variants
 */
import React from 'react';

type BulletVariant = 'primary' | 'secondary' | 'accent';

interface BulletProps {
  variant?: BulletVariant;
  children: React.ReactNode;
}

/**
 * Bullet - A single bullet point item with colored marker
 * @example
 * <Bullet variant="primary">
 *   <strong>Label:</strong> Description text
 * </Bullet>
 */
const Bullet: React.FC<BulletProps> = ({ variant = 'primary', children }) => {
  const markerClass = `bullet-marker-${variant}`;

  return (
    <li className="bullet-item">
      <div className={markerClass}>
        <div className="bullet-dot" />
      </div>
      <div>{children}</div>
    </li>
  );
};

/**
 * BulletList - Container for bullet points
 * @example
 * <BulletList>
 *   <Bullet variant="primary">First item</Bullet>
 *   <Bullet variant="secondary">Second item</Bullet>
 * </BulletList>
 */
interface BulletListProps {
  children: React.ReactNode;
}

const BulletList: React.FC<BulletListProps> = ({ children }) => (
  <ul className="bullet-list">{children}</ul>
);

export { Bullet, BulletList };
export type { BulletProps, BulletListProps, BulletVariant };
