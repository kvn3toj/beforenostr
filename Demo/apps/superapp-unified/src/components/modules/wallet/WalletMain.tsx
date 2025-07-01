import React from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { WalletOverview } from './WalletOverview';
import { WalletActions } from './WalletActions';
import { TransactionHistory } from './TransactionHistory';
import { useWalletData, useWalletTransactions } from '../../../hooks/useWalletIntegration';

const WalletMain: React.FC = () => {
  const theme = useTheme();
  const { data: walletData, isLoading: isWalletLoading } = useWalletData();
  const { data: transactions, isLoading: areTransactionsLoading } = useWalletTransactions();

  const isLoading = isWalletLoading || areTransactionsLoading;

  return (
    <Box sx={{ py: 4, backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.text.primary }}>
          Billetera Holística
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <WalletOverview
              walletData={walletData}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <WalletActions isLoading={isLoading} />
          </Grid>
          <Grid item xs={12}>
            <TransactionHistory
              transactions={transactions || []}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WalletMain;
