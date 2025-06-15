import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { 
  Psychology, 
  Add,
  PersonAdd,
  TrendingUp,
  Group,
  Assessment
} from '@mui/icons-material';
import { AssignUserPersonalityModal } from '../components/AssignUserPersonalityModal';
import { personalityService, type Personality, type PersonalityStats } from '../services/personality.service';

export const PersonalitiesPage: React.FC = () => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [stats, setStats] = useState<PersonalityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [personalitiesData, statsData] = await Promise.all([
        personalityService.getAllPersonalities(),
        personalityService.getPersonalityStats()
      ]);
      
      setPersonalities(personalitiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading personality data:', err);
      setError('Error al cargar los datos de personalidades. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSuccess = () => {
    // Recargar datos después de una asignación exitosa
    loadData();
  };

  const parseTraits = (traitsJson: string) => {
    try {
      return JSON.parse(traitsJson);
    } catch {
      return {};
    }
  };

  const getPersonalityColor = (name: string) => {
    // Colores basados en los grupos MBTI
    if (name.includes('NT')) return 'primary'; // Analistas
    if (name.includes('NF')) return 'secondary'; // Diplomáticos  
    if (name.includes('SJ')) return 'success'; // Centinelas
    if (name.includes('SP')) return 'warning'; // Exploradores
    
    // Colores específicos por tipo
    const colors: Record<string, string> = {
      'INTJ': 'primary',
      'INTP': 'primary',
      'ENTJ': 'primary',
      'ENTP': 'primary',
      'INFJ': 'secondary',
      'INFP': 'secondary',
      'ENFJ': 'secondary',
      'ENFP': 'secondary',
      'ISTJ': 'success',
      'ISFJ': 'success',
      'ESTJ': 'success',
      'ESFJ': 'success',
      'ISTP': 'warning',
      'ISFP': 'warning',
      'ESTP': 'warning',
      'ESFP': 'warning',
    };
    
    return colors[name] || 'default';
  };

  const getPersonalityUsage = (personalityId: string): number => {
    if (!stats) return 0;
    const personalityData = stats.personalitiesWithUserCount.find(p => p.id === personalityId);
    return personalityData?._count.users || 0;
  };

  const getUsagePercentage = (personalityId: string): number => {
    if (!stats || stats.totalUsersWithPersonality === 0) return 0;
    const usage = getPersonalityUsage(personalityId);
    return Math.round((usage / stats.totalUsersWithPersonality) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadData}>
            Reintentar
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Personalidades MBTI
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona los 16 tipos de personalidad Myers-Briggs y asignaciones de usuarios
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAssignModalOpen(true)}
          sx={{ height: 'fit-content' }}
        >
          Asignar Personalidad
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tipos de Personalidad
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.totalPersonalities || 0}
                  </Typography>
                </Box>
                <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />
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
                    Usuarios Asignados
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.totalUsersWithPersonality || 0}
                  </Typography>
                </Box>
                <Group sx={{ fontSize: 40, color: 'success.main' }} />
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
                    Tipo Más Popular
                  </Typography>
                  <Typography variant="h6" component="h2">
                    {stats?.personalitiesWithUserCount
                      ?.sort((a, b) => b._count.users - a._count.users)[0]?.name || 'N/A'}
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
                    Cobertura Total
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {personalities.length === 16 ? '100%' : `${Math.round((personalities.length / 16) * 100)}%`}
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Personality Types Grid */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Tipos de Personalidad ({personalities.length})
      </Typography>
      
      <Grid container spacing={3}>
        {personalities.map((personality) => {
          const traits = parseTraits(personality.traits);
          const usage = getPersonalityUsage(personality.id);
          const percentage = getUsagePercentage(personality.id);
          const color = getPersonalityColor(personality.name);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={personality.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56, fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {personality.name}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {personality.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {personality.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${usage} usuarios`} 
                      color={color as any}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {/* Traits */}
                  {Object.keys(traits).length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Características principales:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Object.entries(traits)
                          .sort(([,a], [,b]) => (b as number) - (a as number))
                          .slice(0, 3)
                          .map(([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}%`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Usage Statistics */}
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Adopción
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      color={color as any}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {personalities.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
          <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No hay personalidades disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las personalidades se cargarán automáticamente desde la base de datos.
          </Typography>
        </Paper>
      )}

      {/* Assignment Modal */}
      <AssignUserPersonalityModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSuccess={handleAssignSuccess}
      />
    </Box>
  );
}; 