import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
  Box,
  Chip,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Stars,
  SwapHoriz,
  AccessTime,
} from '@mui/icons-material';

interface WalletOverviewProps {
  lukas: number;
  ayniCredits: number;
  monthlyChange: number;
  pendingTransactions?: number;
  ayniBalance: number;
  isLoading?: boolean;
  isConnected?: boolean;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({
  lukas,
  ayniCredits,
  monthlyChange,
  pendingTransactions = 0,
  ayniBalance,
  isLoading = false,
  isConnected = true,
}) => {
  const theme = useTheme();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance >= 0.8) return 'success';
    if (balance >= 0.6) return 'warning';
    return 'error';
  };

  const getBalanceMessage = (balance: number) => {
    if (balance >= 0.8) return 'Excelente equilibrio Ayni';
    if (balance >= 0.6) return 'Buen balance, considera dar más';
    return 'Necesitas dar más para equilibrar';
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.success.main,
          0.05
        )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(
            theme.palette.success.main,
            0.1
          )} 0%, transparent 70%)`,
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Mi Wallet CoomÜnity
          </Typography>
          <Avatar
            sx={{
              bgcolor: 'success.main',
              background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
              width: 40,
              height: 40,
            }}
          >
            <AccountBalanceWallet />
          </Avatar>
        </Stack>

        {/* Balance principal en Lükas */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {formatCurrency(lukas)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Lükas
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Moneda interna CoomÜnity
          </Typography>
        </Box>

        {/* Cambio mensual */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          {monthlyChange >= 0 ? (
            <TrendingUp color="success" fontSize="small" />
          ) : (
            <TrendingDown color="error" fontSize="small" />
          )}
          <Typography
            variant="body2"
            color={monthlyChange >= 0 ? 'success.main' : 'error.main'}
            fontWeight="bold"
          >
            {monthlyChange >= 0 ? '+' : ''}
            {monthlyChange}% este mes
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Créditos Ayni y Balance */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Stars sx={{ color: 'warning.main', fontSize: 20 }} />
              <Typography variant="subtitle2" fontWeight="bold">
                Créditos Ayni
              </Typography>
            </Stack>
            <Typography variant="h6" color="warning.main">
              {formatCurrency(ayniCredits)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Créditos de reciprocidad
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="subtitle2" fontWeight="bold">
              Balance Ayni
            </Typography>
            <Typography
              variant="h6"
              color={`${getBalanceColor(ayniBalance)}.main`}
            >
              {Math.round(ayniBalance * 100)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dar / Recibir
            </Typography>
          </Box>
        </Stack>

        {/* Barra de progreso del balance Ayni */}
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="caption" color="text.secondary">
              Equilibrio Ayni
            </Typography>
            <Chip
              label={getBalanceMessage(ayniBalance)}
              color={getBalanceColor(ayniBalance)}
              size="small"
              variant="outlined"
            />
          </Stack>
          <LinearProgress
            variant="determinate"
            value={ayniBalance * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.grey[500], 0.2),
              '& .MuiLinearProgress-bar': {
                bgcolor: `${getBalanceColor(ayniBalance)}.main`,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Transacciones pendientes */}
        {pendingTransactions > 0 && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.1),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <AccessTime sx={{ color: 'info.main', fontSize: 18 }} />
            <Box>
              <Typography variant="body2" fontWeight="bold" color="info.main">
                {pendingTransactions} transacciones pendientes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Esperando confirmación de intercambios Ayni
              </Typography>
            </Box>
          </Stack>
        )}

        {/* Indicador de conexión */}
        {!isConnected && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label="Datos offline"
              color="warning"
              size="small"
              variant="outlined"
              sx={{ width: '100%' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
