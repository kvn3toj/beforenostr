import React, { useState, useEffect, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import { useTheme, alpha } from '@mui/material';

// 🌌 COSMIC DESIGN SYSTEM IMPORTS - ARIA (Frontend Artist)
import { CosmicCard } from '../../design-system';
import { UNIFIED_COLORS } from '../../theme/colors';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import BoltIcon from '@mui/icons-material/Bolt';
import ClearIcon from '@mui/icons-material/Clear';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface EnergyWeatherData {
  condition: 'sunny' | 'cloudy' | 'stormy' | 'energetic' | 'clear';
  temperature: number; // 0-100
  humidity: number; // Elementos
  socialActivity: number; // Social
  recommendations: string[];
  trends: {
    label: string;
    value: number;
    change: number;
  }[];
}

interface WeatherParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  type: 'sun' | 'cloud' | 'lightning' | 'energy' | 'sparkle';
}

interface EnergyWeatherWidgetProps {
  userMetrics: {
    ondas: number;
    meritos: number;
    elementos: {
      fuego: number;
      agua: number;
      tierra: number;
      aire: number;
    };
    balanceReciprocidad: number;
    socialConnections: number;
  };
  className?: string;
}

export const EnergyWeatherWidget: React.FC<EnergyWeatherWidgetProps> = ({
  userMetrics,
  className = '',
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [particles, setParticles] = useState<WeatherParticle[]>([]);
  const [animationTick, setAnimationTick] = useState(0);

  // 🌤️ Calcular el clima energético basado en métricas del usuario
  const weatherData = useMemo((): EnergyWeatherData => {
    const { ondas, meritos, elementos, balanceReciprocidad, socialConnections } =
      userMetrics;

    // Calcular temperatura energética (0-100)
    const temperature = Math.min(100, (ondas / 2000) * 100);

    // Calcular humedad elemental (promedio de elementos)
    const humidity =
      (elementos.fuego + elementos.agua + elementos.tierra + elementos.aire) /
      4;

    // Actividad social
    const socialActivity = Math.min(100, (socialConnections / 50) * 100);

    // Determinar condición climática
    let condition: EnergyWeatherData['condition'] = 'clear';
    if (temperature >= 80 && humidity >= 80 && balanceReciprocidad >= 0.8) {
      condition = 'energetic';
    } else if (temperature >= 60 && humidity >= 70) {
      condition = 'sunny';
    } else if (temperature >= 40 && humidity >= 50) {
      condition = 'cloudy';
    } else if (temperature < 40 || humidity < 50) {
      condition = 'stormy';
    }

    // Generar recomendaciones personalizadas
    const recommendations: string[] = [];
    if (condition === 'stormy') {
      recommendations.push(
        '💪 Participa en desafíos comunitarios para generar más Öndas'
      );
      recommendations.push(
        '🤝 Conecta con otros miembros para mejorar tu red social'
      );
    } else if (condition === 'cloudy') {
      recommendations.push(
        '🌱 Equilibra tus elementos mediante actividades variadas'
      );
      recommendations.push(
        '✨ Explora nuevos módulos para expandir tu energía'
      );
    } else if (condition === 'sunny') {
      recommendations.push(
        '🚀 Aprovecha tu momento óptimo para crear contenido'
      );
      recommendations.push(
        '🎯 Establece metas ambiciosas mientras tu energía es alta'
      );
    } else if (condition === 'energetic') {
      recommendations.push('⚡ ¡Estado óptimo! Lidera proyectos comunitarios');
      recommendations.push('🌟 Comparte tu conocimiento para inspirar a otros');
    }

    // Generar tendencias
    const trends = [
      {
        label: 'Energía Personal',
        value: temperature,
        change: Math.random() * 20 - 10, // Simular cambio
      },
      {
        label: 'Armonía Elemental',
        value: humidity,
        change: Math.random() * 15 - 7.5,
      },
      {
        label: 'Conexión Social',
        value: socialActivity,
        change: Math.random() * 25 - 12.5,
      },
    ];

    return {
      condition,
      temperature,
      humidity,
      socialActivity,
      recommendations,
      trends,
    };
  }, [userMetrics]);

  // 🌈 Configuración de condiciones climáticas
  const weatherConfig = {
    sunny: {
      icon: <WbSunnyIcon />,
      label: 'Soleado',
      color: '#FFD54F',
      gradient: 'linear-gradient(135deg, #FFD54F 0%, #FF8A65 100%)',
      description: 'Energía radiante y creativa',
      particles: 'sun',
    },
    cloudy: {
      icon: <CloudIcon />,
      label: 'Nublado',
      color: '#90A4AE',
      gradient: 'linear-gradient(135deg, #90A4AE 0%, #607D8B 100%)',
      description: 'Momento de reflexión y crecimiento',
      particles: 'cloud',
    },
    stormy: {
      icon: <ThunderstormIcon />,
      label: 'Tormentoso',
      color: '#7986CB',
      gradient: 'linear-gradient(135deg, #7986CB 0%, #3F51B5 100%)',
      description: 'Transformación y renovación energética',
      particles: 'lightning',
    },
    energetic: {
      icon: <BoltIcon />,
      label: 'Energético',
      color: '#4FC3F7',
      gradient: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
      description: '¡Estado de máximo potencial!',
      particles: 'energy',
    },
    clear: {
      icon: <ClearIcon />,
      label: 'Despejado',
      color: '#81C784',
      gradient: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
      description: 'Claridad mental y equilibrio',
      particles: 'sparkle',
    },
  };

  const currentWeather = weatherConfig[weatherData.condition];

  // 🎯 Generar partículas temáticas (ORDEN #1 - Sin dependencias complejas)
  const generateParticles = useCallback(
    (type: string, count: number = 8): WeatherParticle[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: `particle-${type}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 2 + 1,
        type: type as WeatherParticle['type'],
      }));
    },
    []
  );

  // 🔄 Actualizar partículas (ORDEN #2 - Depende de generateParticles)
  const updateParticles = useCallback(() => {
    setParticles(generateParticles(currentWeather.particles, 6));
  }, [generateParticles, currentWeather.particles]);

  // 🎨 Animación de partículas
  useEffect(() => {
    updateParticles();

    const interval = setInterval(() => {
      setAnimationTick((prev) => prev + 1);
      if (animationTick % 30 === 0) {
        // Regenerar partículas cada 30 ticks
        updateParticles();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [updateParticles, animationTick]);

  // 🧹 CLEANUP OBLIGATORIO según Builder.io
  useEffect(() => {
    return () => {
      // Cleanup weather widget resources
    };
  }, []);

  // 🎯 Handlers para interacciones (ORDEN CORRECTO)
  const handleExpandToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // 🎨 Renderizar partículas flotantes
  const renderParticles = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: 'inherit',
      }}
    >
      {particles.map((particle, index) => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            background: alpha(currentWeather.color, particle.opacity),
            boxShadow: `0 0 ${particle.size * 2}px ${alpha(currentWeather.color, 0.3)}`,
            transform: `translate(-50%, -50%) scale(${Math.sin(animationTick * 0.1 + index) * 0.3 + 0.7})`,
            animation: `float-${particle.type} ${particle.speed + 2}s ease-in-out infinite`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );

  return (
    <CosmicCard
      variant="elevated"
      element="aire"
      cosmicIntensity="medium"
      enableGlow
      enableAnimations
      sx={{ minHeight: '320px' }}
      className={`energy-weather-widget ${className}`}
    >
      {/* Partículas flotantes */}
      {renderParticles()}

      <Box sx={{ padding: 3, position: 'relative', zIndex: 1 }}>
        {/* Header del Widget */}
        <Box sx={{ marginBottom: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.aire.primary} 0%, ${UNIFIED_COLORS.elements.fuego.primary} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.3rem',
              marginBottom: 0.5
            }}
          >
            🌤️ Clima Energético
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha('#000', 0.7),
              fontSize: '0.85rem',
              display: 'block'
            }}
          >
            {currentWeather.description}
          </Typography>
        </Box>

        {/* Estado actual con chip dinámico */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 3 }}>
          <Box
            sx={{
              padding: 1.5,
              borderRadius: 2,
              background: currentWeather.gradient,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 16px ${alpha(currentWeather.color, 0.4)}`,
              animation: 'pulse 2s ease-in-out infinite',
              marginRight: 1
            }}
          >
            {currentWeather.icon}
          </Box>

          <Chip
            label={currentWeather.label}
            sx={{
              bgcolor: alpha(currentWeather.color, 0.2),
              color: currentWeather.color,
              fontWeight: 'bold',
              fontSize: '1rem',
              height: 36,
              '& .MuiChip-label': {
                paddingLeft: 2,
                paddingRight: 2,
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }}>
            <IconButton
              onClick={handleExpandToggle}
              sx={{
                color: currentWeather.color,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Métricas atmosféricas compactas */}
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <ThermostatIcon sx={{ color: UNIFIED_COLORS.elements.fuego.primary, marginBottom: 0.5 }} />
              <Typography
                variant="caption"
                sx={{ color: alpha('#000', 0.7), display: 'block' }}
              >
                Temperatura
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: alpha('#000', 0.9), fontWeight: 'bold' }}
              >
                {Math.round(weatherData.temperature)}°
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AutoAwesomeIcon sx={{ color: UNIFIED_COLORS.elements.agua.primary, marginBottom: 0.5 }} />
              <Typography
                variant="caption"
                sx={{ color: alpha('#000', 0.7), display: 'block' }}
              >
                Elementos
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: alpha('#000', 0.9), fontWeight: 'bold' }}
              >
                {Math.round(weatherData.humidity)}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <GroupsIcon sx={{ color: UNIFIED_COLORS.elements.tierra.primary, marginBottom: 0.5 }} />
              <Typography
                variant="caption"
                sx={{ color: alpha('#000', 0.7), display: 'block' }}
              >
                Social
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: alpha('#000', 0.9), fontWeight: 'bold' }}
              >
                {Math.round(weatherData.socialActivity)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Panel expandible con tendencias y recomendaciones */}
        <Collapse in={expanded}>
          <Box sx={{ paddingTop: 2, borderTop: `1px solid ${alpha('#000', 0.1)}` }}>
            {/* Tendencias */}
            <Typography
              variant="subtitle2"
              sx={{
                color: alpha('#000', 0.8),
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 600,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: '1.2rem' }} />
              Tendencias Energéticas
            </Typography>

            <Box sx={{ marginBottom: 3 }}>
              {weatherData.trends.map((trend, index) => (
                <Box key={trend.label} sx={{ marginBottom: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: alpha('#000', 0.7) }}
                    >
                      {trend.label}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: alpha('#000', 0.9), fontWeight: 'bold' }}
                      >
                        {Math.round(trend.value)}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            trend.change > 0
                              ? UNIFIED_COLORS.elements.tierra.primary
                              : UNIFIED_COLORS.elements.fuego.primary,
                          fontSize: '0.7rem',
                        }}
                      >
                        {trend.change > 0 ? '↗' : '↘'}{' '}
                        {Math.abs(trend.change).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={trend.value}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha('#000', 0.1),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${currentWeather.color} 0%, ${alpha(currentWeather.color, 0.6)} 100%)`,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Recomendaciones personalizadas */}
            <Typography
              variant="subtitle2"
              sx={{
                color: alpha('#000', 0.8),
                marginBottom: 2,
                fontWeight: 600,
              }}
            >
              💡 Recomendaciones Personalizadas
            </Typography>

            <Box sx={{ space: 1 }}>
              {weatherData.recommendations.map((recommendation, index) => (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    color: alpha('#000', 0.8),
                    display: 'block',
                    marginBottom: 1,
                    padding: 1.5,
                    borderRadius: 2,
                    background: alpha(currentWeather.color, 0.1),
                    border: `1px solid ${alpha(currentWeather.color, 0.2)}`,
                    fontStyle: 'italic',
                  }}
                >
                  {recommendation}
                </Typography>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </CosmicCard>
  );
};

export default EnergyWeatherWidget;
