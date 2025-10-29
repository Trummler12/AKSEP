import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Satzung() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Satzung" 
          description="Die offizielle Satzung von DIE AKSEP - transparent und für alle einsehbar."
        />
      </main>
      <Footer />
    </>
  );
}