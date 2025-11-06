import '@/styles/components/content-sections/start/mitmachen.css';
import { Users, Heart, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/shared';
import { startPageContent } from '@/data/start';

/**
 * Mitmachen Section
 * Displays participation options (Become member, Get active, Support)
 * Used on the start page
 */
const Mitmachen = () => {
  return (
    <section className="content-section-plain">
      <div className="content-container">
        <div className="content-inner-centered">
          <Heading
            title={startPageContent.participationSection.title}
            description={startPageContent.participationSection.description}
            centered
          />

          <div className="impact-grid">
            <Card className="impact-card">
              <CardHeader>
                <Users className="impact-icon-primary" />
                <CardTitle>Mitglied werden</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="impact-description">
                  Werden Sie offizielles Mitglied und gestalten Sie unsere Politik aktiv mit.
                </p>
                <Button asChild>
                  <a href="/mitglied-werden">Jetzt beitreten</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="impact-card">
              <CardHeader>
                <Lightbulb className="impact-icon-secondary" />
                <CardTitle>Mitmachen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="impact-description">
                  Bringen Sie Ihre Ideen und Expertise in unsere Arbeitsgruppen ein.
                </p>
                <Button variant="secondary" asChild>
                  <a href="/mitmachen">Aktiv werden</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="impact-card">
              <CardHeader>
                <Heart className="impact-icon-accent" />
                <CardTitle>Unterstützen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="impact-description">
                  Helfen Sie uns mit einer Spende, unsere Arbeit zu finanzieren.
                </p>
                <Button variant="outline" asChild>
                  <a href="/unterstuetzen">Spenden</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mitmachen;
