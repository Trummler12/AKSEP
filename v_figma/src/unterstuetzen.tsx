import Navigation from './components/navigation';
import Footer from './components/footer';
import PagePlaceholder from './components/page-placeholder';

export default function Unterstuetzen() {
  return (
    <>
      <Navigation />
      <main>
        <PagePlaceholder 
          title="Unterstützen" 
          description="Helfen Sie uns mit einer Spende, unsere Arbeit für eine bessere Politik zu finanzieren."
        />
      </main>
      <Footer />
    </>
  );
}