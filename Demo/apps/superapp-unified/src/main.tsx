import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeErrorHandling } from './utils/errorHandler';
import { initMonitoring } from './lib/monitoring';
import ErrorBoundary from './components/ui/ErrorBoundary';
import App from './App';
import './index.css';
import './styles/ayni-solar-system-fullscreen.css';
import './styles/orbital-planets-3d.css';

// 🛡️ CRÍTICO: Inicializar manejo de errores PRIMERO para interceptar errores de conversión
initializeErrorHandling();

// Inicializar monitoreo después del manejo de errores
initMonitoring();

// Desregistrar service workers en Builder.io para evitar interceptación de peticiones
if (typeof window !== 'undefined') {
  // 🐛 CORRECCIÓN CRÍTICA: La detección por puerto es frágil.
  // La forma robusta es verificar el hostname.
  const isBuilderIo = window.location.hostname.includes('builder.io');

  if (isBuilderIo && 'serviceWorker' in navigator) {
    console.log('🧹 Builder.io detected, unregistering service workers...');
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((boolean) => {
          console.log('✅ Service worker unregistered:', boolean);
        });
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Temporalmente deshabilitado para debugging de errores React DOM
  // <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  // </React.StrictMode>
);
