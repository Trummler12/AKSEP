import { Button } from './ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  backLink?: string;
}

const PagePlaceholder = ({ title, description, backLink = "/" }: PagePlaceholderProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="bg-primary/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Construction className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-3xl mb-4">{title}</h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          {description || "Diese Seite ist in Entwicklung und wird bald verfügbar sein."}
        </p>
        
        <Button asChild>
          <a href={backLink} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Zurück zur Startseite</span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default PagePlaceholder;