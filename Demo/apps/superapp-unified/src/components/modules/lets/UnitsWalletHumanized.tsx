import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import {
  AccountBalance as WalletIcon,
  TrendingUp as GrowthIcon,
  TrendingDown as SupportIcon,
  Favorite as HeartIcon,
  Lightbulb as TipIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Handshake as HandshakeIcon,
  EmojiEvents as AchievementIcon,
} from '@mui/icons-material';
import { useUnitsWallet, useAyniBalance } from '../../../hooks/useLetsIntegration';

type UserExperience = 'newcomer' | 'beginner' | 'intermediate' | 'advanced';

interface UnitsWalletHumanizedProps {
  userId: string;
  userExperience?: UserExperience;
  onStartOnboarding?: () => void;
  onExploreOpportunities?: () => void;
  simplified?: boolean;
}

interface HumanizedMessage {
  title: string;
  message: string;
  tip?: string;
  action?: {
    label: string;
    handler: () => void;
  };
  emotion: 'positive' | 'neutral' | 'supportive' | 'encouraging';
}

const HUMANIZED_MESSAGES = {
  wallet: {
    positiveBalance: {
      newcomer: {
        title: '¡Eres una estrella de la comunidad! 🌟',
        message: 'Has ayudado a la comunidad más de lo que has pedido ayuda.',
        tip: 'Tu generosidad construye confianza y fortalece la red de reciprocidad.',
        emotion: 'positive' as const,
      },
      beginner: {
        title: '¡Gran contribuidor! 👏',
        message: 'Tu saldo positivo muestra que eres valioso para la comunidad.',
        tip: 'Considera ofrecer tus habilidades a quienes más lo necesiten.',
        emotion: 'positive' as const,
      },
      intermediate: {
        title: 'Excelente balance positivo ⚖️',
        message: 'Mantienes un flujo saludable de contribución a la comunidad.',
        emotion: 'positive' as const,
      },
      advanced: {
        title: 'Alto impacto comunitario',
        message: 'Tu contribución genera confianza adicional en la red.',
        emotion: 'positive' as const,
      },
    },
    negativeBalance: {
      newcomer: {
        title: 'La comunidad te está apoyando 💙',
        message: '¡No te preocupes! Es normal y necesario recibir ayuda mientras creces.',
        tip: 'Cuando puedas, comparte tus talentos para equilibrar tu Ayni.',
        emotion: 'supportive' as const,
      },
      beginner: {
        title: 'Recibiendo apoyo comunitario 🤝',
        message: 'La comunidad invierte en tu crecimiento.',
        tip: '¿Cómo puedes retribuir con tus habilidades únicas?',
        emotion: 'supportive' as const,
      },
      intermediate: {
        title: 'Balance en desarrollo',
        message: 'Estás en proceso de equilibrar tu contribución.',
        emotion: 'encouraging' as const,
      },
      advanced: {
        title: 'Crédito comunitario activo',
        message: 'Aprovecha este período para crecer y prepararte para contribuir.',
        emotion: 'neutral' as const,
      },
    },
    zeroBalance: {
      newcomer: {
        title: '¡Perfecto equilibrio! ⚖️',
        message: 'Estás en armonía entre dar y recibir.',
        tip: 'Este es el ideal del Ayni: equilibrio perfecto.',
        emotion: 'positive' as const,
      },
    },
  },
};

