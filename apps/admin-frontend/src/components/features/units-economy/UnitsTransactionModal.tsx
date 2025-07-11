/**
 * 💎 Ünits Transaction Modal - CoomÜnity Template Economy
 * 
 * 🎯 INTENT: Gestionar transacciones de Ünits para templates siguiendo principios de economia sagrada
 * 🌟 VALUES: Reciprocidad (revenue sharing), Bien Común (community bonus), Transparencia (costos claros)
 * ⚡ CONSTRAINTS: Patrones NEWVISUAL, Material UI v7, integración con billetera
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  MonetizationOn as UnitsIcon,
  Close as CloseIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  Group as CommunityIcon,
  Favorite as ReciprocityIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Stars as PremiumIcon,
  Share as ShareIcon,
  EmojiEvents as MeritIcon,
} from '@mui/icons-material';

// Types
import { ChallengeTemplate } from '../../../types/template-marketplace.types';

interface UnitsTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ChallengeTemplate | null;
  onTransactionComplete: (transactionId: string, template: ChallengeTemplate) => void;
  userWallet: {
    units: number;
    ondas: number;
    meritos: number;
  };
}

interface TransactionStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

const UnitsTransactionModal: React.FC<UnitsTransactionModalProps> = ({
  isOpen,
  onClose,
  template,
  onTransactionComplete,
  userWallet
}) => {
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'units' | 'ondas' | 'meritos'>('units');
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Transaction steps following NEWVISUAL patterns
  const steps: TransactionStep[] = [
    {
      id: 'review',
      label: 'Revisar Template',
      description: 'Confirma los detalles del template y el costo',
      completed: false
    },
    {
      id: 'payment',
      label: 'Método de Pago',
      description: 'Selecciona tu moneda CoomÜnity preferida',
      completed: false
    },
    {
      id: 'philosophy',
      label: 'Impacto Filosófico',
      description: 'Comprende cómo tu compra beneficia la comunidad',
      completed: false
    },
    {
      id: 'confirm',
      label: 'Confirmar Transacción',
      description: 'Finaliza la compra y obtén acceso al template',
      completed: false
    }
  ];

  // Effects
  useEffect(() => {
    if (isOpen && template) {
      setActiveStep(0);
      setIsProcessing(false);
      setTransactionId(null);
      setAgreesToTerms(false);
    }
  }, [isOpen, template]);

  // Handlers
  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const processTransaction = async () => {
    if (!template) return;

    setIsProcessing(true);
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransactionId = `tx_${Date.now()}`;
      setTransactionId(newTransactionId);
      
      // Complete transaction
      onTransactionComplete(newTransactionId, template);
      
      // Move to success step
      handleNext();
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getWalletBalance = (currency: 'units' | 'ondas' | 'meritos') => {
    return userWallet[currency];
  };

  const getWalletIcon = (currency: 'units' | 'ondas' | 'meritos') => {
    switch (currency) {
      case 'units': return <UnitsIcon sx={{ color: '#5C2483' }} />;
      case 'ondas': return <TrendingUpIcon sx={{ color: '#3E8638' }} />;
      case 'meritos': return <MeritIcon sx={{ color: '#FBBA00' }} />;
      default: return <UnitsIcon />;
    }
  };

  const getCurrencyName = (currency: 'units' | 'ondas' | 'meritos') => {
    switch (currency) {
      case 'units': return 'Ünits';
      case 'ondas': return 'Öndas';
      case 'meritos': return 'Méritos';
      default: return 'Ünits';
    }
  };

  const canAfford = template ? getWalletBalance(paymentMethod) >= (template.pricing.price || 0) : false;

  if (!template) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          fontFamily: 'Inter, sans-serif'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          background: 'linear-gradient(135deg, #5C2483 0%, #3E8638 100%)',
          color: 'white',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600
        }}
      >
        <UnitsIcon fontSize="large" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Economía Ünits - Template Premium
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontFamily: 'Kollektif, sans-serif' }}>
            🌟 Transacción que beneficia al Bien Común
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: Review Template */}
          <Step>
            <StepLabel>
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {steps[0].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Card sx={{ mb: 2, borderRadius: 2 }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, mb: 1 }}>
                        {template.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'Kollektif, sans-serif' }}>
                        {template.description}
                      </Typography>
                      
                      {/* Creator Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar src={template.creator.avatar} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {template.creator.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Méritos: {template.creator.reputation} • Contribución: {template.creator.contributionScore}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {template.tags.slice(0, 4).map((tag, index) => (
                          <Chip key={index} size="small" label={tag} variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8F9FA' }}>
                        <Typography variant="h4" sx={{ color: '#5C2483', fontWeight: 'bold', mb: 1 }}>
                          {template.pricing.isFree ? 'Gratuito' : `${template.pricing.price} Ünits`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {template.pricing.isFree ? 'Template comunitario' : 'Template premium'}
                        </Typography>
                        
                        {/* Philosophy Score */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" fontWeight="medium">
                            Alineación CoomÜnity: {template.philosophyAlignment.overallAlignment}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={template.philosophyAlignment.overallAlignment} 
                            sx={{ height: 8, borderRadius: 4, mt: 1 }}
                          />
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span>⭐ {template.analytics.rating.toFixed(1)}</span>
                          <span>🤝 {template.community.collaborationIndex}%</span>
                          <span>📥 {template.analytics.uses}</span>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleNext}>
                  Continuar
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Payment Method */}
          <Step>
            <StepLabel>
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {steps[1].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'Kollektif, sans-serif' }}>
                Selecciona tu moneda CoomÜnity preferida para esta transacción
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                {(['units', 'ondas', 'meritos'] as const).map((currency) => (
                  <Grid item xs={12} md={4} key={currency}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: paymentMethod === currency ? '2px solid #5C2483' : '1px solid #E0E0E0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => setPaymentMethod(currency)}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 3 }}>
                        {getWalletIcon(currency)}
                        <Typography variant="h6" sx={{ mt: 1, fontFamily: 'Montserrat, sans-serif' }}>
                          {getCurrencyName(currency)}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: canAfford ? '#3E8638' : '#f44336' }}>
                          {getWalletBalance(currency).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Balance disponible
                        </Typography>
                        {paymentMethod === currency && (
                          <CheckIcon sx={{ color: '#3E8638', mt: 1 }} />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {!canAfford && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    Balance insuficiente en {getCurrencyName(paymentMethod)}. 
                    Necesitas {template.pricing.price} pero tienes {getWalletBalance(paymentMethod)}.
                  </Typography>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBack}>Atrás</Button>
                <Button variant="contained" onClick={handleNext} disabled={!canAfford}>
                  Continuar
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 3: Philosophy Impact */}
          <Step>
            <StepLabel>
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {steps[2].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'Kollektif, sans-serif' }}>
                Tu compra genera impacto positivo en toda la comunidad CoomÜnity
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F0F8F5' }}>
                    <ShareIcon sx={{ fontSize: 40, color: '#3E8638', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      70% al Creador
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.creator.name} recibe{' '}
                      {Math.round(((template.pricing.price || 0) * 0.7))} {getCurrencyName(paymentMethod)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#F5F0FF' }}>
                    <CommunityIcon sx={{ fontSize: 40, color: '#5C2483', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      20% Comunidad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(((template.pricing.price || 0) * 0.2))} {getCurrencyName(paymentMethod)} al fondo comunitario
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: '#FFF8E7' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: '#FBBA00', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      10% Plataforma
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(((template.pricing.price || 0) * 0.1))} {getCurrencyName(paymentMethod)} para infraestructura
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Reciprocity Benefits */}
              <Card sx={{ mb: 3, borderRadius: 2, bgcolor: '#F0F8F5', border: '1px solid #3E8638' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ReciprocityIcon sx={{ color: '#3E8638' }} />
                    <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                      Beneficios de Reciprocidad
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Al usar este template en proyectos colaborativos, generarás Ünits adicionales que se compartirán con el creador.
                  </Typography>
                  <Chip 
                    label={`+${template.pricing.reciprocityBenefit} Ünits por uso colaborativo`} 
                    color="success" 
                    size="small"
                  />
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBack}>Atrás</Button>
                <Button variant="contained" onClick={handleNext}>
                  Entiendo el Impacto
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 4: Confirm Transaction */}
          <Step>
            <StepLabel>
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                {steps[3].label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Resumen de tu transacción:</strong>
                  <br />
                  • Template: {template.title}
                  <br />
                  • Costo: {template.pricing.price} {getCurrencyName(paymentMethod)}
                  <br />
                  • Tu balance después: {getWalletBalance(paymentMethod) - (template.pricing.price || 0)} {getCurrencyName(paymentMethod)}
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <input 
                  type="checkbox" 
                  checked={agreesToTerms}
                  onChange={(e) => setAgreesToTerms(e.target.checked)}
                />
                <Typography variant="body2">
                  Acepto los términos de la Economía Sagrada CoomÜnity y entiendo que esta transacción 
                  beneficia al Bien Común de la comunidad.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleBack}>Atrás</Button>
                <Button 
                  variant="contained" 
                  onClick={processTransaction}
                  disabled={!agreesToTerms || isProcessing}
                  sx={{
                    background: 'linear-gradient(45deg, #5C2483 30%, #3E8638 90%)',
                    fontWeight: 600
                  }}
                >
                  {isProcessing ? 'Procesando...' : `Pagar ${template.pricing.price} ${getCurrencyName(paymentMethod)}`}
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 5: Success */}
          <Step>
            <StepLabel>
              <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                ¡Transacción Completada!
              </Typography>
            </StepLabel>
            <StepContent>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  🎉 ¡Felicitaciones! Has adquirido el template exitosamente.
                </Typography>
                <Typography variant="body2">
                  Transaction ID: {transactionId}
                  <br />
                  El template ya está disponible en tu biblioteca y puedes usarlo inmediatamente.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={onClose}>
                  Comenzar a Usar Template
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default UnitsTransactionModal;