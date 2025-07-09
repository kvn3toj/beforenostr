import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  Skeleton,
} from '@mui/material';
import {
  Send,
  SwapHoriz,
  History,
  QrCode,
} from '@mui/icons-material';
import { useWalletData, useCreateTransaction, useExchangeCurrency } from '../../../hooks/useWalletIntegration'; // Added mutation hooks
import SendMoneyModal from './SendMoneyModal';
import ReceiveMoneyModal from './ReceiveMoneyModal';
import ExchangeModal from './ExchangeModal';
import type { CreateTransactionData, ExchangeData } from '../../../hooks/useWalletIntegration'; // Import DTO types

interface WalletActionsProps {
  isLoading?: boolean; // This is for main data loading, not mutation loading
}

const ActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, title, onClick, disabled }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Button
        fullWidth
        variant="outlined"
        startIcon={icon}
        onClick={onClick}
        disabled={disabled}
        sx={{
          p: 2,
          flexDirection: 'column',
          height: '100px',
          justifyContent: 'center',
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {title}
        </Typography>
      </Button>
    </Paper>
  );
};

export const WalletActions: React.FC<WalletActionsProps> = ({
  isLoading = false,
}) => {
  const { data: walletData } = useWalletData();
  const { data: walletData } = useWalletData();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);

  const createTransactionMutation = useCreateTransaction();
  const exchangeCurrencyMutation = useExchangeCurrency();

  const handleSendMoney = () => setSendModalOpen(true);
  const handleReceiveMoney = () => setReceiveModalOpen(true);
  const handleExchangeCoins = () => setExchangeModalOpen(true);

  const handleViewHistory = () => {
    console.log('Action: View History');
    const historyElement = document.getElementById('transaction-history');
    if (historyElement) {
      historyElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Updated to use mutation hook
  const handleConfirmSend = (data: CreateTransactionData) => {
    console.log('Action: Send', data);
    createTransactionMutation.mutate(data, {
      onSuccess: () => {
        setSendModalOpen(false);
        // Optionally show success notification via a toast or similar
      },
      onError: (error) => {
        // Optionally show error notification
        console.error("Send money error:", error);
      }
    });
  };

  // Updated to use mutation hook
  const handleConfirmExchange = (data: ExchangeData) => {
    console.log('Action: Exchange', data);
    exchangeCurrencyMutation.mutate(data, {
      onSuccess: () => {
        setExchangeModalOpen(false);
        // Optionally show success notification
      },
      onError: (error) => {
        // Optionally show error notification
        console.error("Exchange error:", error);
      }
    });
  };

  const actionsDisabled = !walletData || createTransactionMutation.isPending || exchangeCurrencyMutation.isPending;

  return (
    <Paper sx={{ p: 3, borderRadius: 4, background: 'transparent', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Acciones Rápidas
      </Typography>
      {isLoading ? ( // This isLoading is for the parent data, not mutations
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<Send />}
              title="Enviar"
              onClick={handleSendMoney}
              disabled={actionsDisabled}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<QrCode />}
              title="Recibir"
              onClick={handleReceiveMoney}
              disabled={actionsDisabled}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<SwapHoriz />}
              title="Intercambiar"
              onClick={handleExchangeCoins}
              disabled={actionsDisabled}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<History />}
              title="Historial"
              onClick={handleViewHistory}
              disabled={actionsDisabled} // or just !walletData if history doesn't depend on mutation status
            />
          </Grid>
        </Grid>
      )}
      <SendMoneyModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onSend={handleConfirmSend} // Passes CreateTransactionData
        isLoading={createTransactionMutation.isPending}
        error={createTransactionMutation.error?.message}
      />
      <ReceiveMoneyModal
        open={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        // Ensure walletData.defaultReceivingAddress or similar is populated by mapBackendWalletToWalletData
        walletAddress={walletData?.accounts?.find(acc => acc.primary)?.id || walletData?.blockchainAddress || 'Dirección no disponible'}
      />
      <ExchangeModal
        open={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        onExchange={handleConfirmExchange} // Passes ExchangeData
        // Assuming walletData.accounts provides available currencies/balances for exchange
        accounts={walletData?.accounts || []}
        isLoading={exchangeCurrencyMutation.isPending}
        error={exchangeCurrencyMutation.error?.message}
      />
    </Paper>
  );
};

export default WalletActions;
