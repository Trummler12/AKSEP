import AkronymSection from './start-sections/AkronymSection';
import ProgrammSection from './start-sections/ProgrammSection';
import AktuellSection from './start-sections/AktuellSection';
import MitmachenSection from './start-sections/MitmachenSection';

/**
 * StartSections Component (Orchestrator)
 * Combines all start page sections into one composable unit
 * Renders: Akronym → Programm → Aktuell → Mitmachen
 */
const StartSections = () => {
  return (
    <div className="content-page-stack">
      <AkronymSection />
      <ProgrammSection />
      <AktuellSection />
      <MitmachenSection />
    </div>
  );
};

export default StartSections;
