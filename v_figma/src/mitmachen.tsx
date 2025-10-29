import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Mitmachen() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Mitmachen" 
          description="Bringen Sie Ihre Ideen und Expertise in unsere Arbeitsgruppen ein."
        />
      </main>
      <Footer />
    </>
  );
}