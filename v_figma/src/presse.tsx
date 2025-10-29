import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Presse() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Presse" 
          description="Pressemitteilungen, Stellungnahmen und Medieninformationen von DIE AKSEP."
        />
      </main>
      <Footer />
    </>
  );
}