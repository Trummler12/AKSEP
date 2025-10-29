import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Termine() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Termine" 
          description="Aktuelle Termine, Veranstaltungen und wichtige Daten von DIE AKSEP."
        />
      </main>
      <Footer />
    </>
  );
}