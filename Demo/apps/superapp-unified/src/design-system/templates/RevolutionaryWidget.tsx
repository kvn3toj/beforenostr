/**
 * 🌌 REVOLUTIONARY WIDGET TEMPLATE
 * ===============================
 *
 * Template revolucionario que encapsula todos los patrones extraídos
 * del Dashboard HOME para uso escalable en toda la SuperApp.
 *
 * Incluye:
 * - Patrones revolutionarios centralizados
 * - Efectos cósmicos configurables
 * - Sistema elemental unificado
 * - Responsividad avanzada
 * - Testing 3D integrado
 * - Performance monitoring
 *
 * Basado en análisis de:
 * - ReciprocidadMetricsCardRevolutionary.tsx (920 líneas)
 * - ModuleCardsRevolutionary.tsx (663 líneas)
 * - NotificationCenterRevolutionary.tsx (747 líneas)
 * - LiveActivityFeed.tsx (737 líneas - glassmorphism)
 *
 * Fase 2, Semana 1 - Plan Maestro Material UI
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import { useTheme, useMediaQuery, alpha } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// 🌌 IMPORTS DEL DESIGN SYSTEM REVOLUCIONARIO
import {
  revolutionaryPattern,
  cosmicCardPattern,
  elementalPatterns,
  animationPatterns,
  cosmicUtils,
  componentVariants
} from '../patterns';
import { homeGradients, applyElementalHomeGradient } from '../styles/gradients/cosmic-home';
import { homeElementalGradients } from '../styles/gradients/cosmic-home';
import {
  RevolutionaryWidgetProps,
  ElementType,
  CosmicIntensity,
  Performance3DMetrics,
  Testing3DConfig
} from '../types';

// 🧪 HOOK PARA TESTING 3D Y PERFORMANCE MONITORING
const use3DPerformanceMonitor = (enabled: boolean = true): Performance3DMetrics => {
  const [metrics, setMetrics] = useState<Performance3DMetrics>({
    fps: 60,
    renderTime: 0,
    gpuUsage: 0,
    memoryUsage: 0,
    smoothness: 100
  });

  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef<number>(0);

  const measurePerformance = useCallback(() => {
    if (!enabled) return;

    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;

    framesRef.current++;

    // Calcular FPS cada segundo
    if (deltaTime >= 1000) {
      const fps = (framesRef.current * 1000) / deltaTime;
      const renderTime = deltaTime / framesRef.current;

      // Simular métricas GPU (en producción usar WebGL context)
      const gpuUsage = Math.min(100, (60 - fps) * 2);
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      const smoothness = Math.max(0, 100 - (Math.abs(60 - fps) * 2));

      setMetrics({
        fps: Math.round(fps),
        renderTime: Math.round(renderTime * 100) / 100,
        gpuUsage: Math.round(gpuUsage),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // MB
        smoothness: Math.round(smoothness)
      });

      framesRef.current = 0;
      lastTimeRef.current = now;
    }

    frameRef.current = requestAnimationFrame(measurePerformance);
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      frameRef.current = requestAnimationFrame(measurePerformance);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, measurePerformance]);

  return metrics;
};

export const RevolutionaryWidget: React.FC<RevolutionaryWidgetProps> = ({
  children,
  title,
  subtitle,
  actions,
  variant = 'primary',
  element,
  cosmicIntensity = 'medium',
  interactionMode = 'hover',
  cosmicEffects = {},
  responsiveConfig = {},
  isLoading = false,
  isConnected = true,
  onRefresh,
  onExpand,
  onMinimize,
  className,
  style,
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // 🎭 Estados del widget
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // 🌌 Configuración de efectos cósmicos con defaults
  const effects = useMemo(() => ({
    enableGlow: true,
    enableParticles: false,
    enableOrbitalEffects: false,
    enableAnimations: true,
    glowIntensity: cosmicIntensity === 'intense' ? 1.5 : cosmicIntensity === 'medium' ? 1 : 0.5,
    particleConfig: {
      count: 3,
      size: 4,
      color: element ? elementalPatterns[element].particleColor : '#FFB74D',
      speed: 1,
      opacity: 0.6,
      blur: true
    },
    orbitalRadius: 100,
    orbitalSpeed: 1,
    ...cosmicEffects
  }), [cosmicIntensity, element, cosmicEffects]);

  // 🧪 Performance monitoring para efectos 3D
  const performance3D = use3DPerformanceMonitor(effects.enableAnimations);

  // 📱 Configuración responsiva
  const responsive = useMemo(() => ({
    padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
    borderRadius: isMobile ? '16px' : '24px',
    spacing: isMobile ? 1.5 : isTablet ? 2 : 3,
    ...responsiveConfig
  }), [isMobile, isTablet, responsiveConfig]);

  // 🎨 Generar estilos revolucionarios
  const revolutionaryStyles = useMemo(() => {
    const variantStyles = componentVariants(theme);
    const baseVariant = variantStyles[variant] || variantStyles.primary;
    const elementalStyles = element ? applyElementalHomeGradient(element) : {};

    return {
      ...baseVariant,
      ...elementalStyles,
      borderRadius: responsive.borderRadius,
      padding: responsive.padding,

      // Efectos dinámicos basados en estado
      ...(isHovered && {
        transform: 'translateY(-6px) translateZ(12px) rotateX(1deg)',
        boxShadow: effects.enableGlow
          ? cosmicUtils.createCosmicShadow(element || 'fuego', effects.glowIntensity)
          : baseVariant.boxShadow,
        ...(element !== 'fuego' && {
          filter: 'brightness(1.08) saturate(1.12)',
        }),
      }),

      ...(isActive && {
        transform: 'translateY(-3px) translateZ(6px)',
        transition: 'all 0.1s ease-out',
      }),

      // Animaciones cósmicas
      ...(effects.enableAnimations && {
        animation: cosmicIntensity === 'intense'
          ? `${animationPatterns.cosmicPulse.animation}`
          : cosmicIntensity === 'medium'
          ? `${animationPatterns.gentleFloat.animation}`
          : 'none'
      })
    };
  }, [variant, element, responsive, isHovered, isActive, effects, cosmicIntensity, theme]);

  // 🌟 Manejadores de eventos
  const handleMouseEnter = useCallback(() => {
    if (interactionMode === 'hover') {
      setIsHovered(true);
    }
  }, [interactionMode]);

  const handleMouseLeave = useCallback(() => {
    if (interactionMode === 'hover') {
      setIsHovered(false);
      setIsActive(false);
    }
  }, [interactionMode]);

  const handleMouseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleExpand = useCallback(() => {
    setExpanded(!expanded);
    onExpand?.();
  }, [expanded, onExpand]);

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  // 🔮 Renderizar partículas cósmicas
  const renderCosmicParticles = () => {
    if (!effects.enableParticles) return null;

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          borderRadius: responsive.borderRadius,
        }}
      >
        {Array.from({ length: effects.particleConfig.count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: `${effects.particleConfig.size}px`,
              height: `${effects.particleConfig.size}px`,
              background: `radial-gradient(circle, ${effects.particleConfig.color}${Math.round(effects.particleConfig.opacity * 255).toString(16)} 0%, transparent 100%)`,
              borderRadius: '50%',
              top: `${20 + (index * 20) % 60}%`,
              left: `${10 + (index * 30) % 80}%`,
              animation: `${animationPatterns.gentleFloat.animation.replace('6.18s', `${4 + index}s`)}`,
              animationDelay: `${index * 0.5}s`,
              filter: effects.particleConfig.blur ? 'blur(1px)' : 'none',
            }}
          />
        ))}
      </Box>
    );
  };

  // 🎯 Renderizar header con controles
  const renderHeader = () => {
    if (!title && !subtitle && !actions) return null;

    return (
      <CardHeader
        title={title && (
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h2"
            sx={{
              fontWeight: 600,
              background: element
                ? elementalPatterns[element].gradient
                : 'linear-gradient(145deg, #8B4513 0%, #CD853F 50%, #DEB887 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: element === 'fuego' ? '#fff' : 'transparent',
              textShadow: '0 1px 2px rgba(139,69,19,0.1)',
            }}
          >
            {title}
          </Typography>
        )}
        subheader={subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.text.primary, 0.7),
              fontWeight: 400,
              letterSpacing: '0.025em',
            }}
          >
            {subtitle}
          </Typography>
        )}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* 🔄 Botón de refresh */}
            {onRefresh && (
              <Tooltip title="Actualizar">
                <IconButton
                  onClick={handleRefresh}
                  disabled={isLoading}
                  size="small"
                  sx={{
                    opacity: isConnected ? 1 : 0.5,
                    color: element ? elementalPatterns[element].particleColor : 'inherit'
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* 📊 Indicador de performance 3D */}
            {effects.enableAnimations && performance3D.fps < 45 && (
              <Tooltip title={`Performance: ${performance3D.fps} FPS`}>
                <IconButton size="small" color="warning">
                  <ErrorOutlineIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* ✨ Indicador de estado cósmico */}
            {effects.enableAnimations && performance3D.fps >= 45 && (
              <Tooltip title="Efectos cósmicos activos">
                <IconButton size="small" sx={{ color: elementalPatterns.fuego.particleColor }}>
                  <AutoAwesomeIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* 📐 Botón de expansión */}
            {onExpand && (
              <Tooltip title={expanded ? "Contraer" : "Expandir"}>
                <IconButton
                  onClick={handleExpand}
                  size="small"
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* ⚡ Acciones adicionales */}
            {actions}
          </Box>
        }
        sx={{
          pb: 1,
          '& .MuiCardHeader-content': {
            overflow: 'hidden',
          },
        }}
      />
    );
  };

  return (
    <Card
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      sx={{
        ...revolutionaryStyles,
        position: 'relative',
        zIndex: 1,
        ...style,
        ...(element === 'fuego' && {
          background: `${homeElementalGradients.fuego.background} !important`,
          backgroundColor: 'transparent !important',
          '&:hover': {
            background: `${homeElementalGradients.fuego.background} !important`,
            backgroundColor: 'transparent !important',
          },
          '&:focus': {
            background: `${homeElementalGradients.fuego.background} !important`,
            backgroundColor: 'transparent !important',
          },
        }),
      }}
      elevation={0}
      {...props}
    >
      {/* 🌟 Partículas cósmicas de fondo */}
      {renderCosmicParticles()}

      {/* 📋 Header del widget */}
      {renderHeader()}

      {/* ⏳ Indicador de carga */}
      {isLoading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            borderRadius: `${responsive.borderRadius} ${responsive.borderRadius} 0 0`,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '& .MuiLinearProgress-bar': {
              background: element
                ? elementalPatterns[element].gradient
                : 'linear-gradient(90deg, #FFB74D, #FF9800)',
            },
          }}
        />
      )}

      {/* 📄 Contenido principal */}
      <CardContent
        sx={{
          position: 'relative',
          zIndex: 2,
          padding: responsive.padding,
          '&:last-child': {
            paddingBottom: responsive.padding,
          },
          ...(element === 'fuego' && {
            color: '#fff',
          }),
        }}
      >
        {isLoading ? (
          // 💀 Skeleton mientras carga
          <Box>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2, borderRadius: '12px' }} />
          </Box>
        ) : (
          children
        )}
      </CardContent>

      {/* 📐 Contenido expandible */}
      {onExpand && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              🚀 Contenido expandido del widget revolucionario
            </Typography>

            {/* 📊 Métricas de performance 3D */}
            {effects.enableAnimations && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Performance 3D: {performance3D.fps} FPS |
                  Suavidad: {performance3D.smoothness}% |
                  Memoria: {performance3D.memoryUsage} MB
                </Typography>
              </Box>
            )}
          </CardContent>
        </Collapse>
      )}

      {/* 🎬 Acciones del pie */}
      {actions && !title && (
        <CardActions
          sx={{
            padding: responsive.padding,
            paddingTop: 0,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

// 🎯 VARIANTES PRE-CONFIGURADAS PARA FÁCIL USO

export const RevolutionaryWidgetPrimary: React.FC<Omit<RevolutionaryWidgetProps, 'variant'>> = (props) => (
  <RevolutionaryWidget variant="primary" {...props} />
);

export const RevolutionaryWidgetSecondary: React.FC<Omit<RevolutionaryWidgetProps, 'variant'>> = (props) => (
  <RevolutionaryWidget variant="secondary" {...props} />
);

export const RevolutionaryWidgetAccent: React.FC<Omit<RevolutionaryWidgetProps, 'variant'>> = (props) => (
  <RevolutionaryWidget variant="accent" {...props} />
);

export const RevolutionaryWidgetElevated: React.FC<Omit<RevolutionaryWidgetProps, 'variant'>> = (props) => (
  <RevolutionaryWidget variant="elevated" {...props} />
);

// 🔥 VARIANTES ELEMENTALES PRE-CONFIGURADAS

export const RevolutionaryWidgetFuego: React.FC<Omit<RevolutionaryWidgetProps, 'element'>> = (props) => (
  <RevolutionaryWidget element="fuego" {...props} />
);

export const RevolutionaryWidgetAgua: React.FC<Omit<RevolutionaryWidgetProps, 'element'>> = (props) => (
  <RevolutionaryWidget element="agua" {...props} />
);

export const RevolutionaryWidgetTierra: React.FC<Omit<RevolutionaryWidgetProps, 'element'>> = (props) => (
  <RevolutionaryWidget element="tierra" {...props} />
);

export const RevolutionaryWidgetAire: React.FC<Omit<RevolutionaryWidgetProps, 'element'>> = (props) => (
  <RevolutionaryWidget element="aire" {...props} />
);

export const RevolutionaryWidgetEspiritu: React.FC<Omit<RevolutionaryWidgetProps, 'element'>> = (props) => (
  <RevolutionaryWidget element="espiritu" {...props} />
);

export default RevolutionaryWidget;
