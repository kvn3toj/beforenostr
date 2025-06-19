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
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  keyframes,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  Diamond,
  Bolt,
  School,
  Celebration,
  TrendingUp,
  Group,
  Schedule,
  CheckCircle,
  Lock,
  AutoAwesome,
  Whatshot,
  LocalFireDepartment,
} from '@mui/icons-material';

// Animaciones
const bounceAnimation = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0,-30px,0); }
  70% { transform: translate3d(0,-15px,0); }
  90% { transform: translate3d(0,-4px,0); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 193, 7, 0.8); }
`;

const shimmerEffect = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'learning' | 'social' | 'streak' | 'mastery' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  rewards: {
    meritos: number;
    ondas: number;
    title?: string;
  };
  unlockedAt?: Date;
}

const UPlayAchievementSystem: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Primer Paso',
      description: 'Completa tu primer video',
      icon: <School />,
      category: 'learning',
      rarity: 'common',
      isUnlocked: true,
      progress: 1,
      maxProgress: 1,
      rewards: { meritos: 10, ondas: 5 },
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Estudiante Dedicado',
      description: 'Mantén una racha de 7 días consecutivos',
      icon: <LocalFireDepartment />,
      category: 'streak',
      rarity: 'rare',
      isUnlocked: true,
      progress: 7,
      maxProgress: 7,
      rewards: { meritos: 50, ondas: 25, title: 'Dedicado' },
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Maestro del Conocimiento',
      description: 'Responde correctamente 100 preguntas',
      icon: <AutoAwesome />,
      category: 'mastery',
      rarity: 'epic',
      isUnlocked: false,
      progress: 73,
      maxProgress: 100,
      rewards: { meritos: 100, ondas: 50, title: 'Maestro' },
    },
    {
      id: '4',
      title: 'Colaborador Social',
      description: 'Participa en 10 salas de estudio',
      icon: <Group />,
      category: 'social',
      rarity: 'rare',
      isUnlocked: false,
      progress: 6,
      maxProgress: 10,
      rewards: { meritos: 75, ondas: 40 },
    },
    {
      id: '5',
      title: 'Leyenda CoomÜnity',
      description: 'Alcanza 1000 Mëritos totales',
      icon: <Diamond />,
      category: 'special',
      rarity: 'legendary',
      isUnlocked: false,
      progress: 340,
      maxProgress: 1000,
      rewards: { meritos: 200, ondas: 100, title: 'Leyenda' },
    },
    {
      id: '6',
      title: 'Velocista del Aprendizaje',
      description: 'Completa 5 videos en un día',
      icon: <Bolt />,
      category: 'learning',
      rarity: 'common',
      isUnlocked: true,
      progress: 5,
      maxProgress: 5,
      rewards: { meritos: 25, ondas: 15 },
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ]);

  // Filtrar logros por categoría
  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  // Estadísticas
  const stats = {
    total: achievements.length,
    unlocked: achievements.filter(a => a.isUnlocked).length,
    totalMeritos: achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.rewards.meritos, 0),
    totalOndas: achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.rewards.ondas, 0),
  };

  // Obtener color según rareza
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9e9e9e';
      case 'rare': return '#2196f3';
      case 'epic': return '#9c27b0';
      case 'legendary': return '#ff9800';
      default: return '#757575';
    }
  };

  // Obtener label de rareza
  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Común';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Legendario';
      default: return rarity;
    }
  };

  // Obtener color de categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return '#4caf50';
      case 'social': return '#2196f3';
      case 'streak': return '#ff5722';
      case 'mastery': return '#9c27b0';
      case 'special': return '#ffc107';
      default: return '#757575';
    }
  };

  // Componente de tarjeta de logro
  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const rarityColor = getRarityColor(achievement.rarity);
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    const isComplete = achievement.isUnlocked;

    return (
      <Card
        sx={{
          height: '100%',
          background: isComplete 
            ? `linear-gradient(135deg, ${alpha(rarityColor, 0.1)}, ${alpha(rarityColor, 0.05)})`
            : alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `2px solid ${isComplete ? alpha(rarityColor, 0.5) : alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
          animation: isComplete ? `${glowPulse} 3s ease-in-out infinite` : 'none',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 20px 60px ${alpha(rarityColor, 0.4)}`,
            border: `2px solid ${alpha(rarityColor, 0.8)}`,
          },
        }}
      >
        {/* Efectos de brillo para logros legendarios */}
        {achievement.rarity === 'legendary' && isComplete && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
              animation: `${shimmerEffect} 2s ease-in-out infinite`,
            }}
          />
        )}

        {/* Estado de bloqueo */}
        {!isComplete && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha('#000', 0.7),
                color: '#757575',
                width: 32,
                height: 32,
              }}
            >
              <Lock sx={{ fontSize: 16 }} />
            </Avatar>
          </Box>
        )}

        <CardContent sx={{ p: 3 }}>
          {/* Icono y rareza */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Avatar
              sx={{
                bgcolor: alpha(rarityColor, 0.2),
                color: rarityColor,
                width: 64,
                height: 64,
                boxShadow: `0 8px 32px ${alpha(rarityColor, 0.3)}`,
                animation: isComplete ? `${bounceAnimation} 1s ease-in-out` : 'none',
              }}
            >
              {achievement.icon}
            </Avatar>
            <Chip
              label={getRarityLabel(achievement.rarity)}
              size="small"
              sx={{
                bgcolor: rarityColor,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            />
          </Box>

          {/* Título y descripción */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 1,
              color: isComplete ? rarityColor : 'text.primary',
            }}
          >
            {achievement.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 2, minHeight: 40 }}
          >
            {achievement.description}
          </Typography>

          {/* Progreso */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold', color: rarityColor }}>
                {achievement.progress}/{achievement.maxProgress}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(rarityColor, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${rarityColor}, ${alpha(rarityColor, 0.8)})`,
                  boxShadow: `0 0 10px ${alpha(rarityColor, 0.5)}`,
                },
              }}
            />
          </Box>

          {/* Recompensas */}
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            <Chip
              icon={<Diamond sx={{ fontSize: '16px !important' }} />}
              label={`${achievement.rewards.meritos} Mëritos`}
              size="small"
              variant="outlined"
              sx={{
                color: '#9c27b0',
                borderColor: alpha('#9c27b0', 0.3),
                bgcolor: alpha('#9c27b0', 0.1),
              }}
            />
            <Chip
              icon={<Bolt sx={{ fontSize: '16px !important' }} />}
              label={`${achievement.rewards.ondas} Öndas`}
              size="small"
              variant="outlined"
              sx={{
                color: '#ff9800',
                borderColor: alpha('#ff9800', 0.3),
                bgcolor: alpha('#ff9800', 0.1),
              }}
            />
          </Box>

          {/* Título especial */}
          {achievement.rewards.title && (
            <Chip
              icon={<Star sx={{ fontSize: '16px !important' }} />}
              label={`Título: ${achievement.rewards.title}`}
              size="small"
              sx={{
                bgcolor: alpha('#ffc107', 0.2),
                color: '#ffc107',
                fontWeight: 'bold',
                border: `1px solid ${alpha('#ffc107', 0.3)}`,
              }}
            />
          )}

          {/* Fecha de desbloqueo */}
          {isComplete && achievement.unlockedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Desbloqueado el {achievement.unlockedAt.toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header con estadísticas */}
      <Card
        sx={{
          background: alpha('#ffffff', 0.05),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 4,
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          🏆 Sistema de Logros
        </Typography>

        {/* Estadísticas principales */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffc107' }}>
                {stats.unlocked}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Logros Desbloqueados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {stats.totalMeritos}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mëritos Ganados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.totalOndas}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Öndas Ganadas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {Math.round((stats.unlocked / stats.total) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Completado
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Filtros de categoría */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Categorías
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {[
              { id: 'all', label: 'Todos', icon: <EmojiEvents /> },
              { id: 'learning', label: 'Aprendizaje', icon: <School /> },
              { id: 'social', label: 'Social', icon: <Group /> },
              { id: 'streak', label: 'Rachas', icon: <LocalFireDepartment /> },
              { id: 'mastery', label: 'Maestría', icon: <AutoAwesome /> },
              { id: 'special', label: 'Especiales', icon: <Diamond /> },
            ].map((category) => (
              <Chip
                key={category.id}
                icon={category.icon}
                label={category.label}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  borderColor: alpha('#ffffff', 0.3),
                  '&.MuiChip-filled': {
                    bgcolor: getCategoryColor(category.id),
                    color: 'white',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${alpha(getCategoryColor(category.id), 0.3)}`,
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>

      {/* Grid de logros */}
      <Grid container spacing={3}>
        {filteredAchievements.map((achievement) => (
          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
            <AchievementCard achievement={achievement} />
          </Grid>
        ))}
      </Grid>

      {/* Mensaje motivacional */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha('#ffc107', 0.1)}, ${alpha('#ff9800', 0.1)})`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffc107', 0.2)}`,
          borderRadius: 4,
          p: 4,
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Celebration sx={{ fontSize: 64, color: '#ffc107', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          ¡Sigue Desbloqueando Logros!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Cada logro que desbloqueas no solo te otorga recompensas, sino que también contribuye al 
          <strong> Bien Común</strong> de la comunidad CoomÜnity. Tu progreso inspira a otros a seguir aprendiendo.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AutoAwesome />}
          sx={{
            background: `linear-gradient(135deg, #ffc107, #ff9800)`,
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
            borderRadius: 3,
            '&:hover': {
              background: `linear-gradient(135deg, #ffb300, #f57c00)`,
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(255, 193, 7, 0.4)',
            }
          }}
        >
          Continuar Aprendiendo
        </Button>
      </Card>
    </Box>
  );
};

export default UPlayAchievementSystem; 