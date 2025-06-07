import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  EmojiEvents, 
  TrendingUp, 
  Add, 
  PlayArrow,
  CheckCircle,
  Schedule 
} from '@mui/icons-material';
import { apiService } from '../services/api.service';
import { useNavigate } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description?: string;
  type: string;
  difficulty: string;
  points: number;
  status: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  _count?: {
    participants: number;
    completions: number;
  };
}

const fetchChallenges = async (): Promise<Challenge[]> => {
  // TEMPORARY: Return static data since backend endpoint might not exist
  return [
    {
      id: "challenge-1",
      title: "Completar 5 Videos Educativos",
      description: "Ve y completa 5 videos educativos en cualquier categoría",
      type: "LEARNING",
      difficulty: "EASY",
      points: 100,
      status: "ACTIVE",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      _count: {
        participants: 25,
        completions: 18
      }
    },
    {
      id: "challenge-2",
      title: "Maestro de Subtítulos",
      description: "Crea subtítulos para 3 videos diferentes",
      type: "CONTRIBUTION",
      difficulty: "MEDIUM",
      points: 250,
      status: "ACTIVE",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      _count: {
        participants: 12,
        completions: 8
      }
    },
    {
      id: "challenge-3",
      title: "Experto en Preguntas",
      description: "Responde correctamente 50 preguntas de videos",
      type: "ENGAGEMENT",
      difficulty: "HARD",
      points: 500,
      status: "ACTIVE",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      _count: {
        participants: 8,
        completions: 3
      }
    },
    {
      id: "challenge-4",
      title: "Colaborador Social",
      description: "Invita a 5 nuevos usuarios al sistema",
      type: "SOCIAL",
      difficulty: "MEDIUM",
      points: 300,
      status: "COMPLETED",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      _count: {
        participants: 15,
        completions: 12
      }
    }
  ];
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'HARD':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'primary';
    case 'COMPLETED':
      return 'success';
    case 'EXPIRED':
      return 'error';
    case 'DRAFT':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return <PlayArrow sx={{ fontSize: 16 }} />;
    case 'COMPLETED':
      return <CheckCircle sx={{ fontSize: 16 }} />;
    case 'EXPIRED':
      return <Schedule sx={{ fontSize: 16 }} />;
    default:
      return <Schedule sx={{ fontSize: 16 }} />;
  }
};

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    data: challenges,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['challenges'],
    queryFn: fetchChallenges,
    retry: false,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading challenges data: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Calcular estadísticas
  const totalChallenges = challenges?.length || 0;
  const activeChallenges = challenges?.filter(c => c.status === 'ACTIVE').length || 0;
  const totalPoints = challenges?.reduce((sum, challenge) => sum + challenge.points, 0) || 0;
  const totalParticipants = challenges?.reduce((sum, challenge) => sum + (challenge._count?.participants || 0), 0) || 0;

  const handleCreateChallenge = () => {
    navigate('/challenges/create');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Desafíos del Sistema
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión de desafíos y retos para usuarios
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Desafíos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalChallenges}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Desafíos creados
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Activos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {activeChallenges}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    En progreso
                  </Typography>
                </Box>
                <PlayArrow sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Puntos Totales
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    Puntos disponibles
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Participantes
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {totalParticipants}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    Total inscripciones
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Challenges List */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Lista de Desafíos
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              size="small"
              onClick={handleCreateChallenge}
            >
              Crear Desafío
            </Button>
          </Box>
          
          {challenges && challenges.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Dificultad</TableCell>
                    <TableCell align="right">Puntos</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Participantes</TableCell>
                    <TableCell align="right">Completados</TableCell>
                    <TableCell>Progreso</TableCell>
                    <TableCell>Fecha Límite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {challenges.map((challenge) => {
                    const completionRate = challenge._count?.participants ? 
                      (challenge._count.completions / challenge._count.participants) * 100 : 0;
                    
                    return (
                      <TableRow key={challenge.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {challenge.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {challenge.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={challenge.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={challenge.difficulty} 
                            size="small" 
                            color={getDifficultyColor(challenge.difficulty) as any}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold" color="primary.main">
                            {challenge.points}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={getStatusIcon(challenge.status)}
                            label={challenge.status} 
                            size="small" 
                            color={getStatusColor(challenge.status) as any}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {challenge._count?.participants || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="success.main">
                            {challenge._count?.completions || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: 100 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={completionRate} 
                              sx={{ mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {completionRate.toFixed(0)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {challenge.endDate ? 
                              new Date(challenge.endDate).toLocaleDateString() : 
                              'Sin límite'
                            }
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay desafíos disponibles en el sistema.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 