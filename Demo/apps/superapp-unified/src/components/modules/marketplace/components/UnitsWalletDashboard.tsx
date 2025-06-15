/**
 * 💰 Units Wallet Dashboard - Dashboard Completo del Wallet de Ünits
 * 
 * Dashboard integral para gestionar Ünits, ver historial de transacciones,
 * límites de crédito y métricas de intercambio
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import {
  AccountBalance as WalletIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as TransferIcon,
  History as HistoryIcon,
  CreditCard as CreditIcon,
  Security as SecurityIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import { 
  useUnitsWallet, 
  useTransferUnits, 
  useTransactionHistory 
} from '../../../../hooks/useLetsMarketplace';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface UnitsWalletDashboardProps {
  userId: string;
}

const UnitsWalletDashboard: React.FC<UnitsWalletDashboardProps> = ({ userId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferDescription, setTransferDescription] = useState('');

  const { data: wallet, isLoading: walletLoading } = useUnitsWallet(userId);
  const { data: transactions, isLoading: transactionsLoading } = useTransactionHistory(userId);
  const transferMutation = useTransferUnits();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferRecipient) return;

    try {
      await transferMutation.mutateAsync({
        toUserId: transferRecipient,
        amount: parseFloat(transferAmount),
        description: transferDescription,
        transactionType: 'direct_transfer'
      });
      
      setTransferDialogOpen(false);
      setTransferAmount('');
      setTransferRecipient('');
      setTransferDescription('');
    } catch (error) {
      console.error('Error transferring units:', error);
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance >= 0) return 'success';
    if (balance >= -10) return 'warning';
    return 'error';
  };

  const getCreditUsagePercentage = () => {
    if (!wallet) return 0;
    const creditUsed = Math.max(0, -wallet.balance);
    return (creditUsed / wallet.creditLimit) * 100;
  };

  // Componente principal del wallet
  const WalletOverviewCard = () => {
    const balanceColor = getBalanceColor(wallet?.balance || 0);
    const creditUsage = getCreditUsagePercentage();

    return (
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        height: '100%'
      }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <WalletIcon sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    💫 Wallet de Ünits
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Sistema LETS CoomÜnity
                  </Typography>
                </Box>
              </Stack>
              
              <Chip
                label={`Confianza: ${((wallet?.trustScore || 0) * 100).toFixed(0)}%`}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Stack>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                {wallet?.balance?.toFixed(2) || '0.00'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
                Ünits disponibles
              </Typography>

              {wallet && wallet.balance < 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Crédito usado: {Math.abs(wallet.balance).toFixed(2)} / {wallet.creditLimit.toFixed(2)} Ünits
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={creditUsage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: creditUsage > 80 ? '#ff5722' : '#ffeb3b',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={() => setTransferDialogOpen(true)}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Transferir
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={() => setTabValue(1)}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Historial
                </Button>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                size="small"
                label="💰 LETS Activo"
                sx={{ bgcolor: 'rgba(76, 175, 80, 0.3)', color: 'white' }}
              />
              <Chip
                size="small"
                label="🤝 Sistema de Confianza"
                sx={{ bgcolor: 'rgba(33, 150, 243, 0.3)', color: 'white' }}
              />
              <Chip
                size="small"
                label="⚖️ Ayni Balance"
                sx={{ bgcolor: 'rgba(156, 39, 176, 0.3)', color: 'white' }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  // Componente de estadísticas
  const WalletStatsCard = () => {
    const totalReceived = transactions?.filter((tx: any) => tx.toUserId === userId)
      .reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;
    
    const totalSent = transactions?.filter((tx: any) => tx.fromUserId === userId)
      .reduce((sum: number, tx: any) => sum + tx.amount, 0) || 0;

    const ayniBalance = totalReceived - totalSent;

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            📊 Estadísticas de Intercambio
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  +{totalReceived.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ünits Recibidas
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingDownIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                  -{totalSent.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ünits Enviadas
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TransferIcon sx={{ 
                  fontSize: 32, 
                  color: ayniBalance >= 0 ? 'success.main' : 'warning.main', 
                  mb: 1 
                }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: ayniBalance >= 0 ? 'success.main' : 'warning.main' 
                }}>
                  {ayniBalance >= 0 ? '+' : ''}{ayniBalance.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Balance Ayni
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Alert 
            severity={Math.abs(ayniBalance) <= 5 ? 'success' : 'info'} 
            sx={{ mt: 3 }}
          >
            {Math.abs(ayniBalance) <= 5 
              ? "¡Excelente! Mantienes un buen equilibrio Ayni en tus intercambios."
              : ayniBalance > 5 
                ? "Has recibido más de lo que has dado. Considera ofrecer más servicios."
                : "Has dado más de lo que has recibido. ¡Busca oportunidades para recibir!"
            }
          </Alert>
        </CardContent>
      </Card>
    );
  };

  // Componente de límite de crédito
  const CreditLimitCard = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          💳 Límite de Crédito
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Límite Actual</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {wallet?.creditLimit?.toFixed(2) || '0.00'} Ünits
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Crédito Usado</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {Math.max(0, -(wallet?.balance || 0)).toFixed(2)} Ünits
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={getCreditUsagePercentage()}
              sx={{ mt: 1, height: 6, borderRadius: 3 }}
              color={getCreditUsagePercentage() > 80 ? 'error' : 'primary'}
            />
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Crédito Disponible</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                {((wallet?.creditLimit || 0) + Math.min(0, wallet?.balance || 0)).toFixed(2)} Ünits
              </Typography>
            </Stack>
          </Box>

          <Alert severity="info">
            <Typography variant="caption">
              💡 Tu límite de crédito aumenta automáticamente con tu puntuación de confianza
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );

  // Componente de historial de transacciones
  const TransactionHistoryTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell align="right">Cantidad</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions?.slice(0, 10).map((transaction: any, index: number) => {
            const isReceived = transaction.toUserId === userId;
            const otherUser = isReceived ? transaction.fromUser : transaction.toUser;
            
            return (
              <TableRow key={index}>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={otherUser?.avatar} sx={{ width: 24, height: 24 }}>
                      {otherUser?.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">
                      {otherUser?.name || 'Usuario'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transaction.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {transaction.transactionType}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: isReceived ? 'success.main' : 'error.main'
                    }}
                  >
                    {isReceived ? '+' : '-'}{transaction.amount.toFixed(2)} Ünits
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    size="small"
                    color={transaction.status === 'completed' ? 'success' : 'warning'}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (walletLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Cargando Wallet...
        </Typography>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          💰 Mi Wallet de Ünits
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tus Ünits y revisa tu actividad LETS
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Resumen" />
          <Tab label="Historial" />
          <Tab label="Crédito" />
        </Tabs>
      </Box>

      {/* Contenido de tabs */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <WalletOverviewCard />
          </Grid>
          <Grid item xs={12} md={6}>
            <WalletStatsCard />
          </Grid>
          <Grid item xs={12}>
            <CreditLimitCard />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              📋 Historial de Transacciones
            </Typography>
            {transactionsLoading ? (
              <LinearProgress />
            ) : (
              <TransactionHistoryTable />
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CreditLimitCard />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialog de transferencia */}
      <Dialog 
        open={transferDialogOpen} 
        onClose={() => setTransferDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Transferir Ünits
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="ID del Usuario Destinatario"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Cantidad de Ünits"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0.01, step: 0.01 }}
            />
            
            <TextField
              label="Descripción"
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
              placeholder="Motivo de la transferencia..."
            />

            <Alert severity="info">
              Las transferencias directas son inmediatas y no se pueden revertir
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleTransfer}
            disabled={transferMutation.isPending || !transferAmount || !transferRecipient}
          >
            {transferMutation.isPending ? 'Transfiriendo...' : 'Transferir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UnitsWalletDashboard; 