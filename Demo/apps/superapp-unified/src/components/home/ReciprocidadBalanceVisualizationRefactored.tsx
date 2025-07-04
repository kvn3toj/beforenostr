import React, { useState, useEffect, useMemo } from 'react';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE MATERIAL UI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { useTheme, useMediaQuery } from '@mui/material';

// 🎯 REGLA #1: IMPORTS ESPECÍFICOS DE ICONOS
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TerrainIcon from '@mui/icons-material/Terrain';
import AirIcon from '@mui/icons-material/Air';
import DiamondIcon from '@mui/icons-material/Diamond';

// 🌌 IMPORTS DEL DESIGN SYSTEM REVOLUCIONARIO
import {
  RevolutionaryWidget,
  createRevolutionaryWidget,
  elementalPatterns,
} from '../../design-system';

// 🌟 IMPORTS DE TIPOS DEL DESIGN SYSTEM
import { ElementStats, ReciprocidadMetrics } from '../../design-system/types';

/**
 * 🌌 RECIPROCIDAD BALANCE VISUALIZATION - REFACTORED
 * =========================================
 *
 * Versión refactorizada del widget Balance de Reciprocidad usando el
 * Design System revolucionario centralizado.
 *
 * ANTES: ReciprocidadBalanceVisualization.tsx (1236 líneas)
 * DESPUÉS: Uso de RevolutionaryWidget + patrones centralizados
 *
 * Mejoras implementadas:
 * ✅ Uso de patrones revolucionarios centralizados
 * ✅ Template widget con efectos cósmicos
 * ✅ Testing 3D integrado
 * ✅ Performance monitoring automático
 * ✅ Gradientes elementales unificados
 * ✅ Responsividad avanzada
 *
 * Fase 2, Semana 1 - Plan Maestro Material UI
 */

interface ReciprocidadBalanceVisualizationProps extends ReciprocidadMetrics {
  elementos: ElementStats;
  isLoading?: boolean;
  isConnected?: boolean;
  className?: string;
}