const ProgressStoryBar: React.FC<{
  given: number;
  received: number;
  userLevel: UserExperience;
}> = ({ given, received, userLevel }) => {
  const total = given + received;
  const givePercentage = total > 0 ? (given / total) * 100 : 50;
  const receivePercentage = total > 0 ? (received / total) * 100 : 50;

  const getAyniMessage = () => {
    const ratio = received > 0 ? given / received : given > 0 ? Infinity : 1;
    
    if (userLevel === 'newcomer') {
      if (ratio > 1.2) return '¡Has dado mucho! Considera recibir más apoyo';
      if (ratio < 0.8) return '¡Estás creciendo! La comunidad te apoya';
      return '¡Equilibrio perfecto! Estás en armonía';
    }
    
    if (ratio >= 0.8 && ratio <= 1.2) return 'Excelente balance Ayni';
    if (ratio > 1.2) return 'Podrías recibir más de la comunidad';
    return 'Considera ofrecer más cuando puedas';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" color="success.main">
          💝 Has dado: {given}h
        </Typography>
        <Typography variant="caption" color="info.main">
          🤲 Has recibido: {received}h
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', height: 8 }}>
        <Box 
          sx={{ 
            width: `${givePercentage}%`, 
            bgcolor: 'success.light',
            transition: 'width 1s ease-in-out'
          }} 
        />
        <Box 
          sx={{ 
            width: `${receivePercentage}%`, 
            bgcolor: 'info.light',
            transition: 'width 1s ease-in-out'
          }} 
        />
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {getAyniMessage()}
      </Typography>
    </Box>
  );
};

const TrustVisualization: React.FC<{
  trustScore: number;
  userLevel: UserExperience;
}> = ({ trustScore, userLevel }) => {
  const getTrustMessage = () => {
    if (userLevel === 'newcomer') {
      if (trustScore >= 90) return '¡La comunidad confía plenamente en ti! ❤️';
      if (trustScore >= 70) return 'Construyendo confianza sólida 🌱';
      return 'Cada buena acción aumenta tu confianza 👍';
    }
    
    return `Nivel de confianza: ${trustScore}%`;
  };

  const getStarCount = () => Math.floor(trustScore / 20);

  return (
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Box sx={{ mb: 1 }}>
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            sx={{
              color: i < getStarCount() ? 'warning.main' : 'grey.300',
              fontSize: 24,
              mx: 0.25,
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {getTrustMessage()}
      </Typography>
    </Box>
  );
};

const SimpleWalletView: React.FC<{
  wallet: any;
  ayniBalance: any;
  userLevel: UserExperience;
  onExploreOpportunities?: () => void;
}> = ({ wallet, ayniBalance, userLevel, onExploreOpportunities }) => {
  const getMessage = (): HumanizedMessage => {
    if (wallet.balance === 0) {
      return HUMANIZED_MESSAGES.wallet.zeroBalance.newcomer;
    }
    
    const balanceType = wallet.balance > 0 ? 'positiveBalance' : 'negativeBalance';
    return HUMANIZED_MESSAGES.wallet[balanceType][userLevel];
  };

  const message = getMessage();
  const emotionColors = {
    positive: 'success.main',
    supportive: 'info.main',
    encouraging: 'warning.main',
    neutral: 'text.primary',
  };

  return (
    <Card 
      sx={{ 
        background: wallet.balance >= 0 
          ? 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)'
          : 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)',
        border: `2px solid ${wallet.balance >= 0 ? '#4caf50' : '#ff9800'}`,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: emotionColors[message.emotion], mr: 2 }}>
            {wallet.balance >= 0 ? '💝' : '🤝'}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Tu contribución a CoomÜnity
          </Typography>
        </Box>

        {/* Balance con explicación contextual */}
        <Box textAlign="center" mb={3}>
          <Zoom in timeout={1000}>
            <Typography variant="h2" fontWeight="bold" color={emotionColors[message.emotion]}>
              {wallet.balance >= 0 ? '+' : ''}{wallet.balance.toFixed(0)}
            </Typography>
          </Zoom>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Ünits
          </Typography>
          <Typography variant="body1" color={emotionColors[message.emotion]} fontWeight="medium">
            {message.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {message.message}
          </Typography>
        </Box>

        {/* Explicación visual del balance */}
        <ProgressStoryBar
          given={ayniBalance.given}
          received={ayniBalance.received}
          userLevel={userLevel}
        />

        {/* Confianza simplificada */}
        <TrustVisualization 
          trustScore={wallet.trustScore || 75} 
          userLevel={userLevel}
        />

        {/* Consejo contextual */}
        {message.tip && (
          <Alert 
            severity={message.emotion === 'positive' ? 'success' : 'info'} 
            sx={{ mb: 2 }}
            icon={<TipIcon />}
          >
            <Typography variant="body2">
              <strong>💡 Consejo:</strong> {message.tip}
            </Typography>
          </Alert>
        )}

        {/* Una sola acción clara */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<HandshakeIcon />}
          onClick={onExploreOpportunities}
          sx={{ 
            mt: 2,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)',
            }
          }}
        >
          Ver oportunidades de intercambio
        </Button>
      </CardContent>
    </Card>
  );
};

