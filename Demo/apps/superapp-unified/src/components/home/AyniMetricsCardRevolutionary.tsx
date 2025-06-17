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
import WaterDropIcon from '@mui/icons-material/WaterDrop';
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

const AyniMetricsCardRevolutionary: React.FC<AyniMetricsRevolutionaryProps> = ({
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
        icon: <WaterDropIcon />,
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

  // 📊 Cálculos avanzados
  const advancedStats = useMemo(() => {
    const averageElemental =
      (elementos.fuego + elementos.agua + elementos.tierra + elementos.aire) /
      4;
    const elementalHarmony =
      100 -
      Math.abs(
        Math.max(...Object.values(elementos)) -
          Math.min(...Object.values(elementos))
      );

    return {
      ayniScore: Math.round(balanceAyni * 100),
      averageElemental: Math.round(averageElemental),
      elementalHarmony,
      experienceNeeded: Math.round(4000 - ondas > 0 ? 4000 - ondas : 0),
      nextLevelOndas: 4000,
      totalContributions: bienComunContributions,
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
    return (
      <Box
        sx={{
          position: 'relative',
          width: { xs: 160, sm: 180, md: 200, lg: 220 },
          height: { xs: 160, sm: 180, md: 200, lg: 220 },
          borderRadius: '50%',
          mx: 'auto',
          mb: { xs: 2, sm: 3, md: 4 },
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
              mb: { xs: 0.5, sm: 1 },
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem',
                lg: '3.5rem',
              },
              lineHeight: 1,
            }}
          >
            {advancedStats.ayniScore}%
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
            }}
          >
            Balance Ayni
          </Typography>
          <Chip
            label={ayniLevel}
            sx={{
              bgcolor: alpha('#00BCD4', 0.2),
              color: '#00BCD4',
              fontWeight: 'bold',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
            }}
          />
        </Box>

        {/* Elementos orbitales */}
        {Object.entries(elementConfig).map(([key, element], index) => {
          const angle = index * 90 + animationPhase * 0.5;
          // Radio adaptativo según el tamaño de pantalla
          const getRadius = () => {
            if (typeof window !== 'undefined') {
              if (window.innerWidth < 600) return 65; // Mobile
              if (window.innerWidth < 900) return 75; // Tablet
              if (window.innerWidth < 1200) return 85; // Desktop
            }
            return 95; // Large Desktop
          };
          const radius = getRadius();
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
                    width: {
                      xs: hoveredElement === key ? 40 : 36,
                      sm: hoveredElement === key ? 48 : 42,
                      md: hoveredElement === key ? 56 : 48,
                      lg: hoveredElement === key ? 60 : 52,
                    },
                    height: {
                      xs: hoveredElement === key ? 40 : 36,
                      sm: hoveredElement === key ? 48 : 42,
                      md: hoveredElement === key ? 56 : 48,
                      lg: hoveredElement === key ? 60 : 52,
                    },
                    background: element.gradient,
                    color: 'white',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 4px 20px ${alpha(element.color, 0.4)}`,
                    '& svg': {
                      fontSize: {
                        xs: '1rem',
                        sm: '1.2rem',
                        md: '1.4rem',
                        lg: '1.6rem',
                      },
                    },
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

  // ��� Renderizar métricas revolucionarias
  const renderRevolutionaryMetrics = () => (
    <Grid
      container
      spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
      sx={{ mb: { xs: 2, sm: 3 } }}
    >
      {[
        {
          label: 'Öndas',
          value: ondas.toLocaleString(),
          icon: <WaterDropIcon />,
          color: '#00BCD4',
          gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
        },
        {
          label: 'Mëritos',
          value: meritos.toLocaleString(),
          icon: <EmojiEventsIcon />,
          color: '#FFD54F',
          gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
        },
        {
          label: 'Bien Común',
          value: bienComunContributions.toString(),
          icon: <FavoriteIcon />,
          color: '#E91E63',
          gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
        },
        {
          label: 'Poder Total',
          value: advancedStats.overallPower.toString(),
          icon: <AutoAwesomeIcon />,
          color: '#9C27B0',
          gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
        },
      ].map((metric, index) => (
        <Grid item xs={6} sm={6} md={3} key={metric.label}>
          <Card
            sx={{
              background: alpha(metric.color, 0.1),
              border: `1px solid ${alpha(metric.color, 0.3)}`,
              borderRadius: { xs: 2, sm: 3 },
              textAlign: 'center',
              p: { xs: 1.5, sm: 2 },
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              minHeight: { xs: 120, sm: 140, md: 150 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(metric.color, 0.4)}`,
                background: alpha(metric.color, 0.15),
              },
            }}
          >
            <Box
              sx={{
                width: { xs: 45, sm: 50, md: 60 },
                height: { xs: 45, sm: 50, md: 60 },
                borderRadius: '50%',
                background: metric.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: { xs: 1, sm: 1.5, md: 2 },
                color: 'white',
                boxShadow: `0 4px 15px ${alpha(metric.color, 0.3)}`,
                '& svg': {
                  fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
                },
              }}
            >
              {metric.icon}
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: metric.color,
                mb: { xs: 0.5, sm: 1 },
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.8rem',
                  md: '2.125rem',
                },
                lineHeight: 1.2,
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
                letterSpacing: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                textAlign: 'center',
                lineHeight: 1.1,
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
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Avatar
          sx={{
            background: 'linear-gradient(135deg, #00BCD4 0%, #9C27B0 100%)',
            color: 'white',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
          }}
        >
          <TrendingUpIcon />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Evolución hacia {nextLevel}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: alpha('#fff', 0.8),
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {advancedStats.experienceNeeded.toLocaleString()} Öndas para
            ascender
          </Typography>
        </Box>
      </Box>

      <LinearProgress
        variant="determinate"
        value={ayniProgress}
        sx={{
          height: { xs: 8, sm: 10, md: 12 },
          borderRadius: 6,
          bgcolor: alpha('#fff', 0.1),
          '& .MuiLinearProgress-bar': {
            borderRadius: 6,
            background: 'linear-gradient(90deg, #00BCD4 0%, #9C27B0 100%)',
          },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0.5, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: alpha('#fff', 0.7),
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          {ayniProgress}% completado
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: alpha('#fff', 0.7),
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          Siguiente: {advancedStats.nextLevelOndas.toLocaleString()} Öndas
        </Typography>
      </Box>
    </Card>
  );

  return (
    <Card
      className={className}
      sx={{
        background: `linear-gradient(135deg, 
          ${alpha('#000', 0.6)} 0%, 
          ${alpha('#001122', 0.8)} 50%, 
          ${alpha('#000', 0.6)} 100%)`,
        border: `2px solid ${alpha('#00BCD4', 0.3)}`,
        borderRadius: { xs: 3, sm: 4 },
        p: { xs: 2, sm: 2.5, md: 3 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 400, sm: 450, md: 500 },
        backdropFilter: 'blur(20px)',
        boxShadow: `0 8px 32px ${alpha('#00BCD4', 0.2)}`,
        // Mejorar spacing en mobile
        mx: { xs: 0.5, sm: 0 },
      }}
    >
      {/* Patrón de fondo sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300BCD4' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float-pattern 20s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1, p: 0 }}>
        {/* Header revolucionario */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
            }}
          >
            <DiamondIcon
              sx={{
                color: '#00BCD4',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                filter: 'drop-shadow(0 0 8px #00BCD4)',
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              Tu Balance Ayni
            </Typography>
          </Box>

          <IconButton
            onClick={handleExpandToggle}
            sx={{
              color: '#00BCD4',
              background: alpha('#00BCD4', 0.1),
              '&:hover': {
                background: alpha('#00BCD4', 0.2),
                transform: 'scale(1.1)',
              },
            }}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            />
          </IconButton>
        </Box>

        {/* Orb central revolucionario */}
        {renderCentralOrb()}

        {/* Métricas revolucionarias */}
        {renderRevolutionaryMetrics()}

        {/* Progreso hacia siguiente nivel */}
        {renderLevelProgress()}

        {/* Panel expandido con insights */}
        {expanded && (
          <Card
            sx={{
              background: alpha('#000', 0.2),
              border: `1px solid ${alpha('#fff', 0.1)}`,
              borderRadius: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 3 },
              mt: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: { xs: 2, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              <BalanceIcon sx={{ color: '#00BCD4' }} />
              Análisis Elemental Detallado
            </Typography>

            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {Object.entries(elementConfig).map(([key, element]) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: alpha(element.color, 0.1),
                      border: `1px solid ${alpha(element.color, 0.3)}`,
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        background: element.gradient,
                        mx: 'auto',
                        mb: { xs: 1, sm: 1.5 },
                      }}
                    >
                      {element.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      sx={{
                        color: element.color,
                        fontWeight: 'bold',
                        mb: 0.5,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      {element.value}%
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        mb: 1,
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      }}
                    >
                      {element.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: alpha('#fff', 0.7),
                        display: 'block',
                        mb: 1,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      {element.description}
                    </Typography>
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
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider
              sx={{ bgcolor: alpha('#fff', 0.1), my: { xs: 2, sm: 3 } }}
            />

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  color: '#00BCD4',
                  fontWeight: 'bold',
                  mb: 1,
                  fontSize: { xs: '1.3rem', sm: '1.5rem' },
                }}
              >
                Armonía Elemental: {Math.round(advancedStats.elementalHarmony)}%
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha('#fff', 0.8),
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                }}
              >
                {advancedStats.elementalHarmony > 80
                  ? '🌟 Tu balance elemental es excepcional'
                  : advancedStats.elementalHarmony > 60
                    ? '⚡ Buen equilibrio elemental'
                    : '🌱 Enfócate en equilibrar tus elementos'}
              </Typography>
            </Box>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default AyniMetricsCardRevolutionary;
