import '@/styles/components/content-sections/start/aktuell.css';
import { ArrowRight, Calendar, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Heading } from '../../shared';
import { newsItems, startPageContent } from '../../../data/start';

/**
 * Aktuell Section
 * Displays news items and call-to-action to press page
 * Used on the start page
 */
const Aktuell = () => {
  return (
    <section className="content-section-plain">
      <div className="content-container">
        <Heading
          title={startPageContent.newsSection.title}
          description={startPageContent.newsSection.description}
        />

        <div className="news-grid">
          {newsItems.map((item) => (
            <Card key={item.href} className="news-card">
              <CardHeader>
                <div className="news-meta">
                  <Calendar className="news-icon" />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="news-title">{item.title}</CardTitle>
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

        <div className="news-cta">
          <Button size="lg" variant="outline" asChild>
            <a href="/presse" className="inline-link">
              <FileText className="content-icon-sm" />
              <span>Alle Pressemitteilungen</span>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Aktuell;
