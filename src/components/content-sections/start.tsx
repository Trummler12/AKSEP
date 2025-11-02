import '@/styles/components/content-sections/start.css';
import Hero from './start/hero';
import Akronym from './start/akronym';
import Programm from './start/programm';
import Aktuell from './start/aktuell';
import Mitmachen from './start/mitmachen';

/**
 * StartSections Orchestrator
 * Combines all start-page sections into one composable unit
 * Renders: Hero → Akronym → Programm → Aktuell → Mitmachen
 */
const StartSections = () => {
  return (
    <>
      <Hero />
      <div className="content-page-stack">
        <Akronym />
        <Programm />
        <Aktuell />
        <Mitmachen />
      </div>
    </>
  );
};

export default StartSections;
