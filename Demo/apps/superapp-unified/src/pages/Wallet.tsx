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
import { UNIFIED_COLORS } from '../theme/colors';
import { alpha } from '@mui/material/styles';

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

const Wallet: React.FC = () => {
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
    <Container maxWidth="lg" sx={{
      py: 3,
      backgroundColor: UNIFIED_COLORS.brand.white,
      minHeight: '100vh'
    }}>
      {/* 🔗 Estado de conexión del backend */}
      {!isRealTime && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: alpha(UNIFIED_COLORS.semantic.warning, 0.1),
            borderColor: UNIFIED_COLORS.semantic.warning,
            color: UNIFIED_COLORS.themes.minimalist.text.primary
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Typography variant="body2">
              🔌 Modo Offline - Mostrando datos simulados del ecosistema de abundancia
            </Typography>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              color="inherit"
            >
              Reconectar con el cosmos
            </Button>
          </Stack>
        </Alert>
      )}

      {/* 🔄 Indicador de carga global */}
      {isLoading && (
        <Card sx={{
          mb: 3,
          backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
          borderColor: UNIFIED_COLORS.themes.minimalist.divider
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.primary
            }}>
              🔄 Sincronizando energías del wallet...
            </Typography>
            <LinearProgress sx={{
              backgroundColor: UNIFIED_COLORS.themes.minimalist.divider,
              '& .MuiLinearProgress-bar': {
                backgroundColor: UNIFIED_COLORS.modules.wallet
              }
            }} />
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
              reciprocidadLevel: 25,
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
      <Card sx={{
        backgroundColor: UNIFIED_COLORS.brand.white,
        borderColor: UNIFIED_COLORS.themes.minimalist.divider
      }}>
        <Box sx={{ borderBottom: 1, borderColor: UNIFIED_COLORS.themes.minimalist.divider }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: UNIFIED_COLORS.modules.wallet,
              },
              '& .Mui-selected': {
                color: UNIFIED_COLORS.modules.wallet
              }
            }}
          >
            <Tab label="📊 Visión Integral" />
            <Tab label="📝 Flujos de Abundancia" />
            <Tab label="💳 Canales de Intercambio" />
            <Tab label="⚙️ Configuración Sagrada" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {/* Panel de Resumen */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.primary
            }}>
              📊 Ecosistema de Abundancia CoomÜnity
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.secondary
            }}>
              Gestiona tus diferentes flujos energéticos y balances en el ecosistema
              de reciprocidad consciente.
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
                          ? UNIFIED_COLORS.modules.wallet
                          : UNIFIED_COLORS.themes.minimalist.divider,
                        transition: 'all 0.2s ease',
                        backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
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
                          sx={{ color: UNIFIED_COLORS.themes.minimalist.text.primary }}
                        >
                          {account.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ color: UNIFIED_COLORS.modules.wallet }}
                        >
                          {account.currency === 'UC'
                            ? `${account.balance} ÜCoins`
                            : new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                              }).format(account.balance)}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: UNIFIED_COLORS.themes.minimalist.text.secondary
                        }}>
                          {account.type === 'checking'
                            ? 'Flujo de intercambio'
                            : account.type === 'savings'
                              ? 'Reserva de abundancia'
                              : 'Moneda del corazón'}
                        </Typography>
                        {account.primary && (
                          <Chip
                            label="Principal"
                            size="small"
                            sx={{
                              mt: 1,
                              backgroundColor: UNIFIED_COLORS.modules.wallet,
                              color: UNIFIED_COLORS.brand.white
                            }}
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
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.primary
            }}>
              💳 Canales de Intercambio Consciente
            </Typography>
            <Typography variant="body2" paragraph sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.secondary
            }}>
              Gestiona tus canales de intercambio y conexiones financieras alineadas
              con la filosofía de abundancia compartida.
            </Typography>

            <Grid container spacing={2}>
              {paymentMethodsQuery.data?.map((method, index) => (
                <Grid item xs={12} sm={6} md={4} key={method.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: UNIFIED_COLORS.themes.minimalist.surface,
                        borderColor: UNIFIED_COLORS.themes.minimalist.divider,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CreditCard sx={{
                          color: UNIFIED_COLORS.modules.wallet,
                          fontSize: 32
                        }} />
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: UNIFIED_COLORS.themes.minimalist.text.primary }}
                          >
                            {method.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: UNIFIED_COLORS.themes.minimalist.text.secondary }}
                          >
                            ****{method.lastFour}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Panel de Configuración */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.primary
            }}>
              ⚙️ Configuración Sagrada del Wallet
            </Typography>
            <Typography variant="body2" paragraph sx={{
              color: UNIFIED_COLORS.themes.minimalist.text.secondary
            }}>
              Personaliza la configuración y seguridad de tu ecosistema financiero
              siguiendo los principios de Reciprocidad y Bien Común.
            </Typography>

            <Stack spacing={3}>
              <Alert
                severity="info"
                icon={<Settings />}
                sx={{
                  backgroundColor: alpha(UNIFIED_COLORS.semantic.info, 0.1),
                  borderColor: UNIFIED_COLORS.semantic.info
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  🔐 Protección Energética del Wallet
                </Typography>
                <Typography variant="body2">
                  Tu ecosistema está protegido con encriptación cósmica
                  y autenticación multidimensional.
                </Typography>
              </Alert>

              <Alert
                severity="success"
                icon={<Analytics />}
                sx={{
                  backgroundColor: alpha(UNIFIED_COLORS.semantic.success, 0.1),
                  borderColor: UNIFIED_COLORS.semantic.success
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  ✅ Sincronización en Tiempo Real
                </Typography>
                <Typography variant="body2">
                  Estado:{' '}
                  {isRealTime
                    ? 'Activa - Conectado al ecosistema CoomÜnity'
                    : 'Modo contemplativo - Datos locales temporales'}
                </Typography>
              </Alert>

              <Alert
                severity="warning"
                sx={{
                  backgroundColor: alpha(UNIFIED_COLORS.semantic.warning, 0.1),
                  borderColor: UNIFIED_COLORS.semantic.warning
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  🌟 Filosofía de Abundancia Consciente
                </Typography>
                <Typography variant="body2">
                  Las transacciones en ÜCoins y Mëritos fortalecen el tejido
                  de reciprocidad. Cada intercambio contribuye al Bien Común de
                  la comunidad consciente.
                </Typography>
              </Alert>
            </Stack>
          </TabPanel>
        </AnimatePresence>
      </Card>

      {/* Modal para crear transacciones */}
      <CreateTransactionModal
        open={createTransactionModalOpen}
        onClose={() => setCreateTransactionModalOpen(false)}
        walletBalance={walletBalance}
        onTransactionCreated={() => {
          setCreateTransactionModalOpen(false);
          refetchChallenges();
          refetchUserChallenges();
        }}
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

export default Wallet;
