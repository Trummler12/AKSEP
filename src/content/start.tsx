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
      <div className="space-y-20">
        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="mb-6 text-3xl lg:text-4xl">{startPageContent.aksepDescription.title}</h2>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                  <strong>{startPageContent.aksepDescription.subtitle}</strong>
                  <br />
                  {startPageContent.aksepDescription.description}
                </p>
              </div>

              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl">Unsere Säulen</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="mt-1 rounded-full bg-primary p-1">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <strong>Klimafreundlich:</strong> Klimatologisch und soziologisch - für eine gute Gesprächskultur
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-1 rounded-full bg-secondary p-1">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <strong>Sozialdemokratisch:</strong> Effiziente, barrierefreie Unterstützung für alle
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-1 rounded-full bg-accent p-1">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <div>
                        <strong>Europa-Partei:</strong> Grenzübergreifend aktiv für gemeinsame Werte
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="mt-1 rounded-full bg-primary p-1">
                        <div className="h-2 w-2 rounded-full bg-white" />
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
                      <p className="mb-4 text-sm">
                        "In einer Zeit des Informationsüberflusses setzen wir uns für einen verantwortungsvollen Umgang mit Daten ein.
                        Information bildet die Grundlage für jeden gesellschaftlichen Wandel..."
                      </p>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/praeambel" className="flex items-center space-x-2">
                            <span>Vollständige Präambel</span>
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href="https://discord.gg/5nBmmbqSPH"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <span>Discord-Server</span>
                            <ArrowRight className="h-4 w-4" />
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

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-3xl lg:text-4xl">{startPageContent.programSection.title}</h2>
              <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
                {startPageContent.programSection.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {programHighlights.map((item) => (
                <Card key={item.href} className="cursor-pointer transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <div className="text-primary">
                        <Icon name={item.iconName} className="h-6 w-6" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.href} className="flex items-center space-x-2">
                        <span>Mehr erfahren</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" variant="outline" asChild>
                <a href="/programm" className="flex items-center space-x-2">
                  <span>Vollständiges Programm ansehen</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-3xl lg:text-4xl">{startPageContent.newsSection.title}</h2>
              <p className="text-lg text-muted-foreground">{startPageContent.newsSection.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <Card key={item.href} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.href} className="flex items-center space-x-2">
                        <span>Weiterlesen</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" variant="outline" asChild>
                <a href="/presse" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Alle Pressemitteilungen</span>
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-3xl lg:text-4xl">{startPageContent.participationSection.title}</h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                {startPageContent.participationSection.description}
              </p>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="text-center">
                  <CardHeader>
                    <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <CardTitle>Mitglied werden</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Werden Sie offizielles Mitglied und gestalten Sie unsere Politik aktiv mit.
                    </p>
                    <Button asChild>
                      <a href="/mitglied-werden">Jetzt beitreten</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Lightbulb className="mx-auto mb-2 h-8 w-8 text-secondary" />
                    <CardTitle>Mitmachen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Bringen Sie Ihre Ideen und Expertise in unsere Arbeitsgruppen ein.
                    </p>
                    <Button variant="secondary" asChild>
                      <a href="/mitmachen">Aktiv werden</a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Heart className="mx-auto mb-2 h-8 w-8 text-accent" />
                    <CardTitle>Unterstützen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
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
