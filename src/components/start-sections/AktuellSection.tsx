import { ArrowRight, Calendar, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { newsItems, startPageContent } from '../../data/start';

/**
 * AktuellSection Component
 * Displays news items and call-to-action to press page
 * Used on the start page
 */
const AktuellSection = () => {
  return (
    <section className="content-section-card">
      <div className="content-container">
        <div className="content-header">
          <h2 className="content-heading-xl">{startPageContent.newsSection.title}</h2>
          <p className="content-description-base">{startPageContent.newsSection.description}</p>
        </div>

        <div className="content-news-grid">
          {newsItems.map((item) => (
            <Card key={item.href} className="content-news-card">
              <CardHeader>
                <div className="content-news-meta">
                  <Calendar className="content-news-icon" />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="content-news-title">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <a href={item.href} className="content-news-link">
                    <span>Weiterlesen</span>
                    <ArrowRight className="content-icon-xs" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="content-news-cta">
          <Button size="lg" variant="outline" asChild>
            <a href="/presse" className="content-inline-link">
              <FileText className="content-icon-sm" />
              <span>Alle Pressemitteilungen</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AktuellSection;
