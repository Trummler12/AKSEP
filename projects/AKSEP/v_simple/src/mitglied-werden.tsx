import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function MitgliedWerden() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Mitglied werden" 
          description="Werden Sie Teil von DIE AKSEP und gestalten Sie aktiv unsere Politik mit."
        />
      </main>
      <Footer />
    </>
  );
}