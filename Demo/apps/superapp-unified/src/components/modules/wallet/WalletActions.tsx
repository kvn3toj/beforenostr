import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Zoom,
  alpha,
} from '@mui/material';
import {
  Add,
  Send,
  SwapHoriz,
  History,
  QrCode,
  RequestQuote,
  AccountBalanceWallet,
  Savings,
  TrendingUp,
  Groups,
  Star,
  Close,
  CreditCard,
  Payment,
  AttachMoney,
  Nature,
  Lightbulb,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🎯 Tipos para las acciones del wallet
interface WalletBalance {
  balance: number;
  ucoins: number;
  meritos: number;
  ondas: number;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  action: () => void;
  disabled?: boolean;
  badge?: string | number;
}

interface WalletActionsProps {
  walletBalance: WalletBalance;
  onSendMoney: () => void;
  onReceiveMoney: () => void;
  onViewHistory: () => void;
  onExchangeCoins: () => void;
  onRequestPayment: () => void;
  isLoading?: boolean;
}

// 🎯 Modal para intercambio de monedas
const ExchangeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  walletBalance: WalletBalance;
}> = ({ open, onClose, walletBalance }) => {
  const [fromCurrency, setFromCurrency] = useState<'COP' | 'UC' | 'MERITOS'>(
    'COP'
  );
  const [toCurrency, setToCurrency] = useState<'COP' | 'UC' | 'MERITOS'>('UC');
  const [amount, setAmount] = useState(0);

  const getExchangeRate = (from: string, to: string) => {
    // 💱 Tasas de cambio CoomÜnity (ejemplo)
    const rates: Record<string, Record<string, number>> = {
      COP: { UC: 0.002, MERITOS: 0.001 }, // 1 COP = 0.002 UC
      UC: { COP: 500, MERITOS: 0.5 }, // 1 UC = 500 COP
      MERITOS: { COP: 1000, UC: 2 }, // 1 MÉRITO = 1000 COP
    };
    return rates[from]?.[to] || 1;
  };

  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * exchangeRate;
  const maxAmount = {
    COP: walletBalance.balance,
    UC: walletBalance.ucoins,
    MERITOS: walletBalance.meritos,
  }[fromCurrency];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SwapHoriz color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Intercambio de Monedas CoomÜnity
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Alert severity="info">
            <Typography variant="body2">
              🌟 Los intercambios en CoomÜnity siguen el principio Reciprocidad de
              reciprocidad equilibrada
            </Typography>
          </Alert>

          {/* 📊 Balance disponible */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Balance Disponible
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip
                  label={`${(walletBalance.balance || 0).toLocaleString()} COP`}
                />
                <Chip label={`${walletBalance.ucoins} ÜCoins`} />
                <Chip label={`${walletBalance.meritos} Mëritos`} />
              </Stack>
            </CardContent>
          </Card>

          {/* 💱 Formulario de intercambio */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'end' }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Desde</InputLabel>
              <Select
                value={fromCurrency}
                label="Desde"
                onChange={(e) => setFromCurrency(e.target.value as any)}
              >
                <MenuItem value="COP">🇨🇴 Pesos (COP)</MenuItem>
                <MenuItem value="UC">🪙 ÜCoins</MenuItem>
                <MenuItem value="MERITOS">⭐ Mëritos</MenuItem>
              </Select>
            </FormControl>

            <IconButton
              sx={{ mb: 1 }}
              onClick={() => {
                const temp = fromCurrency;
                setFromCurrency(toCurrency);
                setToCurrency(temp);
              }}
            >
              <SwapHoriz />
            </IconButton>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Hacia</InputLabel>
              <Select
                value={toCurrency}
                label="Hacia"
                onChange={(e) => setToCurrency(e.target.value as any)}
              >
                <MenuItem value="COP">🇨🇴 Pesos (COP)</MenuItem>
                <MenuItem value="UC">🪙 ÜCoins</MenuItem>
                <MenuItem value="MERITOS">⭐ Mëritos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Cantidad a intercambiar"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            helperText={`Máximo disponible: ${(maxAmount || 0).toLocaleString()}`}
            error={amount > maxAmount}
          />

          {/* 📈 Resultado del intercambio */}
          {amount > 0 && (
            <Card
              sx={{
                bgcolor: 'success.50',
                border: 1,
                borderColor: 'success.200',
              }}
            >
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Resultado del Intercambio
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {convertedAmount.toFixed(4)}{' '}
                  {toCurrency === 'COP'
                    ? 'COP'
                    : toCurrency === 'UC'
                      ? 'ÜCoins'
                      : 'Mëritos'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tasa: 1 {fromCurrency} = {exchangeRate} {toCurrency}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* ⚠️ Advertencias */}
          {fromCurrency === 'MERITOS' && (
            <Alert severity="warning">
              Los Mëritos son recompensas por contribuir al Bien Común.
              Intercambiarlos reduce tu nivel Reciprocidad.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={amount <= 0 || amount > maxAmount}
          startIcon={<SwapHoriz />}
        >
          Realizar Intercambio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 🎨 Componente para acciones rápidas principales
const QuickActionCard: React.FC<QuickAction & { onClick: () => void }> = ({
  title,
  subtitle,
  icon,
  color,
  gradient,
  onClick,
  disabled = false,
  badge,
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      sx={{
        background: gradient,
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          background: `linear-gradient(45deg, transparent, ${alpha(color, 0.3)})`,
          zIndex: 1,
        },
      }}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center', py: 3 }}
      >
        <Box sx={{ mb: 2 }}>
          {icon}
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.9)',
                color: color,
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  </motion.div>
);

// 🎯 Speed Dial flotante para acciones adicionales
const WalletSpeedDial: React.FC<{
  onQRCode: () => void;
  onSavings: () => void;
  onAnalytics: () => void;
}> = ({ onQRCode, onSavings, onAnalytics }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <QrCode />, name: 'Código QR', onClick: onQRCode },
    { icon: <Groups />, name: 'Ahorros Reciprocidad', onClick: onSavings },
    { icon: <TrendingUp />, name: 'Analytics', onClick: onAnalytics },
  ];

  return (
    <SpeedDial
      ariaLabel="Acciones adicionales del wallet"
      sx={{ position: 'fixed', bottom: 80, right: 16 }}
      icon={<SpeedDialIcon />}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            action.onClick();
            setOpen(false);
          }}
        />
      ))}
    </SpeedDial>
  );
};

