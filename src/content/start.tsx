import HeroSection from '../components/hero-section';
import StartSections from '../components/start-sections';

// Import start-page specific styles
import '../styles/pages/start.css';

/**
 * Start Page (Homepage)
 * Displays hero section followed by four main content sections:
 * 1. AKSEP Description & Pillars (Akronym)
 * 2. Program Highlights (Programm)
 * 3. News/Updates (Aktuell)
 * 4. Participation Options (Mitmachen)
 */
const StartPageContent = () => {
  return (
    <>
      <HeroSection />
      <StartSections />
    </>
  );
};

export default StartPageContent;