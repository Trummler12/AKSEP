import React from 'react';
import { Mail, Globe, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Über DIE AKSEP */}
        <div className="footer-col">
          <h3 className="footer-col-title">DIE AKSEP</h3>
          <p className="footer-text">
            Aktivistisch. Klimafreundlich. Sozialdemokratisch. Europa. Partei.
          </p>
          <p className="footer-text">
            Wir setzen uns ein für eine gerechte, nachhaltige und demokratische Zukunft.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-col">
          <h3 className="footer-col-title">Navigation</h3>
          <a href="/begriffe" className="footer-link">Begriffe</a>
          <a href="/programm" className="footer-link">Programm</a>
          <a href="/ueber-uns" className="footer-link">Über uns</a>
          <a href="/aktuelles" className="footer-link">Aktuelles</a>
          <a href="/kontakt" className="footer-link">Kontakt</a>
        </div>

        {/* Programm */}
        <div className="footer-col">
          <h3 className="footer-col-title">Programm</h3>
          <a href="/programm/praeambel" className="footer-link">Präambel</a>
          <a href="/programm/bildung" className="footer-link">Bildung</a>
          <a href="/programm/demokratie" className="footer-link">Demokratie</a>
          <a href="/programm/europa" className="footer-link">Europa</a>
          <a href="/programm/klima" className="footer-link">Klima</a>
          <a href="/programm/soziales" className="footer-link">Soziales</a>
        </div>

        {/* Kontakt & Legal */}
        <div className="footer-col">
          <h3 className="footer-col-title">Kontakt & Rechtliches</h3>
          <a href="/kontakt" className="footer-link">
            <Mail style={{ width: 16, height: 16, display: 'inline', marginRight: 8 }} />
            Kontakt
          </a>
          <a href="/impressum" className="footer-link">
            <FileText style={{ width: 16, height: 16, display: 'inline', marginRight: 8 }} />
            Impressum
          </a>
          <a href="/datenschutz" className="footer-link">
            <Globe style={{ width: 16, height: 16, display: 'inline', marginRight: 8 }} />
            Datenschutz
          </a>
          <a href="/ueber-uns/satzung" className="footer-link">Satzung</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-bottom-text">
            © {currentYear} DIE AKSEP. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};
