import HeroSection from '../components/hero-section';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Icon } from '../components/ui/icon';
import { ArrowRight, Calendar, FileText, Users, Heart, Lightbulb } from 'lucide-react';
import { newsItems, programHighlights, startPageContent } from '../data/startpage';

// Import homepage-specific styles
import '../styles/pages/homepage.css';

const StartPageContent = () => {
  return (
    <>
      <HeroSection />
      <div className="content-page-stack">
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
      </div>
    </>
  );
};

export default StartPageContent;
