import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HomePage } from './pages/HomePage'
import { MainLayout } from './layouts/MainLayout'
import { MundosPage } from './pages/MundosPage'
import { MundoContentPage } from './pages/MundoContentPage'
import { PlaylistDetailPage } from './pages/PlaylistDetailPage'
import { VideoConfigPage } from './pages/VideoConfigPage'
import { GamifiedPlaylistsPage } from './pages/GamifiedPlaylistsPage'
import { AITest } from './components/AITest'
import { Toaster } from 'sonner'
import { createAppTheme } from './theme'
import NostrDemoPage from './pages/NostrDemoPage'

const queryClient = new QueryClient()
const theme = createAppTheme('light');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/mundos" element={<MundosPage />} />
              <Route path="/mundos/:mundoId/contenido" element={<MundoContentPage />} />
              <Route path="/playlists" element={<GamifiedPlaylistsPage />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
              <Route path="/items/:itemId/config" element={<VideoConfigPage />} />
              <Route path="/settings" element={<div>Página de Configuración (Placeholder)</div>} />
              <Route path="/ai-test" element={<AITest />} />
              <Route path="/nostr-demo" element={<NostrDemoPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
