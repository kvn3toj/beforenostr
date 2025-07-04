import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Whatshot,
  Water,
  EmojiNature,
  Air,
  Psychology,
  TrendingUp,
  EmojiEvents,
  Group,
  Insights
} from '@mui/icons-material';
import { apiService } from '../../lib/api-service';

// Interfaces
interface AgentStatus {
  active: boolean;
  efficiency: number;
  lukasGenerated: number;
}

interface CommunityMetrics {
  wisdomQuotient: number;
  reciprocidadIndex: number;
  collaborationVelocity: number;
  innovationScore: number;
}

interface PersonalStats {
  userId: string;
  lukasBalance: number;
  contributionLevel: string;
  feedbackProcessed: number;
  wisdomPointsEarned: number;
  collaborationsCompleted: number;
}

interface Achievement {
  name: string;
  description: string;
  lukasReward: number;
  unlockedAt?: string;
  progress?: number;
}

interface DashboardData {
  communityMetrics: CommunityMetrics;
  agentStatus: {
    fuego: AgentStatus;
    agua: AgentStatus;
    tierra: AgentStatus;
    aire: AgentStatus;
  };
  personalStats: PersonalStats;
  leaderboard: Array<{
    username: string;
    lukasBalance: number;
    level: string;
  }>;
  achievements: {
    recent: Achievement[];
    available: Achievement[];
  };
}

const OracleAgentsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/cop-oraculo/agents/dashboard/metrics');
      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error al cargar el dashboard de agentes');
      // Datos de fallback para desarrollo
      setDashboardData(createMockData());
    } finally {
      setLoading(false);
    }
  };

  const createMockData = (): DashboardData => ({
    communityMetrics: {
      wisdomQuotient: 8.7,
      reciprocidadIndex: 0.92,
      collaborationVelocity: 15.3,
      innovationScore: 7.8
    },
    agentStatus: {
      fuego: { active: true, efficiency: 0.95, lukasGenerated: 1250 },
      agua: { active: true, efficiency: 0.88, lukasGenerated: 980 },
      tierra: { active: true, efficiency: 0.92, lukasGenerated: 1100 },
      aire: { active: true, efficiency: 0.90, lukasGenerated: 1350 }
    },
    personalStats: {
      userId: 'current-user',
      lukasBalance: 450,
      contributionLevel: 'Oráculo Aprendiz',
      feedbackProcessed: 23,
      wisdomPointsEarned: 890,
      collaborationsCompleted: 12
    },
    leaderboard: [
      { username: 'SabioAdmin', lukasBalance: 2500, level: 'Oráculo Maestro' },
      { username: 'ColaboradorReciprocidad', lukasBalance: 1800, level: 'Visionario Elemental' },
      { username: 'TuUsuario', lukasBalance: 450, level: 'Oráculo Aprendiz' }
    ],
    achievements: {
      recent: [
        {
          name: '🔍 Detector de Patrones',
          description: 'Identificaste un patrón en 5 feedback similares',
          lukasReward: 50,
          unlockedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      available: [
        {
          name: '🌟 Maestro del Reciprocidad',
          description: 'Mantén un balance de Reciprocidad > 0.9 por 30 días',
          lukasReward: 200,
          progress: 0.73
        }
      ]
    }
  });

  const getAgentIcon = (element: string) => {
    const iconMap = {
      fuego: <Whatshot sx={{ color: '#ff5722' }} />,
      agua: <Water sx={{ color: '#2196f3' }} />,
      tierra: <EmojiNature sx={{ color: '#4caf50' }} />,
      aire: <Air sx={{ color: '#9c27b0' }} />
    };
    return iconMap[element as keyof typeof iconMap];
  };

  const getElementColor = (element: string) => {
    const colorMap = {
      fuego: '#ff5722',
      agua: '#2196f3',
      tierra: '#4caf50',
      aire: '#9c27b0'
    };
    return colorMap[element as keyof typeof colorMap];
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6">🔮 Cargando Oráculo...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error || !dashboardData) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} textAlign="center">
        <Typography variant="h4" gutterBottom>
          🔮 CoP Oráculo - Dashboard Multi-Agente
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Transformando Feedback en Sabiduría Colectiva
        </Typography>
      </Box>

      {/* Métricas Comunitarias */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.communityMetrics.wisdomQuotient}</Typography>
              <Typography variant="body2">Cociente de Sabiduría</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Group sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{(dashboardData.communityMetrics.reciprocidadIndex * 100).toFixed(0)}%</Typography>
              <Typography variant="body2">Índice de Reciprocidad</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.communityMetrics.collaborationVelocity}</Typography>
              <Typography variant="body2">Velocidad Colaborativa</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
              <Insights sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4">{dashboardData.communityMetrics.innovationScore}</Typography>
              <Typography variant="body2">Puntuación Innovación</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estado de Agentes Elementales */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🤖 Estado de Agentes Elementales
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(dashboardData.agentStatus).map(([element, status]) => (
                  <Grid item xs={12} sm={6} md={3} key={element}>
                    <Box
                      p={2}
                      border={1}
                      borderColor={getElementColor(element)}
                      borderRadius={2}
                      textAlign="center"
                    >
                      <Badge
                        badgeContent={status.active ? "●" : "○"}
                        color={status.active ? "success" : "error"}
                      >
                        <Avatar sx={{ bgcolor: getElementColor(element), mb: 1 }}>
                          {getAgentIcon(element)}
                        </Avatar>
                      </Badge>
                      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                        {element}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eficiencia: {(status.efficiency * 100).toFixed(0)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={status.efficiency * 100}
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Chip
                        label={`${status.lukasGenerated} Lükas`}
                        size="small"
                        sx={{ bgcolor: getElementColor(element), color: 'white' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Estadísticas Personales y Leaderboard */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Tus Estadísticas
              </Typography>
              <Box mb={2}>
                <Typography variant="body1">
                  💰 Balance de Lükas: <strong>{dashboardData.personalStats.lukasBalance}</strong>
                </Typography>
                <Typography variant="body1">
                  🎭 Nivel: <strong>{dashboardData.personalStats.contributionLevel}</strong>
                </Typography>
                <Typography variant="body1">
                  📝 Feedback Procesado: <strong>{dashboardData.personalStats.feedbackProcessed}</strong>
                </Typography>
                <Typography variant="body1">
                  🧠 Puntos de Sabiduría: <strong>{dashboardData.personalStats.wisdomPointsEarned}</strong>
                </Typography>
                <Typography variant="body1">
                  🤝 Colaboraciones: <strong>{dashboardData.personalStats.collaborationsCompleted}</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Leaderboard Oráculo
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell align="right">Lükas</TableCell>
                      <TableCell>Nivel</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.leaderboard.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {index === 0 && <EmojiEvents sx={{ color: 'gold', mr: 1 }} />}
                            {index === 1 && <EmojiEvents sx={{ color: 'silver', mr: 1 }} />}
                            {index === 2 && <EmojiEvents sx={{ color: '#cd7f32', mr: 1 }} />}
                            {user.username}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{user.lukasBalance}</TableCell>
                        <TableCell>
                          <Chip label={user.level} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logros */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎖️ Logros Recientes
              </Typography>
              {dashboardData.achievements.recent.map((achievement, index) => (
                <Box key={index} mb={2} p={2} bgcolor="success.light" borderRadius={1}>
                  <Typography variant="body1" fontWeight="bold">
                    {achievement.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                  <Chip
                    label={`+${achievement.lukasReward} Lükas`}
                    size="small"
                    color="success"
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Logros Disponibles
              </Typography>
              {dashboardData.achievements.available.map((achievement, index) => (
                <Box key={index} mb={2} p={2} bgcolor="info.light" borderRadius={1}>
                  <Typography variant="body1" fontWeight="bold">
                    {achievement.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                  {achievement.progress && (
                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={achievement.progress * 100}
                      />
                      <Typography variant="caption">
                        Progreso: {(achievement.progress * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  )}
                  <Chip
                    label={`${achievement.lukasReward} Lükas`}
                    size="small"
                    color="info"
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OracleAgentsDashboard;
