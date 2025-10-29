import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function UeberUns() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Über uns" 
          description="Erfahren Sie mehr über DIE AKSEP - unsere Geschichte, unsere Menschen und unsere Ziele."
        />
      </main>
      <Footer />
    </>
  );
}