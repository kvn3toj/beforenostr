import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Box, Typography, Card, IconButton, Tooltip, Chip } from '@mui/material';
import {
  CompareArrows,
  TrendingUp,
  AutoAwesome,
  Waves,
  FlashOn,
  AllInclusive,
  Refresh,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🌌 COSMIC DESIGN SYSTEM
import { UNIFIED_COLORS } from '../../../../theme/colors';

interface ReciprocidadFlowData {
  givingFlow: number; // Flujo de dar (0-100)
  receivingFlow: number; // Flujo de recibir (0-100)
  balanceIndex: number; // Índice de equilibrio (-100 a +100)
  totalTransactions: number;
  activeConnections: number;
  networkResonance: number; // Resonancia con la red (0-100)
  lastActivity: Date;
  trend: 'ascending' | 'descending' | 'stable';
}

interface FlowParticle {
  id: string;
  x: number;
  y: number;
  direction: 'giving' | 'receiving';
  intensity: number;
  created: number;
}

interface RealTimeReciprocidadFlowProps {
  data?: ReciprocidadFlowData;
  isLoading?: boolean;
  enableAnimation?: boolean;
  autoRefresh?: boolean;
  onFlowInteraction?: (type: 'giving' | 'receiving') => void;
  height?: number;
}

/**
 * 🌊 REAL TIME RECIPROCIDAD FLOW - NIRA (Pattern Visionary)
 * ==========================================================
 *
 * Visualización en tiempo real del flujo de Reciprocidad que muestra:
 * - Flujo bidireccional de dar y recibir
 * - Partículas animadas representando transacciones
 * - Resonancia con la red de la comunidad
 * - Balance dinámico y tendencias
 *
 * Filosofía: "La Reciprocidad es un río cósmico que fluye constantemente,
 * conectando corazones y creando ondas de abundancia en el Bien Común"
 */
const RealTimeReciprocidadFlow: React.FC<RealTimeReciprocidadFlowProps> = ({
  data,
  isLoading = false,
  enableAnimation = true,
  autoRefresh = true,
  onFlowInteraction,
  height = 280
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [particles, setParticles] = useState<FlowParticle[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 🎭 MOCK DATA para desarrollo
  const mockData: ReciprocidadFlowData = {
    givingFlow: 68,
    receivingFlow: 72,
    balanceIndex: 4, // Ligeramente más recepción
    totalTransactions: 247,
    activeConnections: 18,
    networkResonance: 84,
    lastActivity: new Date(),
    trend: 'ascending'
  };

  const flowData = data || mockData;

  // 🌈 COLORES DINÁMICOS
  const flowColors = useMemo(() => ({
    giving: {
      primary: '#FF6B35',
      secondary: '#FFB84D',
      glow: 'rgba(255, 107, 53, 0.4)',
      gradient: 'linear-gradient(90deg, #FF6B35 0%, #FFB84D 100%)'
    },
    receiving: {
      primary: '#00D4AA',
      secondary: '#7DFFC7',
      glow: 'rgba(0, 212, 170, 0.4)',
      gradient: 'linear-gradient(90deg, #00D4AA 0%, #7DFFC7 100%)'
    },
    balance: {
      positive: '#4CAF50',
      negative: '#FF5722',
      neutral: '#9C27B0'
    }
  }), []);

  // ⚡ GENERACIÓN DE PARTÍCULAS
  const generateParticle = useCallback((): FlowParticle => {
    const direction = Math.random() > 0.5 ? 'giving' : 'receiving';
    const isGiving = direction === 'giving';

    return {
      id: `particle-${Date.now()}-${Math.random()}`,
      x: isGiving ? 10 : 90,
      y: 30 + Math.random() * 40,
      direction,
      intensity: 0.3 + Math.random() * 0.7,
      created: Date.now()
    };
  }, []);

  // 🔄 ANIMACIÓN DE PARTÍCULAS
  useEffect(() => {
    if (!enableAnimation || !isPlaying) return;

    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);

      // Generar nuevas partículas
      if (Math.random() < 0.3) {
        setParticles(prev => [...prev, generateParticle()]);
      }

      // Actualizar y filtrar partículas
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.direction === 'giving'
            ? particle.x + 1.5
            : particle.x - 1.5,
          y: particle.y + (Math.sin(Date.now() * 0.01) * 0.5)
        }))
        .filter(particle =>
          particle.direction === 'giving'
            ? particle.x < 95
            : particle.x > 5
        )
        .slice(-20) // Máximo 20 partículas
      );
    }, 100);

    return () => clearInterval(interval);
  }, [enableAnimation, isPlaying, generateParticle]);

  // 📊 ESTADO DEL BALANCE
  const balanceState = useMemo(() => {
    const balance = flowData.balanceIndex;
    if (Math.abs(balance) < 10) {
      return { state: 'equilibrium', color: flowColors.balance.neutral, text: 'Equilibrio Cósmico' };
    } else if (balance > 0) {
      return { state: 'receiving', color: flowColors.balance.positive, text: 'Recepción Abundante' };
    } else {
      return { state: 'giving', color: flowColors.balance.negative, text: 'Dar Generoso' };
    }
  }, [flowData.balanceIndex, flowColors]);

  // 🎮 CONTROLS
  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <Card
      sx={{
        height,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 212, 170, 0.08) 0%, transparent 50%),
          linear-gradient(135deg,
            rgba(255, 254, 251, 0.95) 0%,
            rgba(255, 254, 251, 0.98) 100%
          )
        `,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🎮 CONTROLES SUPERIORES */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: UNIFIED_COLORS.themes.minimalist.text.primary,
            fontSize: '1.1rem'
          }}
        >
          Flujo de Reciprocidad
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={balanceState.text}
            size="small"
            sx={{
              backgroundColor: `${balanceState.color}20`,
              color: balanceState.color,
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />

          <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
            <IconButton size="small" onClick={toggleAnimation}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 🌊 ÁREA PRINCIPAL DE FLUJO */}
      <Box
        sx={{
          position: 'absolute',
          top: 70,
          left: 20,
          right: 20,
          bottom: 80,
          border: '2px solid',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden'
        }}
      >
        {/* 🔥 ZONA DE DAR (IZQUIERDA) */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '45%',
            height: '100%',
            background: `linear-gradient(90deg, ${flowColors.giving.glow} 0%, transparent 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onFlowInteraction ? 'pointer' : 'default'
          }}
          onClick={() => onFlowInteraction?.('giving')}
        >
          <FlashOn sx={{ fontSize: 32, color: flowColors.giving.primary, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: flowColors.giving.primary }}>
            DANDO
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: flowColors.giving.primary }}>
            {flowData.givingFlow}%
          </Typography>
        </Box>

        {/* 💚 ZONA DE RECIBIR (DERECHA) */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '45%',
            height: '100%',
            background: `linear-gradient(270deg, ${flowColors.receiving.glow} 0%, transparent 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onFlowInteraction ? 'pointer' : 'default'
          }}
          onClick={() => onFlowInteraction?.('receiving')}
        >
          <Waves sx={{ fontSize: 32, color: flowColors.receiving.primary, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: flowColors.receiving.primary }}>
            RECIBIENDO
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: flowColors.receiving.primary }}>
            {flowData.receivingFlow}%
          </Typography>
        </Box>

        {/* ⚖️ CENTRO DE BALANCE */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${balanceState.color}40 0%, ${balanceState.color}20 70%, transparent 100%)`,
            border: `3px solid ${balanceState.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5
          }}
        >
          <CompareArrows
            sx={{
              fontSize: 24,
              color: balanceState.color,
              animation: isPlaying ? 'cosmic-pulse 2s ease-in-out infinite' : 'none'
            }}
          />
        </Box>

        {/* ✨ PARTÍCULAS ANIMADAS */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: particle.intensity, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: particle.direction === 'giving'
                  ? flowColors.giving.gradient
                  : flowColors.receiving.gradient,
                boxShadow: `0 0 8px ${
                  particle.direction === 'giving'
                    ? flowColors.giving.glow
                    : flowColors.receiving.glow
                }`,
                zIndex: 3
              }}
            />
          ))}
        </AnimatePresence>
      </Box>

      {/* 📊 MÉTRICAS INFERIORES */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Transacciones
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {flowData.totalTransactions}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Conexiones
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {flowData.activeConnections}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Resonancia
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
                             color: flowData.networkResonance > 80 ? flowColors.receiving.primary : UNIFIED_COLORS.themes.minimalist.text.primary
            }}
          >
            {flowData.networkResonance}%
          </Typography>
        </Box>
      </Box>

      {/* 🌟 EFECTOS HOVER */}
      <AnimatePresence>
        {isHovered && enableAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px solid',
                             borderColor: `${UNIFIED_COLORS.themes.minimalist.primary}40`,
              borderRadius: 12,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>
    </Card>
  );
};

export default RealTimeReciprocidadFlow;
