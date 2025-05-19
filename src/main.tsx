import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { NostrProvider } from './contexts/NostrProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NostrProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </NostrProvider>
  </React.StrictMode>,
)
