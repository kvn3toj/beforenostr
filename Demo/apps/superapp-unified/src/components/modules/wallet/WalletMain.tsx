import React from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { UnitsWalletHumanized } from './UnitsWalletHumanized';
import { TransactionHistory } from './TransactionHistory';
import { useWalletTransactions, useWalletData } from '../../../hooks/useWalletIntegration'; // Added useWalletData
import { WalletActions } from './WalletActions';
import { CircularProgress, Alert } from '@mui/material'; // For loading/error states

const WalletMain: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  // Fetch wallet transactions
  const {
    data: transactions,
    isLoading: areTransactionsLoading,
    error: transactionsError
  } = useWalletTransactions();

  // Fetch general wallet data (balances, etc.)
  // Assuming user must exist for WalletMain to be rendered, or useWalletData handles null user.id via `enabled`
  const {
    data: walletData,
    isLoading: isWalletDataLoading,
    error: walletDataError
  } = useWalletData(!!user); // Pass enabled flag based on user existence

  if (isWalletDataLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress /></Box>;
  }

  if (walletDataError) {
    return <Alert severity="error">Error al cargar los datos de la billetera: {walletDataError.message}</Alert>;
  }

  // Note: UnitsWalletHumanized might also need loading/error state from walletData if it's critical path
  // For now, assuming WalletMain handles the primary loading/error for walletData.

  return (
    <Box sx={{ py: 4, backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.text.primary }}>
          Billetera Holística
        </Typography>
        <Grid container spacing={4}>
          {user?.id && walletData && ( // Ensure walletData is available
            <Grid item xs={12}>
              {/* Pass WalletData to UnitsWalletHumanized */}
              <UnitsWalletHumanized userId={user.id} walletData={walletData} />
            </Grid>
          )}
          <Grid item xs={12}>
            {/* isLoading prop for WalletActions might need to consider both transaction and walletData loading states */}
            <WalletActions isLoading={areTransactionsLoading || isWalletDataLoading} />
          </Grid>
          <Grid item xs={12}>
            <TransactionHistory
              transactions={transactions || []}
              isLoading={areTransactionsLoading}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WalletMain;
