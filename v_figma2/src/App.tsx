import React from 'react';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { Users, Lightbulb, Heart, Globe } from 'lucide-react';

export default function App() {
  return (
    <div className="dark">
      <Navigation />
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span>Aktivistisch • Klimafreundlich • Sozialdemokratisch</span>
            </div>
            <h1 className="hero-title">DIE AKSEP</h1>
            <p className="hero-subtitle">
              Aktivistisch. Klimafreundlich. Sozialdemokratisch. Europa. Partei.
            </p>
            <p className="hero-description">
              Wir sind eine politische Bewegung, die sich für eine gerechte, nachhaltige und demokratische Zukunft einsetzt.
              Unsere Vision ist ein Europa, das allen Menschen gleiche Chancen bietet.
            </p>
            <div className="hero-actions">
              <a href="/programm" className="btn btn--primary btn--lg">
                Unser Programm
              </a>
              <a href="/mitmachen" className="btn btn--outline btn--lg">
                Mitmachen
              </a>
            </div>
          </div>
        </section>

        {/* AKSEP Bedeutung */}
        <section className="akronym-section">
          <div className="akronym-content">
            <h2 className="section-heading">Was bedeutet AKSEP?</h2>
            <div className="akronym-list">
              <div className="akronym-item">
                <div className="akronym-bullet">A</div>
                <div className="akronym-text">
                  <strong>Aktivistisch</strong>
                  <p>Wir glauben an politische Teilhabe und gesellschaftliches Engagement. Veränderung entsteht durch aktives Handeln.</p>
                </div>
              </div>
              <div className="akronym-item">
                <div className="akronym-bullet">K</div>
                <div className="akronym-text">
                  <strong>Klimafreundlich</strong>
                  <p>Der Kampf gegen den Klimawandel ist eine der größten Herausforderungen unserer Zeit. Nachhaltigkeit steht im Zentrum unserer Politik.</p>
                </div>
              </div>
              <div className="akronym-item">
                <div className="akronym-bullet">S</div>
                <div className="akronym-text">
                  <strong>Sozialdemokratisch</strong>
                  <p>Gerechtigkeit, Solidarität und gleiche Chancen für alle - das sind die Grundpfeiler unserer politischen Überzeugung.</p>
                </div>
              </div>
              <div className="akronym-item">
                <div className="akronym-bullet">E</div>
                <div className="akronym-text">
                  <strong>Europa</strong>
                  <p>Wir stehen für ein geeintes, demokratisches Europa, das Vielfalt schätzt und gemeinsam große Herausforderungen angeht.</p>
                </div>
              </div>
              <div className="akronym-item">
                <div className="akronym-bullet">P</div>
                <div className="akronym-text">
                  <strong>Partei</strong>
                  <p>Als organisierte politische Kraft arbeiten wir daran, unsere Werte in konkrete Politik umzusetzen.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programm Preview */}
        <section className="programm-section">
          <div className="section-content">
            <h2 className="section-heading">Unsere Schwerpunkte</h2>
            <div className="programm-grid">
              <div className="programm-card">
                <div className="programm-card-header">
                  <div className="programm-card-icon">
                    <Lightbulb />
                  </div>
                  <h3 className="programm-card-title">Bildung</h3>
                </div>
                <div className="programm-card-content">
                  <p>Bildung ist der Schlüssel zu einer gerechten Gesellschaft. Wir setzen uns für kostenlose, hochwertige Bildung für alle ein.</p>
                </div>
                <div className="programm-card-footer">
                  <a href="/programm/bildung" className="btn btn--ghost btn--sm">Mehr erfahren</a>
                </div>
              </div>

              <div className="programm-card">
                <div className="programm-card-header">
                  <div className="programm-card-icon">
                    <Users />
                  </div>
                  <h3 className="programm-card-title">Demokratie</h3>
                </div>
                <div className="programm-card-content">
                  <p>Stärkung der demokratischen Teilhabe und Transparenz in politischen Prozessen auf allen Ebenen.</p>
                </div>
                <div className="programm-card-footer">
                  <a href="/programm/demokratie" className="btn btn--ghost btn--sm">Mehr erfahren</a>
                </div>
              </div>

              <div className="programm-card">
                <div className="programm-card-header">
                  <div className="programm-card-icon">
                    <Globe />
                  </div>
                  <h3 className="programm-card-title">Klima</h3>
                </div>
                <div className="programm-card-content">
                  <p>Entschlossenes Handeln gegen den Klimawandel mit sozialer Gerechtigkeit und wirtschaftlicher Vernunft.</p>
                </div>
                <div className="programm-card-footer">
                  <a href="/programm/klima" className="btn btn--ghost btn--sm">Mehr erfahren</a>
                </div>
              </div>

              <div className="programm-card">
                <div className="programm-card-header">
                  <div className="programm-card-icon">
                    <Heart />
                  </div>
                  <h3 className="programm-card-title">Soziales</h3>
                </div>
                <div className="programm-card-content">
                  <p>Ein starker Sozialstaat, der allen Menschen Sicherheit und Perspektiven bietet - von der Geburt bis ins Alter.</p>
                </div>
                <div className="programm-card-footer">
                  <a href="/programm/soziales" className="btn btn--ghost btn--sm">Mehr erfahren</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mitmachen Call-to-Action */}
        <section className="mitmachen-section">
          <div className="mitmachen-content">
            <h2 className="section-heading">Werde Teil der Bewegung</h2>
            <div className="mitmachen-grid">
              <div className="mitmachen-card">
                <div className="mitmachen-card-icon">
                  <Users />
                </div>
                <h3 className="mitmachen-card-title">Mitglied werden</h3>
                <p className="mitmachen-card-text">
                  Werde offizielles Mitglied und gestalte unsere politische Agenda aktiv mit.
                </p>
                <a href="/mitgliedschaft" className="btn btn--primary">Beitreten</a>
              </div>

              <div className="mitmachen-card">
                <div className="mitmachen-card-icon">
                  <Heart />
                </div>
                <h3 className="mitmachen-card-title">Ehrenamt</h3>
                <p className="mitmachen-card-text">
                  Engagiere dich freiwillig in unseren Arbeitsgruppen und Projekten.
                </p>
                <a href="/ehrenamt" className="btn btn--primary">Mitmachen</a>
              </div>

              <div className="mitmachen-card">
                <div className="mitmachen-card-icon">
                  <Globe />
                </div>
                <h3 className="mitmachen-card-title">Unterstützen</h3>
                <p className="mitmachen-card-text">
                  Unterstütze unsere Arbeit durch Spenden oder das Teilen unserer Inhalte.
                </p>
                <a href="/spenden" className="btn btn--primary">Spenden</a>
              </div>
            </div>

            <div className="mitmachen-cta">
              <h3 className="mitmachen-cta-title">Gemeinsam für Veränderung</h3>
              <p className="mitmachen-cta-text">
                Jede Stimme zählt. Jeder Beitrag macht einen Unterschied. 
                Lass uns zusammen eine bessere Zukunft gestalten.
              </p>
              <div className="mitmachen-cta-buttons">
                <a href="/kontakt" className="btn btn--primary btn--lg">Kontakt aufnehmen</a>
                <a href="/newsletter" className="btn btn--outline btn--lg">Newsletter abonnieren</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}