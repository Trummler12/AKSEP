import React from 'react';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import '../styles/pages/not-found.css';

interface NotFoundProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = 'Seite nicht gefunden',
  description = 'Diese Seite befindet sich noch im Aufbau. Wir arbeiten daran, Ihnen bald mehr Informationen zur Verfügung zu stellen.',
  icon,
}) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">
          {icon || <FileQuestion />}
        </div>

        <div className="placeholder-divider" />

        <h1 className="placeholder-title">{title}</h1>

        <p className="placeholder-description">{description}</p>

        <div className="placeholder-actions">
          <a href="/start" className="btn btn--primary">
            <Home className="btn-icon" />
            Zur Startseite
          </a>
          <button
            onClick={() => window.history.back()}
            className="btn btn--secondary"
            type="button"
          >
            <ArrowLeft className="btn-icon" />
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
