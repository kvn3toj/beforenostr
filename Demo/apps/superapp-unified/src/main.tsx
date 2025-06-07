import React from 'react'
import ReactDOM from 'react-dom/client'
import { initMonitoring } from './lib/monitoring'
import ErrorBoundary from './components/ui/ErrorBoundary'
import App from './App'
import './index.css'

// Inicializar monitoreo antes que cualquier otra cosa
initMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
) 