const AdvancedWalletView: React.FC<{
  wallet: any;
  ayniBalance: any;
  onExploreOpportunities?: () => void;
}> = ({ wallet, ayniBalance, onExploreOpportunities }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wallet LETS Avanzado
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {wallet.balance >= 0 ? '+' : ''}{wallet.balance.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ünits disponibles
            </Typography>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Límite de crédito: {wallet.creditLimit}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crédito disponible: {wallet.creditLimit + wallet.balance}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Confianza Comunitaria: {wallet.trustScore}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={wallet.trustScore} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box textAlign="center">
            <Typography variant="h6" color="success.main">
              +{ayniBalance.given}
            </Typography>
            <Typography variant="caption">Has dado</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" color="info.main">
              -{ayniBalance.received}
            </Typography>
            <Typography variant="caption">Has recibido</Typography>
          </Box>
        </Box>

        <Alert 
          severity={ayniBalance.isBalanced ? 'success' : 'warning'}
          sx={{ mb: 2 }}
        >
          <Typography variant="body2">
            {ayniBalance.recommendation}
          </Typography>
        </Alert>

        <Button
          fullWidth
          variant="contained"
          onClick={onExploreOpportunities}
        >
          Explorar oportunidades
        </Button>
      </CardContent>
    </Card>
  );
};

export const UnitsWalletHumanized: React.FC<UnitsWalletHumanizedProps> = ({
  userId,
  userExperience = 'newcomer',
  onStartOnboarding,
  onExploreOpportunities,
  simplified = true,
}) => {
  const { data: wallet, isLoading, error } = useUnitsWallet(userId);
  const ayniBalance = useAyniBalance(userId);
  
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);

  useEffect(() => {
    // Mostrar onboarding si es newcomer y no tiene transacciones
    if (userExperience === 'newcomer' && wallet && !wallet.hasTransactions) {
      setShowOnboardingPrompt(true);
    }
  }, [userExperience, wallet]);

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Conectando con tu historia de contribución... 🌟
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <Typography variant="body2">
          No pudimos cargar tu wallet. Por favor intenta de nuevo.
        </Typography>
      </Alert>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <WalletIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            ¡Tu viaje LETS está por comenzar! 🚀
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Cuando hagas tu primer intercambio, verás aquí tu impacto en la comunidad
          </Typography>
          {onStartOnboarding && (
            <Button 
              variant="contained" 
              onClick={onStartOnboarding}
              startIcon={<TipIcon />}
            >
              Comenzar introducción a LETS
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Decidir qué vista mostrar según el nivel de usuario
  const shouldShowSimplified = simplified || ['newcomer', 'beginner'].includes(userExperience);

  return (
    <Box>
      {showOnboardingPrompt && onStartOnboarding && (
        <Fade in>
          <Alert 
            severity="info" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={onStartOnboarding}
              >
                Empezar
              </Button>
            }
            onClose={() => setShowOnboardingPrompt(false)}
          >
            <Typography variant="body2">
              <strong>¿Nuevo en LETS?</strong> Te ayudamos a entender cómo funciona paso a paso.
            </Typography>
          </Alert>
        </Fade>
      )}

      {shouldShowSimplified ? (
        <SimpleWalletView
          wallet={wallet}
          ayniBalance={ayniBalance}
          userLevel={userExperience}
          onExploreOpportunities={onExploreOpportunities}
        />
      ) : (
        <AdvancedWalletView
          wallet={wallet}
          ayniBalance={ayniBalance}
          onExploreOpportunities={onExploreOpportunities}
        />
      )}
    </Box>
  );
};

export default UnitsWalletHumanized; 