import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  FlashOn,
  Waves,
  CompareArrows,
  PlayArrow,
  Pause,
} from '@mui/icons-material';

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

interface RealTimeReciprocidadFlowProps {
  data?: ReciprocidadFlowData;
  isLoading?: boolean;
  enableAnimation?: boolean;
  autoRefresh?: boolean;
  onFlowInteraction?: (type: 'giving' | 'receiving') => void;
  height?: number;
}

/**
 * 🌊 REAL TIME RECIPROCIDAD FLOW - MINIMALIST
 * ===========================================
 *
 * Visualización en tiempo real del flujo de Reciprocidad que muestra:
 * - Flujo bidireccional de dar y recibir
 * - Balance dinámico y tendencias
 * - Resonancia con la red de la comunidad
 *
 * Filosofía: "La Reciprocidad es un flujo natural que conecta corazones
 * y crea ondas de abundancia en el Bien Común"
 */
const RealTimeReciprocidadFlow: React.FC<RealTimeReciprocidadFlowProps> = ({
  data,
  isLoading = false,
  enableAnimation = true,
  autoRefresh = true,
  onFlowInteraction,
  height = 280
}) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(enableAnimation);
  const [isHovered, setIsHovered] = useState(false);

  // 🧮 MOCK DE DATOS POR DEFECTO (desarrollo)
  const flowData: ReciprocidadFlowData = useMemo(() => data || {
    givingFlow: 68,
    receivingFlow: 72,
    balanceIndex: 4, // Ligeramente equilibrado hacia recibir
    totalTransactions: 1247,
    activeConnections: 89,
    networkResonance: 76,
    lastActivity: new Date(),
    trend: 'ascending'
  }, [data]);

  // ⚖️ ESTADO DE BALANCE SIMPLIFICADO
  const balanceState = useMemo(() => {
    const balance = flowData.balanceIndex;

    if (Math.abs(balance) <= 10) {
      return {
        text: 'Equilibrado',
        color: theme.palette.success.main,
        description: 'Flujo de Ayni perfecto'
      };
    } else if (balance > 10) {
      return {
        text: 'Recibiendo+',
        color: theme.palette.info.main,
        description: 'Flujo hacia recibir'
      };
    } else {
      return {
        text: 'Dando+',
        color: theme.palette.warning.main,
        description: 'Flujo hacia dar'
      };
    }
  }, [flowData.balanceIndex, theme]);

  // 🔄 TOGGLE DE ANIMACIÓN
  const toggleAnimation = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        height,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
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
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: '1rem'
          }}
        >
          Flujo de Reciprocidad
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={balanceState.text}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: alpha(balanceState.color, 0.05),
              color: balanceState.color,
              borderColor: alpha(balanceState.color, 0.3),
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
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.divider, 0.05),
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
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onFlowInteraction ? 'pointer' : 'default',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
          onClick={() => onFlowInteraction?.('giving')}
        >
          <FlashOn sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
            DANDO
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
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
            backgroundColor: alpha(theme.palette.success.main, 0.05),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onFlowInteraction ? 'pointer' : 'default',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.success.main, 0.08),
            }
          }}
          onClick={() => onFlowInteraction?.('receiving')}
        >
          <Waves sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
            RECIBIENDO
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
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
            backgroundColor: alpha(balanceState.color, 0.1),
            border: `2px solid ${balanceState.color}`,
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
              transition: 'transform 0.3s ease',
              transform: isPlaying ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Box>
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Transacciones
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {flowData.totalTransactions.toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Conexiones
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {flowData.activeConnections}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            Resonancia Red
          </Typography>
          <Typography variant="body2" fontWeight={600} color={balanceState.color}>
            {flowData.networkResonance}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RealTimeReciprocidadFlow;
