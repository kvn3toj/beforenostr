import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Send,
  SwapHoriz,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

// Datos mock simplificados
const mockWalletData = {
  totalBalanceUSD: 2847.52,
  currencies: [
    { name: 'Lükas', balance: 'L 1,250.00', iconColor: 'primary.main' },
    { name: 'Öndas', balance: 'Ö 890.00', iconColor: 'info.main' },
    { name: 'Méritos', balance: 'M 340.00', iconColor: 'success.main' },
  ],
};

export const WalletWidget: React.FC = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { totalBalanceUSD, currencies } = mockWalletData;

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalBalanceUSD);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Billetera
        </Typography>
        <Tooltip title={balanceVisible ? 'Ocultar balances' : 'Mostrar balances'}>
          <IconButton onClick={() => setBalanceVisible(!balanceVisible)} size="small">
            {balanceVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Stack>

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Balance Total
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {balanceVisible ? formattedBalance : '$ ••••.••'}
        </Typography>
      </Box>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {currencies.map((currency) => (
          <Stack
            key={currency.name}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AccountBalanceWallet sx={{ color: currency.iconColor }} />
              <Typography variant="body1">{currency.name}</Typography>
            </Stack>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
               {balanceVisible ? currency.balance : '••••'}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={1} justifyContent="center">
        <Button size="small" startIcon={<Add />}>Añadir</Button>
        <Button size="small" startIcon={<Send />}>Enviar</Button>
        <Button size="small" startIcon={<SwapHoriz />}>Cambiar</Button>
      </Stack>
    </Box>
  );
};
