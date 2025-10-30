import { useMemo } from 'react';
import PageShell from '../page-shell';
import NotFound from '../../content/not-found';
import StartPageContent from '../../content/start';
import { useRouter } from '../../hooks/useRouter';
import { getRouteConfig } from '../../data/routes';

/**
 * Main router component
 * Handles route matching and page rendering
 */
const Router = () => {
  const { currentPath } = useRouter();

  const routeKey = useMemo(() => {
    if (currentPath === '/start') {
      return '/';
    }
    return currentPath;
  }, [currentPath]);

  const routeConfig = getRouteConfig(routeKey);
  const isStartPage = routeKey === '/';

  return (
    <PageShell currentPath={routeKey}>
      {isStartPage ? (
        <StartPageContent />
      ) : routeConfig ? (
        <NotFound {...routeConfig} />
      ) : (
        <NotFound 
          title="Seite nicht gefunden" 
          description="Die aufgerufene Seite existiert nicht." 
        />
      )}
    </PageShell>
  );
};

export default Router;