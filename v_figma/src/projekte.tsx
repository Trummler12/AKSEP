import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Projekte() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Projekte" 
          description="Unsere aktuellen Projekte und Initiativen für gesellschaftlichen Wandel."
        />
      </main>
      <Footer />
    </>
  );
}