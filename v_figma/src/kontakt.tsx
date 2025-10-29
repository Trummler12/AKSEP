import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Kontakt() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Kontakt" 
          description="Nehmen Sie Kontakt mit uns auf. Besuchen Sie auch unseren Discord-Server für direkten Austausch."
        />
      </main>
      <Footer />
    </>
  );
}