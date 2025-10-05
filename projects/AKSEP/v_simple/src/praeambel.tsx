import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Praeambel() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Präambel" 
          description="Unsere Grundsätze: Aktivistisch · Klimafreundlich · Sozialdemokratisch · Europa-Partei"
        />
      </main>
      <Footer />
    </>
  );
}