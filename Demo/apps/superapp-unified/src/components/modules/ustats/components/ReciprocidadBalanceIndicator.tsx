import React, { useMemo, useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Tooltip, IconButton, useTheme, alpha } from '@mui/material';
import {
  Balance,
  TrendingUp,
  TrendingDown,
  Remove,
  AutoAwesome,
  Waves,
  FlashOn
} from '@mui/icons-material';

interface ReciprocidadBalanceData {
  currentBalance: number; // 0-100
  trend: number; // Weekly trend percentage
  reciprocidadGiven: number;
  reciprocidadReceived: number;
  harmonyLevel: number; // 0-100
  lastUpdate: string;
}

interface ReciprocidadBalanceIndicatorProps {
  data?: ReciprocidadBalanceData;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
  onBalanceClick?: () => void;
}

/**
 * 🌟 RECIPROCIDAD BALANCE INDICATOR - MINIMALIST VERSION
 * ======================================================
 *
 * Indicador visual del equilibrio de Reciprocidad que muestra:
 * - Balance en tiempo real entre dar y recibir
 * - Tendencia de equilibrio
 * - Nivel de armonía del usuario
 * - Diseño limpio y minimalista
 *
 * Filosofía: "El verdadero equilibrio no es estático, sino un flujo consciente
 * de dar y recibir que nutre el Bien Común"
 */
const ReciprocidadBalanceIndicator: React.FC<ReciprocidadBalanceIndicatorProps> = ({
  data,
  isLoading = false,
  size = 'medium',
  onBalanceClick
}) => {
  const theme = useTheme();

  // 🎭 MOCK DATA para desarrollo
  const mockData: ReciprocidadBalanceData = {
    currentBalance: 78,
    trend: 5.2,
    reciprocidadGiven: 124,
    reciprocidadReceived: 96,
    harmonyLevel: 82,
    lastUpdate: new Date().toISOString()
  };

  const balanceData = data || mockData;

  // 🌈 CONFIGURACIÓN DE TAMAÑO
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'small':
        return { cardSize: 120, orbSize: 60, fontSize: 'caption' as const };
      case 'large':
        return { cardSize: 200, orbSize: 120, fontSize: 'h6' as const };
      default:
        return { cardSize: 160, orbSize: 80, fontSize: 'body2' as const };
    }
  }, [size]);

  // 🎨 COLORES DINÁMICOS SEGÚN BALANCE
  const balanceStatus = useMemo(() => {
    if (balanceData.currentBalance >= 85) return {
      level: 'Excelente Armonía',
      color: theme.palette.success.main,
      description: 'Perfecto equilibrio cósmico'
    };
    if (balanceData.currentBalance >= 70) return {
      level: 'Buena Armonía',
      color: theme.palette.primary.main,
      description: 'Equilibrio en buen estado'
    };
    if (balanceData.currentBalance >= 50) return {
      level: 'Balance Moderado',
      color: theme.palette.warning.main,
      description: 'Equilibrio en desarrollo'
    };
    return {
      level: 'Mejora Necesaria',
      color: theme.palette.error.main,
      description: 'Requiere atención'
    };
  }, [balanceData.currentBalance, theme]);

  // 🔄 ICONO DE TENDENCIA
  const TrendIcon = useMemo(() => {
    if (balanceData.trend > 0) return TrendingUp;
    if (balanceData.trend < 0) return TrendingDown;
    return Remove;
  }, [balanceData.trend]);

  if (isLoading) {
    return (
      <Paper sx={{
        width: sizeConfig.cardSize,
        height: sizeConfig.cardSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}>
        <CircularProgress size={40} sx={{ color: theme.palette.primary.main }} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: sizeConfig.cardSize,
        height: sizeConfig.cardSize,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        cursor: onBalanceClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: balanceStatus.color,
          boxShadow: `0 2px 8px ${alpha(balanceStatus.color, 0.1)}`,
          transform: onBalanceClick ? 'translateY(-2px)' : 'none'
        }
      }}
      onClick={onBalanceClick}
    >
      {/* Main Content */}
      <Box
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Central Orb/Progress */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={balanceData.currentBalance}
            size={sizeConfig.orbSize}
            thickness={6}
            sx={{
              color: balanceStatus.color,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={sizeConfig.orbSize}
            thickness={6}
            sx={{
              color: alpha(theme.palette.divider, 0.3),
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />

          {/* Center Value */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              variant={size === 'large' ? 'h5' : 'h6'}
              sx={{
                fontWeight: 800,
                color: balanceStatus.color,
                lineHeight: 1,
              }}
            >
              {balanceData.currentBalance}%
            </Typography>
            <Balance
              sx={{
                fontSize: size === 'large' ? 16 : 12,
                color: balanceStatus.color,
                mt: 0.5,
              }}
            />
          </Box>
        </Box>

        {/* Status Text */}
        <Typography
          variant="caption"
          sx={{
            color: balanceStatus.color,
            fontWeight: 600,
            mb: 1,
          }}
        >
          {balanceStatus.level}
        </Typography>

        {/* Trend Indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TrendIcon
            sx={{
              fontSize: 16,
              color: balanceData.trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: balanceData.trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
              fontWeight: 600,
            }}
          >
            {balanceData.trend >= 0 ? '+' : ''}{balanceData.trend.toFixed(1)}%
          </Typography>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Dado: {balanceData.reciprocidadGiven} · Recibido: {balanceData.reciprocidadReceived}
          </Typography>
        </Box>
      </Box>

      {/* Corner Indicators */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: theme.palette.success.main,
            opacity: 0.8,
          }}
        />
      </Box>

      {/* Harmony Level Bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: alpha(theme.palette.divider, 0.3),
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${balanceData.harmonyLevel}%`,
            height: '100%',
            backgroundColor: balanceStatus.color,
            transition: 'width 1s ease-out',
          }}
        />
      </Box>
    </Paper>
  );
};

export default ReciprocidadBalanceIndicator;
