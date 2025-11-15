import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // In production: /sw.js (built from src/sw.ts)
    // In development: /src/sw.ts (via Vite)
    const swPath = import.meta.env.DEV ? '/src/sw.ts' : '/sw.js';

    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
