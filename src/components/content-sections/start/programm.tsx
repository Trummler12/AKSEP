import '@/styles/components/content-sections/start/programm.css';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Heading } from '@/components/shared';
import { programHighlights, startPageContent } from '@/data/start';

/**
 * Programm Section
 * Displays program highlights and call-to-action to full program
 * Used on the start page
 */
const Programm = () => {
  return (
    <section className="content-section-plain">
      <div className="content-container">
        <Heading
          title={startPageContent.programSection.title}
          description={startPageContent.programSection.description}
        />

        <div className="program-grid">
          {programHighlights.map((item) => (
            <Card key={item.href} className="content-card-interactive">
              <CardHeader>
                <div className="card-icon-wrapper">
                  <div className="card-icon-color">
                    <Icon name={item.iconName} className="content-card-icon-size" />
                  </div>
                </div>
                <CardTitle className="card-title">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="card-description">{item.description}</p>
                <Button variant="ghost" size="sm" asChild>
                  <a href={item.href} className="content-card-link">
                    <span>Mehr erfahren</span>
                    <ArrowRight className="content-icon-xs" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="program-cta">
          <Button size="lg" variant="outline" asChild>
            <a href="/programm" className="inline-link">
              <span>Vollständiges Programm ansehen</span>
              <ArrowRight className="content-icon-sm" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Programm;
