import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/components/ui/.figma-ui-components.css';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(<App />);
}
