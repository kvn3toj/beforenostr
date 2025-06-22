import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Badge,
  Stack,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material'
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  EmojiEvents as TrophyIcon,
  AccountBalance as WalletIcon,
  TrendingUp as GrowthIcon,
  Group as CommunityIcon,
  School as LearningIcon,
  Store as MarketplaceIcon,
  Psychology as AIIcon,
  SupportAgent as SupportIcon,
  Security as SecurityIcon,
  CloudUpload as CloudIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  Rocket as RocketIcon,
  EmojiEvents as CrownIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as MagicIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { triggerReward, triggerHapticFeedback } from '../lib/gameFeelSystem'

// Types
interface SubscriptionTier {
  id: string
  name: string
  price: {
    monthly: number
    yearly: number
    lukas?: number
  }
  discount?: number
  description: string
  icon: React.ReactNode
  color: string
  popular?: boolean
  exclusive?: boolean
  features: SubscriptionFeature[]
  limits: SubscriptionLimits
  rewards: SubscriptionRewards
}

interface SubscriptionFeature {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  included: boolean
  highlighted?: boolean
}

interface SubscriptionLimits {
  dailyMeritos: number
  monthlyLukas: number
  marketplaceListings: number
  videoUploads: number
  groupsCreated: number
  aiQuestions: number
  prioritySupport: boolean
  advancedAnalytics: boolean
}

interface SubscriptionRewards {
  onboardingBonus: {
    meritos: number
    lukas: number
  }
  monthlyBonus: {
    meritos: number
    lukas: number
  }
  loyaltyMultiplier: number
  exclusiveBadges: string[]
}

