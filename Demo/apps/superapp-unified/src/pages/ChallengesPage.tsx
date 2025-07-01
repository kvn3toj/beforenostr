import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  Container,
  Fab,
  Zoom,
  useScrollTrigger,
  Backdrop,
  CircularProgress,
  Stack,
  Paper,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add,
  ViewModule,
  ViewList,
  Share,
  BookmarkBorder,
  MoreVert,
  Refresh,
  TrendingUp,
  AutoAwesome,
  EmojiEvents,
  FilterList,
  Search,
} from '@mui/icons-material';
import { toast } from 'sonner';

// 🌌 IMPORT DEL SISTEMA DE COLORES CÓSMICO
import { UNIFIED_COLORS } from '../theme/colors';

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
const ChallengeCardSkeleton: React.FC = () => (
  <Card sx={{
    height: 400,
    backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
    borderColor: UNIFIED_COLORS.themes.minimalist.divider
  }}>
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

const StatsCardSkeleton: React.FC = () => (
  <Card sx={{
    backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
    borderColor: UNIFIED_COLORS.themes.minimalist.divider
  }}>
    <CardContent sx={{ textAlign: 'center', py: 2 }}>
      <Skeleton variant="text" height={32} width={60} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" height={16} width={80} sx={{ mx: 'auto' }} />
    </CardContent>
  </Card>
);

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      toast.success('¡Te has sumado al desafío cósmico exitosamente!', {
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

  // Datos combinados y filtros aplicados
  const allChallenges = useMemo(() => {
    return challengesData?.data || [];
  }, [challengesData]);

  const userChallenges = useMemo(() => {
    return userChallengesData?.data || [];
  }, [userChallengesData]);

  const activeChallenges = useMemo(() => {
    return userChallenges.filter(
      (challenge) => challenge.status === 'ACTIVE'
    );
  }, [userChallenges]);

  const completedChallenges = useMemo(() => {
    return userChallenges.filter(
      (challenge) => challenge.status === 'COMPLETED'
    );
  }, [userChallenges]);

  // Estados de carga y error
  const isLoading = challengesLoading || userChallengesLoading;
  const hasError = challengesError;

  // Renderizado de estadísticas
  const renderStatsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={3}>
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card sx={{
            backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
            borderColor: UNIFIED_COLORS.themes.minimalist.divider
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" sx={{
                color: UNIFIED_COLORS.concepts.meritos
              }}>
                {allChallenges.length}
              </Typography>
              <Typography variant="body2" sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                Desafíos Disponibles
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={6} sm={3}>
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card sx={{
            backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
            borderColor: UNIFIED_COLORS.themes.minimalist.divider
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" sx={{
                color: UNIFIED_COLORS.semantic.info
              }}>
                {activeChallenges.length}
              </Typography>
              <Typography variant="body2" sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                En Progreso
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={6} sm={3}>
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card sx={{
            backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
            borderColor: UNIFIED_COLORS.themes.minimalist.divider
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" sx={{
                color: UNIFIED_COLORS.semantic.success
              }}>
                {completedChallenges.length}
              </Typography>
              <Typography variant="body2" sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                Completados
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item xs={6} sm={3}>
        {isLoading ? (
          <StatsCardSkeleton />
        ) : (
          <Card sx={{
            backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
            borderColor: UNIFIED_COLORS.themes.minimalist.divider
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" fontWeight="bold" sx={{
                color: UNIFIED_COLORS.concepts.reciprocidad
              }}>
                {completedChallenges.reduce(
                  (total, challenge) => total + (challenge.points || 0),
                  0
                )}
              </Typography>
              <Typography variant="body2" sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                Mëritos Ganados
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{
      backgroundColor: UNIFIED_COLORS.brand.white,
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header con título y acciones */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.primary
            }}>
              🏆 Desafíos de Transformación Consciente
            </Typography>
            <Typography variant="body1" sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.secondary
            }}>
              Expande tu potencial y contribuye al Bien Común a través de misiones significativas
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => setMenuAnchor(null)}
              sx={{
                backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
                color: UNIFIED_COLORS.themes.minimalist.text.primary,
                '&:hover': {
                  backgroundColor: UNIFIED_COLORS.themes.minimalist.divider,
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Stack>
        </Box>

        {/* Estadísticas rápidas */}
        {renderStatsCards()}

        {/* Alert de error si existe */}
        {hasError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Error al cargar desafíos. Por favor, intenta nuevamente.
            </Typography>
            <Button
              size="small"
              onClick={handleRefresh}
              sx={{ mt: 1 }}
              variant="outlined"
            >
              Reintentar
            </Button>
          </Alert>
        )}

        {/* Navegación por pestañas */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
            borderColor: UNIFIED_COLORS.themes.minimalist.divider,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: UNIFIED_COLORS.concepts.reciprocidad,
              },
              '& .Mui-selected': {
                color: UNIFIED_COLORS.concepts.reciprocidad,
                fontWeight: 'bold',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                color: UNIFIED_COLORS.themes.minimalist.text.secondary,
              },
            }}
          >
            <Tab
              label={`🌍 Explorar (${allChallenges.length})`}
              icon={<AutoAwesome />}
              iconPosition="start"
            />
            <Tab
              label={`⚡ Activos (${activeChallenges.length})`}
              icon={<TrendingUp />}
              iconPosition="start"
            />
            <Tab
              label={`✨ Completados (${completedChallenges.length})`}
              icon={<EmojiEvents />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Contenido de las pestañas */}
        <Box>
          {selectedTab === 0 && (
            <Box>
              {/* Filtros */}
              <ChallengeFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onResetFilters={handleResetFilters}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />

              {/* Grid de desafíos */}
              {isLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ChallengeCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  {allChallenges.map((challenge) => (
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
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.primary,
                fontWeight: 'bold'
              }}>
                ⚡ Tus Desafíos Activos
              </Typography>
              <Typography variant="body2" sx={{
                mb: 3,
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                Continúa tu viaje de crecimiento personal y contribución comunitaria
              </Typography>

              {isLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ChallengeCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : activeChallenges.length > 0 ? (
                <Grid container spacing={3}>
                  {activeChallenges.map((challenge) => (
                    <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                      <ChallengeCard
                        challenge={challenge}
                        onView={handleViewChallenge}
                        onLike={handleLikeChallenge}
                        onShare={handleShareChallenge}
                        variant="featured"
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
                    borderColor: UNIFIED_COLORS.themes.minimalist.divider,
                  }}
                >
                  <AutoAwesome sx={{
                    fontSize: 48,
                    color: UNIFIED_COLORS.themes.minimalist.text.muted,
                    mb: 2
                  }} />
                  <Typography variant="h6" gutterBottom sx={{
                    color: UNIFIED_COLORS.themes.minimalist.text.primary
                  }}>
                    ¡Tiempo de comenzar tu aventura!
                  </Typography>
                  <Typography variant="body2" sx={{
                    mb: 3,
                    color: UNIFIED_COLORS.themes.minimalist.text.secondary
                  }}>
                    Explora desafíos que resuenen con tu alma y propósito
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedTab(0)}
                    sx={{
                      backgroundColor: UNIFIED_COLORS.concepts.reciprocidad,
                      '&:hover': {
                        backgroundColor: UNIFIED_COLORS.brand.burgundy,
                      },
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
              <Typography variant="h6" gutterBottom sx={{
                color: UNIFIED_COLORS.themes.minimalist.text.primary,
                fontWeight: 'bold'
              }}>
                ✨ Desafíos Completados
              </Typography>
              <Typography variant="body2" sx={{
                mb: 3,
                color: UNIFIED_COLORS.themes.minimalist.text.secondary
              }}>
                Celebra tus logros y reflexiona sobre tu crecimiento
              </Typography>

              {isLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <ChallengeCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : completedChallenges.length > 0 ? (
                <Grid container spacing={3}>
                  {completedChallenges.map((challenge) => (
                    <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                      <ChallengeCard
                        challenge={challenge}
                        onView={handleViewChallenge}
                        onShare={handleShareChallenge}
                        variant="minimal"
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
                    borderColor: UNIFIED_COLORS.themes.minimalist.divider,
                  }}
                >
                  <EmojiEvents sx={{
                    fontSize: 48,
                    color: UNIFIED_COLORS.themes.minimalist.text.muted,
                    mb: 2
                  }} />
                  <Typography variant="h6" gutterBottom sx={{
                    color: UNIFIED_COLORS.themes.minimalist.text.primary
                  }}>
                    Tu primera medalla te espera
                  </Typography>
                  <Typography variant="body2" sx={{
                    mb: 3,
                    color: UNIFIED_COLORS.themes.minimalist.text.secondary
                  }}>
                    Completa desafíos para desbloquear logros y ganar Mëritos
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setSelectedTab(0)}
                    sx={{
                      backgroundColor: UNIFIED_COLORS.concepts.reciprocidad,
                      '&:hover': {
                        backgroundColor: UNIFIED_COLORS.brand.burgundy,
                      },
                    }}
                  >
                    Comenzar Aventura
                  </Button>
                </Paper>
              )}
            </Box>
          )}
        </Box>

        {/* FAB para crear nuevo desafío */}
        <Zoom in={trigger}>
          <Fab
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: UNIFIED_COLORS.concepts.reciprocidad,
              color: UNIFIED_COLORS.brand.white,
              '&:hover': {
                backgroundColor: UNIFIED_COLORS.brand.burgundy,
              },
            }}
            onClick={() => navigate('/challenges/create')}
          >
            <Add />
          </Fab>
        </Zoom>

        {/* Backdrop de carga */}
        {joinChallengeMutation.isPending && (
          <Backdrop
            open
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <CircularProgress sx={{
              color: UNIFIED_COLORS.concepts.reciprocidad
            }} />
          </Backdrop>
        )}
      </Container>
    </Box>
  );
};

export default ChallengesPage;
