import { Button } from '../components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  backLink?: string;
}

const PagePlaceholder = ({ title, description, backLink = '/' }: PagePlaceholderProps) => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
          <Construction className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-lg text-muted-foreground">
            {description || 'Diese Seite ist in Entwicklung und wird bald verfügbar sein.'}
          </p>
        </div>

        <Button asChild>
          <a href={backLink} className="inline-flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Zur Startseite</span>
          </a>
        </Button>
      </div>
    </section>
  );
};

export default PagePlaceholder;
