import Navigation from './components/navigation';
import HeroSection from './components/hero-section';
import ContentSections from './components/content-sections';
import Footer from './components/footer';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navigation />
      <main>
        <HeroSection />
        <ContentSections />
      </main>
      <Footer />
    </div>
  );
}