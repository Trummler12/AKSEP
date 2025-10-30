import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { startPageContent } from '../../data/start';

/**
 * AkronymSection Component
 * Displays AKSEP description, pillars (Säulen), and information politics info
 * Used on the start page
 */
const AkronymSection = () => {
  return (
    <section className="content-section-card">
      <div className="content-container">
        <div className="content-inner-wide">
          <div className="content-header">
            <h2 className="content-heading-xl">{startPageContent.aksepDescription.title}</h2>
            <p className="content-description-wide">
              <strong>{startPageContent.aksepDescription.subtitle}</strong>
              <br />
              {startPageContent.aksepDescription.description}
            </p>
          </div>

          <div className="content-two-column-grid">
            <div>
              <h3 className="content-subheading">Unsere Säulen</h3>
              <ul className="content-bullet-list">
                <li className="content-bullet-item">
                  <div className="content-bullet-marker-primary">
                    <div className="content-bullet-dot" />
                  </div>
                  <div>
                    <strong>Klimafreundlich:</strong> Klimatologisch und soziologisch - für eine gute Gesprächskultur
                  </div>
                </li>
                <li className="content-bullet-item">
                  <div className="content-bullet-marker-secondary">
                    <div className="content-bullet-dot" />
                  </div>
                  <div>
                    <strong>Sozialdemokratisch:</strong> Effiziente, barrierefreie Unterstützung für alle
                  </div>
                </li>
                <li className="content-bullet-item">
                  <div className="content-bullet-marker-accent">
                    <div className="content-bullet-dot" />
                  </div>
                  <div>
                    <strong>Europa-Partei:</strong> Grenzübergreifend aktiv für gemeinsame Werte
                  </div>
                </li>
                <li className="content-bullet-item">
                  <div className="content-bullet-marker-primary">
                    <div className="content-bullet-dot" />
                  </div>
                  <div>
                    <strong>AKSEPtanz:</strong> Gleiche Chancen unabhängig von Startparametern
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informationspolitik</CardTitle>
                  <CardDescription>Unser Hauptfokus für gesellschaftlichen Wandel</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="content-bullet-caption">
                    "In einer Zeit des Informationsüberflusses setzen wir uns für einen verantwortungsvollen Umgang mit Daten ein.
                    Information bildet die Grundlage für jeden gesellschaftlichen Wandel..."
                  </p>
                  <div className="content-resource-stack">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/praeambel" className="content-inline-link">
                        <span>Vollständige Präambel</span>
                        <ArrowRight className="content-icon-xs" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href="https://discord.gg/5nBmmbqSPH"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="content-inline-link"
                      >
                        <span>Discord-Server</span>
                        <ArrowRight className="content-icon-xs" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AkronymSection;
