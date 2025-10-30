import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Icon } from '../ui/icon';
import { programHighlights, startPageContent } from '../../data/start';

/**
 * ProgrammSection Component
 * Displays program highlights and call-to-action to full program
 * Used on the start page
 */
const ProgrammSection = () => {
  return (
    <section className="content-section-plain">
      <div className="content-container">
        <div className="content-header">
          <h2 className="content-heading-xl">{startPageContent.programSection.title}</h2>
          <p className="content-description-wide">
            {startPageContent.programSection.description}
          </p>
        </div>

        <div className="content-program-grid">
          {programHighlights.map((item) => (
            <Card key={item.href} className="content-card-interactive">
              <CardHeader>
                <div className="content-card-icon-wrapper">
                  <div className="content-card-icon-color">
                    <Icon name={item.iconName} className="content-card-icon-size" />
                  </div>
                </div>
                <CardTitle className="content-card-title">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="content-card-description">{item.description}</p>
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

        <div className="content-program-cta">
          <Button size="lg" variant="outline" asChild>
            <a href="/programm" className="content-inline-link">
              <span>Vollständiges Programm ansehen</span>
              <ArrowRight className="content-icon-sm" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgrammSection;
