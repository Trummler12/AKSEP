import { Button } from './ui/button';
import { ArrowRight, Users, BookOpen, Calendar } from 'lucide-react';
import aksepLogo from 'figma:asset/656b674fc169e7dedbf127dfaf9ab8d51d976120.png';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-background to-card py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <img src={aksepLogo} alt="DIE AKSEP Logo" className="h-16 w-16 lg:h-20 lg:w-20" />
            <div>
              <h1 className="text-4xl lg:text-6xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                DIE AKSEP
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground">
                Für eine informierte und transparente Politik
              </p>
            </div>
          </div>

          {/* Main Slogan */}
          <h2 className="text-2xl lg:text-4xl mb-6 max-w-3xl mx-auto">
            Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei
          </h2>

          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            <strong>Informationspolitik als Hauptfokus:</strong> Wir verbinden Bildung, Medien und Digitalisierung 
            zu einem integrativen Ansatz für evidenzbasierte Politik und AKSEPtanz.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <a href="/programm" className="flex items-center space-x-2">
                <span>Unser Programm</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/mitglied-werden" className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Mitglied werden</span>
              </a>
            </Button>
          </div>

          {/* Key Stats/Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Bildung revolutionieren</h3>
              <p className="text-sm text-muted-foreground">
                Moderne, digitale und international vergleichbare Bildungsangebote schaffen
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="mb-2">AKSEPtanz leben</h3>
              <p className="text-sm text-muted-foreground">
                Gleiche Chancen für alle - unabhängig von Herkunft oder Umständen
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-2">Bürgernah agieren</h3>
              <p className="text-sm text-muted-foreground">
                Expertenwissen systematisch in Entscheidungsprozesse integrieren
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;