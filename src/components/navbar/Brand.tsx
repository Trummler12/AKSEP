import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import aksepLogo from 'figma:asset/Logo_AKSEP.png';

import '@/styles/components/navbar/navbar-brand.css';

export const NavbarBrand = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href="/"
          className="nav-logo-link"
          aria-label="Zur Startseite"
        >
          <img src={aksepLogo} alt="DIE AKSEP Logo" className="nav-logo-image" />
          <span className="nav-logo-text">DIE AKSEP</span>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>Zur Startseite</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
