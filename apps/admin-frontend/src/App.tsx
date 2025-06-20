import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { HomePage } from './pages/HomePage'
import { MainLayout } from './layouts/MainLayout'
import { MundosPage } from './pages/MundosPage'
import { MundoContentPage } from './pages/MundoContentPage'
import { PlaylistDetailPage } from './pages/PlaylistDetailPage'
import { VideoConfigPage } from './pages/VideoConfigPage'
import { GamifiedPlaylistsPage } from './pages/GamifiedPlaylistsPage'
import { PlaylistDirectPage } from './pages/PlaylistDirectPage'
import { PlaylistRedirectPage } from './pages/PlaylistRedirectPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { UsersPage } from './pages/UsersPage'
import { RolesPage } from './pages/RolesPage'
import { PermissionsPage } from './pages/PermissionsPage'
import { ItemsPage } from './pages/ItemsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { AITest } from './components/AITest'
import { Toaster } from 'sonner'
import { createAppTheme } from './theme'
import { useAuthStore } from './store/authStore'
import NostrDemoPage from './pages/NostrDemoPage'
import { ChallengesPage } from './pages/ChallengesPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { TransactionsPage } from './pages/TransactionsPage'
import ConsolePage from './pages/ConsolePage'

const queryClient = new QueryClient()
const theme = createAppTheme('light');

function App() {
  const { initializeAuth } = useAuthStore();

  // Inicializar autenticación al cargar la aplicación
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            {/* Rutas de autenticación (sin layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Rutas principales (con layout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/mundos" element={<MundosPage />} />
              <Route path="/mundos/:mundoId/contenido" element={<MundoContentPage />} />
              <Route path="/playlists" element={<GamifiedPlaylistsPage />} />
              <Route path="/playlist-direct" element={<PlaylistDirectPage />} />
              <Route path="/playlist" element={<PlaylistRedirectPage />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:itemId/config" element={<VideoConfigPage />} />
              
              {/* Rutas de administración */}
              <Route path="/users" element={<UsersPage />} />
              <Route path="/roles" element={<RolesPage />} />
              <Route path="/permissions" element={<PermissionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              
              {/* 🎮 Consola de Experiencias CoomÜnity */}
              <Route path="/console" element={<ConsolePage />} />
              
              {/* Ruta de perfil de usuario */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Otras rutas */}
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
