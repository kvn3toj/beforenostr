import React, { useState } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Stack,
  Chip,
  LinearProgress,
  Grid,
  Tooltip,
  Zoom,
  alpha,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Visibility,
  VisibilityOff,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Nature,
  Lightbulb,
  Groups,
  AttachMoney,
  Star,
  Timeline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// 🌌 ARIA (Frontend Artist) - Cosmic Design System
import { CosmicCard } from '../../../design-system';
import { UNIFIED_COLORS } from '../../../theme/colors';

// 🎯 Tipos específicos para el wallet CoomÜnity
interface WalletData {
  balance: number;
  currency: string;
  ucoins: number;
  meritos: number;
  ondas: number;
  pendingBalance: number;
  monthlyChange: number;
  reciprocidadLevel: number;
  collaborationScore: number;
  communityRank: string;
}

interface WalletOverviewProps {
  walletData: WalletData;
  balanceVisible: boolean;
  onToggleVisibility: () => void;
  isLoading?: boolean;
  isRealTime?: boolean;
}

// 🌟 Configuración de métricas CoomÜnity
const RECIPROCIDAD_LEVELS = [
  { level: 1, name: 'Explorador', color: '#8BC34A', min: 0, max: 25 },
  { level: 2, name: 'Colaborador', color: '#FF9800', min: 26, max: 50 },
  { level: 3, name: 'Constructor', color: '#2196F3', min: 51, max: 75 },
  { level: 4, name: 'Guardian', color: '#9C27B0', min: 76, max: 90 },
  { level: 5, name: 'Maestro Reciprocidad', color: '#FF5722', min: 91, max: 100 },
];

