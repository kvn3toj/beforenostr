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
import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';

interface WalletOverviewProps {
  lukas: number;
  creditosReciprocidad: number;
  monthlyChange: number;
  pendingTransactions?: number;
  balanceReciprocidad: number;
  isLoading?: boolean;
  isConnected?: boolean;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({
  lukas,
  creditosReciprocidad,
  monthlyChange,
  pendingTransactions = 0,
  balanceReciprocidad,
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
    if (balance >= 0.8) return 'Excelente equilibrio de Reciprocidad';
    if (balance >= 0.6) return 'Buen balance, considera dar más';
    return 'Necesitas dar más para equilibrar';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-coomunity-primary-50 to-white",
          "border border-coomunity-primary-100",
          "shadow-coomunity-soft hover:shadow-coomunity-medium",
          "transition-all duration-300"
        )}
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
            <Typography
              variant="h6"
              className="coomunity-h3 text-coomunity-primary-700"
              fontWeight="bold"
            >
              Mi Wallet CoomÜnity
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
            </motion.div>
          </Stack>

          {/* Balance principal en Lükas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography
                  variant="h4"
                  className="coomunity-h1 text-coomunity-primary-600"
                  fontWeight="bold"
                  color="success.main"
                >
                  {formatCurrency(lukas)}
                </Typography>
                <Typography
                  variant="h6"
                  className="coomunity-body-lg text-gray-600"
                  color="text.secondary"
                >
                  Lükas
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                className="coomunity-caption text-gray-500"
                color="text.secondary"
              >
                Moneda interna CoomÜnity
              </Typography>
            </Box>
          </motion.div>

          {/* Cambio mensual */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
              {monthlyChange >= 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
              )}
              <Typography
                variant="body2"
                color={monthlyChange >= 0 ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {monthlyChange >= 0 ? '+' : ''}
                {monthlyChange.toFixed(1)}% este mes
              </Typography>
            </Stack>
          </motion.div>

          {/* Créditos Reciprocidad */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Créditos Reciprocidad
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stars sx={{ color: 'warning.main', fontSize: 18 }} />
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {creditosReciprocidad}
                  </Typography>
                </Stack>
              </Box>
              <Chip
                icon={<SwapHoriz />}
                label="Intercambiar"
                size="small"
                color="primary"
                variant="outlined"
                className="hover:bg-coomunity-primary-50 transition-colors duration-200"
              />
            </Stack>
          </motion.div>

          <Divider sx={{ my: 2 }} />

          {/* Equilibrio Reciprocidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Box sx={{ mb: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="caption"
                  className="coomunity-caption text-gray-500"
                  color="text.secondary"
                >
                  Equilibrio Reciprocidad
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color={`${getBalanceColor(balanceReciprocidad)}.main`}
                >
                  {Math.round(balanceReciprocidad * 100)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={balanceReciprocidad * 100}
                color={getBalanceColor(balanceReciprocidad)}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography
                variant="caption"
                className="coomunity-caption text-xs text-gray-500"
                sx={{ mt: 0.5, display: 'block' }}
              >
                {getBalanceMessage(balanceReciprocidad)}
              </Typography>
            </Box>
          </motion.div>

          {/* Transacciones pendientes */}
          {pendingTransactions > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                className={cn(
                  "p-3 rounded-lg",
                  "bg-blue-50 border border-blue-200",
                  "hover:bg-blue-100 transition-colors duration-200"
                )}
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
                  <Typography
                    variant="caption"
                    className="coomunity-caption text-gray-500"
                    color="text.secondary"
                  >
                    Esperando confirmación de intercambios Reciprocidad
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          )}

          {/* Indicador de conexión */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Datos offline"
                  color="warning"
                  size="small"
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Box>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
