import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Alert,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';

// Hooks
import { useAuth } from '../contexts/AuthContext';

// Widgets
import { WelcomeWidget } from '../components/home/widgets/WelcomeWidget';
import { ReciprocidadBalanceWidget } from '../components/home/widgets/ReciprocidadBalanceWidget';
import { WalletWidget } from '../components/home/widgets/WalletWidget';
import { QuickActionsWidget } from '../components/home/widgets/QuickActionsWidget';
import { NotificationsWidget } from '../components/home/widgets/NotificationsWidget';
import { MainModulesWidget } from '../components/home/widgets/MainModulesWidget';

// Error Boundary
class HomePageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error">
            <Typography variant="h6">Error en el Dashboard</Typography>
            <Typography variant="body2">
              Se ha producido un error al cargar los componentes principales.
            </Typography>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
            >
              Recargar Página
            </Button>
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  if (!isAuthenticated) {
     return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Acceso Requerido
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Necesitas iniciar sesión para acceder al Dashboard.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/login')}
        >
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  // Placeholder para datos que vendrían de una API
  const isLoading = false;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <HomePageErrorBoundary>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>

            {/* Columna Principal */}
            <Grid item xs={12} lg={8}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <WelcomeWidget />
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{
                    p: {xs: 2, md: 3},
                    borderRadius: theme.shape.borderRadius,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper
                  }}>
                    <MainModulesWidget />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                   <Paper variant="outlined" sx={{
                     p: {xs: 2, md: 3},
                     borderRadius: theme.shape.borderRadius,
                     borderColor: theme.palette.divider,
                     backgroundColor: theme.palette.background.paper
                   }}>
                    <ReciprocidadBalanceWidget />
                   </Paper>
                </Grid>
              </Grid>
            </Grid>

            {/* Columna Lateral */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{
                    p: {xs: 2, md: 3},
                    borderRadius: theme.shape.borderRadius,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper
                  }}>
                    <WalletWidget />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{
                    p: {xs: 2, md: 3},
                    borderRadius: theme.shape.borderRadius,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper
                  }}>
                    <QuickActionsWidget />
                  </Paper>
                </Grid>
                 <Grid item xs={12}>
                  <Paper variant="outlined" sx={{
                    p: {xs: 2, md: 3},
                    borderRadius: theme.shape.borderRadius,
                    borderColor: theme.palette.divider,
                    backgroundColor: theme.palette.background.paper
                  }}>
                    <NotificationsWidget />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </HomePageErrorBoundary>
  );
}

export default HomePage;
