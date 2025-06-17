import React from 'react';
import ReactDOM from 'react-dom/client';
import { initMonitoring } from './lib/monitoring';
import ErrorBoundary from './components/ui/ErrorBoundary';
import App from './App';
import './index.css';
import './styles/ayni-solar-system-fullscreen.css';
import './styles/orbital-planets-3d.css';

// Inicializar monitoreo antes que cualquier otra cosa
initMonitoring();

// Desregistrar service workers en Builder.io para evitar interceptación de peticiones
if (typeof window !== 'undefined') {
  const currentPort = parseInt(window.location.port);
  const isBuilderIo = currentPort !== 3001; // Si no estamos en puerto nativo, es Builder.io

  if (isBuilderIo && 'serviceWorker' in navigator) {
    console.log('🧹 Builder.io detected, unregistering service workers...');
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister().then(function (boolean) {
          console.log('✅ Service worker unregistered:', boolean);
        });
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
