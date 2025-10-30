import { ArrowLeft, Construction } from 'lucide-react';

const PagePlaceholder = () => {
  return (
    <section className="standard-placeholder-section">
      <div className="standard-placeholder-card">
        <div className="standard-placeholder-icon-wrap">
          <Construction className="standard-placeholder-icon" />
        </div>
        <div className="standard-placeholder-stack">
          <h1 className="standard-placeholder-title">Seite in Arbeit</h1>
          <p className="standard-placeholder-description">
            Dieser Bereich wird momentan überarbeitet. Bitte schauen Sie bald wieder vorbei.
          </p>
          <a href="/" className="standard-placeholder-link">
            <ArrowLeft className="standard-placeholder-link-icon" />
            <span>Zurück zur Startseite</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PagePlaceholder;
