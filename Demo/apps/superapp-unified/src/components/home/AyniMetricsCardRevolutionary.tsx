import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useTheme, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterIcon from '@mui/icons-material/Water';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import BalanceIcon from '@mui/icons-material/Balance';
import StarIcon from '@mui/icons-material/Star';

interface ElementStats {
  fuego: number;
  agua: number;
  tierra: number;
  aire: number;
}

interface AyniMetricsRevolutionaryProps {
  ondas: number;
  meritos: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
  bienComunContributions: number;
  balanceAyni: number;
  elementos: ElementStats;
  isLoading?: boolean;
  isConnected?: boolean;
  className?: string;
}

export const AyniMetricsCardRevolutionary: React.FC<
  AyniMetricsRevolutionaryProps
> = ({
  ondas,
  meritos,
  ayniLevel,
  nextLevel,
  ayniProgress,
  bienComunContributions,
  balanceAyni,
  elementos,
  isLoading = false,
  isConnected = true,
  className = '',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // 🎨 Configuración de elementos con colores revolucionarios
  const elementConfig = useMemo(
    () => ({
      fuego: {
        name: 'Fuego',
        value: elementos.fuego,
        icon: <LocalFireDepartmentIcon />,
        color: '#FF6B35',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
        description: 'Pasión y Acción',
        keyword: 'ENERGÍA',
      },
      agua: {
        name: 'Agua',
        value: elementos.agua,
        icon: <WaterIcon />,
        color: '#00BCD4',
        gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
        description: 'Fluir y Adaptabilidad',
        keyword: 'FLUIDEZ',
      },
      tierra: {
        name: 'Tierra',
        value: elementos.tierra,
        icon: <TerrainIcon />,
        color: '#66BB6A',
        gradient: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
        description: 'Estabilidad y Confianza',
        keyword: 'SOLIDEZ',
      },
      aire: {
        name: 'Aire',
        value: elementos.aire,
        icon: <AirIcon />,
        color: '#FFD54F',
        gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
        description: 'Comunicación e Ideas',
        keyword: 'CLARIDAD',
      },
    }),
    [elementos]
  );

  // 🎯 Calcular estadísticas avanzadas
  const advancedStats = useMemo(() => {
    const totalElemental =
      elementos.fuego + elementos.agua + elementos.tierra + elementos.aire;
    const averageElemental = totalElemental / 4;
    const elementalHarmony =
      100 -
      Math.abs(
        Math.max(...Object.values(elementos)) -
          Math.min(...Object.values(elementos))
      );

    const nextLevelOndas = Math.ceil(ondas * 1.5);
    const experienceNeeded = nextLevelOndas - ondas;

    return {
      totalElemental,
      averageElemental,
      elementalHarmony,
      nextLevelOndas,
      experienceNeeded,
      ayniScore: Math.round(balanceAyni * 100),
      overallPower: Math.round(ondas / 20 + meritos / 10 + averageElemental),
    };
  }, [elementos, ondas, meritos, balanceAyni]);

  // 🎨 Animaciones continuas
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AyniMetricsCardRevolutionary');
    };
  }, []);

  // 🎯 Handlers
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleElementHover = useCallback((elementKey: string | null) => {
    setHoveredElement(elementKey);
  }, []);

  // 🎨 Renderizar el círculo central revolucionario
  const renderCentralOrb = () => {
    const orbSize = 200;
    const progress = ayniProgress / 100;

    return (
      <Box
        sx={{
          position: 'relative',
          width: orbSize,
          height: orbSize,
          mx: 'auto',
          mb: 4,
        }}
      >
        {/* Círculo exterior con gradiente animado */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(from ${animationPhase}deg, 
              #FF6B35 0deg,
              #00BCD4 90deg,
              #66BB6A 180deg,
              #FFD54F 270deg,
              #FF6B35 360deg)`,
            animation: 'rotate-continuous 20s linear infinite',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 8,
              left: 8,
              right: 8,
              bottom: 8,
              borderRadius: '50%',
              background: `linear-gradient(135deg, 
                ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                ${alpha(theme.palette.background.default, 0.9)} 100%)`,
            },
          }}
        />

        {/* Contenido central */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF6B35 30%, #00BCD4 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              fontSize: '3rem',
            }}
          >
            {advancedStats.ayniScore}%
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
          >
            Balance Ayni
          </Typography>
          <Chip
            label={ayniLevel}
            sx={{
              bgcolor: alpha('#00BCD4', 0.2),
              color: '#00BCD4',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Elementos orbitales */}
        {Object.entries(elementConfig).map(([key, element], index) => {
          const angle = index * 90 + animationPhase * 0.5;
          const radius = 85;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <Box
              key={key}
              onMouseEnter={() => handleElementHover(key)}
              onMouseLeave={() => handleElementHover(null)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                zIndex: 3,
                cursor: 'pointer',
              }}
            >
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2">{element.name}</Typography>
                    <Typography variant="caption">
                      {element.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {element.value}% - {element.keyword}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Avatar
                  sx={{
                    width: hoveredElement === key ? 56 : 48,
                    height: hoveredElement === key ? 56 : 48,
                    background: element.gradient,
                    color: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 4px 20px ${alpha(element.color, 0.4)}`,
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: `0 6px 25px ${alpha(element.color, 0.6)}`,
                    },
                  }}
                >
                  {element.icon}
                </Avatar>
              </Tooltip>
            </Box>
          );
        })}
      </Box>
    );
  };

  // 📊 Renderizar métricas principales
  const renderMainMetrics = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[
        {
          label: 'Öndas Generadas',
          value: ondas.toLocaleString(),
          icon: <BoltIcon />,
          color: '#FFD54F',
          gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
        },
        {
          label: 'Mëritos Ganados',
          value: meritos.toLocaleString(),
          icon: <DiamondIcon />,
          color: '#9C27B0',
          gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
        },
        {
          label: 'Bien Común',
          value: bienComunContributions.toString(),
          icon: <FavoriteIcon />,
          color: '#E91E63',
          gradient: 'linear-gradient(135deg, #E91E63 0%, #EC407A 100%)',
        },
        {
          label: 'Poder Total',
          value: advancedStats.overallPower.toString(),
          icon: <AutoAwesomeIcon />,
          color: '#00BCD4',
          gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
        },
      ].map((metric, index) => (
        <Grid item xs={6} md={3} key={metric.label}>
          <Card
            sx={{
              background: alpha(metric.color, 0.1),
              border: `1px solid ${alpha(metric.color, 0.3)}`,
              borderRadius: 3,
              textAlign: 'center',
              p: 2,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(metric.color, 0.4)}`,
                background: alpha(metric.color, 0.15),
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: metric.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'white',
                boxShadow: `0 4px 15px ${alpha(metric.color, 0.3)}`,
              }}
            >
              {metric.icon}
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: metric.color,
                mb: 1,
              }}
            >
              {metric.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: alpha('#fff', 0.8),
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {metric.label}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // 🎯 Renderizar progreso hacia siguiente nivel
  const renderLevelProgress = () => (
    <Card
      sx={{
        background: `linear-gradient(135deg, 
          ${alpha('#00BCD4', 0.15)} 0%, 
          ${alpha('#9C27B0', 0.15)} 100%)`,
        border: `1px solid ${alpha('#00BCD4', 0.3)}`,
        borderRadius: 3,
        p: 3,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #00BCD4 0%, #9C27B0 100%)',
            color: 'white',
          }}
        >
          <TrendingUpIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            Evolución hacia {nextLevel}
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
            {advancedStats.experienceNeeded.toLocaleString()} Öndas para
            ascender
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={ayniProgress}
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: alpha('#fff', 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 6,
            background: 'linear-gradient(90deg, #00BCD4 0%, #9C27B0 100%)',
          },
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
          {ayniProgress}% completado
        </Typography>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
          Siguiente: {advancedStats.nextLevelOndas.toLocaleString()} Öndas
        </Typography>
      </Box>
    </Card>
  );

  // 🌟 Renderizar elementos expandidos
  const renderExpandedElements = () => (
    <Card
      sx={{
        background: alpha('#000', 0.2),
        border: `1px solid ${alpha('#fff', 0.1)}`,
        borderRadius: 3,
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <BalanceIcon sx={{ color: '#00BCD4' }} />
        Armonía Elemental Detallada
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(elementConfig).map(([key, element]) => (
          <Grid item xs={12} md={6} key={key}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: alpha(element.color, 0.1),
                border: `1px solid ${alpha(element.color, 0.3)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(element.color, 0.15),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    background: element.gradient,
                    color: 'white',
                    width: 40,
                    height: 40,
                  }}
                >
                  {element.icon}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: 'white', fontWeight: 'bold' }}
                  >
                    {element.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha('#fff', 0.7) }}
                  >
                    {element.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: alpha('#fff', 0.8) }}
                  >
                    Nivel de {element.keyword}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: element.color, fontWeight: 'bold' }}
                  >
                    {element.value}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={element.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#fff', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: element.gradient,
                    },
                  }}
                />
              </Box>

              <Chip
                label={
                  element.value > 80
                    ? 'Excelente'
                    : element.value > 60
                      ? 'Bueno'
                      : 'Mejorable'
                }
                size="small"
                sx={{
                  bgcolor: alpha(element.color, 0.2),
                  color: element.color,
                  fontWeight: 'bold',
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ bgcolor: alpha('#fff', 0.1), my: 3 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            color: '#00BCD4',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Armonía Elemental: {Math.round(advancedStats.elementalHarmony)}%
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
          {advancedStats.elementalHarmony > 80
            ? '🌟 Tu balance elemental es excepcional'
            : advancedStats.elementalHarmony > 60
              ? '⚡ Buen equilibrio elemental'
              : '🌱 Enfócate en equilibrar tus elementos'}
        </Typography>
      </Box>
    </Card>
  );

  if (isLoading) {
    return (
      <Card className={`harmony-card ${className}`}>
        <CardContent className="harmony-p-lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: alpha('#fff', 0.6) }}>
              Cargando tu Balance Ayni...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`harmony-card interactive-card-advanced ${className}`}
      sx={{
        background: `linear-gradient(135deg, 
          ${alpha('#0A0E27', 0.95)} 0%, 
          ${alpha('#1A1F3A', 0.9)} 50%,
          ${alpha('#0A0E27', 0.95)} 100%)`,
        border: `1px solid ${alpha('#00BCD4', 0.3)}`,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 600,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300BCD4' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float-pattern 20s ease-in-out infinite',
          pointerEvents: 'none',
        },
      }}
    >
      <CardContent
        className="harmony-p-xl"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        {/* Header revolucionario */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                background:
                  'linear-gradient(135deg, #FF6B35 0%, #00BCD4 50%, #9C27B0 100%)',
                color: 'white',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  background:
                    'linear-gradient(45deg, #FF6B35 30%, #00BCD4 70%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                Tu Balance Ayni
              </Typography>
              <Typography variant="body1" sx={{ color: alpha('#fff', 0.8) }}>
                Dashboard Energético Revolucionario
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isConnected && (
              <Chip
                label="Offline"
                color="warning"
                size="small"
                icon={<RefreshIcon />}
              />
            )}
            <IconButton
              onClick={handleExpandToggle}
              sx={{
                color: '#00BCD4',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Orb central revolucionario */}
        {renderCentralOrb()}

        {/* Métricas principales */}
        {renderMainMetrics()}

        {/* Progreso hacia siguiente nivel */}
        {renderLevelProgress()}

        {/* Panel expandido */}
        {expanded && renderExpandedElements()}
      </CardContent>

      {/* CSS personalizado para animaciones */}
      <style jsx>{`
        @keyframes rotate-continuous {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Card>
  );
};

export default AyniMetricsCardRevolutionary;
