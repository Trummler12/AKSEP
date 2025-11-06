import '@/styles/components/content-sections/start/akronym.css';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bullet, BulletList, Heading, Subheading, Caption } from '@/components/shared';
import { startPageContent } from '@/data/start';

/**
 * Akronym Section
 * Displays AKSEP description, pillars (Säulen), and information politics info
 * Used on the start page
 */
const Akronym = () => {
  return (
    <section className="content-section-card">
      <div className="content-container">
        <div className="content-inner-wide">
          <Heading
            title={startPageContent.aksepDescription.title}
            description={
              <>
                <strong>{startPageContent.aksepDescription.subtitle}</strong>
                <br />
                {startPageContent.aksepDescription.description}
              </>
            }
          />

          <div className="content-two-column-grid">
            <div>
              <Subheading>Unsere Säulen</Subheading>
              <BulletList>
                <Bullet variant="primary">
                  <strong>Klimafreundlich:</strong> Klimatologisch und soziologisch - für eine gute Gesprächskultur
                </Bullet>
                <Bullet variant="secondary">
                  <strong>Sozialdemokratisch:</strong> Effiziente, barrierefreie Unterstützung für alle
                </Bullet>
                <Bullet variant="accent">
                  <strong>Europa-Partei:</strong> Grenzübergreifend aktiv für gemeinsame Werte
                </Bullet>
                <Bullet variant="primary">
                  <strong>AKSEPtanz:</strong> Gleiche Chancen unabhängig von Startparametern
                </Bullet>
              </BulletList>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informationspolitik</CardTitle>
                  <CardDescription>Unser Hauptfokus für gesellschaftlichen Wandel</CardDescription>
                </CardHeader>
                <CardContent>
                  <Caption>
                    "In einer Zeit des Informationsüberflusses setzen wir uns für einen verantwortungsvollen Umgang mit Daten ein.
                    Information bildet die Grundlage für jeden gesellschaftlichen Wandel..."
                  </Caption>
                  <div className="bullet-resource-stack">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/praeambel" className="inline-link">
                        <span>Vollständige Präambel</span>
                        <ArrowRight className="content-icon-xs" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href="https://discord.gg/5nBmmbqSPH"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-link"
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

export default Akronym;
