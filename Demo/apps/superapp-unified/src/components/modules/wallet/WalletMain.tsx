import React from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { UnitsWalletHumanized } from './UnitsWalletHumanized';
import { TransactionHistory } from './TransactionHistory';
import { useWalletTransactions } from '../../../hooks/useWalletIntegration';
import { WalletActions } from './WalletActions';

const WalletMain: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: transactions, isLoading: areTransactionsLoading } = useWalletTransactions();

  return (
    <Box sx={{ py: 4, backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.text.primary }}>
          Billetera Holística
        </Typography>
        <Grid container spacing={4}>
          {user?.id && (
            <Grid item xs={12}>
              <UnitsWalletHumanized userId={user.id} />
            </Grid>
          )}
          <Grid item xs={12}>
            <WalletActions isLoading={areTransactionsLoading} />
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
