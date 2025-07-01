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
  Paper,
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

interface MinimalistProfileWidgetProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    level: number;
    experience: number;
    maxExperience: number;
    meritos: number;
    ondas: number;
    etherEnergy: number;
    title?: string;
    joinDate: string;
    achievements: Achievement[];
    activityScore: number;
    reciprocidadIndex: number;
    bienComunContributions: number;
  };
  achievements: Achievement[];
  compact?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'cosmic';
  unlockedAt?: string;
  category: string;
  progress?: number;
  maxProgress?: number;
}

export const MinimalistProfileWidget: React.FC<MinimalistProfileWidgetProps> = ({
  user,
  achievements,
  compact = false
}) => {
  const theme = useTheme();
  const [expandedView, setExpandedView] = useState(false);

  // Calculate Alignment
  const alignment = useMemo(() => {
    const totalEnergy = user.meritos + user.ondas + user.etherEnergy;
    const balance = Math.abs(user.meritos - user.ondas) / totalEnergy;

    if (user.etherEnergy > 80 && balance < 0.1) return 'transcendent';
    if (balance < 0.2) return 'balanced';
    return 'ascending';
  }, [user]);

  // Achievement Rarity Colors
  const rarityColors = {
    common: theme.palette.info.main,
    rare: theme.palette.success.main,
    epic: theme.palette.warning.main,
    legendary: theme.palette.error.main,
    cosmic: theme.palette.secondary.main
  };

  const levelTitles = {
    1: 'Explorador',
    2: 'Buscador de Sabiduría',
    3: 'Tejedor de Conexiones',
    4: 'Guardián del Equilibrio',
    5: 'Maestro de la Reciprocidad',
    6: 'Sabio Experimentado',
    7: 'Avatar del Bien Común'
  };

  // Función para obtener color de alineación
  const getAlignmentColor = () => {
    switch (alignment) {
      case 'transcendent': return theme.palette.secondary.main;
      case 'balanced': return theme.palette.success.main;
      case 'ascending': return theme.palette.primary.main;
      default: return theme.palette.primary.main;
    }
  };

  // Stats principales
  const mainStats = [
    {
      label: 'Mëritos',
      value: user.meritos,
      icon: <DiamondOutlined />,
      color: theme.palette.primary.main,
      description: 'Contribuciones al Bien Común'
    },
    {
      label: 'Öndas',
      value: user.ondas,
      icon: <FlashOnOutlined />,
      color: theme.palette.secondary.main,
      description: 'Energía vibracional positiva'
    },
    {
      label: 'Experiencia',
      value: user.experience,
      icon: <AutoAwesome />,
      color: theme.palette.warning.main,
      description: 'Puntos de experiencia acumulados'
    },
    {
      label: 'Reciprocidad',
      value: `${(user.reciprocidadIndex * 100).toFixed(0)}%`,
      icon: <FavoriteOutlined />,
      color: theme.palette.success.main,
      description: 'Índice de balance Ayni'
    }
  ];

  // Achievements recientes (últimos 3)
  const recentAchievements = achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3);

  if (compact) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Avatar
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: getAlignmentColor(),
                  border: `2px solid ${theme.palette.background.paper}`
                }}
              >
                <Typography sx={{ fontSize: '8px', color: 'white' }}>
                  {user.level}
                </Typography>
              </Avatar>
            }
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: 'block'
              }}
            >
              {levelTitles[user.level as keyof typeof levelTitles] || 'Miembro'}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main
              }}
            >
              {user.meritos}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              Mëritos
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
        }
      }}
    >
      {/* Header del perfil */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: getAlignmentColor(),
                  border: `2px solid ${theme.palette.background.paper}`,
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {user.level}
              </Avatar>
            }
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{
                width: 80,
                height: 80,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold',
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.5
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 1
              }}
            >
              {user.title || levelTitles[user.level as keyof typeof levelTitles] || 'Miembro'}
            </Typography>

            <Chip
              label={alignment === 'transcendent' ? 'Trascendente' : alignment === 'balanced' ? 'Equilibrado' : 'En Ascensión'}
              size="small"
              sx={{
                backgroundColor: alpha(getAlignmentColor(), 0.1),
                color: getAlignmentColor(),
                fontWeight: 600,
                border: `1px solid ${alpha(getAlignmentColor(), 0.2)}`,
              }}
            />
          </Box>

          <IconButton
            onClick={() => setExpandedView(!expandedView)}
            sx={{
              color: theme.palette.text.secondary,
              transform: expandedView ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>

        {/* Barra de progreso de nivel */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Nivel {user.level}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {user.experience} / {user.maxExperience} XP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(user.experience / user.maxExperience) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 4,
              },
            }}
          />
        </Box>
      </Box>

      {/* Stats principales */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          📊 Estadísticas Principales
        </Typography>

        <Grid container spacing={2}>
          {mainStats.map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: alpha(stat.color, 0.05),
                  border: `1px solid ${alpha(stat.color, 0.1)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha(stat.color, 0.08),
                    borderColor: alpha(stat.color, 0.2),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Box
                  sx={{
                    color: stat.color,
                    mb: 1,
                    '& > svg': { fontSize: '1.5rem' }
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    mb: 0.5
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.75rem'
                  }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Logros recientes - Expandible */}
      <Collapse in={expandedView}>
        <Box sx={{ p: 3, pt: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2
            }}
          >
            🏆 Logros Recientes
          </Typography>

          {recentAchievements.length > 0 ? (
            <Stack spacing={1.5}>
              {recentAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: alpha(rarityColors[achievement.rarity], 0.05),
                    border: `1px solid ${alpha(rarityColors[achievement.rarity], 0.1)}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(rarityColors[achievement.rarity], 0.08),
                      borderColor: alpha(rarityColors[achievement.rarity], 0.2),
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        color: rarityColors[achievement.rarity],
                        '& > svg': { fontSize: '1.8rem' }
                      }}
                    >
                      {achievement.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          display: 'block'
                        }}
                      >
                        {achievement.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={achievement.rarity}
                      size="small"
                      sx={{
                        backgroundColor: alpha(rarityColors[achievement.rarity], 0.2),
                        color: rarityColors[achievement.rarity],
                        fontSize: '0.7rem',
                        height: 20,
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                </Card>
              ))}
            </Stack>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Aún no tienes logros desbloqueados
              </Typography>
            </Paper>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MinimalistProfileWidget;
