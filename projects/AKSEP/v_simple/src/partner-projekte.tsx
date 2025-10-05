import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function PartnerProjekte() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Partner & Projekte" 
          description="Unsere Kooperationspartner und gemeinsame Projekte für eine bessere Zukunft."
        />
      </main>
      <Footer />
    </>
  );
}