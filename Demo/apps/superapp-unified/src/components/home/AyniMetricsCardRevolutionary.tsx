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

  // 🎨 Configuración de elementos con colores áureos matemáticamente perfectos
  const elementConfig = useMemo(
    () => ({
      fuego: {
        name: 'Fuego',
        value: elementos.fuego,
        icon: <LocalFireDepartmentIcon />,
        color: '#FF6B35', // HSL(21, 89%, 59%) - Fibonacci hue 21°
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
        description: 'Pasión y Acción',
        keyword: 'ENERGÍA',
        angle: 0, // Ángulo base áureo
        hsl: 'hsl(21, 89%, 59%)', // Colores áureos HSL
      },
      agua: {
        name: 'Agua',
        value: elementos.agua,
        icon: <WaterDropIcon />,
        color: '#00BCD4', // HSL(187, 100%, 42%) - Aproximación áurea
        gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
        description: 'Fluir y Adaptabilidad',
        keyword: 'FLUIDEZ',
        angle: 90, // 360° / 4 = 90°
        hsl: 'hsl(187, 100%, 42%)', // Colores áureos HSL
      },
      tierra: {
        name: 'Tierra',
        value: elementos.tierra,
        icon: <TerrainIcon />,
        color: '#66BB6A', // HSL(123, 39%, 57%) - Fibonacci hue aproximado
        gradient: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
        description: 'Estabilidad y Confianza',
        keyword: 'SOLIDEZ',
        angle: 180, // 360° / 4 * 2 = 180°
        hsl: 'hsl(123, 39%, 57%)', // Colores áureos HSL
      },
      aire: {
        name: 'Aire',
        value: elementos.aire,
        icon: <AirIcon />,
        color: '#FFD54F', // HSL(48, 100%, 65%) - Aproximación áurea
        gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
        description: 'Comunicación e Ideas',
        keyword: 'CLARIDAD',
        angle: 270, // 360° / 4 * 3 = 270°
        hsl: 'hsl(48, 100%, 65%)', // Colores áureos HSL
      },
    }),
    [elementos]
  );

  // 📊 Cálculos avanzados con matemática áurea
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

    // Aplicar proporciones áureas a las métricas
    const goldenRatio = 1.6180339887;
    const ayniScore = Math.round(balanceAyni * 100);
    const nextLevelOndas = Math.round(4000 * goldenRatio); // 6472 ondas para próximo nivel áureo

    return {
      ayniScore,
      averageElemental: Math.round(averageElemental),
      elementalHarmony,
      experienceNeeded: Math.round(
        nextLevelOndas - ondas > 0 ? nextLevelOndas - ondas : 0
      ),
      nextLevelOndas,
      totalContributions: bienComunContributions,
      overallPower: Math.round(ondas / 21 + meritos / 13 + averageElemental), // Fibonacci divisors
      goldenRatio,
    };
  }, [elementos, ondas, meritos, balanceAyni]);

  // 🎨 Animaciones continuas con timing áureo
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 50); // Velocidad basada en proporción áurea

    return () => clearInterval(interval);
  }, []);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AyniMetricsCardRevolutionary');
    };
  }, []);

  // 🎯 Handlers con useCallback según reglas Builder.io
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleElementHover = useCallback((elementKey: string | null) => {
    setHoveredElement(elementKey);
  }, []);

  // 📐 Función para calcular radio orbital con secuencia Fibonacci UX/UI
  const getFibonacciOrbitalRadius = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Radios basados en secuencia Fibonacci optimizada para UX/UI
      if (window.innerWidth < 480) return 34; // Mobile: Fibonacci 34
      if (window.innerWidth < 768) return 55; // Mobile L: Fibonacci 55
      if (window.innerWidth < 1024) return 89; // Tablet: Fibonacci 89
      if (window.innerWidth < 1440) return 144; // Desktop: Fibonacci 144
      return 89; // Default: Fibonacci 89 (más conservador)
    }
    return 55; // Default: Fibonacci 55
  }, []);

  // 🎨 Renderizar el círculo central cósmico con secuencia Fibonacci UX/UI
  const renderCentralOrb = () => {
    const orbitalRadius = getFibonacciOrbitalRadius();

    return (
      <Box
        className="fibonacci-orb cosmic-center"
        sx={{
          position: 'relative',
          // Tamaños basados en secuencia Fibonacci para mejor UX/UI responsive
          width: {
            xs: '89px', // Fibonacci 89 - Mobile
            sm: '144px', // Fibonacci 144 - Tablet
            md: '233px', // Fibonacci 233 - Desktop
            lg: '233px', // Fibonacci 233 - Large
          },
          height: {
            xs: '89px', // Fibonacci 89 - Mobile
            sm: '144px', // Fibonacci 144 - Tablet
            md: '233px', // Fibonacci 233 - Desktop
            lg: '233px', // Fibonacci 233 - Large
          },
          borderRadius: '50%',
          mx: 'auto',
          mb: {
            xs: '13px', // Fibonacci 13
            sm: '21px', // Fibonacci 21
            md: '34px', // Fibonacci 34
            lg: '55px', // Fibonacci 55
          },
          // Simplificar variables CSS
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 🌍 Círculo exterior con gradiente cónico Fibonacci */}
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
            animation: 'revolutionary-rotate-continuous 15s linear infinite',
            boxShadow: `
              0 0 21px rgba(255, 107, 53, 0.5),
              0 0 34px rgba(0, 188, 212, 0.3),
              0 0 55px rgba(102, 187, 106, 0.2)
            `,
            zIndex: 1,
          }}
        />

        {/* 🌍 Fondo interno del mundo */}
        <Box
          sx={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            right: '5px',
            bottom: '5px',
            borderRadius: '50%',
            background: `radial-gradient(circle,
              rgba(15, 23, 42, 0.95) 0%,
              rgba(30, 41, 59, 0.9) 70%,
              rgba(15, 23, 42, 0.85) 100%)`,
            zIndex: 2,
          }}
        />

        {/* 🌍 Contenido central del mundo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            color: 'white',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFD700, #FF6B35, #00BCD4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
              fontSize: {
                xs: '1.5rem', // Fibonacci responsive
                sm: '2rem', // Fibonacci responsive
                md: '2.5rem', // Fibonacci responsive
                lg: '3rem', // Fibonacci responsive
              },
              lineHeight: 1,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            {advancedStats.ayniScore}%
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: 600,
              mb: 0.5,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            🌍 Balance Ayni
          </Typography>

          <Chip
            label={ayniLevel}
            sx={{
              bgcolor: 'rgba(0, 188, 212, 0.2)',
              color: '#00BCD4',
              fontWeight: 600,
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              border: '1px solid rgba(0, 188, 212, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          />
        </Box>

        {/* Elementos orbitales con posicionamiento Fibonacci UX/UI */}
        {Object.entries(elementConfig).map(([key, element], index) => {
          // Ángulo basado en secuencia Fibonacci: 360° / 4 = 90°
          const fibonacciAngle = 90; // Distribución más simple y clara
          const angle = (index * fibonacciAngle + animationPhase * 0.3) % 360;

          const x = Math.cos((angle * Math.PI) / 180) * orbitalRadius;
          const y = Math.sin((angle * Math.PI) / 180) * orbitalRadius;

          return (
            <Tooltip
              key={key}
              title={
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 0.5 }}
                  >
                    {element.name} - {element.value}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    {element.description}
                  </Typography>
                  <Chip
                    label={element.keyword}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      bgcolor: alpha(element.color, 0.2),
                      color: element.color,
                    }}
                  />
                </Box>
              }
              placement="top"
            >
              <Avatar
                className="orbital-element"
                onMouseEnter={() => handleElementHover(key)}
                onMouseLeave={() => handleElementHover(null)}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  // Tamaños basados en secuencia Fibonacci UX/UI
                  width: {
                    xs: hoveredElement === key ? '34px' : '21px', // Fibonacci 34/21
                    sm: hoveredElement === key ? '55px' : '34px', // Fibonacci 55/34
                    md: hoveredElement === key ? '89px' : '55px', // Fibonacci 89/55
                    lg: hoveredElement === key ? '89px' : '55px', // Fibonacci 89/55
                  },
                  height: {
                    xs: hoveredElement === key ? '34px' : '21px', // Fibonacci 34/21
                    sm: hoveredElement === key ? '55px' : '34px', // Fibonacci 55/34
                    md: hoveredElement === key ? '89px' : '55px', // Fibonacci 89/55
                    lg: hoveredElement === key ? '89px' : '55px', // Fibonacci 89/55
                  },
                  background: element.gradient,
                  cursor: 'pointer',
                  transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
                  boxShadow:
                    hoveredElement === key
                      ? `0 0 var(--golden-space-21) ${alpha(element.color, 0.6)}`
                      : `0 0 var(--golden-space-8) ${alpha(element.color, 0.3)}`,
                  zIndex: 3,
                  '&:hover': {
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(var(--golden-ratio-inverse))`,
                    boxShadow: `0 0 var(--golden-space-34) ${alpha(element.color, 0.8)}`,
                  },
                }}
              >
                {React.cloneElement(element.icon, {
                  sx: {
                    color: 'white',
                    fontSize: {
                      xs: 'var(--golden-text-md)',
                      sm: 'var(--golden-text-lg)',
                      md: 'var(--golden-text-xl)',
                    },
                  },
                })}
              </Avatar>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  // 📊 Renderizar métricas con grid áureo
  const renderMetricsGrid = () => {
    const metrics = [
      {
        label: 'Öndas',
        value: ondas.toLocaleString(),
        icon: <BoltIcon />,
        color: '#00BCD4',
        gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
      },
      {
        label: 'Mëritos',
        value: meritos.toLocaleString(),
        icon: <DiamondIcon />,
        color: '#FFD54F',
        gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
      },
      {
        label: 'Bien Común',
        value: bienComunContributions,
        icon: <FavoriteIcon />,
        color: '#E91E63',
        gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      },
      {
        label: 'Poder Total',
        value: advancedStats.overallPower,
        icon: <AutoAwesomeIcon />,
        color: '#9C27B0',
        gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
      },
    ];

    return (
      <Box
        className="golden-metrics-grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)', // Mobile: 2 columnas
            sm: 'repeat(2, 1fr)', // Tablet: 2 columnas
            md: 'repeat(4, 1fr)', // Desktop: 4 columnas
          },
          gap: {
            xs: '8px', // var(--golden-gap-sm)
            sm: '13px', // var(--golden-gap-md)
            md: '21px', // var(--golden-gap-lg)
          },
          marginTop: {
            xs: '21px', // var(--golden-space-21)
            sm: '34px', // var(--golden-space-34)
            md: '55px', // var(--golden-space-55)
          },
        }}
      >
        {metrics.map((metric, index) => (
          <Card
            key={metric.label}
            className="golden-metric-card golden-elevation-1"
            sx={{
              borderRadius: '13px', // var(--golden-radius-lg)
              padding: {
                xs: '8px', // var(--golden-space-8)
                sm: '13px', // var(--golden-space-13)
                md: '21px', // var(--golden-space-21)
              },
              minHeight: {
                xs: '144px', // var(--golden-widget-small)
                sm: '89px', // var(--golden-height-compact)
                md: '144px', // var(--golden-height-normal)
              },
              aspectRatio: '0.618', // var(--golden-ratio-inverse) = 1:φ
              background: `linear-gradient(
                161.8deg,
                ${alpha(metric.color, 0.1)} 0%,
                ${alpha(metric.color, 0.05)} 61.8%,
                ${alpha(metric.color, 0.1)} 100%
              )`,
              border: `1px solid ${alpha(metric.color, 0.2)}`,
              transition: `all 0.382s cubic-bezier(0.236, 0.618, 0.382, 0.764)`,
              '&:hover': {
                transform: `translateY(-4.944px)`, // var(--golden-micro-8)
                boxShadow: `0 var(--golden-space-8) var(--golden-space-34) ${alpha(metric.color, 0.3)}`,
                background: metric.gradient,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(metric.color, 0.2),
                  mb: '8px',
                  width: {
                    xs: '34px',
                    sm: '55px',
                  },
                  height: {
                    xs: '34px',
                    sm: '55px',
                  },
                }}
              >
                {React.cloneElement(metric.icon, {
                  sx: {
                    color: metric.color,
                    fontSize: {
                      xs: '1.236rem',
                      sm: '1.618rem',
                    },
                  },
                })}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'rgba(255, 255, 255, 0.95)',
                  mb: 'var(--golden-micro-2)',
                  fontSize: {
                    xs: '1.236rem',
                    sm: '1.618rem',
                  },
                }}
              >
                {metric.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: {
                    xs: 'var(--golden-text-xs)', // 0.618rem
                    sm: 'var(--golden-text-sm)', // 0.764rem
                  },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box className={`golden-widget ${className}`}>
      {/* Container principal con proporciones áureas perfectas */}
      <Card
        className="golden-card golden-elevation-3"
        sx={{
          borderRadius: {
            xs: '13px', // var(--golden-radius-lg) móvil
            sm: '21px', // var(--golden-radius-xl) tablet
            md: '34px', // var(--golden-radius-xxl) desktop
          },
          padding: {
            xs: '21px', // var(--golden-space-21) móvil
            sm: '34px', // var(--golden-space-34) tablet
            md: '55px', // var(--golden-space-55) desktop
          },
          minHeight: {
            xs: '233px', // var(--golden-height-extended) móvil
            sm: '377px', // var(--golden-height-hero) tablet
            md: '610px', // 377px * φ = 610px desktop
          },
          // Aspect ratio áureo responsivo
          aspectRatio: {
            xs: '0.618', // var(--golden-ratio-inverse) = 1:φ móvil
            sm: '1', // 1:1 tablet (cuadrado)
            lg: '1.618', // var(--golden-ratio) = φ:1 desktop
          },
          background:
            'radial-gradient(circle at 61.8% 61.8%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 61.8%, rgba(255, 255, 255, 0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.13)',
          position: 'relative',
          overflow: 'hidden',
          transition: `all var(--golden-duration-slow) var(--golden-ease-natural)`,
          '&:hover': {
            transform: `translateY(calc(-1 * var(--golden-space-5)))`,
            boxShadow: `0 var(--golden-space-34) var(--golden-space-144) var(--golden-glass-tertiary)`,
          },
        }}
      >
        <CardContent
          sx={{
            p: 0,
            '&:last-child': { pb: 0 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header con título áureo */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: {
                xs: '13px', // var(--golden-space-13)
                sm: '21px', // var(--golden-space-21)
                md: '34px', // var(--golden-space-34)
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF6B35 30%, #00BCD4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: {
                  xs: '1.618rem', // var(--golden-text-lg)
                  sm: '2rem', // var(--golden-text-xl)
                  md: '2.618rem', // var(--golden-text-2xl)
                },
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--golden-space-8)',
              }}
            >
              <BoltIcon
                sx={{
                  color: '#00BCD4',
                  fontSize: 'inherit',
                }}
              />
              Tu Balance Ayni
            </Typography>

            <IconButton
              onClick={handleExpandToggle}
              sx={{
                color: 'var(--golden-text-secondary)',
                transition: `all var(--golden-duration-normal) var(--golden-ease-natural)`,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Orb central revolucionario */}
          {renderCentralOrb()}

          {/* Grid de métricas áureas */}
          {renderMetricsGrid()}

          {/* Progreso hacia siguiente nivel */}
          <Box
            sx={{
              mt: {
                xs: '21px', // var(--golden-space-21)
                sm: '34px', // var(--golden-space-34)
                md: '55px', // var(--golden-space-55)
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: '8px', // var(--golden-space-8)
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 'var(--golden-text-sm)',
                }}
              >
                Progreso hacia {nextLevel}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 'bold',
                  fontSize: 'var(--golden-text-sm)',
                }}
              >
                {ayniProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={ayniProgress}
              sx={{
                height: '8px', // var(--golden-space-8)
                borderRadius: '5px', // var(--golden-radius-sm)
                backgroundColor: alpha('#00BCD4', 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 'var(--golden-radius-sm)',
                  background:
                    'linear-gradient(45deg, #FF6B35 30%, #00BCD4 90%)',
                },
              }}
            />
          </Box>

          {/* Información expandida */}
          {expanded && (
            <Box
              sx={{
                mt: '21px', // var(--golden-space-21)
                pt: '21px', // var(--golden-space-21)
                borderTop: '1px solid rgba(255, 255, 255, 0.13)',
              }}
            >
              <Grid container spacing="var(--golden-gap-md)">
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    Armonía Elemental
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 'bold',
                    }}
                  >
                    {advancedStats.elementalHarmony.toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--golden-text-tertiary)' }}
                  >
                    Próximo Nivel
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--golden-text-primary)',
                      fontWeight: 'bold',
                    }}
                  >
                    {advancedStats.experienceNeeded} öndas
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--golden-text-tertiary)' }}
                  >
                    Promedio Elemental
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--golden-text-primary)',
                      fontWeight: 'bold',
                    }}
                  >
                    {advancedStats.averageElemental}%
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--golden-text-tertiary)' }}
                  >
                    Estado
                  </Typography>
                  <Chip
                    label={isConnected ? 'Conectado' : 'Desconectado'}
                    size="small"
                    color={isConnected ? 'success' : 'error'}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AyniMetricsCardRevolutionary;
