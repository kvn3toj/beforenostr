import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  Skeleton,
  alpha,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountBalanceWallet,
  Star,
  VolunteerActivism,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { WalletData } from '../../../types/wallet';
import { formatPrice } from '../../../utils/numberUtils';
import BalanceChart from './BalanceChart';

// Represents the internal currency of the CoomÜnity ecosystem. [[memory:514394]]
const UCOIN_CURRENCY = 'Ünits';

interface WalletOverviewProps {
  walletData?: WalletData;
  isLoading?: boolean;
}

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isLoading?: boolean;
}> = ({ icon, label, value, isLoading }) => {
  const theme = useTheme();

  const formattedValue = typeof value === 'number' ? value.toLocaleString('es-CO') : value;

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box sx={{ color: theme.palette.primary.main }}>{icon}</Box>
      <Stack>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {isLoading ? <Skeleton width={80} /> : formattedValue}
        </Typography>
      </Stack>
    </Stack>
  );
};

export const WalletOverview: React.FC<WalletOverviewProps> = ({
  walletData,
  isLoading = false,
}) => {
  const theme = useTheme();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const toggleVisibility = () => setBalanceVisible(!balanceVisible);

  const mainBalance = walletData?.balance ?? 0;
  const ucoins = walletData?.ucoins ?? 0;
  const meritos = walletData?.meritos ?? 0;
  const ondas = walletData?.ondas ?? 0;

  const formattedBalance = balanceVisible
    ? formatPrice(mainBalance, walletData?.currency || 'COP')
    : '••••••';

  return (
    <Paper
      component={motion.div}
      elevation={2}
      sx={{
        p: 4,
        borderRadius: 4,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.05)})`,
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={5}>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" color="text.secondary">
                Balance Principal
              </Typography>
              <IconButton onClick={toggleVisibility} size="small">
                {balanceVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Stack>
            <Typography variant="h2" fontWeight="bold" color="primary">
              {isLoading ? <Skeleton width={200} /> : formattedBalance}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4}>
              <StatItem
                icon={<AccountBalanceWallet />}
                label={UCOIN_CURRENCY}
                value={ucoins}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <StatItem
                icon={<Star />}
                label="Méritos"
                value={meritos}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <StatItem
                icon={<VolunteerActivism />}
                label="Ondas"
                value={ondas}
                isLoading={isLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/*
        NOTE FOR DEVS: The BalanceChart component below may show linting errors related to Recharts and React 18 types.
        These are often editor-only issues and may not affect runtime. If they persist, consider checking for updates
        to 'recharts' and '@types/recharts' or other dependency conflicts.
      */}
      <BalanceChart />
    </Paper>
  );
};

export default WalletOverview;
