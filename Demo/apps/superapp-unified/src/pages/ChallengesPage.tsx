import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  Container,
} from '@mui/material';
import {
  Search,
  FilterList,
  EmojiEvents,
  TrendingUp,
  Group,
  Star,
  Add,
} from '@mui/icons-material';
import { toast } from 'sonner';

// Hooks y tipos
import { useChallenges, useJoinChallenge, useUserChallenges } from '../hooks/useRealBackendData';
import { useAuth } from '../contexts/AuthContext';
import { ChallengeCard } from '../components/modules/challenges/ChallengeCard';
import { 
  ChallengeStatus, 
  ChallengeDifficulty, 
  ChallengeCategory,
  ChallengeType 
} from '../types/challenges';

// 🔧 SOLUCIÓN: Función segura para formatear fechas (agregada al inicio del archivo)
const formatSafeDate = (dateString?: string): string => {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn(`⚠️ Fecha inválida detectada: ${dateString}`);
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(`❌ Error al formatear fecha: ${dateString}`, error);
    return 'Error en fecha';
  }
};

// Loading skeleton component
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

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ChallengeStatus[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<ChallengeCategory[]>([]);

  // Hooks para datos
  const { 
    data: challengesData, 
    isLoading: challengesLoading, 
    error: challengesError 
  } = useChallenges();

  const { 
    data: userChallengesData, 
    isLoading: userChallengesLoading 
  } = useUserChallenges(user?.id || '');

  const joinChallengeMutation = useJoinChallenge();

  // Handlers
  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await joinChallengeMutation.mutateAsync(challengeId);
      toast.success('¡Te has unido al desafío exitosamente!');
    } catch (error) {
      toast.error('Error al unirse al desafío. Inténtalo de nuevo.');
      console.error('Error joining challenge:', error);
    }
  };

  const handleViewChallenge = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Filtrar desafíos según la pestaña seleccionada
  const getFilteredChallenges = () => {
    if (!challengesData?.challenges) return [];

    let filtered = challengesData.challenges;

    // Filtrar por pestaña
    switch (selectedTab) {
      case 0: // Todos
        break;
      case 1: // Activos
        filtered = filtered.filter(c => c.status === 'ACTIVE');
        break;
      case 2: // Mis Desafíos
        filtered = filtered.filter(c => c.isParticipating);
        break;
      case 3: // Completados
        filtered = filtered.filter(c => c.isCompleted);
        break;
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por estado
    if (statusFilter.length > 0) {
      filtered = filtered.filter(challenge => statusFilter.includes(challenge.status));
    }

    // Filtrar por dificultad
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter(challenge => difficultyFilter.includes(challenge.difficulty));
    }

    // Filtrar por categoría
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(challenge => categoryFilter.includes(challenge.category));
    }

    return filtered;
  };

  const filteredChallenges = getFilteredChallenges();

  // Estadísticas rápidas
  const stats = {
    total: challengesData?.challenges?.length || 0,
    active: challengesData?.challenges?.filter(c => c.status === 'ACTIVE').length || 0,
    participating: challengesData?.challenges?.filter(c => c.isParticipating).length || 0,
    completed: challengesData?.challenges?.filter(c => c.isCompleted).length || 0,
  };

  if (challengesError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los desafíos: {challengesError instanceof Error ? challengesError.message : 'Error desconocido'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          🏆 Desafíos CoomÜnity
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Participa en desafíos que fomentan el Bien Común, la reciprocidad (Ayni) y el crecimiento personal.
          Gana Méritos, Lükas y reconocimientos por tus contribuciones a la comunidad.
        </Typography>

        {/* Estadísticas rápidas */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Desafíos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="success.main">
                  {stats.active}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Activos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="warning.main">
                  {stats.participating}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Participando
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h6" color="info.main">
                  {stats.completed}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filtros y búsqueda */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar desafíos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  // TODO: Implementar modal de filtros avanzados
                  toast.info('Filtros avanzados próximamente');
                }}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  // TODO: Implementar creación de desafíos (solo para admins/moderadores)
                  toast.info('Creación de desafíos próximamente');
                }}
              >
                Crear Desafío
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Pestañas */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Todos" />
          <Tab label="Activos" />
          <Tab label="Mis Desafíos" />
          <Tab label="Completados" />
        </Tabs>
      </Box>

      {/* Lista de desafíos */}
      {challengesLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ChallengeCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredChallenges.length > 0 ? (
        <Grid container spacing={3}>
          {filteredChallenges.map((challenge) => (
            <Grid item xs={12} sm={6} md={4} key={challenge.id}>
              <ChallengeCard
                challenge={challenge}
                onJoin={handleJoinChallenge}
                onView={handleViewChallenge}
                showActions={true}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron desafíos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter.length > 0 || difficultyFilter.length > 0 || categoryFilter.length > 0
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay desafíos disponibles'}
          </Typography>
          {searchTerm && (
            <Button variant="outlined" onClick={() => setSearchTerm('')}>
              Limpiar búsqueda
            </Button>
          )}
        </Box>
      )}

      {/* Información adicional */}
      {userChallengesData && (
        <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            📊 Tu Progreso en Desafíos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="primary">
                  {userChallengesData.totalPoints}
                </Typography>
                <Typography variant="caption">Puntos Totales</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="success.main">
                  {userChallengesData.totalCompleted}
                </Typography>
                <Typography variant="caption">Completados</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="warning.main">
                  {userChallengesData.activeChallenges?.length || 0}
                </Typography>
                <Typography variant="caption">En Progreso</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color="info.main">
                  {userChallengesData.currentStreak}
                </Typography>
                <Typography variant="caption">Racha Actual</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}; 