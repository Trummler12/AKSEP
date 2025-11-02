import type { PropsWithChildren, ReactNode } from 'react';
import Navigation from './navigation';
import Footer from './footer';

import '@/styles/components/page-shell.css';

interface PageShellProps extends PropsWithChildren {
  currentPath: string;
  mainClassName?: string;
  afterMain?: ReactNode;
}

const PageShell = ({ currentPath, mainClassName, afterMain, children }: PageShellProps) => {
  const mainClass = ['homepage-main', mainClassName].filter(Boolean).join(' ');

  return (
    <div className="app-shell">
      <Navigation currentPath={currentPath} />
      <main className={mainClass}>{children}</main>
      {afterMain}
      <Footer />
    </div>
  );
};

export default PageShell;
