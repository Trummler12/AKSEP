import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Begriffe() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Begriffe" 
          description="Hier finden Sie unsere Sammlung klar definierter politischer Begriffe für besseres Verständnis."
        />
      </main>
      <Footer />
    </>
  );
}