export const ReciprocidadBalanceVisualizationRefactored: React.FC<ReciprocidadBalanceVisualizationProps> = ({
  ondas,
  meritos,
  nivel,
  siguienteNivel,
  progreso,
  contribucionesBienComun,
  balance,
  elementos,
  isLoading = false,
  isConnected = true,
  className
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 🎭 Estados locales simplificados (reducidos gracias al template)
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  // 🌟 Configuración del widget usando el design system
  const widgetConfig = useMemo(() => {
    // Usar preset heroWidget para el Balance de Reciprocidad (elemento principal)
    const baseConfig = createRevolutionaryWidget('heroWidget', {
      // Habilitar efectos cósmicos para el protagonista único
      cosmicEffects: {
        enableGlow: true,
        enableAnimations: !isMobile, // Optimización móvil
        enableParticles: !isMobile && isConnected,
        enableOrbitalEffects: !isMobile && balance > 80, // Solo si hay buen balance
        glowIntensity: balance / 100, // Intensidad basada en balance
        orbitalRadius: 120,
        orbitalSpeed: 0.8,
        particleConfig: {
          count: Math.min(5, Math.floor(balance / 20)),
          size: 6,
          color: '#FFB74D',
          speed: 1,
          opacity: 0.7,
          blur: true
        }
      }
    });

    return baseConfig;
  }, [isMobile, isConnected, balance]);

  // 🔄 Manejador de refresh optimizado
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  // 📐 Manejador de expansión
  const handleExpand = () => {
    setExpandedDetails(!expandedDetails);
  };

  // 🎨 Calcular elemento dominante para efectos visuales
  const dominantElement = useMemo(() => {
    const elementValues = Object.entries(elementos);
    const [dominantKey] = elementValues.reduce((a, b) =>
      elementos[a[0] as keyof ElementStats] > elementos[b[0] as keyof ElementStats] ? a : b
    );
    return dominantKey as keyof ElementStats;
  }, [elementos]);

  // 🌟 Renderizar métricas principales usando componentes Material UI
  const renderMainMetrics = () => (
    <Grid container spacing={2}>
      {/* 🌊 Öndas */}
      <Grid xs={6} sm={3}>
        <Box sx={{ textAlign: 'center' }}>
          <BoltIcon sx={{ color: elementalPatterns.aire.particleColor, mb: 1 }} />
          <Typography variant="h4" sx={{
            fontWeight: 700,
            background: elementalPatterns.aire.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {ondas.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Öndas
          </Typography>
        </Box>
      </Grid>

      {/* 💎 Mëritos */}
      <Grid xs={6} sm={3}>
        <Box sx={{ textAlign: 'center' }}>
          <DiamondIcon sx={{ color: elementalPatterns.tierra.particleColor, mb: 1 }} />
          <Typography variant="h4" sx={{
            fontWeight: 700,
            background: elementalPatterns.tierra.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {meritos.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Mëritos
          </Typography>
        </Box>
      </Grid>

      {/* ⚖️ Balance de Reciprocidad */}
      <Grid xs={12} sm={6}>
        <Box sx={{ textAlign: 'center' }}>
          <AutoAwesomeIcon sx={{ color: elementalPatterns.espiritu.particleColor, mb: 1 }} />
          <Typography variant="h3" sx={{
            fontWeight: 800,
            background: elementalPatterns.espiritu.gradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {balance}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Balance de Reciprocidad
          </Typography>

          {/* Barra de progreso cósmica */}
          <LinearProgress
            variant="determinate"
            value={balance}
            sx={{
              mt: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 183, 77, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: elementalPatterns.espiritu.gradient,
                borderRadius: 4,
                boxShadow: `0 0 10px ${elementalPatterns.espiritu.glowColor}`
              }
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );

  // 🔥 Renderizar distribución elemental
  const renderElementalDistribution = () => {
    const elementIcons = {
      fuego: <LocalFireDepartmentIcon />,
      agua: <WaterDropIcon />,
      tierra: <TerrainIcon />,
      aire: <AirIcon />,
      espiritu: <DiamondIcon />
    };

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          🌟 Distribución Elemental
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(elementos).map(([element, value]) => {
            const elementKey = element as keyof ElementStats;
            const pattern = elementalPatterns[elementKey];
            const isSpiritu = elementKey === 'espiritu';

            if (isSpiritu && value === undefined) return null;

            return (
              <Grid xs={6} sm={2.4} key={element}>
                <Box sx={{
                  textAlign: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  background: pattern.bgGradient,
                  border: `1px solid ${pattern.particleColor}20`,
                  color: pattern.particleColor,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  {React.cloneElement(elementIcons[elementKey], { sx: { fontSize: 32, mb: 1 }})}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{pattern.name}</Typography>
                  <Typography variant="h6">{value}%</Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderLevelInfo = () => (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Typography variant="h6">{nivel}</Typography>
      <LinearProgress
        variant="determinate"
        value={progreso}
        sx={{ my: 1, height: 6, borderRadius: 3 }}
      />
      <Typography variant="caption" color="text.secondary">
        {progreso}% para {siguienteNivel}
      </Typography>
    </Box>
  );

  const widgetActions = (
    <>
      <IconButton onClick={handleRefresh} disabled={refreshing}>
        <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
      </IconButton>
      <IconButton onClick={handleExpand}>
        <ExpandMoreIcon sx={{ transform: expandedDetails ? 'rotate(180deg)' : 'none' }} />
      </IconButton>
    </>
  );

  return (
    <RevolutionaryWidget
      title="Balance de Reciprocidad"
      subtitle="Tu centro de equilibrio energético"
      actions={widgetActions}
      element={dominantElement}
      isLoading={isLoading}
      isConnected={isConnected}
      className={className}
      {...widgetConfig}
    >
      {renderMainMetrics()}
      {expandedDetails && (
        <>
          {renderElementalDistribution()}
          {renderLevelInfo()}
        </>
      )}
    </RevolutionaryWidget>
  );
};
