import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Fab,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
  useScrollTrigger,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
} from '@mui/material';
import {
  EmojiEvents,
  Psychology,
  Add,
  Refresh,
  ViewModule,
  ViewList,
  MoreVert,
  FilterList,
  Search,
} from '@mui/icons-material';
import { toast } from 'sonner';

// Componentes mejorados
import {
  ChallengeCard,
  ChallengeStats,
  ChallengeFilters,
} from '../components/modules/challenges';

// Hooks y tipos
import {
  useChallenges,
  useJoinChallenge,
  useUserChallenges,
} from '../hooks/useRealBackendData';
import { useAuth } from '../contexts/AuthContext';
import {
  ChallengeStatus,
  ChallengeDifficulty,
  ChallengeCategory,
  ChallengeType,
  ChallengeFilters as IFilters,
  Challenge,
} from '../types/challenges';

// 🔧 SOLUCIÓN: Función segura para formatear fechas
const formatSafeDate = (dateString?: string): string => {
  if (!dateString) return 'No especificada';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada: ${dateString}`);
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error(`❌ Error al formatear fecha: ${dateString}`, error);
    return 'Error en fecha';
  }
};

// Loading skeleton components
const ChallengeCardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: 400,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Skeleton variant="rectangular" height={120} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Box>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
      </CardContent>
    </Card>
  );
};

const StatsCardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 2 }}>
        <Skeleton variant="text" height={32} width={60} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" height={16} width={80} sx={{ mx: 'auto' }} />
      </CardContent>
    </Card>
  );
};

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  // State para pestañas y vista
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // State para filtros
  const [filters, setFilters] = useState<IFilters>({
    search: '',
    status: [],
    type: [],
    difficulty: [],
    category: [],
    sortBy: 'startDate',
    sortOrder: 'desc',
  });

  // Hooks para datos
  const {
    data: challengesData,
    isLoading: challengesLoading,
    error: challengesError,
    refetch: refetchChallenges,
  } = useChallenges(filters);

  const {
    data: userChallengesData,
    isLoading: userChallengesLoading,
    refetch: refetchUserChallenges,
  } = useUserChallenges(user?.id || '');

  const joinChallengeMutation = useJoinChallenge();

  // Scroll trigger para FAB
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  // Handlers
  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallengeMutation.mutateAsync(challengeId);
      toast.success('¡Te has sumado al desafío exitosamente!', {
        description: 'Comienza tu viaje de transformación y acumula Mëritos de crecimiento.',
      });
      refetchChallenges();
      refetchUserChallenges();
    } catch (error) {
      toast.error('Error al unirse al desafío', {
        description: 'Inténtalo de nuevo en unos momentos.',
      });
      console.error('Error joining challenge:', error);
    }
  };

  const handleViewChallenge = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  const handleLikeChallenge = (challengeId: string) => {
    // TODO: Implementar sistema de likes
    toast.info('¡Funcionalidad de resonancia próximamente!');
  };

  const handleShareChallenge = (challengeId: string) => {
    // TODO: Implementar sistema de compartir
    if (navigator.share) {
      navigator
        .share({
          title: 'Desafío de Transformación CoomÜnity',
          text: 'Únete a este increíble viaje de crecimiento consciente',
          url: `${window.location.origin}/challenges/${challengeId}`,
        })
        .catch(console.error);
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard
        .writeText(`${window.location.origin}/challenges/${challengeId}`)
        .then(() => {
          toast.success('¡Enlace copiado al portapapeles!');
        })
        .catch(() => {
          toast.error('Error al copiar enlace');
        });
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = () => {
    refetchChallenges();
    refetchUserChallenges();
  };

  const handleFiltersChange = (newFilters: IFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: [],
      type: [],
      difficulty: [],
      category: [],
      sortBy: 'startDate',
      sortOrder: 'desc',
    });
  };

  // Error State
  if (challengesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.error.main, 0.05),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: theme.palette.error.main, mb: 2 }}>
            Error al cargar desafíos
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
            Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            sx={{
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05)
              }
            }}
          >
            Reintentar
          </Button>
        </Paper>
      </Container>
    );
  }

  // Stats computadas
  const stats = {
    totalChallenges: challengesData?.challenges?.length || 0,
    activeChallenges: challengesData?.challenges?.filter((c: any) => c.status === 'active').length || 0,
    userChallenges: userChallengesData?.activeChallenges?.length || 0,
    completedChallenges: userChallengesData?.completedChallenges?.length || 0,
  };

  // Función para renderizar las tarjetas de estadísticas
  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} md={3}>
        {challengesLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 800 }}>
                {stats.totalChallenges}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Desafíos Totales
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid item xs={6} md={3}>
        {challengesLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.success.main,
              boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.1)}`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: theme.palette.success.main, fontWeight: 800 }}>
                {stats.activeChallenges}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Activos Ahora
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid item xs={6} md={3}>
        {userChallengesLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.info.main,
              boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.1)}`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: theme.palette.info.main, fontWeight: 800 }}>
                {stats.userChallenges}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Mis Desafíos
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid item xs={6} md={3}>
        {userChallengesLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card elevation={0} sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: theme.palette.warning.main,
              boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.1)}`,
            }
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: theme.palette.warning.main, fontWeight: 800 }}>
                {stats.completedChallenges}
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Completados
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  // Función para renderizar las opciones de vista
  const renderViewOptions = () => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 3,
      p: 2,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
          Desafíos de Transformación
        </Typography>
        <Chip
          label={`${challengesData?.challenges?.length || 0} disponibles`}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Filtros">
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              color: showFilters ? theme.palette.primary.main : theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <FilterList />
          </IconButton>
        </Tooltip>

        <Tooltip title="Vista en cuadrícula">
          <IconButton
            onClick={() => setViewMode('grid')}
            sx={{
              color: viewMode === 'grid' ? theme.palette.primary.main : theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <ViewModule />
          </IconButton>
        </Tooltip>

        <Tooltip title="Vista en lista">
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{
              color: viewMode === 'list' ? theme.palette.primary.main : theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <ViewList />
          </IconButton>
        </Tooltip>

        <Tooltip title="Actualizar">
          <IconButton
            onClick={handleRefresh}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>

        <Tooltip title="Más opciones">
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
            }}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  // Renderizar challenges según el modo de vista
  const renderChallenges = () => {
    if (challengesLoading) {
      return (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ChallengeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      );
    }

    if (!challengesData?.challenges || challengesData.challenges.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <EmojiEvents sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h5" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            No hay desafíos disponibles
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Vuelve más tarde para descubrir nuevos desafíos de transformación.
          </Typography>
        </Paper>
      );
    }

    if (viewMode === 'grid') {
      return (
        <Grid container spacing={3}>
          {challengesData.challenges.map((challenge: any) => (
            <Grid item xs={12} sm={6} md={4} key={challenge.id}>
              <ChallengeCard
                challenge={challenge}
                onJoin={handleJoinChallenge}
                onView={handleViewChallenge}
                onLike={handleLikeChallenge}
                onShare={handleShareChallenge}
              />
            </Grid>
          ))}
        </Grid>
      );
    }

    // Vista de lista
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {challengesData.challenges.map((challenge: any) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={handleJoinChallenge}
            onView={handleViewChallenge}
            onLike={handleLikeChallenge}
            onShare={handleShareChallenge}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      py: 3
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            🎯 Desafíos de Transformación
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Únete a experiencias de crecimiento consciente y acumula Mëritos transformando tu realidad
          </Typography>
        </Box>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Pestañas */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                }
              }
            }}
          >
            <Tab label="🌟 Todos los Desafíos" />
            <Tab label="🎯 Mis Desafíos" />
            <Tab label="🏆 Completados" />
          </Tabs>
        </Paper>

        {/* Opciones de vista */}
        {renderViewOptions()}

        {/* Filtros expandibles */}
        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <ChallengeFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </Box>
        )}

        {/* Contenido de pestañas */}
        <Box>
          {selectedTab === 0 && renderChallenges()}
          {selectedTab === 1 && (
            <Box>
              {userChallengesLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ChallengeCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : userChallengesData && userChallengesData.activeChallenges && userChallengesData.activeChallenges.length > 0 ? (
                <Grid container spacing={3}>
                  {userChallengesData.activeChallenges
                    .filter((challenge) => challenge.status !== 'completed')
                    .map((challenge) => (
                      <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                        <ChallengeCard
                          challenge={challenge}
                          onJoin={handleJoinChallenge}
                          onView={handleViewChallenge}
                          onLike={handleLikeChallenge}
                          onShare={handleShareChallenge}
                        />
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <Psychology sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="h5" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                    No tienes desafíos activos
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                    Explora la pestaña "Todos los Desafíos" para encontrar experiencias de transformación.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedTab(0)}
                    sx={{
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    Explorar Desafíos
                  </Button>
                </Paper>
              )}
            </Box>
          )}
          {selectedTab === 2 && (
            <Box>
              {userChallengesLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ChallengeCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : userChallengesData && userChallengesData.completedChallenges && userChallengesData.completedChallenges.length > 0 ? (
                <Grid container spacing={3}>
                  {userChallengesData.completedChallenges
                    .map((challenge) => (
                      <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                        <ChallengeCard
                          challenge={challenge}
                          onJoin={handleJoinChallenge}
                          onView={handleViewChallenge}
                          onLike={handleLikeChallenge}
                          onShare={handleShareChallenge}
                        />
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="h5" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                    Aún no has completado desafíos
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Completa desafíos para verlos aquí y acumular Mëritos de transformación.
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Box>

        {/* FAB para crear desafío */}
        <Fab
          color="primary"
          aria-label="crear desafío"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            transform: trigger ? 'scale(0.8)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
          onClick={() => navigate('/challenges/create')}
        >
          <Add />
        </Fab>

        {/* Menu de opciones */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => navigate('/challenges/create')}>
            <ListItemIcon>
              <Add fontSize="small" />
            </ListItemIcon>
            <ListItemText>Crear Desafío</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleRefresh}>
            <ListItemIcon>
              <Refresh fontSize="small" />
            </ListItemIcon>
            <ListItemText>Actualizar</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default ChallengesPage;
