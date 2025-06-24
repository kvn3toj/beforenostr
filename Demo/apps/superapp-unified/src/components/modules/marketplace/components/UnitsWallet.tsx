// UnitsWallet Component - LETS Currency Management
// Wallet de Ünits para el sistema de economía colaborativa CoomÜnity
// Basado en principios de Ayni (reciprocidad) y confianza comunitaria

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
  Grid
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
  useAyniBalance
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
  const ayniBalance = useAyniBalance(userId);

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

  const ayniValue = ayniBalance ? ayniBalance.given - ayniBalance.received : 0;
  const ayniColor = ayniBalance ? (ayniBalance.isBalanced ? 'lightgreen' : 'orange') : 'white';

  return (
    <>
      <Card
        sx={{
          background: 'linear-gradient(135deg, var(--primary-blue, #3b82f6), var(--primary-green, #10b981))',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))'
        }}
      >
        {/* Elementos decorativos sutiles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
            zIndex: 0
          }}
        />

        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header del Wallet */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AccountBalanceWallet sx={{ fontSize: 32, opacity: 0.9 }} />
              <Typography variant="h6" fontWeight="600">
                Mi Wallet de Ünits
              </Typography>
            </Box>

            <Tooltip title={expanded ? "Contraer" : "Expandir"}>
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}
                size="small"
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Balance Principal */}
          <Box textAlign="center" mb={3}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Balance Actual</Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, lineHeight: 1.2 }}>
              {wallet.balance >= 0 ? '+' : ''}{wallet.balance.toFixed(2)}
              <Typography component="span" variant="h5" sx={{ ml: 1, opacity: 0.7, fontWeight: 400 }}>
                Ünits
              </Typography>
            </Typography>

            {isUsingCredit && (
              <Chip
                icon={<Warning />}
                label={`Usando crédito: ${Math.abs(wallet.balance).toFixed(2)} Ünits`}
                size="small"
                sx={{ mb: 1, backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#FFC107' }}
              />
            )}
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
            {/* Trust Score */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" display="flex" alignItems="center" gap={1} sx={{ color: 'rgba(255,255,255,0.8)'}}>
                  <Security fontSize="small" />
                  Confianza Comunitaria
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {trustPercentage.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={trustPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>

            {/* Límite de Crédito */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" display="flex" alignItems="center" gap={1} sx={{ color: 'rgba(255,255,255,0.8)'}}>
                  <LocalAtm fontSize="small" />
                  Crédito Disponible
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {availableCredit.toFixed(2)} Ünits
                </Typography>
              </Box>
            </Box>

            {/* Ayni Balance */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" display="flex" alignItems="center" gap={1} sx={{ color: 'rgba(255,255,255,0.8)'}}>
                   <Handshake fontSize="small" />
                   Balance Ayni (Dar/Recibir)
                </Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ color: ayniColor }}>
                  {ayniValue > 0 && '+'}{ayniValue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 2 }} />
          </Collapse>

          {/* Botones de Acción */}
          {showTransferButton && (
            <Grid container spacing={1} mt={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Send />}
                  onClick={() => setTransferDialogOpen(true)}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: 'var(--primary-blue, #3b82f6)',
                    '&:hover': {
                      backgroundColor: 'white'
                    }
                  }}
                >
                  Transferir
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<History />}
                  onClick={() => setHistoryDialogOpen(true)}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Historial
                </Button>
              </Grid>
            </Grid>
          )}

        </CardContent>
      </Card>

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
