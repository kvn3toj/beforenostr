import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Stack,
  Alert,
  LinearProgress,
  Fab,
  Zoom,
  Button,
  Chip,
} from '@mui/material';
import { 
  Refresh, 
  Add, 
  Send, 
  Settings, 
  Analytics,
  CreditCard,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useBackendAvailability } from '../hooks/useRealBackendData';
import {
  useWalletData,
  useWalletTransactions,
  useCreateTransaction,
  useExchangeCurrency,
  usePaymentMethods,
} from '../hooks/useWalletIntegration';
import { CreateTransactionModal } from '../components/modules/wallet/CreateTransactionModal';
import { WalletOverview } from '../components/modules/wallet/WalletOverview';
import { WalletActions } from '../components/modules/wallet/WalletActions';
import { TransactionHistory } from '../components/modules/wallet/TransactionHistory';
import { motion, AnimatePresence } from 'framer-motion';

// 🎯 Interfaces para TabPanel
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ pt: 3 }}>{children}</Box>
        </motion.div>
      )}
    </div>
  );
}

export const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [createTransactionModalOpen, setCreateTransactionModalOpen] =
    useState(false);

  // 🔗 Hooks mejorados para datos del wallet
  const backendAvailability = useBackendAvailability();
  const walletDataQuery = useWalletData();
  const transactionsQuery = useWalletTransactions();
  const paymentMethodsQuery = usePaymentMethods();
  const createTransactionMutation = useCreateTransaction();

  // 🔄 Función para refrescar datos
  const handleRefresh = () => {
    walletDataQuery.refetch();
    transactionsQuery.refetch();
    paymentMethodsQuery.refetch();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 🎯 Handlers para acciones del wallet
  const handleSendMoney = () => {
    setCreateTransactionModalOpen(true);
  };

  const handleReceiveMoney = () => {
    // TODO: Implementar modal para recibir dinero/generar QR
    console.log('🔗 Abriendo modal para recibir dinero');
  };

  const handleViewHistory = () => {
    setTabValue(1); // Cambiar a la pestaña de transacciones
  };

  const handleExchangeCoins = () => {
    // Se maneja desde WalletActions component
    console.log('💱 Intercambio de monedas iniciado');
  };

  const handleRequestPayment = () => {
    // TODO: Implementar solicitud de pago
    console.log('💰 Solicitando pago');
  };

  const handleTransactionClick = (transaction: any) => {
    // TODO: Implementar vista detallada de transacción
    console.log('📋 Ver detalles de transacción:', transaction.id);
  };

  const handleExportHistory = () => {
    // TODO: Implementar exportación de historial
    console.log('📥 Exportando historial de transacciones');
  };

  // 🎨 Preparar datos para componentes
  const walletBalance = {
    balance: walletDataQuery.data?.balance || 0,
    ucoins: walletDataQuery.data?.ucoins || 0,
    meritos: walletDataQuery.data?.meritos || 0,
    ondas: walletDataQuery.data?.ondas || 0,
  };

  const isLoading = walletDataQuery.isLoading || transactionsQuery.isLoading;
  const isRealTime = backendAvailability.isAvailable;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 🔗 Estado de conexión del backend */}
      {!isRealTime && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
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

      {/* 🔄 Indicador de carga global */}
      {isLoading && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🔄 Sincronizando datos del wallet...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {/* 📊 Overview principal del wallet */}
      <Box sx={{ mb: 4 }}>
        <WalletOverview
          walletData={
            walletDataQuery.data || {
              balance: 0,
              currency: 'COP',
              ucoins: 0,
              meritos: 0,
              ondas: 0,
              pendingBalance: 0,
              monthlyChange: 0,
              ayniLevel: 25,
              collaborationScore: 5.0,
              communityRank: '#1,247',
            }
          }
          balanceVisible={balanceVisible}
          onToggleVisibility={() => setBalanceVisible(!balanceVisible)}
          isLoading={isLoading}
          isRealTime={isRealTime}
        />
      </Box>

      {/* 🚀 Acciones rápidas del wallet */}
      <Box sx={{ mb: 4 }}>
        <WalletActions
          walletBalance={walletBalance}
          onSendMoney={handleSendMoney}
          onReceiveMoney={handleReceiveMoney}
          onViewHistory={handleViewHistory}
          onExchangeCoins={handleExchangeCoins}
          onRequestPayment={handleRequestPayment}
          isLoading={isLoading}
        />
      </Box>

      {/* 📋 Contenido con pestañas */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="📊 Resumen" />
            <Tab label="📝 Transacciones" />
            <Tab label="💳 Métodos de Pago" />
            <Tab label="⚙️ Configuración" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {/* Panel de Resumen */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📊 Resumen de Cuentas CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Gestiona tus diferentes cuentas y balances en el ecosistema
              CoomÜnity.
            </Typography>

            <Grid container spacing={3}>
              {walletDataQuery.data?.accounts?.map((account, index) => (
                <Grid item xs={12} sm={6} md={4} key={account.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        border: account.primary ? 2 : 1,
                        borderColor: account.primary
                          ? 'primary.main'
                          : 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {account.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary.main"
                        >
                          {account.currency === 'UC'
                            ? `${account.balance} ÜCoins`
                            : new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                              }).format(account.balance)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.type === 'checking'
                            ? 'Cuenta corriente'
                            : account.type === 'savings'
                              ? 'Cuenta de ahorros'
                              : 'Moneda digital'}
                        </Typography>
                        {account.primary && (
                          <Chip
                            label="Principal"
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Panel de Transacciones */}
          <TabPanel value={tabValue} index={1}>
            <TransactionHistory
              transactions={transactionsQuery.data || []}
              isLoading={transactionsQuery.isLoading}
              onTransactionClick={handleTransactionClick}
              onExportHistory={handleExportHistory}
            />
          </TabPanel>

          {/* Panel de Métodos de Pago */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              💳 Métodos de Pago
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Gestiona tus métodos de pago y tarjetas vinculadas a tu wallet
              CoomÜnity.
            </Typography>

            <Grid container spacing={2}>
              {paymentMethodsQuery.data?.map((method, index) => (
                <Grid item xs={12} sm={6} key={method.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <CreditCard sx={{ mr: 2, color: 'primary.main' }} />
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
                          <Chip
                            label="Principal"
                            size="small"
                            color="primary"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Button variant="outlined" startIcon={<Add />} sx={{ mt: 3 }}>
              Agregar Método de Pago
            </Button>
          </TabPanel>

          {/* Panel de Configuración */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ⚙️ Configuración del Wallet CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Personaliza la configuración y seguridad de tu wallet siguiendo
              los principios Ayni.
            </Typography>

            <Stack spacing={3}>
              <Alert severity="info" icon={<Settings />}>
                <Typography variant="body2" fontWeight="bold">
                  🔐 Seguridad del Wallet
                </Typography>
                <Typography variant="body2">
                  Tu wallet está protegido con encriptación de extremo a extremo
                  y autenticación multifactor.
                </Typography>
              </Alert>

              <Alert severity="success" icon={<Analytics />}>
                <Typography variant="body2" fontWeight="bold">
                  ✅ Sincronización en Tiempo Real
                </Typography>
                <Typography variant="body2">
                  Estado:{' '}
                  {isRealTime
                    ? 'Activa - Conectado al backend CoomÜnity'
                    : 'Modo offline - Datos locales simulados'}
                </Typography>
              </Alert>

              <Alert severity="warning">
                <Typography variant="body2" fontWeight="bold">
                  🌟 Filosofía Ayni
                </Typography>
                <Typography variant="body2">
                  Las transacciones en ÜCoins y Mëritos fortalecen el ecosistema
                  de reciprocidad. Cada intercambio contribuye al Bien Común de
                  la comunidad CoomÜnity.
                </Typography>
              </Alert>

              <Alert severity="info">
                <Typography variant="body2" fontWeight="bold">
                  🔗 Tecnología Blockchain
                </Typography>
                <Typography variant="body2">
                  Las transacciones en ÜCoins utilizan tecnología blockchain
                  para máxima seguridad y transparencia.
                </Typography>
              </Alert>
            </Stack>
          </TabPanel>
        </AnimatePresence>
      </Card>

      {/* 💳 Modal para crear nueva transacción */}
      <CreateTransactionModal
        open={createTransactionModalOpen}
        onClose={() => setCreateTransactionModalOpen(false)}
        walletBalance={walletBalance}
      />

      {/* 🚀 Botón flotante para acciones rápidas */}
      <Zoom in={!isLoading}>
        <Fab
          color="primary"
          aria-label="Nueva transacción"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={handleSendMoney}
        >
          <Send />
        </Fab>
      </Zoom>
    </Container>
  );
};
