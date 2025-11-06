import type { PropsWithChildren, ReactNode } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useNavigationController } from '@/hooks/useNavigationController';
import Footer from './footer';

import '@/styles/components/page-shell.css';

interface PageShellProps extends PropsWithChildren {
  currentPath: string;
  mainClassName?: string;
  afterMain?: ReactNode;
}

const PageShell = ({ currentPath, mainClassName, afterMain, children }: PageShellProps) => {
  const mainClass = ['homepage-main', mainClassName].filter(Boolean).join(' ');
  const navigationController = useNavigationController({ currentPath });

  return (
    <div className="app-shell">
      <Navbar controller={navigationController} />
      <Sidebar controller={navigationController} />
      <main className={mainClass}>{children}</main>
      {afterMain}
      <Footer />
    </div>
  );
};

export default PageShell;
