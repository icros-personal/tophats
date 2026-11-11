import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// "/tophats/" -> "/tophats" (react-router wants no trailing slash)
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const container = document.getElementById('root')!;
// Pre-rendered pages arrive with HTML already inside #root: attach to it.
// The dev server and 404.html send an empty #root: render from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
