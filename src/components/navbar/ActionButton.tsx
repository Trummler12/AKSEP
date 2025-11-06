import { Button } from '@/components/ui/button';
import type { NavAction } from '@/types/navigation';

interface NavbarActionButtonProps {
  action: NavAction;
  isOverflow: boolean;
  registerRef: (element: HTMLElement | null) => void;
}

export const NavbarActionButton = ({ action, isOverflow, registerRef }: NavbarActionButtonProps) => {
  return (
    <div ref={registerRef} hidden={isOverflow} className="nav-action-wrapper">
      {action.variant === 'outline' ? (
        <Button variant="outline" size="sm" asChild>
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : (
        <Button size="sm" className="hero-primary-button" asChild>
          <a href={action.href}>{action.label}</a>
        </Button>
      )}
    </div>
  );
};