interface UserSubscription {
  currentTier: string
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'TRIAL'
  expiresAt: Date
  autoRenew: boolean
  paymentMethod: string
  nextBillingDate: Date
  trialDaysLeft?: number
}

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [showPaymentFlow, setShowPaymentFlow] = useState(false)
  const [paymentStep, setPaymentStep] = useState(0)

  const queryClient = useQueryClient()

  // Subscription tiers
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'explorer',
      name: 'Explorador',
      price: { monthly: 0, yearly: 0, lukas: 0 },
      description: 'Perfecto para comenzar tu aventura en CoomÜnity',
      icon: <RocketIcon sx={{ fontSize: 40 }} />,
      color: '#10B981',
      features: [
        { id: '1', name: 'Acceso a ÜPlay básico', description: 'Videos educativos limitados', icon: <LearningIcon />, included: true },
        { id: '2', name: 'Marketplace básico', description: 'Hasta 3 publicaciones activas', icon: <MarketplaceIcon />, included: true },
        { id: '3', name: 'Comunidad social', description: 'Participación en grupos públicos', icon: <CommunityIcon />, included: true },
        { id: '4', name: 'Méritos básicos', description: 'Hasta 50 méritos diarios', icon: <TrophyIcon />, included: true },
        { id: '5', name: 'IA Premium', description: 'Análisis avanzado de contenido', icon: <AIIcon />, included: false },
        { id: '6', name: 'Soporte prioritario', description: 'Respuesta en 24h', icon: <SupportIcon />, included: false },
      ],
      limits: {
        dailyMeritos: 50,
        monthlyLukas: 100,
        marketplaceListings: 3,
        videoUploads: 5,
        groupsCreated: 1,
        aiQuestions: 10,
        prioritySupport: false,
        advancedAnalytics: false
      },
      rewards: {
        onboardingBonus: { meritos: 25, lukas: 10 },
        monthlyBonus: { meritos: 0, lukas: 0 },
        loyaltyMultiplier: 1.0,
        exclusiveBadges: ['🚀']
      }
    },
    {
      id: 'emprendedor',
      name: 'Emprendedor Confiable',
      price: { monthly: 19, yearly: 190, lukas: 400 },
      discount: 20,
      description: 'Para emprendedores que buscan maximizar su impacto',
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: '#F59E0B',
      popular: true,
      features: [
        { id: '1', name: 'ÜPlay ilimitado', description: 'Acceso completo a todo el contenido', icon: <LearningIcon />, included: true, highlighted: true },
        { id: '2', name: 'Marketplace Pro', description: 'Hasta 15 publicaciones activas', icon: <MarketplaceIcon />, included: true },
        { id: '3', name: 'Grupos privados', description: 'Crea y gestiona comunidades', icon: <CommunityIcon />, included: true },
        { id: '4', name: 'Méritos acelerados', description: 'Hasta 150 méritos diarios', icon: <TrophyIcon />, included: true },
        { id: '5', name: 'IA Premium', description: 'Preguntas ilimitadas + análisis', icon: <AIIcon />, included: true, highlighted: true },
        { id: '6', name: 'Soporte prioritario', description: 'Respuesta en 4h', icon: <SupportIcon />, included: true },
        { id: '7', name: 'Analíticas avanzadas', description: 'Dashboard completo de métricas', icon: <AnalyticsIcon />, included: true },
        { id: '8', name: 'Badge verificado', description: 'Símbolo de confianza', icon: <VerifiedIcon />, included: true },
      ],
      limits: {
        dailyMeritos: 150,
        monthlyLukas: 500,
        marketplaceListings: 15,
        videoUploads: 25,
        groupsCreated: 5,
        aiQuestions: -1, // unlimited
        prioritySupport: true,
        advancedAnalytics: true
      },
      rewards: {
        onboardingBonus: { meritos: 100, lukas: 50 },
        monthlyBonus: { meritos: 200, lukas: 100 },
        loyaltyMultiplier: 1.5,
        exclusiveBadges: ['⭐', '🏆', '✨']
      }
    },
    {
      id: 'guardian',
      name: 'Guardián del Bien Común',
      price: { monthly: 49, yearly: 490, lukas: 1000 },
      discount: 20,
      description: 'Para líderes que transforman comunidades enteras',
      icon: <DiamondIcon sx={{ fontSize: 40 }} />,
      color: '#8B5CF6',
      exclusive: true,
      features: [
        { id: '1', name: 'Todo de Emprendedor', description: 'Todas las funciones anteriores', icon: <StarIcon />, included: true },
        { id: '2', name: 'Marketplace Enterprise', description: 'Publicaciones ilimitadas', icon: <MarketplaceIcon />, included: true, highlighted: true },
        { id: '3', name: 'IA Generativa', description: 'Crea contenido automáticamente', icon: <MagicIcon />, included: true, highlighted: true },
        { id: '4', name: 'Méritos empresariales', description: 'Hasta 500 méritos diarios', icon: <FireIcon />, included: true },
        { id: '5', name: 'Soporte VIP', description: 'Respuesta inmediata + manager dedicado', icon: <CrownIcon />, included: true, highlighted: true },
        { id: '6', name: 'White-label options', description: 'Personaliza tu experiencia', icon: <SecurityIcon />, included: true },
        { id: '7', name: 'Early access', description: 'Nuevas funciones antes que nadie', icon: <RocketIcon />, included: true },
        { id: '8', name: 'Revenue sharing', description: 'Gana por referir usuarios premium', icon: <WalletIcon />, included: true, highlighted: true },
      ],
      limits: {
        dailyMeritos: 500,
        monthlyLukas: 2000,
        marketplaceListings: -1, // unlimited
        videoUploads: -1, // unlimited
        groupsCreated: -1, // unlimited
        aiQuestions: -1, // unlimited
        prioritySupport: true,
        advancedAnalytics: true
      },
      rewards: {
        onboardingBonus: { meritos: 500, lukas: 250 },
        monthlyBonus: { meritos: 1000, lukas: 500 },
        loyaltyMultiplier: 2.0,
        exclusiveBadges: ['💎', '👑', '🌟', '🔥']
      }
    }
  ]

  // Current user subscription
  const { data: userSubscription } = useQuery<UserSubscription>({
    queryKey: ['user-subscription'],
    queryFn: async () => ({
      currentTier: 'explorer',
      status: 'TRIAL',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      autoRenew: false,
      paymentMethod: 'none',
      nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trialDaysLeft: 7
    })
  })

  // Upgrade mutation
  const upgradeMutation = useMutation({
    mutationFn: async ({ tierId, billingCycle }: { tierId: string, billingCycle: 'monthly' | 'yearly' }) => {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, tierId, billingCycle }
    },
    onSuccess: (data) => {
      triggerReward('ACHIEVEMENT', 0)
      triggerHapticFeedback('success')
      toast.success('¡Upgrade exitoso!', {
        description: `Ahora eres ${selectedTier?.name}`,
        duration: 5000,
      })
      setShowUpgradeDialog(false)
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] })
    }
  })

  const handleUpgrade = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    setShowUpgradeDialog(true)
    triggerHapticFeedback('light')
  }

  const handlePayment = () => {
    if (!selectedTier) return

    upgradeMutation.mutate({
      tierId: selectedTier.id,
      billingCycle
    })
  }

  const getSavings = (tier: SubscriptionTier) => {
    if (tier.price.monthly === 0) return 0
    const yearlyTotal = tier.price.yearly
    const monthlyTotal = tier.price.monthly * 12
    return monthlyTotal - yearlyTotal
  }

  const currentTier = subscriptionTiers.find(t => t.id === userSubscription?.currentTier)

  const paymentSteps = [
    'Confirmar Plan',
    'Método de Pago',
    'Procesando',
    'Completado'
  ]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: '#CDAB5A' }}>
          💫 Planes de Subscripción
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Elige el plan perfecto para maximizar tu impacto en el Bien Común
        </Typography>

        {/* Current Status */}
        {userSubscription && (
          <Alert
            severity={userSubscription.status === 'TRIAL' ? 'info' : 'success'}
            sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: currentTier?.color }}>
                {currentTier?.icon}
              </Avatar>
              <Typography variant="body2">
                {userSubscription.status === 'TRIAL'
                  ? `Prueba gratuita: ${userSubscription.trialDaysLeft} días restantes`
                  : `Plan actual: ${currentTier?.name}`
                }
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Billing Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography color={billingCycle === 'monthly' ? 'primary' : 'text.secondary'}>
            Mensual
          </Typography>
          <Switch
            checked={billingCycle === 'yearly'}
            onChange={(e) => setBillingCycle(e.target.checked ? 'yearly' : 'monthly')}
            color="primary"
          />
          <Typography color={billingCycle === 'yearly' ? 'primary' : 'text.secondary'}>
            Anual
          </Typography>
          {billingCycle === 'yearly' && (
            <Chip label="Ahorra 20%" size="small" color="success" />
          )}
        </Box>
      </Box>

      {/* Subscription Tiers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {subscriptionTiers.map((tier) => (
          <Grid item xs={12} md={4} key={tier.id}>
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  border: tier.popular ? `3px solid ${tier.color}` : `1px solid`,
                  borderColor: tier.popular ? tier.color : 'divider',
                  boxShadow: tier.popular ? `0 8px 32px ${tier.color}30` : 1,
                  background: tier.exclusive ? `linear-gradient(135deg, ${tier.color}10, white)` : 'white'
                }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <Chip
                    label="🔥 Más Popular"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: tier.color,
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  />
                )}

                {/* Exclusive Badge */}
                {tier.exclusive && (
                  <Chip
                    label="👑 Exclusivo"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: tier.color,
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  />
                )}

                <CardContent sx={{ textAlign: 'center', pb: 1 }}>
                  {/* Icon */}
                  <Box sx={{ mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: tier.color,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {tier.icon}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      {tier.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {tier.description}
                    </Typography>
                  </Box>

                  {/* Pricing */}
                  <Box sx={{ mb: 3 }}>
                    {tier.price.monthly === 0 ? (
                      <Typography variant="h3" fontWeight="bold" color={tier.color}>
                        Gratis
                      </Typography>
                    ) : (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h3" fontWeight="bold" color={tier.color}>
                            ${billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            /{billingCycle === 'yearly' ? 'año' : 'mes'}
                          </Typography>
                        </Box>

                        {billingCycle === 'yearly' && tier.discount && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Ahorras ${getSavings(tier)} al año
                          </Typography>
                        )}

                        {tier.price.lukas && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            o {tier.price.lukas} Lükas
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Features List */}
                  <List dense sx={{ textAlign: 'left' }}>
                    {tier.features.map((feature) => (
                      <ListItem key={feature.id} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {feature.included ? (
                            <CheckIcon sx={{
                              color: feature.highlighted ? tier.color : 'success.main',
                              fontSize: 20
                            }} />
                          ) : (
                            <LockIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.name}
                          secondary={feature.description}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: feature.highlighted ? 'bold' : 'normal',
                            color: feature.included ? 'text.primary' : 'text.disabled'
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            color: feature.included ? 'text.secondary' : 'text.disabled'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {/* Rewards Preview */}
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Recompensas incluidas:
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                      <Chip size="small" label={`+${tier.rewards.onboardingBonus.meritos} Méritos`} />
                      <Chip size="small" label={`+${tier.rewards.onboardingBonus.lukas} Lükas`} />
                      <Chip size="small" label={`${tier.rewards.loyaltyMultiplier}x Multiplicador`} />
                    </Stack>
                    <Box sx={{ mt: 1 }}>
                      {tier.rewards.exclusiveBadges.map((badge, index) => (
                        <span key={index} style={{ fontSize: '1.2em', marginRight: '4px' }}>
                          {badge}
                        </span>
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant={tier.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    onClick={() => handleUpgrade(tier)}
                    disabled={userSubscription?.currentTier === tier.id}
                    sx={{
                      backgroundColor: tier.popular ? tier.color : 'transparent',
                      borderColor: tier.color,
                      color: tier.popular ? 'white' : tier.color,
                      '&:hover': {
                        backgroundColor: tier.color,
                        color: 'white'
                      }
                    }}
                  >
                    {userSubscription?.currentTier === tier.id
                      ? 'Plan Actual'
                      : tier.price.monthly === 0
                        ? 'Comenzar Gratis'
                        : 'Upgradearse'
                    }
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Upgrade Dialog */}
      <Dialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {selectedTier && (
              <>
                <Avatar sx={{ bgcolor: selectedTier.color }}>
                  {selectedTier.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    Upgrade a {selectedTier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desbloquea todo el potencial de CoomÜnity
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedTier && (
            <Box>
              {/* Payment Flow Stepper */}
              <Stepper activeStep={paymentStep} orientation="horizontal" sx={{ mb: 3 }}>
                {paymentSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              {paymentStep === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Resumen del Plan
                  </Typography>

                  <Paper sx={{ p: 3, mb: 3, backgroundColor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {selectedTier.name}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={selectedTier.color}>
                        ${billingCycle === 'yearly' ? selectedTier.price.yearly : selectedTier.price.monthly}
                        <Typography variant="body2" component="span" color="text.secondary">
                          /{billingCycle === 'yearly' ? 'año' : 'mes'}
                        </Typography>
                      </Typography>
                    </Box>

                    {billingCycle === 'yearly' && selectedTier.discount && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        ¡Ahorras ${getSavings(selectedTier)} al año con el plan anual!
                      </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      {selectedTier.description}
                    </Typography>

                    {/* Immediate Rewards */}
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Recibirás inmediatamente:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          icon={<TrophyIcon />}
                          label={`${selectedTier.rewards.onboardingBonus.meritos} Méritos`}
                          color="warning"
                        />
                        <Chip
                          icon={<WalletIcon />}
                          label={`${selectedTier.rewards.onboardingBonus.lukas} Lükas`}
                          color="success"
                        />
                        <Chip
                          label={`${selectedTier.rewards.loyaltyMultiplier}x Multiplicador`}
                          color="primary"
                        />
                      </Stack>
                    </Box>
                  </Paper>
                </Box>
              )}

              {upgradeMutation.isPending && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LinearProgress sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    Procesando tu upgrade...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowUpgradeDialog(false)}
            disabled={upgradeMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={upgradeMutation.isPending}
            sx={{
              backgroundColor: selectedTier?.color,
              '&:hover': {
                backgroundColor: selectedTier?.color,
                filter: 'brightness(0.9)'
              }
            }}
          >
            {upgradeMutation.isPending ? 'Procesando...' : 'Confirmar Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SubscriptionPage
