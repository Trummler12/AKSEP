import { Users, Heart, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { startPageContent } from '../../data/start';

/**
 * MitmachenSection Component
 * Displays participation options (Become member, Get active, Support)
 * Used on the start page
 */
const MitmachenSection = () => {
  return (
    <section className="content-section-plain">
      <div className="content-container">
        <div className="content-inner-centered">
          <h2 className="content-heading-xl">{startPageContent.participationSection.title}</h2>
          <p className="content-description-compact">
            {startPageContent.participationSection.description}
          </p>

          <div className="content-impact-grid">
            <Card className="content-impact-card">
              <CardHeader>
                <Users className="content-impact-icon-primary" />
                <CardTitle>Mitglied werden</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="content-impact-description">
                  Werden Sie offizielles Mitglied und gestalten Sie unsere Politik aktiv mit.
                </p>
                <Button asChild>
                  <a href="/mitglied-werden">Jetzt beitreten</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="content-impact-card">
              <CardHeader>
                <Lightbulb className="content-impact-icon-secondary" />
                <CardTitle>Mitmachen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="content-impact-description">
                  Bringen Sie Ihre Ideen und Expertise in unsere Arbeitsgruppen ein.
                </p>
                <Button variant="secondary" asChild>
                  <a href="/mitmachen">Aktiv werden</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="content-impact-card">
              <CardHeader>
                <Heart className="content-impact-icon-accent" />
                <CardTitle>Unterstützen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="content-impact-description">
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

export default MitmachenSection;
