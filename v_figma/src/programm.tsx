import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Programm() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Programm" 
          description="Unser vollständiges Parteiprogramm mit allen Arbeitsgruppen und politischen Positionen."
        />
      </main>
      <Footer />
    </>
  );
}