const BalanceCard: React.FC<{
  title: string;
  amount: number | string;
  currency: string;
  visible: boolean;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  trend?: number;
  subtitle?: string;
}> = ({
  title,
  amount,
  currency,
  visible,
  icon,
  color,
  gradient,
  trend,
  subtitle,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ height: '100%' }}
    >
      <CosmicCard
        variant="elevated"
        element="espiritu" // 🌌 Elemento Espíritu para abundancia/wallet
        enableGlow={true}
        enableAnimations={true}
        cosmicIntensity="medium"
        sx={{ height: '100%' }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* Header with icon and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    bgcolor: color,
                    background: gradient,
                    width: 40,
                    height: 40,
                    transform: hovered ? 'scale(1.1) rotateY(10deg)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Amount display */}
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: gradient || `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: hovered ? '2.2rem' : '2rem',
                  transition: 'font-size 0.3s ease',
                }}
              >
                {visible
                  ? `${currency === 'UC' ? '' : '$'}${amount.toLocaleString()}${currency === 'UC' ? ' UC' : ''}`
                  : '••••••••'}
              </Typography>

              {/* Trend indicator */}
              {trend !== undefined && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                  {trend >= 0 ? (
                    <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: trend >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {trend >= 0 ? '+' : ''}{trend}%
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CosmicCard>
    </Box>
  );
};

// 🎯 Componente para métricas Reciprocidad
const ReciprocidadMetrics: React.FC<{
  reciprocidadLevel: number;
  collaborationScore: number;
  communityRank: string;
}> = ({ reciprocidadLevel, collaborationScore, communityRank }) => {
  const currentLevel =
    RECIPROCIDAD_LEVELS.find(
      (level) => reciprocidadLevel >= level.min && reciprocidadLevel <= level.max
    ) || RECIPROCIDAD_LEVELS[0];

  const nextLevel = RECIPROCIDAD_LEVELS.find(
    (level) => level.level === currentLevel.level + 1
  );
  const progressToNext = nextLevel
    ? ((reciprocidadLevel - currentLevel.min) / (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  return (
    <CardContent>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💫 Nivel de Reciprocidad
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${currentLevel.color} 0%, ${currentLevel.color}DD 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {currentLevel.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {reciprocidadLevel}% de desarrollo
          </Typography>
        </Box>

        {nextLevel && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progreso hacia {nextLevel.name}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {Math.round(progressToNext)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressToNext}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(currentLevel.color, 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                },
              }}
            />
          </Box>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {collaborationScore}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Colaboración
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {communityRank}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ranking
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </CardContent>
  );
};

// 🎨 Componente principal WalletOverview
export const WalletOverview: React.FC<WalletOverviewProps> = ({
  walletData,
  balanceVisible,
  onToggleVisibility,
  isLoading = false,
  isRealTime = false,
}) => {
  // 🌟 Normalización y validación de datos
  const normalizedData = {
    balance: Number(walletData?.balance) || 0,
    ucoins: Number(walletData?.ucoins) || 0,
    meritos: Number(walletData?.meritos) || 0,
    ondas: Number(walletData?.ondas) || 0,
    pendingBalance: Number(walletData?.pendingBalance) || 0,
    monthlyChange: Number(walletData?.monthlyChange) || 0,
    reciprocidadLevel: Number(walletData?.reciprocidadLevel) || 0,
    collaborationScore: Number(walletData?.collaborationScore) || 0,
    communityRank: walletData?.communityRank || 'Nuevo',
  };

  if (isLoading) {
    return (
      <CosmicCard
        variant="primary"
        element="espiritu"
        enableAnimations={true}
        cosmicIntensity="subtle"
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: `linear-gradient(90deg, ${UNIFIED_COLORS.elements.eter.primary}, ${UNIFIED_COLORS.elements.eter.light})`,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <Box>
              <Typography variant="h6">Cargando...</Typography>
              <Typography variant="body2" color="text.secondary">
                Sincronizando con el cosmos financiero
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CosmicCard>
    );
  }

  return (
    <CosmicCard
      variant="primary"
      element="espiritu"
      title="💰 Centro Financiero Universal"
      subtitle="Gestión consciente de la abundancia"
      enableGlow={true}
      enableAnimations={true}
      enableOrbitalEffects={true}
      cosmicIntensity="medium"
      sx={{
        background: `linear-gradient(135deg,
          ${alpha(UNIFIED_COLORS.elements.eter.primary, 0.05)} 0%,
          ${alpha(UNIFIED_COLORS.elements.eter.primary, 0.03)} 50%,
          ${alpha(UNIFIED_COLORS.brand.white, 0.95)} 100%)`,
      }}
    >

      {/* 💰 Header con toggle de visibilidad */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: UNIFIED_COLORS.elements.eter.primary,
              background: `linear-gradient(135deg, ${UNIFIED_COLORS.elements.eter.primary}, ${UNIFIED_COLORS.elements.eter.light})`,
              width: 50,
              height: 50,
              boxShadow: `0 0 20px ${alpha(UNIFIED_COLORS.elements.eter.primary, 0.3)}`,
            }}
          >
            <AccountBalanceWallet />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Ecosistema de Abundancia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRealTime ? '🟢 Tiempo real' : '🟡 Modo contemplativo'}
            </Typography>
          </Box>
        </Box>

        <Tooltip title={balanceVisible ? 'Ocultar balances' : 'Mostrar balances'}>
          <IconButton
            onClick={onToggleVisibility}
            sx={{
              bgcolor: alpha(UNIFIED_COLORS.elements.eter.primary, 0.1),
              '&:hover': {
                bgcolor: alpha(UNIFIED_COLORS.elements.eter.primary, 0.2),
                transform: 'scale(1.05)',
              },
            }}
          >
            {balanceVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 💰 Balances principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <BalanceCard
            title="Balance Principal"
            amount={normalizedData.balance}
            currency="COP"
            visible={balanceVisible}
            icon={<AttachMoney />}
            color="#1976d2"
            gradient="linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
            trend={normalizedData.monthlyChange}
            subtitle="Pesos Colombianos"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <BalanceCard
            title="ÜCoins CoomÜnity"
            amount={normalizedData.ucoins}
            currency="UC"
            visible={balanceVisible}
            icon={<SwapHoriz />}
            color="#f57c00"
            gradient="linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)"
            subtitle="Moneda interna colaborativa"
          />
        </Grid>
      </Grid>

      {/* 🌟 Mëritos y Öndas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <CosmicCard
            variant="secondary"
            element="fuego"
            enableGlow={true}
            cosmicIntensity="subtle"
            sx={{ textAlign: 'center' }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Star sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Mëritos
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {balanceVisible
                  ? normalizedData.meritos.toLocaleString()
                  : '•••••'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contribuciones reconocidas
              </Typography>
            </CardContent>
          </CosmicCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CosmicCard
            variant="secondary"
            element="agua"
            enableGlow={true}
            cosmicIntensity="subtle"
            sx={{ textAlign: 'center' }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Nature sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Öndas
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {balanceVisible
                  ? normalizedData.ondas.toLocaleString()
                  : '•••••'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Energía vibracional
              </Typography>
            </CardContent>
          </CosmicCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CosmicCard
            variant="secondary"
            element="aire"
            enableGlow={true}
            cosmicIntensity="subtle"
            sx={{ textAlign: 'center' }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Timeline sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Pendiente
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="info.main">
                {balanceVisible
                  ? `$${(normalizedData.pendingBalance || 0).toLocaleString()}`
                  : '•••••'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Transacciones en proceso
              </Typography>
            </CardContent>
          </CosmicCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CosmicCard
            variant="secondary"
            element="tierra"
            enableGlow={true}
            cosmicIntensity="subtle"
            sx={{ textAlign: 'center' }}
          >
            <CardContent sx={{ pb: '16px !important' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Groups sx={{ color: 'purple.main', mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Comunidad
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" color="purple.main">
                {normalizedData.communityRank}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ranking global
              </Typography>
            </CardContent>
          </CosmicCard>
        </Grid>
      </Grid>

      {/* 🌍 Métricas de Reciprocidad */}
      <CosmicCard
        variant="elevated"
        element="tierra"
        enableGlow={true}
        cosmicIntensity="subtle"
        sx={{ mt: 2 }}
      >
        <ReciprocidadMetrics
          reciprocidadLevel={normalizedData.reciprocidadLevel}
          collaborationScore={normalizedData.collaborationScore}
          communityRank={normalizedData.communityRank}
        />
      </CosmicCard>
    </CosmicCard>
  );
};
