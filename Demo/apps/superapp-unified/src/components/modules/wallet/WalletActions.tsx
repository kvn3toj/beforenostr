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
import { useWalletData } from '../../../hooks/useWalletIntegration';
import SendMoneyModal from './SendMoneyModal';
import ReceiveMoneyModal from './ReceiveMoneyModal';
import ExchangeModal from './ExchangeModal';
// NOTE: Assuming ExchangeModal and other modals will be handled separately or re-imported later.

interface WalletActionsProps {
  isLoading?: boolean;
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
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);

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

  const handleConfirmSend = (recipient: string, amount: number) => {
    console.log(`Action: Send ${amount} to ${recipient}`);
    // Here you would call the API service to perform the transaction
    setSendModalOpen(false);
  };

  const handleConfirmExchange = (from: string, to: string, amount: number) => {
    console.log(`Action: Exchange ${amount} ${from} to ${to}`);
    // Here you would call the API service to perform the exchange
    setExchangeModalOpen(false);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, background: 'transparent', boxShadow: 'none' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Acciones Rápidas
      </Typography>
      {isLoading ? (
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
              disabled={!walletData}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<QrCode />}
              title="Recibir"
              onClick={handleReceiveMoney}
              disabled={!walletData}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<SwapHoriz />}
              title="Intercambiar"
              onClick={handleExchangeCoins}
              disabled={!walletData}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ActionButton
              icon={<History />}
              title="Historial"
              onClick={handleViewHistory}
              disabled={!walletData}
            />
          </Grid>
        </Grid>
      )}
      <SendMoneyModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onSend={handleConfirmSend}
      />
      <ReceiveMoneyModal
        open={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        walletAddress={walletData?.address || '0x...'}
      />
      <ExchangeModal
        open={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        onExchange={handleConfirmExchange}
        currencies={['COP', 'USD', 'Ünits']}
      />
      {/* Modals will be re-integrated here */}
    </Paper>
  );
};

export default WalletActions;
