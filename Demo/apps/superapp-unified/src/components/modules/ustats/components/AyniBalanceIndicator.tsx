import React, { useMemo } from 'react';
import { Box, Typography, Paper, CircularProgress, Tooltip, useTheme, alpha } from '@mui/material';
import {
  Balance,
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';

interface ReciprocidadBalanceData {
  currentBalance: number; // 0-100
  trend: 'ascending' | 'descending' | 'stable';
  reciprocidadGiven: number;
  reciprocidadReceived: number;
  harmonyLevel: 'critical' | 'low' | 'balanced' | 'excellent' | 'transcendent';
  lastUpdate: Date;
}

interface ReciprocidadBalanceIndicatorProps {
  data?: ReciprocidadBalanceData;
  isLoading?: boolean;
  size?: 'small' | 'medium' | 'large';
  onBalanceClick?: () => void;
}

/**
 * 🌟 RECIPROCIDAD BALANCE INDICATOR - Minimalist Version
 * =====================================================
 *
 * Indicador visual del equilibrio de Reciprocidad que muestra:
 * - Balance en tiempo real entre dar y recibir
 * - Tendencia de equilibrio
 * - Nivel de armonía del usuario
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

  // MOCK DATA para desarrollo
  const mockData: ReciprocidadBalanceData = {
    currentBalance: 78,
    trend: 'ascending',
    reciprocidadGiven: 124,
    reciprocidadReceived: 96,
    harmonyLevel: 'excellent',
    lastUpdate: new Date()
  };

  const balanceData = data || mockData;

  // CONFIGURACIÓN DE TAMAÑO
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

  // COLORES SEGÚN HARMONY LEVEL
  const harmonyColors = useMemo(() => {
    switch (balanceData.harmonyLevel) {
      case 'critical':
        return {
          primary: theme.palette.error.main,
          secondary: theme.palette.error.light,
        };
      case 'low':
        return {
          primary: theme.palette.warning.main,
          secondary: theme.palette.warning.light,
        };
      case 'balanced':
        return {
          primary: theme.palette.info.main,
          secondary: theme.palette.info.light,
        };
      case 'excellent':
        return {
          primary: theme.palette.success.main,
          secondary: theme.palette.success.light,
        };
      case 'transcendent':
        return {
          primary: theme.palette.primary.main,
          secondary: theme.palette.primary.light,
        };
    }
  }, [balanceData.harmonyLevel, theme.palette]);

  // ICONO DE TENDENCIA
  const TrendIcon = useMemo(() => {
    switch (balanceData.trend) {
      case 'ascending': return TrendingUp;
      case 'descending': return TrendingDown;
      default: return Remove;
    }
  }, [balanceData.trend]);

  // TEXTO DE HARMONY LEVEL
  const harmonyText = useMemo(() => {
    switch (balanceData.harmonyLevel) {
      case 'critical': return 'Desequilibrio Crítico';
      case 'low': return 'Armonía Baja';
      case 'balanced': return 'Balance Consciente';
      case 'excellent': return 'Excelente Armonía';
      case 'transcendent': return 'Reciprocidad Trascendente';
    }
  }, [balanceData.harmonyLevel]);

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{
          width: sizeConfig.cardSize,
          height: sizeConfig.cardSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: sizeConfig.cardSize,
        height: sizeConfig.cardSize,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        cursor: onBalanceClick ? 'pointer' : 'default',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: harmonyColors.primary,
          boxShadow: `0 2px 8px ${alpha(harmonyColors.primary, 0.2)}`,
          transform: onBalanceClick ? 'translateY(-2px)' : 'none'
        }
      }}
      onClick={onBalanceClick}
    >
      {/* Círculo Principal de Balance */}
      <Box
        sx={{
          position: 'relative',
          width: sizeConfig.orbSize,
          height: sizeConfig.orbSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {/* Progreso Circular */}
        <CircularProgress
          variant="determinate"
          value={balanceData.currentBalance}
          size={sizeConfig.orbSize}
          thickness={4}
          sx={{
            position: 'absolute',
            color: harmonyColors.primary,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />

        {/* Icono Central */}
        <Balance sx={{
          fontSize: sizeConfig.orbSize * 0.4,
          color: harmonyColors.primary
        }} />
      </Box>

      {/* Valor del Balance */}
      <Typography
        variant={sizeConfig.fontSize}
        sx={{
          fontWeight: 700,
          color: harmonyColors.primary,
          mb: 0.5
        }}
      >
        {balanceData.currentBalance}%
      </Typography>

      {/* Estado de Armonía */}
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          textAlign: 'center',
          mb: 1,
          fontSize: '0.7rem'
        }}
      >
        {harmonyText}
      </Typography>

      {/* Indicador de Tendencia */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5
      }}>
        <TrendIcon sx={{
          fontSize: 16,
          color: balanceData.trend === 'ascending'
            ? theme.palette.success.main
            : balanceData.trend === 'descending'
              ? theme.palette.error.main
              : theme.palette.text.secondary
        }} />
        <Typography variant="caption" color="text.secondary">
          {balanceData.trend === 'ascending' ? 'Creciendo' :
           balanceData.trend === 'descending' ? 'Declinando' : 'Estable'}
        </Typography>
      </Box>

      {/* Datos de Reciprocidad en Tooltip */}
      <Tooltip
        title={
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Balance de Reciprocidad
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Dado: {balanceData.reciprocidadGiven}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block' }}>
              Recibido: {balanceData.reciprocidadReceived}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Última actualización: {balanceData.lastUpdate.toLocaleTimeString()}
            </Typography>
          </Box>
        }
        arrow
        placement="top"
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            cursor: 'help'
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: harmonyColors.primary,
              opacity: 0.6
            }}
          />
        </Box>
      </Tooltip>
    </Paper>
  );
};

export default ReciprocidadBalanceIndicator;
