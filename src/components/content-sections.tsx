import StartSections from './content-sections/start';

import '@/styles/components/content-sections.css';

/**
 * ContentSections Orchestrator (Top-level)
 * Combines all page-specific content sections
 * Currently exports: Start page sections
 * Future: Can be extended with /presse, /programm, etc.
 */
const ContentSections = () => {
  return <StartSections />;
};

export default ContentSections;
