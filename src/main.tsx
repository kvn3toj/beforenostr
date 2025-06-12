import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import './config/i18n'
import { analyticsService } from './services/analytics'

// Inicializar analytics para programa beta
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  analyticsService.initialize().catch(console.error)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
