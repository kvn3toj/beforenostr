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
  Avatar,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  EmojiEvents, 
  Star, 
  TrendingUp, 
  Person,
  WorkspacePremium,
  Grade,
  LocalFireDepartment
} from '@mui/icons-material';
import { apiService } from '../services/api.service';

interface Merit {
  id: string;
  userId: string;
  amount: number;
  type: 'MERITO' | 'ONDA' | 'VIBRA';
  source: string;
  relatedEntityId?: string | null;
  createdAt: string;
}

interface MeritsStats {
  totalMerits: number;
  totalPoints: number;
  userRank: number;
  totalUsers: number;
  recentMerits: number;
  byType: {
    MERITO: number;
    ONDA: number;
    VIBRA: number;
  };
}

const fetchMerits = async (): Promise<Merit[]> => {
  return apiService.get<Merit[]>('/merits');
};

const getMeritTypeColor = (type: string) => {
  switch (type) {
    case 'MERITO':
      return 'primary';
    case 'ONDA':
      return 'secondary';
    case 'VIBRA':
      return 'success';
    default:
      return 'default';
  }
};

const getMeritTypeIcon = (type: string) => {
  switch (type) {
    case 'MERITO':
      return <EmojiEvents sx={{ fontSize: 16 }} />;
    case 'ONDA':
      return <TrendingUp sx={{ fontSize: 16 }} />;
    case 'VIBRA':
      return <LocalFireDepartment sx={{ fontSize: 16 }} />;
    default:
      return <Star sx={{ fontSize: 16 }} />;
  }
};

const getSourceLabel = (source: string) => {
  switch (source) {
    case 'CONTENT_CREATION':
      return 'Creación de Contenido';
    case 'COMMUNITY_PARTICIPATION':
      return 'Participación Comunitaria';
    case 'INVITATION_PERFORMANCE':
      return 'Rendimiento de Invitaciones';
    case 'CHALLENGE_COMPLETION':
      return 'Completar Desafío';
    case 'INTERACTION':
      return 'Interacción';
    default:
      return source;
  }
};

export const MeritsPage: React.FC = () => {
  // ✅ TODOS LOS HOOKS AL INICIO - Sin early returns
  const [tabValue, setTabValue] = React.useState(0);

  const {
    data: merits,
    isLoading: isLoadingMerits,
    error: meritsError,
  } = useQuery({
    queryKey: ['merits'],
    queryFn: fetchMerits,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // ✅ useMemo SIEMPRE se ejecuta (con datos seguros)
  const stats: MeritsStats = React.useMemo(() => {
    if (!merits) {
      return {
        totalMerits: 0,
        totalPoints: 0,
        userRank: 0,
        totalUsers: 0,
        recentMerits: 0,
        byType: { MERITO: 0, ONDA: 0, VIBRA: 0 }
      };
    }

    const totalPoints = merits.reduce((sum, merit) => sum + merit.amount, 0);
    const byType = merits.reduce((acc, merit) => {
      acc[merit.type] = (acc[merit.type] || 0) + merit.amount;
      return acc;
    }, { MERITO: 0, ONDA: 0, VIBRA: 0 });

    // Méritos recientes (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMerits = merits.filter(merit => 
      new Date(merit.createdAt) > sevenDaysAgo
    ).length;

    return {
      totalMerits: merits.length,
      totalPoints,
      userRank: 1, // Placeholder
      totalUsers: 5, // Placeholder
      recentMerits,
      byType
    };
  }, [merits]);

  // ✅ Manejar estados condicionales DENTRO del render principal
  if (isLoadingMerits) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (meritsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading merits data: {meritsError instanceof Error ? 
            meritsError.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Sistema de Méritos
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Gestión y seguimiento del sistema de méritos gamificado
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Méritos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalMerits}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Registros totales
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
                    Puntos Totales
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Acumulados
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, color: 'success.main' }} />
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
                    Méritos Recientes
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.recentMerits}
                  </Typography>
                  <Typography variant="body2" color="info.main">
                    Últimos 7 días
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />
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
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    Con méritos
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribución por Tipo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución por Tipo
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">MÉRITOS</Typography>
                  <Typography variant="body2">{stats.byType.MERITO}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.byType.MERITO / stats.totalPoints) * 100} 
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  color="primary"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">ONDAS</Typography>
                  <Typography variant="body2">{stats.byType.ONDA}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.byType.ONDA / stats.totalPoints) * 100} 
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  color="secondary"
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">VIBRAS</Typography>
                  <Typography variant="body2">{stats.byType.VIBRA}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(stats.byType.VIBRA / stats.totalPoints) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Méritos Recientes
              </Typography>
              
              <List>
                {merits?.slice(0, 5).map((merit, index) => (
                  <React.Fragment key={merit.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getMeritTypeColor(merit.type)}.main` }}>
                          {getMeritTypeIcon(merit.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              +{merit.amount} {merit.type}
                            </Typography>
                            <Chip 
                              label={getSourceLabel(merit.source)} 
                              size="small" 
                              color={getMeritTypeColor(merit.type)}
                            />
                          </Box>
                        }
                        secondary={new Date(merit.createdAt).toLocaleDateString()}
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Todos los Méritos */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial Completo de Méritos
          </Typography>
          
          {merits && merits.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario ID</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell>Fuente</TableCell>
                    <TableCell>Entidad Relacionada</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {merits.map((merit) => (
                    <TableRow key={merit.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {merit.userId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={merit.type}
                          color={getMeritTypeColor(merit.type)}
                          size="small"
                          icon={getMeritTypeIcon(merit.type)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color={`${getMeritTypeColor(merit.type)}.main`}>
                          +{merit.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getSourceLabel(merit.source)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {merit.relatedEntityId ? 
                            `${merit.relatedEntityId.substring(0, 8)}...` : 
                            'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(merit.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay méritos registrados en el sistema.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}; 