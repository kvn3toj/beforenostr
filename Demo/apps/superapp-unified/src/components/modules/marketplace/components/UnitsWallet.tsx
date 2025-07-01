// UnitsWallet Component - LETS Currency Management
// Wallet de Ünits para el sistema de economía colaborativa CoomÜnity
// Basado en principios de Reciprocidad (reciprocidad) y confianza comunitaria

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Tooltip,
  Grid,
  Stack,
  alpha
} from '@mui/material';
import {
  AccountBalanceWallet,
  Send,
  History,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  Info,
  Security,
  Handshake,
  LocalAtm,
  Schedule,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  useUnitsWallet,
  useUnitsTransactions,
  useTransferUnits,
  useCanTransferUnits,
  useReciprocidadBalance
} from '../../../../hooks/useLetsIntegration';
import { UnitsWalletProps } from '../../../../types/lets';

const UnitsWallet: React.FC<UnitsWalletProps> = ({
  userId,
  compact = false,
  showTransferButton = true,
  showHistory = true
}) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(!compact);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferDescription, setTransferDescription] = useState('');

  // Hooks para datos del wallet
  const { data: wallet, isLoading: walletLoading, error: walletError } = useUnitsWallet(userId);
  const { data: transactions, isLoading: transactionsLoading } = useUnitsTransactions(userId, { limit: 10 });
  const transferMutation = useTransferUnits();
  const canTransferData = useCanTransferUnits(userId, parseFloat(transferAmount) || 0);
  const reciprocidadBalance = useReciprocidadBalance(userId);

  // Estados de carga y error
  if (walletLoading) {
    return (
      <Card sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Cargando wallet...
        </Typography>
      </Card>
    );
  }

  if (walletError || !wallet) {
    return (
      <Card sx={{ p: 2 }}>
        <Alert severity="error">
          Error al cargar el wallet de Ünits. Por favor, intenta nuevamente.
        </Alert>
      </Card>
    );
  }

  // Handlers
  const handleTransfer = async () => {
    if (!transferAmount || !transferRecipient || !transferDescription) {
      return;
    }

    try {
      await transferMutation.mutateAsync({
        toUserId: transferRecipient,
        amount: parseFloat(transferAmount),
        transactionType: 'service', // Por defecto, podría ser dinámico
        description: transferDescription,
        metadata: {
          transferType: 'manual',
          timestamp: new Date().toISOString()
        }
      });

      // Limpiar formulario y cerrar dialog
      setTransferAmount('');
      setTransferRecipient('');
      setTransferDescription('');
      setTransferDialogOpen(false);
    } catch (error) {
      console.error('Error en transferencia:', error);
    }
  };

  // Cálculos de estado del wallet
  const isUsingCredit = wallet.balance < 0;
  const creditUsagePercentage = isUsingCredit
    ? Math.abs(wallet.balance) / wallet.creditLimit * 100
    : 0;
  const availableCredit = wallet.creditLimit + wallet.balance;
  const trustPercentage = wallet.trustScore * 100;

  const reciprocidadValue = reciprocidadBalance ? reciprocidadBalance.given - reciprocidadBalance.received : 0;
  const reciprocidadColor = reciprocidadBalance ? (reciprocidadBalance.isBalanced ? 'lightgreen' : 'orange') : 'white';

  return (
    <>
      <Box>
        {/* Header del Wallet */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AccountBalanceWallet color="primary" />
            <Typography variant="h6" fontWeight="600">
              Mi Wallet de Ünits
            </Typography>
          </Stack>

          <Tooltip title={expanded ? 'Contraer' : 'Expandir'}>
            <IconButton onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Balance Principal */}
        <Stack
          alignItems="center"
          sx={{
            py: 3,
            backgroundColor: (theme) =>
              isUsingCredit
                ? alpha(theme.palette.error.main, 0.05)
                : alpha(theme.palette.success.main, 0.05),
            borderRadius: 2,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            Balance Actual
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={isUsingCredit ? 'error.main' : 'success.main'}
          >
            {wallet.balance.toFixed(2)} Ü
          </Typography>
        </Stack>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Límite de Crédito
              </Typography>
              <Typography fontWeight="bold">{wallet.creditLimit} Ü</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Nivel de Confianza
              </Typography>
              <Typography fontWeight="bold">
                {trustPercentage.toFixed(0)}%
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 0.5 }}
            >
              Uso de crédito
            </Typography>
            <LinearProgress
              variant="determinate"
              value={creditUsagePercentage}
              color={creditUsagePercentage > 75 ? 'error' : 'warning'}
            />
          </Box>
        </Collapse>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {showTransferButton && (
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={() => setTransferDialogOpen(true)}
              fullWidth
            >
              Transferir
            </Button>
          )}
          {showHistory && (
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={() => setHistoryDialogOpen(true)}
              fullWidth
            >
              Historial
            </Button>
          )}
        </Stack>
      </Box>

      {/* Dialogo de Transferencia */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Send />
            Transferir Ünits
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="ID del Destinatario"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              margin="normal"
              helperText="Ingresa el ID del usuario destinatario"
            />

            <TextField
              fullWidth
              label="Cantidad (Ünits)"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              margin="normal"
              inputProps={{ min: 0.01, step: 0.01 }}
              error={!canTransferData.canTransfer && transferAmount !== ''}
              helperText={
                !canTransferData.canTransfer && transferAmount !== ''
                  ? `Excede el límite de crédito. Disponible: ${canTransferData.availableCredit.toFixed(2)} Ünits`
                  : `Crédito disponible: ${canTransferData.availableCredit.toFixed(2)} Ünits`
              }
            />

            <TextField
              fullWidth
              label="Descripción"
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              margin="normal"
              multiline
              rows={2}
              helperText="Describe el motivo de la transferencia"
            />

            {canTransferData.wouldExceedLimit && transferAmount !== '' && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Esta transferencia excedería tu límite de crédito.
                Tu límite actual es de {canTransferData.creditLimit.toFixed(2)} Ünits.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            variant="contained"
            disabled={
              !transferAmount ||
              !transferRecipient ||
              !transferDescription ||
              !canTransferData.canTransfer ||
              transferMutation.isPending
            }
            startIcon={transferMutation.isPending ? <CircularProgress size={16} /> : <Send />}
          >
            {transferMutation.isPending ? 'Transfiriendo...' : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Historial */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <History />
            Historial de Transacciones
          </Box>
        </DialogTitle>
        <DialogContent>
          {transactionsLoading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Cargando transacciones...
              </Typography>
            </Box>
          ) : transactions && transactions.length > 0 ? (
            <List>
              {transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <ListItem>
                    <ListItemIcon>
                      {transaction.fromUserId === userId ? (
                        <TrendingUp color="error" />
                      ) : (
                        <TrendingDown color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">
                            {transaction.description}
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={transaction.fromUserId === userId ? 'error.main' : 'success.main'}
                          >
                            {transaction.fromUserId === userId ? '-' : '+'}
                            {transaction.amount.toFixed(2)} Ünits
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          <Chip
                            label={transaction.transactionType}
                            size="small"
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                          {transaction.status === 'completed' && (
                            <CheckCircle
                              fontSize="small"
                              color="success"
                              sx={{ ml: 1, verticalAlign: 'middle' }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay transacciones aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tus transacciones de Ünits aparecerán aquí
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnitsWallet;
