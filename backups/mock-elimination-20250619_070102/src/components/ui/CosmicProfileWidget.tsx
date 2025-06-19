import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Fab,
  Collapse,
  Stack,
  Badge,
} from '@mui/material';
import {
  AutoAwesome,
  DiamondOutlined,
  FlashOnOutlined,
  FavoriteOutlined,
  TrendingUpOutlined,
  StarBorderOutlined,
  ExpandMore,
  ExpandLess,
  Psychology,
  Spa,
  EmojiNature,
  AllInclusive,
} from '@mui/icons-material';

// Placeholder for RevolutionaryWidget if not available
const RevolutionaryWidget: React.FC<any> = ({ children, ...props }) => (
  <Box 
    sx={{ 
      position: 'relative',
      borderRadius: 3,
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 50%)',
      backdropFilter: 'blur(20px)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(225, 190, 231, 0.03) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(79, 195, 247, 0.03) 0%, transparent 40%)
        `,
        pointerEvents: 'none'
      },
      ...props.style
    }}
  >
    {children}
  </Box>
);

interface CosmicProfileWidgetProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    meritos: number;
    ondas: number;
    ayniScore: number;
    currentStreak: number;
    nextLevelProgress: number;
    etherEnergy: number; // New cosmic element
    cosmicAlignment: 'ascending' | 'balanced' | 'transcendent';
  };
  achievements: Array<{
    id: string;
    title: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'cosmic';
    unlockedAt: Date;
    category: 'learning' | 'ayni' | 'community' | 'wisdom' | 'transcendence';
  }>;
  compact?: boolean;
}

export const CosmicProfileWidget: React.FC<CosmicProfileWidgetProps> = ({
  user,
  achievements,
  compact = false
}) => {
  const theme = useTheme();
  const [expandedView, setExpandedView] = useState(false);

  // Cosmic Ether Configuration (5th Element)
  const etherConfig = {
    name: 'Ether',
    description: 'Consciencia Cósmica Expandida',
    color: '#E1BEE7', // Violet-light for transcendence
    gradient: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 50%, #BA68C8 100%)',
    icon: <AllInclusive sx={{ color: '#E1BEE7' }} />,
    effects: {
      particles: 'cosmic-dust',
      glow: 'transcendent',
      animation: 'ethereal-flow'
    }
  };

  // Calculate Cosmic Alignment
  const cosmicAlignment = useMemo(() => {
    const totalEnergy = user.meritos + user.ondas + user.etherEnergy;
    const balance = Math.abs(user.meritos - user.ondas) / totalEnergy;
    
    if (user.etherEnergy > 80 && balance < 0.1) return 'transcendent';
    if (balance < 0.2) return 'balanced';
    return 'ascending';
  }, [user]);

  // Achievement Rarity Colors
  const rarityColors = {
    common: '#64B5F6',
    rare: '#81C784',
    epic: '#FFB74D',
    legendary: '#FF8A65',
    cosmic: '#E1BEE7'
  };

  const levelTitles = {
    1: 'Explorador Cósmico',
    2: 'Buscador de Sabiduría', 
    3: 'Tejedor de Conexiones',
    4: 'Guardián del Equilibrio',
    5: 'Maestro de la Reciprocidad',
    6: 'Sabio Intergaláctico',
    7: 'Avatar del Bien Común'
  };

  return (
    <RevolutionaryWidget
      title="🌌 Perfil Cósmico CoomÜnity"
      subtitle="Tu esencia multidimensional en el ecosistema"
      variant="elevated"
      element="ether"
      cosmicEffects={{
        enableGlow: true,
        enableAnimations: true,
        enableParticles: true,
        glowIntensity: user.etherEnergy / 100,
        particleTheme: 'cosmic-dust',
        cosmicIntensity: cosmicAlignment === 'transcendent' ? 'cosmic' : 'intense'
      }}
      style={{ minHeight: compact ? '300px' : '500px' }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        {/* Header with Cosmic Avatar */}
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box position="relative">
            <Avatar
              src={user.avatar}
              sx={{
                width: compact ? 80 : 120,
                height: compact ? 80 : 120,
                border: `3px solid ${etherConfig.color}`,
                boxShadow: `0 0 20px ${alpha(etherConfig.color, 0.5)}`,
                background: etherConfig.gradient,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  right: -5,
                  bottom: -5,
                  borderRadius: '50%',
                  background: etherConfig.gradient,
                  opacity: 0.3,
                  zIndex: -1,
                  animation: 'etherealPulse 3s ease-in-out infinite',
                }
              }}
            />
            
            {/* Cosmic Alignment Indicator */}
            <Chip
              label={cosmicAlignment}
              size="small"
              sx={{
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: etherConfig.gradient,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                '&::before': {
                  content: cosmicAlignment === 'transcendent' ? '"✨"' : 
                          cosmicAlignment === 'balanced' ? '"⚖️"' : '"🌱"',
                  mr: 0.5
                }
              }}
            />
          </Box>

          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.name}
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Nivel {user.level} • {levelTitles[user.level as keyof typeof levelTitles]}
            </Typography>

            {/* Cosmic Progress to Next Level */}
            <Box mt={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  Progreso Cósmico al Nivel {user.level + 1}
                </Typography>
                <Typography variant="caption" fontWeight="bold">
                  {user.nextLevelProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={user.nextLevelProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: alpha(etherConfig.color, 0.2),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: etherConfig.gradient,
                    animation: 'cosmicFlow 2s ease-in-out infinite'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Cosmic Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Mëritos */}
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA726 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }
              }}
            >
              <DiamondOutlined sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                {user.meritos.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Mëritos
              </Typography>
            </Card>
          </Grid>

          {/* Öndas */}
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }
              }}
            >
              <FlashOnOutlined sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                {user.ondas.toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Öndas
              </Typography>
            </Card>
          </Grid>

          {/* Ayni Score */}
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  borderRadius: '50%'
                }
              }}
            >
              <FavoriteOutlined sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                {user.ayniScore}%
              </Typography>
              <Typography variant="caption">
                Balance Ayni
              </Typography>
            </Card>
          </Grid>

          {/* Ether Energy (New!) */}
          <Grid item xs={6} md={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                background: etherConfig.gradient,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 4px 20px ${alpha(etherConfig.color, 0.3)}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'etherealGlow 4s ease-in-out infinite'
                }
              }}
            >
              <AllInclusive sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                {user.etherEnergy}
              </Typography>
              <Typography variant="caption">
                Ether Cósmico
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Achievement Showcase */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              🏆 Logros Cósmicos
            </Typography>
            <IconButton
              onClick={() => setExpandedView(!expandedView)}
              sx={{ 
                background: alpha(etherConfig.color, 0.1),
                '&:hover': { background: alpha(etherConfig.color, 0.2) }
              }}
            >
              {expandedView ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {achievements.slice(0, expandedView ? achievements.length : 3).map((achievement) => (
              <Tooltip
                key={achievement.id}
                title={`${achievement.title} • ${achievement.category} • ${achievement.rarity}`}
              >
                <Chip
                  label={achievement.title}
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${rarityColors[achievement.rarity]}, ${alpha(rarityColors[achievement.rarity], 0.7)})`,
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 1,
                    '&::before': {
                      content: achievement.rarity === 'cosmic' ? '"🌌"' :
                              achievement.rarity === 'legendary' ? '"👑"' :
                              achievement.rarity === 'epic' ? '"⭐"' :
                              achievement.rarity === 'rare' ? '"💎"' : '"🏅"',
                      mr: 0.5
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Stack>

          <Collapse in={expandedView}>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Distribución de Logros por Rareza:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {Object.entries(rarityColors).map(([rarity, color]) => {
                  const count = achievements.filter(a => a.rarity === rarity).length;
                  return count > 0 ? (
                    <Chip
                      key={rarity}
                      label={`${rarity}: ${count}`}
                      size="small"
                      sx={{
                        background: alpha(color, 0.2),
                        color: color,
                        border: `1px solid ${alpha(color, 0.3)}`
                      }}
                    />
                  ) : null;
                })}
              </Stack>
            </Box>
          </Collapse>
        </Box>

        {/* Cosmic Energy Visualization */}
        {!compact && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🌌 Alineación Energética
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    border: `2px solid ${alpha(etherConfig.color, 0.3)}`,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(etherConfig.color, 0.05)}, ${alpha(etherConfig.color, 0.1)})`,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Estado Vibracional
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                    {etherConfig.icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: etherConfig.color }}>
                      {user.etherEnergy}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Consciencia expandida en dimensiones superiores
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    border: `2px solid ${alpha('#FFD700', 0.3)}`,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha('#FFD700', 0.05)}, ${alpha('#FFD700', 0.1)})`,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Racha Actual
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                    <TrendingUpOutlined sx={{ color: '#FFD700' }} />
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#FFD700' }}>
                      {user.currentStreak}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">🔥</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Días consecutivos de contribución al Bien Común
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Floating Cosmic Action Button */}
        <Fab
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            background: etherConfig.gradient,
            color: 'white',
            '&:hover': {
              background: etherConfig.gradient,
              transform: 'scale(1.1)',
              boxShadow: `0 8px 30px ${alpha(etherConfig.color, 0.4)}`
            }
          }}
          size="medium"
        >
          <AutoAwesome />
        </Fab>

        {/* Custom CSS animations in sx */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            '& @keyframes etherealPulse': {
              '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
              '50%': { opacity: 0.6, transform: 'scale(1.05)' }
            },
            '& @keyframes cosmicFlow': {
              '0%, 100%': { filter: 'brightness(1)' },
              '50%': { filter: 'brightness(1.2) hue-rotate(30deg)' }
            },
            '& @keyframes etherealGlow': {
              '0%, 100%': { opacity: 0.15 },
              '50%': { opacity: 0.25 }
            }
          }}
        />
      </Box>
    </RevolutionaryWidget>
  );
};

export default CosmicProfileWidget;