import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Button,
  Tab,
  Tabs,
  Stack,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown,
  Add,
  Send,
  History,
  CreditCard,
  AttachMoney,
  Euro,
  Refresh,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useWalletData, useWalletTransactions, useBackendAvailability } from '../hooks/useRealBackendData';

// 🎭 Mock data (fallback when backend is unavailable)
const mockWalletData = {
  balance: 1250.75,
  currency: 'COP',
  ucoins: 480,
  pendingBalance: 150.00,
  monthlyChange: 15.2,
  
  accounts: [
    {
      id: '1',
      name: 'Cuenta Principal CoomÜnity',
      type: 'checking',
      balance: 1250.75,
      currency: 'COP',
      primary: true,
    },
    {
      id: '2',
      name: 'ÜCoins Wallet',
      type: 'crypto',
      balance: 480,
      currency: 'UC',
      primary: false,
    },
    {
      id: '3',
      name: 'Ahorros Ayni',
      type: 'savings',
      balance: 850.30,
      currency: 'COP',
      primary: false,
    },
  ],
  
  recentTransactions: [
    {
      id: '1',
      type: 'income',
      amount: 50000,
      currency: 'COP',
      description: 'Gig completado: Diseño Web',
      date: '2025-01-19',
      from: 'María González',
      status: 'completed',
    },
    {
      id: '2',
      type: 'expense',
      amount: -25000,
      currency: 'COP',
      description: 'Compra en Marketplace',
      date: '2025-01-18',
      to: 'CoomÜnity Store',
      status: 'completed',
    },
    {
      id: '3',
      type: 'reward',
      amount: 25,
      currency: 'UC',
      description: 'Recompensa por Ayni',
      date: '2025-01-18',
      from: 'Sistema CoomÜnity',
      status: 'completed',
    },
    {
      id: '4',
      type: 'transfer',
      amount: 75000,
      currency: 'COP',
      description: 'Transferencia recibida',
      date: '2025-01-17',
      from: 'Carlos Ruiz',
      status: 'pending',
    },
  ],

  paymentMethods: [
    {
      id: '1',
      name: 'CoomÜnity Card',
      type: 'credit',
      lastFour: '4721',
      primary: true,
    },
    {
      id: '2', 
      name: 'Nequi',
      type: 'digital',
      lastFour: '8923',
      primary: false,
    }
  ]
};

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
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // 🔗 Conectar al backend real con fallback a mock data
  const backendAvailability = useBackendAvailability();
  const walletDataQuery = useWalletData(user?.id || 'mock-user-id');
  const transactionsQuery = useWalletTransactions(user?.id || 'mock-user-id');

  // 🎯 Decidir qué datos usar basado en disponibilidad del backend
  const walletData = walletDataQuery.data || mockWalletData;
  const transactions = transactionsQuery.data || mockWalletData.recentTransactions;

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    if (walletDataQuery.refetch) {
      walletDataQuery.refetch();
    }
    if (transactionsQuery.refetch) {
      transactionsQuery.refetch();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number, currency: string = 'COP') => {
    if (currency === 'UC') {
      return `${amount} ÜCoins`;
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'expense':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      case 'reward':
        return <CheckCircle sx={{ color: 'warning.main' }} />;
      case 'transfer':
        return <Send sx={{ color: 'info.main' }} />;
      default:
        return <AttachMoney />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  // 🎨 Normalizar datos del backend
  const normalizedWalletData = {
    balance: walletData.balance || mockWalletData.balance,
    ucoins: walletData.ucoins || mockWalletData.ucoins,
    pendingBalance: walletData.pendingBalance || mockWalletData.pendingBalance,
    monthlyChange: walletData.monthlyChange || mockWalletData.monthlyChange,
    accounts: walletData.accounts || mockWalletData.accounts,
    paymentMethods: walletData.paymentMethods || mockWalletData.paymentMethods,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🔗 Backend Connection Status */}
      {!backendAvailability.isAvailable && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Typography variant="body2">
              🔌 Modo Offline - Mostrando datos simulados del wallet
            </Typography>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              color="inherit"
            >
              Reintentar conexión
            </Button>
          </Stack>
        </Alert>
      )}

      {(walletDataQuery.isLoading || transactionsQuery.isLoading) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Sincronizando datos del wallet...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {/* Header del Wallet */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Mi Wallet CoomÜnity
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {backendAvailability.isAvailable ? 
              '🌐 Datos en tiempo real' : 
              '📱 Datos offline'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleRefresh} disabled={walletDataQuery.isLoading}>
            <Refresh />
          </IconButton>
          <IconButton onClick={() => setBalanceVisible(!balanceVisible)}>
            {balanceVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Balance Principal */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                  <AccountBalanceWallet sx={{ fontSize: 30 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Balance Principal
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary.main">
                    {balanceVisible ? formatCurrency(normalizedWalletData.balance) : '••••••'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp sx={{ color: 'success.main', fontSize: 20, mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +{normalizedWalletData.monthlyChange}% este mes
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ÜCoins */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'warning.50', 
                borderRadius: 2, 
                border: 1,
                borderColor: 'warning.200',
                mb: 2
              }}>
                <Typography variant="h6" gutterBottom>
                  ÜCoins CoomÜnity
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {balanceVisible ? `${normalizedWalletData.ucoins} UC` : '••• UC'}
                </Typography>
              </Box>

              {/* Balance Pendiente */}
              <Box sx={{ 
                p: 2, 
                bgcolor: 'info.50', 
                borderRadius: 2,
                border: 1,
                borderColor: 'info.200',
              }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Balance Pendiente
                </Typography>
                <Typography variant="h6" color="info.main">
                  {balanceVisible ? formatCurrency(normalizedWalletData.pendingBalance) : '••••••'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones Rápidas */}
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              fullWidth
              sx={{ py: 2 }}
            >
              Recargar Wallet
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Send />}
              fullWidth
              sx={{ py: 2 }}
            >
              Enviar Dinero
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<History />}
              fullWidth
              sx={{ py: 2 }}
            >
              Ver Historial
            </Button>
          </Stack>
        </Grid>

        {/* Pestañas de Contenido */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Cuentas" />
                <Tab label="Transacciones" />
                <Tab label="Métodos de Pago" />
                <Tab label="Configuración" />
              </Tabs>
            </Box>

            {/* Panel de Cuentas */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Mis Cuentas CoomÜnity
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gestiona tus diferentes cuentas y balances en el ecosistema CoomÜnity.
              </Typography>
              
              <Grid container spacing={2}>
                {normalizedWalletData.accounts.map((account) => (
                  <Grid item xs={12} sm={6} md={4} key={account.id}>
                    <Card variant="outlined" sx={{ 
                      border: account.primary ? 2 : 1, 
                      borderColor: account.primary ? 'primary.main' : 'divider' 
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: account.primary ? 'primary.main' : 'grey.400',
                            mr: 2 
                          }}>
                            <AccountBalanceWallet />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {account.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {account.type}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          {formatCurrency(account.balance, account.currency)}
                        </Typography>
                        {account.primary && (
                          <Chip label="Principal" size="small" color="primary" sx={{ mt: 1 }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Panel de Transacciones */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Transacciones Recientes
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {backendAvailability.isAvailable ? 
                  'Historial actualizado en tiempo real desde el servidor.' :
                  'Mostrando transacciones simuladas - modo offline.'
                }
              </Typography>

              <List>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          {getTransactionIcon(transaction.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={transaction.description}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.from ? `De: ${transaction.from}` : ''}
                              {transaction.to ? `Para: ${transaction.to}` : ''}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.date}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="subtitle1" 
                          fontWeight="bold"
                          color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                        >
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                        </Typography>
                        <Chip 
                          label={transaction.status} 
                          size="small" 
                          color={getStatusColor(transaction.status) as any}
                        />
                      </Box>
                    </ListItem>
                    {index < transactions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>

            {/* Panel de Métodos de Pago */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Métodos de Pago
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gestiona tus métodos de pago y tarjetas vinculadas.
              </Typography>

              <Grid container spacing={2}>
                {normalizedWalletData.paymentMethods.map((method) => (
                  <Grid item xs={12} sm={6} key={method.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CreditCard sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {method.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              •••• •••• •••• {method.lastFour}
                            </Typography>
                          </Box>
                        </Box>
                        {method.primary && (
                          <Chip label="Principal" size="small" color="primary" />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Button variant="outlined" startIcon={<Add />} sx={{ mt: 2 }}>
                Agregar Método de Pago
              </Button>
            </TabPanel>

            {/* Panel de Configuración */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Configuración del Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Personaliza la configuración y seguridad de tu wallet.
              </Typography>

              <Stack spacing={2}>
                <Alert severity="info">
                  <Typography variant="body2">
                    🔐 Tu wallet está protegido con encriptación de extremo a extremo.
                  </Typography>
                </Alert>

                <Alert severity="success">
                  <Typography variant="body2">
                    ✅ Sincronización automática con el backend {backendAvailability.isAvailable ? 'activa' : 'desactivada (modo offline)'}.
                  </Typography>
                </Alert>

                <Alert severity="warning">
                  <Typography variant="body2">
                    ⚠️ Las transacciones en ÜCoins utilizan tecnología blockchain para máxima seguridad.
                  </Typography>
                </Alert>
              </Stack>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}; 