// 🎨 Componente principal WalletActions
export const WalletActions: React.FC<WalletActionsProps> = ({
  walletBalance,
  onSendMoney,
  onReceiveMoney,
  onViewHistory,
  onExchangeCoins,
  onRequestPayment,
  isLoading = false,
}) => {
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // 🎯 Configuración de acciones principales
  const quickActions: QuickAction[] = [
    {
      id: 'send',
      title: 'Enviar',
      subtitle: 'Transferir a otros usuarios',
      icon: <Send sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
      action: onSendMoney,
    },
    {
      id: 'receive',
      title: 'Recibir',
      subtitle: 'Solicitar o generar QR',
      icon: <Add sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      gradient: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
      action: onReceiveMoney,
    },
    {
      id: 'exchange',
      title: 'Intercambiar',
      subtitle: 'Convertir entre monedas',
      icon: <SwapHoriz sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      gradient: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
      action: () => setExchangeModalOpen(true),
      badge: 'Reciprocidad',
    },
    {
      id: 'history',
      title: 'Historial',
      subtitle: 'Ver todas las transacciones',
      icon: <History sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      gradient: 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)',
      action: onViewHistory,
    },
  ];

  // 🎯 Acciones adicionales para el Speed Dial
  const handleQRCode = () => {
    setQrModalOpen(true);
  };

  const handleSavings = () => {
    // TODO: Implementar página de ahorros Reciprocidad
    console.log('🏦 Abriendo ahorros Reciprocidad');
  };

  const handleAnalytics = () => {
    // TODO: Implementar analytics del wallet
    console.log('📊 Abriendo analytics del wallet');
  };

  return (
    <Box>
      {/* 📊 Resumen de balance disponible */}
      <Card sx={{ mb: 3, bgcolor: 'background.default' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💼 Balance Disponible para Operaciones
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip
              icon={<AttachMoney />}
              label={`$${(walletBalance.balance || 0).toLocaleString()} COP`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<SwapHoriz />}
              label={`${walletBalance.ucoins} ÜCoins`}
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<Star />}
              label={`${walletBalance.meritos} Mëritos`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<Lightbulb />}
              label={`${walletBalance.ondas} Öndas`}
              color="info"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 🚀 Acciones principales */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Acciones Rápidas
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {quickActions.map((action, index) => (
          <QuickActionCard
            key={action.id}
            {...action}
            onClick={action.action}
            disabled={isLoading}
          />
        ))}
      </Box>

      {/* 💡 Acciones adicionales con Speed Dial */}
      <WalletSpeedDial
        onQRCode={handleQRCode}
        onSavings={handleSavings}
        onAnalytics={handleAnalytics}
      />

      {/* 💱 Modal de intercambio */}
      <ExchangeModal
        open={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        walletBalance={walletBalance}
      />

      {/* 📱 Modal de código QR */}
      <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <QrCode color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Código QR para Recibir Pagos
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box
              sx={{
                width: 200,
                height: 200,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <QrCode sx={{ fontSize: 80, color: 'text.secondary' }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Muestra este código QR para recibir pagos directamente a tu wallet
              CoomÜnity
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrModalOpen(false)}>Cerrar</Button>
          <Button variant="contained">Compartir QR</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
