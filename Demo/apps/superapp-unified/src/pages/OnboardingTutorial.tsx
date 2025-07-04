import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
  Zoom,
  Slide,
  AvatarGroup,
} from '@mui/material'
import {
  PlayArrow as StartIcon,
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  Group as CommunityIcon,
  Store as MarketplaceIcon,
  School as LearnIcon,
  AccountBalance as WalletIcon,
  Close as CloseIcon,
  ArrowForward as NextIcon,
  CheckCircle as CompleteIcon,
  Stars as MagicIcon,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// Types
interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
  reward: {
    meritos: number
    units: number
    message: string
  }
  component: React.ReactNode
}

interface OnboardingProgress {
  currentStep: number
  completedSteps: string[]
  totalMeritos: number
  totalUnits: number
  startTime: Date
}

const OnboardingTutorial: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: [],
    totalMeritos: 0,
    totalUnits: 0,
    startTime: new Date()
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const navigate = useNavigate()

  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: '¡Bienvenido a CoomÜnity!',
      description: 'Descubre un mundo donde cada acción construye el Bien Común',
      icon: <HeartIcon sx={{ fontSize: 48, color: '#CDAB5A' }} />,
      action: 'Comenzar Aventura',
      reward: { meritos: 10, units: 5, message: '¡Primer paso hacia el Bien Común!' },
      component: <WelcomeStep />
    },
    {
      id: 'reciprocidad',
      title: 'Principio de Reciprocidad',
      description: 'Aprende sobre reciprocidad: dar y recibir en equilibrio perfecto',
      icon: <MagicIcon sx={{ fontSize: 48, color: '#10B981' }} />,
      action: 'Practicar la Reciprocidad',
      reward: { meritos: 25, units: 10, message: '¡Has comprendido la reciprocidad!' },
      component: <ReciprocidadStep />
    },
    {
      id: 'meritos',
      title: 'Gana tus Primeros Méritos',
      description: 'Los Méritos reconocen tus contribuciones al Bien Común',
      icon: <TrophyIcon sx={{ fontSize: 48, color: '#F59E0B' }} />,
      action: 'Ganar Méritos',
      reward: { meritos: 50, units: 20, message: '¡Méritos bien ganados!' },
      component: <MeritosStep />
    },
    {
      id: 'community',
      title: 'Únete a la Comunidad',
      description: 'Conecta con otros miembros que comparten tus valores',
      icon: <CommunityIcon sx={{ fontSize: 48, color: '#8B5CF6' }} />,
      action: 'Conocer Comunidad',
      reward: { meritos: 30, units: 15, message: '¡Bienvenido a la tribu!' },
      component: <CommunityStep />
    },
    {
      id: 'marketplace',
      title: 'Explora el Marketplace',
      description: 'Intercambia productos y servicios usando Ünits',
      icon: <MarketplaceIcon sx={{ fontSize: 48, color: '#3B82F6' }} />,
      action: 'Explorar Intercambios',
      reward: { meritos: 40, units: 25, message: '¡Primer intercambio exitoso!' },
      component: <MarketplaceStep />
    },
    {
      id: 'complete',
      title: '¡Eres un Emprendedor Confiable!',
      description: 'Has completado tu iniciación en CoomÜnity',
      icon: <CompleteIcon sx={{ fontSize: 48, color: '#EF4444' }} />,
      action: 'Comenzar Aventura',
      reward: { meritos: 100, units: 50, message: '¡Aventura CoomÜnity desbloqueada!' },
      component: <CompleteStep />
    }
  ]

  const currentTutorialStep = steps[currentStep]

  const handleStepComplete = async () => {
    const step = steps[currentStep]

    // Animate reward
    setShowCelebration(true)

    // Update progress
    setProgress(prev => ({
      ...prev,
      currentStep: currentStep + 1,
      completedSteps: [...prev.completedSteps, step.id],
      totalMeritos: prev.totalMeritos + step.reward.meritos,
      totalUnits: prev.totalUnits + step.reward.units
    }))

    // Show reward toast
    toast.success(step.reward.message, {
      description: `+${step.reward.meritos} Méritos, +${step.reward.units} Ünits`,
      duration: 3000,
    })

    setTimeout(() => {
      setShowCelebration(false)
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleTutorialComplete()
      }
    }, 2000)
  }

  const handleTutorialComplete = () => {
    const duration = (new Date().getTime() - progress.startTime.getTime()) / 1000

    // Save tutorial completion
    localStorage.setItem('coomunity_tutorial_completed', 'true')
    localStorage.setItem('coomunity_tutorial_time', duration.toString())

    toast.success('¡Tutorial Completado!', {
      description: `Completado en ${Math.round(duration / 60)} minutos`,
      duration: 5000,
    })

    setIsOpen(false)
    navigate('/')
  }

  const handleSkip = () => {
    localStorage.setItem('coomunity_tutorial_skipped', 'true')
    setIsOpen(false)
    navigate('/')
  }

  if (!isOpen) return null

  return (
    <Dialog
      open={isOpen}
      fullScreen
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(205, 171, 90, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)
            `,
            animation: 'float 20s ease-in-out infinite'
          }}
        />

        {/* Skip Button */}
        <IconButton
          onClick={handleSkip}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'rgba(255,255,255,0.7)',
            zIndex: 10
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Progress Bar */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5 }}>
          <LinearProgress
            variant="determinate"
            value={(currentStep / (steps.length - 1)) * 100}
            sx={{
              height: 6,
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#CDAB5A'
              }
            }}
          />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Step Counter */}
          <Chip
            label={`Paso ${currentStep + 1} de ${steps.length}`}
            sx={{
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          />

          {/* Step Icon */}
          <motion.div
            key={currentStep}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                mb: 3,
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              {currentTutorialStep.icon}
            </Box>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', maxWidth: '600px' }}
            >
              <Typography variant="h3" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
                {currentTutorialStep.title}
              </Typography>

              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                {currentTutorialStep.description}
              </Typography>

              {/* Step Component */}
              <Box sx={{ mb: 4 }}>
                {currentTutorialStep.component}
              </Box>

              {/* Action Button */}
              <Button
                variant="contained"
                size="large"
                endIcon={<NextIcon />}
                onClick={handleStepComplete}
                sx={{
                  backgroundColor: '#CDAB5A',
                  color: 'white',
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: '25px',
                  boxShadow: '0 8px 32px rgba(205, 171, 90, 0.3)',
                  '&:hover': {
                    backgroundColor: '#B8954A',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(205, 171, 90, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {currentTutorialStep.action}
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Progress Stats */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 30,
              left: 30,
              display: 'flex',
              gap: 2
            }}
          >
            <Chip
              icon={<TrophyIcon />}
              label={`${progress.totalMeritos} Méritos`}
              sx={{
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#F59E0B',
                backdropFilter: 'blur(10px)'
              }}
            />
            <Chip
              icon={<WalletIcon />}
              label={`${progress.totalUnits} Ünits`}
              sx={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
        </Box>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 100
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Box textAlign="center">
                  <TrophyIcon sx={{ fontSize: 100, color: '#CDAB5A', mb: 2 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    ¡Excelente!
                  </Typography>
                  <Typography variant="h6">
                    +{currentTutorialStep.reward.meritos} Méritos, +{currentTutorialStep.reward.units} Ünits
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// Individual Step Components
const WelcomeStep: React.FC = () => (
  <Card sx={{ maxWidth: 400, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
    <CardContent sx={{ textAlign: 'center', color: 'white' }}>
      <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, backgroundColor: '#CDAB5A' }}>
        <HeartIcon sx={{ fontSize: 40 }} />
      </Avatar>
      <Typography variant="h6" sx={{ mb: 2 }}>
        En CoomÜnity, cada acción que realizas contribuye al bienestar colectivo
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        Aquí no competimos, colaboramos. No consumimos, co-creamos.
      </Typography>
    </CardContent>
  </Card>
)

const ReciprocidadStep: React.FC = () => (
  <Box textAlign="center">
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #CDAB5A, #10B981, #3B82F6, #CDAB5A)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <MagicIcon sx={{ fontSize: 40, color: '#CDAB5A' }} />
          </Box>
        </Box>
      </motion.div>
    </Box>
    <Typography variant="body1" sx={{ mb: 2 }}>
      <strong>Reciprocidad</strong> es nuestro principio sagrado.
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Cuando das, recibes. Cuando recibes, das. El equilibrio perfecto.
    </Typography>
  </Box>
)

const MeritosStep: React.FC = () => (
  <Box textAlign="center">
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        >
          <TrophyIcon sx={{ fontSize: 30, color: '#F59E0B' }} />
        </motion.div>
      ))}
    </Box>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Los Méritos son reconocimientos por tus contribuciones valiosas
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Cada acción que beneficia al Bien Común te otorga Méritos
    </Typography>
  </Box>
)

const CommunityStep: React.FC = () => (
  <Box textAlign="center">
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <AvatarGroup max={4}>
        {['Ana', 'Carlos', 'María', 'Luis'].map((name, i) => (
          <Avatar
            key={name}
            sx={{
              backgroundColor: ['#CDAB5A', '#10B981', '#3B82F6', '#8B5CF6'][i],
              border: '2px solid white'
            }}
          >
            {name[0]}
          </Avatar>
        ))}
      </AvatarGroup>
    </Box>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Únete a una comunidad de personas comprometidas con el cambio positivo
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Colabora, aprende y crece junto a otros emprendedores confiables
    </Typography>
  </Box>
)

const MarketplaceStep: React.FC = () => (
  <Box textAlign="center">
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
      <Card sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', minWidth: 100 }}>
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
          Verduras Orgánicas
        </Typography>
        <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 'bold' }}>
          50 Ünits
        </Typography>
      </Card>
      <Card sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', minWidth: 100 }}>
        <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
          Taller Meditación
        </Typography>
        <Typography variant="h6" sx={{ color: '#3B82F6', fontWeight: 'bold' }}>
          25 Ünits
        </Typography>
      </Card>
    </Box>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Intercambia productos y servicios usando Ünits, nuestra moneda comunitaria
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Todo en el marketplace está alineado con valores de sostenibilidad
    </Typography>
  </Box>
)

const CompleteStep: React.FC = () => (
  <Box textAlign="center">
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Box
        sx={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #CDAB5A, #F59E0B)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
          mb: 3,
          boxShadow: '0 20px 40px rgba(205, 171, 90, 0.3)'
        }}
      >
        <CompleteIcon sx={{ fontSize: 80, color: 'white' }} />
      </Box>
    </motion.div>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
      ¡Felicidades!
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      Ahora eres oficialmente un <strong>Emprendedor Confiable</strong>
    </Typography>
    <Typography variant="body2" sx={{ opacity: 0.8 }}>
      Tu aventura en CoomÜnity apenas comienza. ¡Vamos a cambiar el mundo juntos!
    </Typography>
  </Box>
)

export default OnboardingTutorial
