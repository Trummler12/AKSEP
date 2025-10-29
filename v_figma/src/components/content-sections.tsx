import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowRight, Calendar, FileText, Globe, Heart, Lightbulb, Shield, Users } from 'lucide-react';

const ContentSections = () => {
  const newsItems = [
    {
      title: "Bildungsreform: Grundreformierung des Bildungssystems",
      description: "Moderne, digitale und international vergleichbare Bildungsangebote schaffen",
      date: "15. März 2024",
      href: "/programm/bildung"
    },
    {
      title: "Discord-Server: Bürgernähe digital leben",
      description: "Plattform für Austausch, Ressourcen-Sharing und demokratische Teilhabe",
      date: "8. März 2024",
      href: "https://discord.gg/nE7TKtBQnr"
    },
    {
      title: "AKSEPtanz: Gleiche Chancen für alle",
      description: "Unser Ideal einer Gesellschaft ohne systemische Benachteiligung",
      date: "1. März 2024",
      href: "/praeambel"
    }
  ];

  const programHighlights = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Bildungsreform",
      description: "Grundreformierung des Bildungssystems mit digitalen, international vergleichbaren Angeboten",
      href: "/programm/bildung"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Klimapolitik",
      description: "Klimatologisch und soziologisch - für Umwelt und gute Gesprächskultur",
      href: "/programm/klimaschutz"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Sozialpolitik",
      description: "Effiziente, barrierefreie Unterstützung ohne bürokratische Hürden",
      href: "/programm/soziales"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Europa & Migration",
      description: "Grenzübergreifende Zusammenarbeit und menschenwürdige Migrationspolitik",
      href: "/programm/europa-migration"
    }
  ];

  return (
    <div className="space-y-20">
      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl mb-6">Was bedeutet AKSEP?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                <strong>Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei</strong><br/>
                Wir vereinen formelle Politik mit informeller Aufklärungsarbeit und setzen auf evidenzbasierte Entscheidungen 
                mit Expertenwissen statt auf reine Ideologie.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl mb-4">Unsere Säulen</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="bg-primary rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Klimafreundlich:</strong> Klimatologisch und soziologisch - für eine gute Gesprächskultur
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="bg-secondary rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Sozialdemokratisch:</strong> Effiziente, barrierefreie Unterstützung für alle
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="bg-accent rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <strong>Europa-Partei:</strong> Grenzübergreifend aktiv für gemeinsame Werte
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="bg-primary rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
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
                    <p className="text-sm mb-4">
                      "In einer Zeit des Informationsüberflusses setzen wir uns für einen verantwortungsvollen 
                      Umgang mit Daten ein. Information bildet die Grundlage für jeden gesellschaftlichen Wandel..."
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="/praeambel" className="flex items-center space-x-2">
                          <span>Vollständige Präambel</span>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href="https://discord.gg/nE7TKtBQnr" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
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

      {/* Program Highlights */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-6">Programm-Highlights</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unsere Arbeitsgruppen entwickeln evidenzbasierte Lösungen für die wichtigsten gesellschaftlichen Herausforderungen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programHighlights.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <div className="text-primary">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
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
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <a href="/programm" className="flex items-center space-x-2">
                <span>Vollständiges Programm ansehen</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl mb-6">Aktuelles</h2>
            <p className="text-lg text-muted-foreground">
              Die neuesten Entwicklungen und Positionen von DIE AKSEP
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
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
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <a href="/presse" className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Alle Pressemitteilungen</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl mb-6">Gemeinsam für AKSEPtanz</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unterstützen Sie uns dabei, eine Gesellschaft zu schaffen, in der jede Person die gleichen Chancen hat. 
              Aktivistisch, klimafreundlich, sozialdemokratisch - für ein vereintes Europa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Mitglied werden</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Werden Sie offizielles Mitglied und gestalten Sie unsere Politik aktiv mit.
                  </p>
                  <Button asChild>
                    <a href="/mitglied-werden">Jetzt beitreten</a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Lightbulb className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <CardTitle>Mitmachen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bringen Sie Ihre Ideen und Expertise in unsere Arbeitsgruppen ein.
                  </p>
                  <Button variant="secondary" asChild>
                    <a href="/mitmachen">Aktiv werden</a>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
                  <CardTitle>Unterstützen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
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
  );
};

export default ContentSections;