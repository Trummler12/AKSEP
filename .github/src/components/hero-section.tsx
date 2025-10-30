import { Button } from './ui/button';
import { ArrowRight, Users, BookOpen, Calendar } from 'lucide-react';
import aksepLogo from 'figma:asset/Logo_AKSEP.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          {/* Logo and Title */}
          <div className="hero-logo-container">
            <img src={aksepLogo} alt="DIE AKSEP Logo" className="hero-logo" />
            <div>
              <h1 className="hero-title">DIE AKSEP</h1>
              <p className="hero-subtitle">
                Für eine informierte und transparente Politik
              </p>
            </div>
          </div>

          {/* Main Slogan */}
          <h2 className="hero-slogan">
            Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
          </h2>

          <p className="hero-description">
            <strong>Informationspolitik als Hauptfokus:</strong> Wir verbinden Bildung, Medien und Digitalisierung
            zu einem integrativen Ansatz für evidenzbasierte Politik und AKSEPtanz.
          </p>

          {/* Call to Action Buttons */}
          <div className="hero-buttons">
            <Button size="lg" className="hero-primary-button" asChild>
              <a href="/programm" className="hero-button-link">
                <span>Unser Programm</span>
                <ArrowRight className="hero-button-icon" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/mitglied-werden" className="hero-button-link">
                <Users className="hero-button-icon" />
                <span>Mitglied werden</span>
              </a>
            </Button>
          </div>

          {/* Key Stats/Features */}
          <div className="hero-features-grid">
            <div className="hero-feature-card">
              <div className="hero-feature-icon">
                <BookOpen className="hero-button-icon" />
              </div>
              <h3 className="hero-feature-heading">Bildung revolutionieren</h3>
              <p className="hero-feature-text">
                Moderne, digitale und international vergleichbare Bildungsangebote schaffen
              </p>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-icon-secondary">
                <Users className="hero-button-icon" />
              </div>
              <h3 className="hero-feature-heading">AKSEPtanz leben</h3>
              <p className="hero-feature-text">
                Gleiche Chancen für alle - unabhängig von Herkunft oder Umständen
              </p>
            </div>

            <div className="hero-feature-card">
              <div className="hero-feature-icon-accent">
                <Calendar className="hero-button-icon" />
              </div>
              <h3 className="hero-feature-heading">Bürgernah agieren</h3>
              <p className="hero-feature-text">
                Expertenwissen systematisch in Entscheidungsprozesse integrieren
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
