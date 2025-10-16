import type { PropsWithChildren, ReactNode } from 'react';
import Navigation from './navigation';
import Footer from './footer';

interface PageShellProps extends PropsWithChildren {
  currentPath: string;
  mainClassName?: string;
  afterMain?: ReactNode;
}

const PageShell = ({ currentPath, mainClassName, afterMain, children }: PageShellProps) => {
  const mainClass = ['flex-1', mainClassName].filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
      <Navigation currentPath={currentPath} />
      <main className={mainClass}>{children}</main>
      {afterMain}
      <Footer />
    </div>
  );
};

export default PageShell;
