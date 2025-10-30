import { useMemo } from 'react';
import PageShell from '../page-shell';
import PagePlaceholder from '../../content/page-placeholder';
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
        <PagePlaceholder {...routeConfig} />
      ) : (
        <PagePlaceholder 
          title="Seite nicht gefunden" 
          description="Die aufgerufene Seite existiert nicht." 
        />
      )}
    </PageShell>
  );
};

export default Router;