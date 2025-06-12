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
  <Card sx={{ height: 400 }}>
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
  <Card>
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
      toast.success('¡Te has unido al desafío exitosamente!', {
        description: 'Comienza a participar y gana Mëritos por tus logros.',
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
    toast.info('¡Funcionalidad de likes próximamente!');
  };

  const handleShareChallenge = (challengeId: string) => {
    // TODO: Implementar sistema de compartir
    if (navigator.share) {
      navigator
        .share({
          title: 'Desafío CoomÜnity',
          text: 'Únete a este increíble desafío en CoomÜnity',
          url: `${window.location.origin}/challenges/${challengeId}`,
        })
        .catch(console.error);
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard
        .writeText(`${window.location.origin}/challenges/${challengeId}`)
        .then(() => {
          toast.success('Enlace copiado al portapapeles');
        });
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleRefresh = () => {
    refetchChallenges();
    refetchUserChallenges();
    toast.success('Datos actualizados');
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

  // Filtrar desafíos según la pestaña seleccionada
  const filteredChallenges = useMemo(() => {
    if (
      !challengesData?.challenges ||
      !Array.isArray(challengesData.challenges)
    )
      return [];

    let filtered = challengesData.challenges.filter((c) => c && c.id); // Filter out invalid challenges

    // Filtrar por pestaña
    switch (selectedTab) {
      case 0: // Todos
        break;
      case 1: // Activos
        filtered = filtered.filter((c) => c.status === 'ACTIVE');
        break;
      case 2: // Mis Desafíos
        filtered = filtered.filter((c) => c.isParticipating);
        break;
      case 3: // Completados
        filtered = filtered.filter((c) => c.isCompleted);
        break;
      case 4: // Favoritos
        // TODO: Implementar sistema de favoritos
        break;
    }

    return filtered;
  }, [challengesData?.challenges, selectedTab]);

  // Estadísticas computadas
  const stats = useMemo(() => {
    const challenges = Array.isArray(challengesData?.challenges)
      ? challengesData.challenges.filter((c) => c && c.id) // Filter out invalid challenges
      : [];
    return {
      total: challenges.length,
      active: challenges.filter((c) => c.status === 'ACTIVE').length,
      participating: challenges.filter((c) => c.isParticipating).length,
      completed: challenges.filter((c) => c.isCompleted).length,
      totalPoints: challenges.reduce((sum, c) => sum + (c.points || 0), 0),
      totalParticipants: challenges.reduce(
        (sum, c) => sum + (c._count?.participants || 0),
        0
      ),
      successRate: challenges.length
        ? (challenges.filter((c) => c.isCompleted).length / challenges.length) *
          100
        : 0,
      averageRating: 4.2, // Mock data - implementar cuando esté disponible
      weeklyCompleted: userChallengesData?.weeklyCompleted || 0,
      currentStreak: userChallengesData?.currentStreak || 0,
    };
  }, [challengesData, userChallengesData]);

  // User stats mock data (TODO: implementar con datos reales)
  const userStats = useMemo(() => {
    if (!userChallengesData) return undefined;
    return {
      totalMerits: userChallengesData.totalPoints || 0,
      totalLukas: 1250, // Mock
      totalOndas: 890, // Mock
      level: 12, // Mock
      currentExp: 2400, // Mock
      nextLevelExp: 3000, // Mock
      badges: 8, // Mock
      rank: 156, // Mock
      weeklyProgress: 75, // Mock
    };
  }, [userChallengesData]);

  if (challengesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Reintentar
            </Button>
          }
        >
          Error al cargar los desafíos:{' '}
          {challengesError instanceof Error
            ? challengesError.message
            : 'Error desconocido'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
      {/* Header mejorado */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background:
            'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))',
          border: '1px solid rgba(33, 150, 243, 0.2)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background:
              'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1))',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, #2196F3, #9C27B0, #FF6B35)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  display: 'inline-block',
                }}
              >
                🏆 Desafíos CoomÜnity
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 600, lineHeight: 1.6 }}
              >
                Participa en desafíos que fomentan el{' '}
                <strong>Bien Común</strong>, la reciprocidad (
                <strong>Ayni</strong>) y el crecimiento personal. Gana{' '}
                <strong>Mëritos</strong>, <strong>Lükas</strong> y
                reconocimientos por tus contribuciones a la comunidad.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={handleRefresh}
                disabled={challengesLoading}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' },
                }}
              >
                <Refresh />
              </IconButton>
              <IconButton
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.default' },
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          {/* Vista rápida de acciones */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                toast.info('Creación de desafíos próximamente');
              }}
              sx={{
                background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E55A2E, #E8841A)',
                },
              }}
            >
              Crear Desafío
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'inherit'}
            >
              Filtros
            </Button>
            <Button
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  sortBy: 'participants',
                  sortOrder: 'desc',
                }));
              }}
            >
              Tendencias
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Estadísticas mejoradas */}
      {challengesLoading ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <StatsCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <ChallengeStats
          stats={stats}
          userStats={userStats}
          loading={challengesLoading || userChallengesLoading}
          onRefresh={handleRefresh}
        />
      )}

      {/* Filtros avanzados */}
      {showFilters && (
        <ChallengeFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          totalResults={filteredChallenges.length}
          isLoading={challengesLoading}
        />
      )}

      {/* Pestañas mejoradas */}
      <Paper elevation={0} sx={{ mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 1,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48,
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesome sx={{ fontSize: 20 }} />
                  Todos ({stats.total})
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🔥 Activos ({stats.active})
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  🎯 Mis Desafíos ({stats.participating})
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ✅ Completados ({stats.completed})
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⭐ Favoritos
                </Box>
              }
            />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              {viewMode === 'grid' ? <ViewModule /> : <ViewList />}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Lista de desafíos mejorada */}
      {challengesLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              key={index}
            >
              <ChallengeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredChallenges.length > 0 ? (
        <Grid container spacing={3}>
          {filteredChallenges.map((challenge, index) => (
            <Grid
              item
              xs={12}
              sm={viewMode === 'grid' ? 6 : 12}
              md={viewMode === 'grid' ? 4 : 12}
              key={challenge.id}
            >
              <ChallengeCard
                challenge={challenge}
                onJoin={handleJoinChallenge}
                onView={handleViewChallenge}
                onLike={handleLikeChallenge}
                onShare={handleShareChallenge}
                showActions={true}
                compact={viewMode === 'list'}
                variant={index < 2 ? 'featured' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            background:
              'linear-gradient(135deg, rgba(33, 150, 243, 0.05), rgba(156, 39, 176, 0.05))',
          }}
        >
          <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No se encontraron desafíos
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
          >
            {filters.search ||
            filters.status?.length ||
            filters.difficulty?.length ||
            filters.category?.length
              ? 'Intenta ajustar los filtros de búsqueda para encontrar más desafíos.'
              : 'Aún no hay desafíos disponibles. ¡Sé el primero en crear uno!'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {(filters.search ||
              filters.status?.length ||
              filters.difficulty?.length ||
              filters.category?.length) && (
              <Button variant="outlined" onClick={handleResetFilters}>
                Limpiar filtros
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                toast.info('Creación de desafíos próximamente');
              }}
            >
              Crear Primer Desafío
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Floating Action Button */}
      <Zoom in={trigger}>
        <Fab
          color="primary"
          aria-label="crear desafío"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
            '&:hover': {
              background: 'linear-gradient(45deg, #E55A2E, #E8841A)',
            },
          }}
          onClick={() => {
            toast.info('Creación de desafíos próximamente');
          }}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={joinChallengeMutation.isPending}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Uniéndote al desafío...
          </Typography>
        </Box>
      </Backdrop>

      {/* Menu de opciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            toast.info('Función próximamente');
          }}
        >
          <ListItemIcon>
            <BookmarkBorder />
          </ListItemIcon>
          <ListItemText>Guardar vista actual</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            handleShareChallenge('general');
          }}
        >
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText>Compartir página</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            navigate('/challenges/create');
          }}
        >
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText>Crear desafío</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};
