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
  useTheme,
  Grid,
  Divider,
  CircularProgress,
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
import { useUnitsWallet } from '../../../hooks/useLetsIntegration';
import { useAuth } from '../../../contexts/AuthContext';

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
        tip: 'Cuando puedas, comparte tus talentos para equilibrar tu Reciprocidad.',
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
        tip: 'Este es el ideal del Reciprocidad: equilibrio perfecto.',
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

  const getReciprocidadMessage = () => {
    const ratio = received > 0 ? given / received : given > 0 ? Infinity : 1;

    if (userLevel === 'newcomer') {
      if (ratio > 1.2) return '¡Has dado mucho! Considera recibir más apoyo';
      if (ratio < 0.8) return '¡Estás creciendo! La comunidad te apoya';
      return '¡Equilibrio perfecto! Estás en armonía';
    }

    if (ratio >= 0.8 && ratio <= 1.2) return 'Excelente balance Reciprocidad';
    if (ratio > 1.2) return 'Podrías recibir más de la comunidad';
    return 'Considera ofrecer más cuando puedas';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💝 Has dado: {given}h
        </Typography>
        <Typography variant="caption" color="text.secondary">
          🤲 Has recibido: {received}h
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', borderRadius: 2, overflow: 'hidden', height: 8 }}>
        <Box
          sx={{
            width: `${givePercentage}%`,
            bgcolor: 'primary.light',
            transition: 'width 1s ease-in-out',
          }}
        />
        <Box
          sx={{
            width: `${receivePercentage}%`,
            bgcolor: 'secondary.light',
            transition: 'width 1s ease-in-out',
          }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {getReciprocidadMessage()}
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
              color: i < getStarCount() ? 'primary.main' : 'grey.300',
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
  reciprocidadBalance: any;
  userLevel: UserExperience;
  onExploreOpportunities?: () => void;
}> = ({ wallet, reciprocidadBalance, userLevel, onExploreOpportunities }) => {
  const getMessage = (): HumanizedMessage => {
    if (wallet.balance === 0) {
      return HUMANIZED_MESSAGES.wallet.zeroBalance.newcomer;
    }

    const balanceType = wallet.balance > 0 ? 'positiveBalance' : 'negativeBalance';
    return HUMANIZED_MESSAGES.wallet[balanceType][userLevel];
  };

  const message = getMessage();
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        p: 1,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', mr: 2 }}>
            {wallet.balance >= 0 ? '💝' : '🤝'}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Tu contribución a CoomÜnity
          </Typography>
        </Box>

        {/* Balance con explicación contextual */}
        <Box textAlign="center" mb={3}>
          <Zoom in timeout={1000}>
            <Typography variant="h2" fontWeight="bold" color={theme.palette.text.primary}>
              {wallet.balance >= 0 ? '+' : ''}{wallet.balance.toFixed(0)}
            </Typography>
          </Zoom>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Ünits
          </Typography>
          <Typography variant="body1" color={theme.palette.text.primary} fontWeight="medium">
            {message.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {message.message}
          </Typography>
        </Box>

        {/* Explicación visual del balance */}
        <ProgressStoryBar
          given={reciprocidadBalance.given}
          received={reciprocidadBalance.received}
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
  reciprocidadBalance: any;
  onExploreOpportunities?: () => void;
}> = ({ wallet, reciprocidadBalance, onExploreOpportunities }) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box textAlign="center">
              <Typography variant="overline" color="text.secondary">
                Balance de Reciprocidad
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {wallet.balance > 0 && '+'}
                {wallet.balance.toFixed(2)} Ü
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {wallet.balance > 0
                  ? 'Has contribuido más de lo que has recibido.'
                  : 'La comunidad te apoya en tu crecimiento.'}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <ProgressStoryBar
                given={reciprocidadBalance?.given || 0}
                received={reciprocidadBalance?.received || 0}
                userLevel={'advanced'}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TrustVisualization
              trustScore={wallet.trustScore * 100}
              userLevel={'advanced'}
            />
            <Divider sx={{ my: 2 }} />
            <Box textAlign="center">
              <Typography variant="h6">Límite de Crédito Comunitario</Typography>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {wallet.creditLimit} Ü
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Este es el nivel de apoyo que la comunidad puede ofrecerte.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<GrowthIcon />}
            onClick={onExploreOpportunities}
          >
            Explorar Oportunidades de Intercambio
          </Button>
        </Box>
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
  const { user } = useAuth();
  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useUnitsWallet(userId);

  const [message, setMessage] = useState<HumanizedMessage | null>(null);

  useEffect(() => {
    if (wallet) {
      if (wallet.balance === 0) {
        setMessage(HUMANIZED_MESSAGES.wallet.zeroBalance.newcomer);
        return;
      }
      const balanceType = wallet.balance > 0 ? 'positiveBalance' : 'negativeBalance';
      setMessage(HUMANIZED_MESSAGES.wallet[balanceType][userExperience]);
    }
  }, [wallet, userExperience]);

  if (walletLoading) {
    return (
      <Card variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando tu información de Billetera...</Typography>
      </Card>
    );
  }

  if (walletError || !wallet) {
    return <Alert severity="error">No se pudo cargar la información de la billetera.</Alert>;
  }

  const reciprocidadBalance = { given: 0, received: 0 }; // Mock data

  if (simplified) {
    return (
      <SimpleWalletView
        wallet={wallet}
        reciprocidadBalance={reciprocidadBalance}
        userLevel={userExperience}
        onExploreOpportunities={onExploreOpportunities}
      />
    );
  }

  return (
    <AdvancedWalletView
      wallet={wallet}
      reciprocidadBalance={reciprocidadBalance}
      onExploreOpportunities={onExploreOpportunities}
    />
  );
};

export default UnitsWalletHumanized;