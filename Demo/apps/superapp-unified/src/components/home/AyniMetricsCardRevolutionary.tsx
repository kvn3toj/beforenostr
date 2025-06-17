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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PublicIcon from '@mui/icons-material/Public';

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

  // 🌌 Configuración orbital de elementos con velocidades y tamaños únicos
  const elementConfig = useMemo(
    () => ({
      fuego: {
        name: 'Fuego',
        value: elementos.fuego,
        icon: <LocalFireDepartmentIcon />,
        color: '#FF6B35',
        gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
        baseAngle: 0,
        orbitSpeed: 1.1,
        orbitRadius: 1.0,
        size: 1.0,
      },
      agua: {
        name: 'Agua',
        value: elementos.agua,
        icon: <WaterDropIcon />,
        color: '#00BCD4',
        gradient: 'linear-gradient(135deg, #00BCD4 0%, #4FC3F7 100%)',
        baseAngle: 90,
        orbitSpeed: 0.7,
        orbitRadius: 1.2,
        size: 1.1,
      },
      tierra: {
        name: 'Tierra',
        value: elementos.tierra,
        icon: <TerrainIcon />,
        color: '#66BB6A',
        gradient: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
        baseAngle: 180,
        orbitSpeed: 0.9,
        orbitRadius: 0.9,
        size: 1.2,
      },
      aire: {
        name: 'Aire',
        value: elementos.aire,
        icon: <AirIcon />,
        color: '#FFD54F',
        gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFEB3B 100%)',
        baseAngle: 270,
        orbitSpeed: 1.4,
        orbitRadius: 0.8,
        size: 0.9,
      },
    }),
    [elementos]
  );

  // 📊 Cálculos simples
  const advancedStats = useMemo(() => {
    const averageElemental =
      (elementos.fuego + elementos.agua + elementos.tierra + elementos.aire) /
      4;
    const ayniScore = Math.round(balanceAyni * 100);

    return {
      ayniScore,
      averageElemental: Math.round(averageElemental),
      experienceNeeded: Math.max(0, 4000 - ondas),
      totalContributions: bienComunContributions,
      overallPower: Math.round(ondas / 21 + meritos / 13 + averageElemental),
    };
  }, [elementos, ondas, meritos, balanceAyni]);

  // 🌌 Animación orbital como el universo real
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 0.8) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 🧹 CLEANUP OBLIGATORIO
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up AyniMetricsCardRevolutionary');
    };
  }, []);

  // 🚨 DETECCIÓN DE ERRORES BUILDER.IO
  useEffect(() => {
    const handleBuilderError = (event: ErrorEvent) => {
      if (
        event.message.includes('Builder') ||
        event.message.includes('hook') ||
        event.filename?.includes('builder')
      ) {
        console.error('🚨 Builder.io Error detectado:', {
          message: event.message,
          filename: event.filename,
          component: 'AyniMetricsCardRevolutionary',
        });
      }
    };

    window.addEventListener('error', handleBuilderError);
    return () => window.removeEventListener('error', handleBuilderError);
  }, []);

  // 🎯 Handlers
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleElementHover = useCallback((elementKey: string | null) => {
    setHoveredElement(elementKey);
  }, []);

  // 🌌 Renderizar el sistema solar dinámico con efecto 3D MÁXIMO
  const renderCentralOrb = () => {
    const orbitRadius = 180; // Radio orbital MÁS GRANDE para efecto 3D perfecto

    console.log('🌌 Sistema orbital dinámico activo:', {
      animationPhase,
      orbitRadius,
      elementConfigCount: Object.keys(elementConfig).length,
    });

    return (
      <Box
        className="central-orb-container"
        sx={{
          position: 'relative',
          width: '500px', // Contenedor aún MÁS GRANDE para órbitas 3D expandidas
          height: '500px',
          mx: 'auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible !important', // ¡LA CORRECCIÓN CLAVE!
          perspective: '1500px', // Perspectiva más profunda
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 🌍 PLANETA CENTRAL - Esfera 3D realista que gira sobre su eje */}
        <Box
          sx={{
            position: 'absolute',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            // 🌍 GRADIENTE ESFÉRICO 3D PARA EL PLANETA CENTRAL
            background: `
              radial-gradient(ellipse at 25% 25%,
                rgba(255, 255, 255, 0.3) 0%,
                rgba(255, 255, 255, 0.1) 15%,
                transparent 30%
              ),
              conic-gradient(from 0deg,
                #FF6B35 0deg,
                #00BCD4 90deg,
                #66BB6A 180deg,
                #FFD54F 270deg,
                #FF6B35 360deg)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // 🌟 SOMBRAS MÚLTIPLES PARA DIMENSIONALIDAD
            boxShadow: `
              0 0 50px rgba(255, 107, 53, 0.6),
              0 0 100px rgba(0, 188, 212, 0.4),
              inset -15px -15px 40px rgba(0, 0, 0, 0.3),
              inset 10px 10px 30px rgba(255, 255, 255, 0.2),
              inset 0 0 60px rgba(255, 255, 255, 0.05)
            `,
            border: '3px solid rgba(255, 255, 255, 0.2)',
            zIndex: 5,
            // 🌍 ROTACIÓN DEL PLANETA SOBRE SU EJE (hacia la derecha)
            animation:
              'planet-spin-right 15s linear infinite, breathe 4s ease-in-out infinite',
            transform: `rotateZ(${animationPhase * 0.3}deg)`,
            // 🎨 HIGHLIGHT PRINCIPAL DEL PLANETA
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '10%',
              left: '15%',
              width: '40%',
              height: '40%',
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 1,
              pointerEvents: 'none',
            },
            // 🌟 HIGHLIGHT SECUNDARIO
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '60%',
              right: '20%',
              width: '20%',
              height: '20%',
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%)',
              borderRadius: '50%',
              zIndex: 1,
              pointerEvents: 'none',
            },
          }}
        >
          {/* Contenido central */}
          <Box
            sx={{
              width: '135px',
              height: '135px',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(15, 23, 42, 0.95) 30%,
                  rgba(30, 41, 59, 0.9) 100%
                )
              `,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <PublicIcon
              sx={{
                fontSize: '2.8rem',
                background:
                  'linear-gradient(135deg, #00BCD4, #FFD700, #FF6B35)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
                filter: 'drop-shadow(0 2px 8px rgba(0, 188, 212, 0.5))',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD700, #FF6B35)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '2rem',
                lineHeight: 1,
                mb: 0.2,
              }}
            >
              {advancedStats.ayniScore}%
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Balance Ayni
            </Typography>
          </Box>
        </Box>

        {/* 🌌 ELEMENTOS ORBITALES 3D */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            zIndex: 10,
          }}
        >
          {Object.entries(elementConfig).map(([key, config]) => {
            // 🌍 CÁLCULO ORBITAL 3D ÚNICO
            const currentAngle =
              config.baseAngle + animationPhase * config.orbitSpeed;
            const radians = (currentAngle * Math.PI) / 180;

            // 🌌 ÓRBITA 3D VERTICAL PERFECTA - Sin restricciones Fibonacci
            const elementOrbitRadius = orbitRadius * config.orbitRadius;
            const x = elementOrbitRadius * Math.cos(radians);
            const y = elementOrbitRadius * Math.sin(radians) * 0.2; // MÁS vertical (menos Y)
            const z = elementOrbitRadius * Math.sin(radians) * 1.0; // MÁS profundidad 3D

            const baseSize = 65;
            const elementSize = baseSize * config.size;
            const hoverSize = elementSize * 1.15;

            console.log(`🪐 ${key} órbita 3D:`, {
              angle: Math.round(currentAngle),
              orbitRadius: Math.round(elementOrbitRadius),
              x: Math.round(x),
              y: Math.round(y),
              z: Math.round(z),
              size: Math.round(elementSize),
            });

            return (
              <Tooltip title={`${config.name}: ${config.value}%`} key={key}>
                <Box
                  className="orbital-element"
                  data-element={key}
                  onMouseEnter={() => handleElementHover(key)}
                  onMouseLeave={() => handleElementHover(null)}
                  sx={{
                    position: 'absolute',
                    // 🌌 TRANSFORMACIÓN 3D ORBITAL + ROTACIÓN PROPIA DE LA ESFERA
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateX(35deg) rotateY(5deg) rotateZ(${animationPhase * config.orbitSpeed * 2}deg)`,
                    transformStyle: 'preserve-3d',
                    width:
                      hoveredElement === key
                        ? `${hoverSize}px`
                        : `${elementSize}px`,
                    height:
                      hoveredElement === key
                        ? `${hoverSize}px`
                        : `${elementSize}px`,
                    // 🌍 GRADIENTE RADIAL 3D MEJORADO PARA ESFERA MÁS REALISTA
                    background: `
                      radial-gradient(ellipse at 30% 20%,
                        rgba(255, 255, 255, 0.9) 0%,
                        rgba(255, 255, 255, 0.6) 10%,
                        rgba(255, 255, 255, 0.2) 25%,
                        ${config.color} 40%,
                        ${config.color}EE 60%,
                        ${config.color}AA 80%,
                        ${config.color}66 95%,
                        ${config.color}33 100%
                      ),
                      radial-gradient(ellipse at 80% 80%,
                        transparent 0%,
                        transparent 40%,
                        rgba(0, 0, 0, 0.2) 50%,
                        rgba(0, 0, 0, 0.4) 70%,
                        rgba(0, 0, 0, 0.6) 100%
                      )
                    `,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 15,
                    // 🌟 BORDE SUTIL PARA DEFINICIÓN
                    border: `2px solid rgba(255, 255, 255, 0.3)`,
                    // 🌌 SOMBRAS MÚLTIPLES PARA EFECTO 3D REALISTA
                    boxShadow: `
                      0 0 30px ${config.color}80,
                      0 0 60px ${config.color}40,
                      inset -10px -10px 30px rgba(0, 0, 0, 0.4),
                      inset 8px 8px 20px rgba(255, 255, 255, 0.3),
                      inset 0 0 40px rgba(255, 255, 255, 0.1)
                    `,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    opacity: 0.95,
                    // 🎨 PSEUDO-ELEMENTO PARA HIGHLIGHT ADICIONAL
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '15%',
                      left: '20%',
                      width: '30%',
                      height: '30%',
                      background:
                        'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                      borderRadius: '50%',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    // 🌟 SEGUNDO HIGHLIGHT MENOR
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '60%',
                      right: '25%',
                      width: '15%',
                      height: '15%',
                      background:
                        'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 60%)',
                      borderRadius: '50%',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    '&:hover': {
                      transform: `translate(-50%, -50%) translate3d(${x * 1.15}px, ${y * 1.15}px, ${z * 1.15}px) rotateX(35deg) rotateY(5deg) rotateZ(${animationPhase * config.orbitSpeed * 2}deg) scale(1.3)`,
                      zIndex: 20,
                      opacity: 1,
                      // 🌟 BRILLO AUMENTADO EN HOVER
                      boxShadow: `
                        0 0 60px ${config.color},
                        0 0 120px ${config.color}70,
                        0 0 150px rgba(255, 255, 255, 0.4),
                        inset -15px -15px 40px rgba(0, 0, 0, 0.5),
                        inset 12px 12px 25px rgba(255, 255, 255, 0.4),
                        inset 0 0 60px rgba(255, 255, 255, 0.2)
                      `,
                      // 🎨 HIGHLIGHT MÁS INTENSO EN HOVER
                      '&::before': {
                        background:
                          'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%)',
                        width: '35%',
                        height: '35%',
                      },
                    },
                  }}
                >
                  {/* Superficie rotativa del planeta */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: `
                        repeating-linear-gradient(
                          ${animationPhase * config.orbitSpeed * 3}deg,
                          transparent,
                          transparent 8px,
                          ${alpha(config.color, 0.1)} 8px,
                          ${alpha(config.color, 0.1)} 12px
                        )
                      `,
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Ícono estático */}
                  <Box
                    sx={{
                      // CONTRAROTACIÓN COMPLETA para mantener el ícono estático
                      transform: `rotateZ(${-animationPhase * config.orbitSpeed * 2}deg) rotateX(-35deg) rotateY(-5deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                      position: 'relative',
                    }}
                  >
                    {React.cloneElement(config.icon, {
                      sx: {
                        color: 'white',
                        fontSize: '2rem',
                        filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8))',
                        transform: 'none', // Sin rotación adicional
                      },
                    })}
                  </Box>
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* 🌌 ÓRBITAS MÚLTIPLES VISIBLES */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${orbitRadius * 2}px`,
            height: `${orbitRadius * 2}px`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px solid rgba(255, 107, 53, 0.15)',
            zIndex: 1,
            animation: 'rotate 50s linear infinite',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${orbitRadius * 1.6}px`,
            height: `${orbitRadius * 1.6}px`,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(0, 188, 212, 0.1)',
            zIndex: 1,
            animation: 'rotate 70s linear infinite reverse',
          }}
        />

        {/* 🌟 ESTRELLAS LOCALES */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={`local-star-${i}`}
            sx={{
              position: 'absolute',
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              zIndex: 0,
            }}
          />
        ))}
      </Box>
    );
  };

  // 📊 Renderizar métricas
  const renderMetricsGrid = () => {
    const metrics = [
      {
        label: 'Öndas',
        value: ondas.toLocaleString(),
        icon: <BoltIcon />,
        color: '#00BCD4',
      },
      {
        label: 'Mëritos',
        value: meritos.toLocaleString(),
        icon: <DiamondIcon />,
        color: '#FFD54F',
      },
      {
        label: 'Bien Común',
        value: bienComunContributions,
        icon: <FavoriteIcon />,
        color: '#E91E63',
      },
      {
        label: 'Poder Total',
        value: advancedStats.overallPower,
        icon: <AutoAwesomeIcon />,
        color: '#9C27B0',
      },
    ];

    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={6} sm={3} key={metric.label}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(metric.color, 0.1)} 0%, ${alpha(metric.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(metric.color, 0.2)}`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 20px ${alpha(metric.color, 0.3)}`,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(metric.color, 0.2),
                  mx: 'auto',
                  mb: 1,
                }}
              >
                {React.cloneElement(metric.icon, {
                  sx: { color: metric.color },
                })}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" color="white">
                {metric.value}
              </Typography>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                {metric.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box className={`orbital-widget ${className}`}>
      <Card
        sx={{
          borderRadius: 3,
          p: 3,
          background: 'rgba(15, 23, 42, 0.85)', // Fondo sólido sin gradientes rotativos
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'visible !important', // ¡LA CORRECCIÓN CLAVE!
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
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
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <BoltIcon sx={{ color: '#00BCD4' }} />
              Tu Balance Ayni
            </Typography>

            <IconButton
              onClick={handleExpandToggle}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Sistema orbital central */}
          {renderCentralOrb()}

          {/* Grid de métricas */}
          {renderMetricsGrid()}

          {/* Progreso */}
          <Box sx={{ mt: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                Progreso hacia {nextLevel}
              </Typography>
              <Typography variant="body2" color="white" fontWeight="bold">
                {ayniProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={ayniProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha('#00BCD4', 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
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
                mt: 3,
                pt: 3,
                borderTop: '1px solid rgba(255, 255, 255, 0.13)',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="rgba(255, 255, 255, 0.6)"
                  >
                    Promedio Elemental
                  </Typography>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {advancedStats.averageElemental}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="caption"
                    color="rgba(255, 255, 255, 0.6)"
                  >
                    Próximo Nivel
                  </Typography>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {advancedStats.experienceNeeded} öndas
                  </Typography>
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
