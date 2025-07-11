/**
 * 💰 Revenue Sharing System - CoomÜnity Economia Sagrada
 * 
 * 🎯 INTENT: Automatizar distribución equitativa de ingresos siguiendo principios de economia sagrada
 * 🌟 VALUES: Bien Común (20% community), Reciprocidad (ongoing benefits), Transparencia (clear allocation)
 * ⚡ CONSTRAINTS: Real-time tracking, automated distribution, audit trail
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  MonetizationOn as UnitsIcon,
  TrendingUp as TrendingUpIcon,
  Group as CommunityIcon,
  Person as CreatorIcon,
  Business as PlatformIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  AccountBalance as BalanceIcon,
  EmojiEvents as RewardIcon,
  Sync as AutoIcon,
} from '@mui/icons-material';

// Types
interface RevenueTransaction {
  id: string;
  templateId: string;
  templateTitle: string;
  buyerId: string;
  buyerName: string;
  creatorId: string;
  creatorName: string;
  totalAmount: number;
  currency: 'units' | 'ondas' | 'meritos';
  distribution: {
    creator: number;
    community: number;
    platform: number;
  };
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  reciprocityBenefits: number;
  communityBonus: number;
}

interface RevenueStats {
  totalRevenue: number;
  creatorEarnings: number;
  communityFund: number;
  platformFee: number;
  transactionCount: number;
  averageTransaction: number;
  topEarningTemplate: string;
  reciprocityGenerated: number;
}

interface RevenueSharingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
  creatorId?: string;
}

const RevenueSharingSystem: React.FC<RevenueSharingSystemProps> = ({
  isOpen,
  onClose,
  templateId,
  creatorId
}) => {
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<RevenueTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockTransactions: RevenueTransaction[] = [
    {
      id: 'tx-001',
      templateId: 'template-ayni-circle',
      templateTitle: 'Círculo de Ayni - Reciprocidad Comunitaria',
      buyerId: 'user-123',
      buyerName: 'María González',
      creatorId: 'creator-amaru',
      creatorName: 'Amaru Condori',
      totalAmount: 500,
      currency: 'units',
      distribution: {
        creator: 350, // 70%
        community: 100, // 20%
        platform: 50 // 10%
      },
      timestamp: '2024-01-25T14:30:00Z',
      status: 'completed',
      reciprocityBenefits: 25,
      communityBonus: 15
    },
    {
      id: 'tx-002',
      templateId: 'template-minga-learning',
      templateTitle: 'Minga Digital - Aprendizaje Colaborativo',
      buyerId: 'user-456',
      buyerName: 'Carlos Mendoza',
      creatorId: 'creator-inti',
      creatorName: 'Inti Raymi',
      totalAmount: 300,
      currency: 'units',
      distribution: {
        creator: 210,
        community: 60,
        platform: 30
      },
      timestamp: '2024-01-24T11:15:00Z',
      status: 'completed',
      reciprocityBenefits: 18,
      communityBonus: 12
    },
    {
      id: 'tx-003',
      templateId: 'template-wellness-circle',
      templateTitle: 'Círculo de Bienestar Integral',
      buyerId: 'user-789',
      buyerName: 'Ana Quispe',
      creatorId: 'creator-pachamama',
      creatorName: 'Pachamama Wisdom',
      totalAmount: 750,
      currency: 'units',
      distribution: {
        creator: 525,
        community: 150,
        platform: 75
      },
      timestamp: '2024-01-23T16:45:00Z',
      status: 'completed',
      reciprocityBenefits: 38,
      communityBonus: 23
    }
  ];

  const mockStats: RevenueStats = {
    totalRevenue: 1550,
    creatorEarnings: 1085,
    communityFund: 310,
    platformFee: 155,
    transactionCount: 3,
    averageTransaction: 516.67,
    topEarningTemplate: 'Círculo de Bienestar Integral',
    reciprocityGenerated: 81
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      loadRevenueData();
    }
  }, [isOpen, templateId, creatorId]);

  // Handlers
  const loadRevenueData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredTransactions = mockTransactions;
      
      if (templateId) {
        filteredTransactions = mockTransactions.filter(tx => tx.templateId === templateId);
      }
      
      if (creatorId) {
        filteredTransactions = mockTransactions.filter(tx => tx.creatorId === creatorId);
      }
      
      setTransactions(filteredTransactions);
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencyIcon = (currency: 'units' | 'ondas' | 'meritos') => {
    switch (currency) {
      case 'units': return <UnitsIcon sx={{ color: '#5C2483' }} />;
      case 'ondas': return <TrendingUpIcon sx={{ color: '#3E8638' }} />;
      case 'meritos': return <RewardIcon sx={{ color: '#FBBA00' }} />;
      default: return <UnitsIcon />;
    }
  };

  const formatCurrency = (amount: number, currency: 'units' | 'ondas' | 'meritos') => {
    const symbols = { units: 'Ü', ondas: 'Ö', meritos: 'M' };
    return `${symbols[currency]} ${amount.toLocaleString()}`;
  };

  const renderTabPanel = (value: number, index: number, children: React.ReactNode) => (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
      {value === index && children}
    </Box>
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          borderRadius: 2,
          fontFamily: 'Inter, sans-serif'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #5C2483 0%, #3E8638 100%)',
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BalanceIcon fontSize="large" />
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Sistema de Revenue Sharing
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'Kollektif, sans-serif' }}>
              💰 Economia Sagrada • Distribución transparente y equitativa
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Stats Overview */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F5F0FF' }}>
                <UnitsIcon sx={{ fontSize: 40, color: '#5C2483', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5C2483' }}>
                  Ü {stats.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue Total
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F0F8F5' }}>
                <CreatorIcon sx={{ fontSize: 40, color: '#3E8638', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                  Ü {stats.creatorEarnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creadores (70%)
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#F0F8F5' }}>
                <CommunityIcon sx={{ fontSize: 40, color: '#3E8638', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                  Ü {stats.communityFund.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fondo Comunitario (20%)
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2, borderRadius: 2, bgcolor: '#FFF8E7' }}>
                <PlatformIcon sx={{ fontSize: 40, color: '#FBBA00', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FBBA00' }}>
                  Ü {stats.platformFee.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plataforma (10%)
                </Typography>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<TimelineIcon />} label="Transacciones" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<AutoIcon />} label="Automatización" />
        </Tabs>

        {/* Transactions Tab */}
        {renderTabPanel(activeTab, 0, (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Template</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Creador</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Distribución</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reciprocidad</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {transaction.templateTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {transaction.templateId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">
                          {transaction.buyerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">
                          {transaction.creatorName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCurrencyIcon(transaction.currency)}
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(transaction.totalAmount, transaction.currency)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip 
                          size="small" 
                          label={`Creador: ${formatCurrency(transaction.distribution.creator, transaction.currency)}`} 
                          color="success"
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label={`Com: ${formatCurrency(transaction.distribution.community, transaction.currency)}`} 
                          color="primary"
                          variant="outlined"
                        />
                        <Chip 
                          size="small" 
                          label={`Plat: ${formatCurrency(transaction.distribution.platform, transaction.currency)}`} 
                          color="default"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        +{transaction.reciprocityBenefits} Ünits
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Beneficio futuro
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={transaction.status === 'completed' ? 'Completado' : 'Pendiente'} 
                        color={transaction.status === 'completed' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ))}

        {/* Analytics Tab */}
        {renderTabPanel(activeTab, 1, (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  📊 Métricas de Revenue Sharing
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Transacciones promedio</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Ü {stats?.averageTransaction.toFixed(0)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Template más vendido</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {stats?.topEarningTemplate}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Reciprocidad generada</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3E8638' }}>
                    +{stats?.reciprocityGenerated} Ünits
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  🌟 Impacto Filosófico
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* Philosophy Impact Bars */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Bien Común (Fondo Comunitario)</Typography>
                    <Typography variant="body2" fontWeight="medium">20%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={20} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Reciprocidad (Beneficios Futuros)</Typography>
                    <Typography variant="body2" fontWeight="medium">15%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={15} sx={{ height: 8, borderRadius: 4 }} color="success" />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Transparencia (Distribución Clara)</Typography>
                    <Typography variant="body2" fontWeight="medium">100%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4 }} color="primary" />
                </Box>
              </Card>
            </Grid>
          </Grid>
        ))}

        {/* Automation Tab */}
        {renderTabPanel(activeTab, 2, (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="medium">
                  🤖 Sistema de Automatización Activo
                </Typography>
                <Typography variant="body2">
                  La distribución de revenue se realiza automáticamente al completarse cada transacción, 
                  siguiendo los principios de Economia Sagrada CoomÜnity.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F0F8F5' }}>
                <AutoIcon sx={{ fontSize: 48, color: '#3E8638', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Distribución Inmediata
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Los Ünits se distribuyen automáticamente al creador (70%), 
                  fondo comunitario (20%) y plataforma (10%) en tiempo real.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F5F0FF' }}>
                <RewardIcon sx={{ fontSize: 48, color: '#5C2483', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Beneficios de Reciprocidad
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Los templates generan Ünits adicionales cuando se usan en 
                  proyectos colaborativos, beneficiando al creador original.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#FFF8E7' }}>
                <AnalyticsIcon sx={{ fontSize: 48, color: '#FBBA00', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                  Tracking Transparente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Todas las transacciones son auditables y transparentes, 
                  permitiendo el seguimiento completo del flujo de valor.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        ))}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Exportar Reporte
        </Button>
      </DialogActions>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Detalles de Transacción</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTransaction.templateTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Transaction ID: {selectedTransaction.id}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                  <Typography variant="h5">
                    {formatCurrency(selectedTransaction.totalAmount, selectedTransaction.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Fecha</Typography>
                  <Typography variant="body1">
                    {new Date(selectedTransaction.timestamp).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Creador recibe</Typography>
                  <Typography variant="body1" color="success.main">
                    {formatCurrency(selectedTransaction.distribution.creator, selectedTransaction.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Beneficio futuro</Typography>
                  <Typography variant="body1" color="primary.main">
                    +{selectedTransaction.reciprocityBenefits} Ünits
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTransaction(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default RevenueSharingSystem;