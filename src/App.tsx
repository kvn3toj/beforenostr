import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { HomePage } from './pages/HomePage'
import { MainLayout } from './layouts/MainLayout'
import { MundosPage } from './pages/MundosPage'
import { MundoDetailPage } from './pages/MundoDetailPage'
import { MundoContentPage } from './pages/MundoContentPage'
import { PlaylistDetailPage } from './pages/PlaylistDetailPage'
import { VideoConfigPage } from './pages/VideoConfigPage'
import { GamifiedPlaylistsPage } from './pages/GamifiedPlaylistsPage'
import { PlaylistDirectPage } from './pages/PlaylistDirectPage'
import { PlaylistRedirectPage } from './pages/PlaylistRedirectPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { BetaRegisterPage } from './pages/BetaRegisterPage'
import { UsersPage } from './pages/UsersPage'
import { RolesPage } from './pages/RolesPage'
import { PermissionsPage } from './pages/PermissionsPage'
import { ItemsPage } from './pages/ItemsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { AuditLogsPage } from './pages/AuditLogsPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { TokensPage } from './pages/TokensPage'
import { WalletPage } from './pages/WalletPage'
import { MeritsPage } from './pages/MeritsPage'
import { GroupsPage } from './pages/GroupsPage'
import { ChallengesPage } from './pages/ChallengesPage'
import { CreateChallengePage } from './pages/CreateChallengePage'
import { SocialPage } from './pages/SocialPage'
import { MarketplacePage } from './pages/MarketplacePage'
import { InvitationsPage } from './pages/InvitationsPage'
import { NewInvitationPage } from './pages/NewInvitationPage'
import { PersonalitiesPage } from './pages/PersonalitiesPage'
import { AITest } from './components/AITest'
import { Toaster } from 'sonner'
import { createAppTheme } from './theme'
import { useAuthStore } from './store/authStore'
import NostrDemoPage from './pages/NostrDemoPage'

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
            <Route path="/beta-register" element={<BetaRegisterPage />} />
            
            {/* Rutas principales (con layout) */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/mundos" element={<MundosPage />} />
              <Route path="/mundos/:mundoId" element={<MundoDetailPage />} />
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
              
              {/* Rutas de gamificación */}
              <Route path="/tokens" element={<TokensPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/merits" element={<MeritsPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/challenges/create" element={<CreateChallengePage />} />
              <Route path="/social" element={<SocialPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/invitations" element={<InvitationsPage />} />
              <Route path="/invitations/new" element={<NewInvitationPage />} />
              <Route path="/personalities" element={<PersonalitiesPage />} />
              
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
