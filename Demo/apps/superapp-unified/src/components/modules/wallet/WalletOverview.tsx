import React, { useState } from 'react';
import {
  Box,
  Card,
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

// 🎯 Tipos específicos para el wallet CoomÜnity
interface WalletData {
  balance: number;
  currency: string;
  ucoins: number;
  meritos: number;
  ondas: number;
  pendingBalance: number;
  monthlyChange: number;
  ayniLevel: number;
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
const AYNI_LEVELS = [
  { level: 1, name: 'Explorador', color: '#8BC34A', min: 0, max: 25 },
  { level: 2, name: 'Colaborador', color: '#FF9800', min: 26, max: 50 },
  { level: 3, name: 'Constructor', color: '#2196F3', min: 51, max: 75 },
  { level: 4, name: 'Guardian', color: '#9C27B0', min: 76, max: 90 },
  { level: 5, name: 'Maestro Ayni', color: '#FF5722', min: 91, max: 100 },
];

// 🎨 Componente para tarjeta de balance principal
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
}) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card
      sx={{
        background: gradient,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '30%',
          height: '100%',
          background: `linear-gradient(45deg, transparent, ${alpha(color, 0.2)})`,
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha('#fff', 0.2),
              mr: 2,
              width: 48,
              height: 48,
              backdropFilter: 'blur(10px)',
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, opacity: 0.9 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {visible
            ? typeof amount === 'number'
              ? `${amount.toLocaleString('es-CO')} ${currency}`
              : `${amount} ${currency}`
            : '••••••'}
        </Typography>

        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 18, mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ fontSize: 18, mr: 0.5 }} />
            )}
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {trend > 0 ? '+' : ''}
              {trend}% este mes
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

// 🎯 Componente para métricas Ayni
const AyniMetrics: React.FC<{
  ayniLevel: number;
  collaborationScore: number;
  communityRank: string;
}> = ({ ayniLevel, collaborationScore, communityRank }) => {
  const currentLevel =
    AYNI_LEVELS.find(
      (level) => ayniLevel >= level.min && ayniLevel <= level.max
    ) || AYNI_LEVELS[0];

  const nextLevel = AYNI_LEVELS.find(
    (level) => level.level === currentLevel.level + 1
  );
  const progressToNext = nextLevel
    ? ((ayniLevel - currentLevel.min) / (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: currentLevel.color, mr: 2 }}>
            <Nature />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Nivel Ayni
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reciprocidad en CoomÜnity
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Chip
              label={currentLevel.name}
              sx={{
                bgcolor: currentLevel.color,
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              color={currentLevel.color}
            >
              {ayniLevel}/100
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressToNext}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(currentLevel.color, 0.2),
              '& .MuiLinearProgress-bar': {
                bgcolor: currentLevel.color,
                borderRadius: 4,
              },
            }}
          />

          {nextLevel && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              {Math.ceil(nextLevel.min - ayniLevel)} puntos para{' '}
              {nextLevel.name}
            </Typography>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{xs:6}}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {collaborationScore}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Colaboración
              </Typography>
            </Box>
          </Grid>
          <Grid size={{xs:6}}>
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="warning.main">
                {communityRank}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ranking
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 🔢 Normalizar datos con fallbacks
  const normalizedData: WalletData = {
    balance: walletData.balance || 0,
    currency: walletData.currency || 'COP',
    ucoins: walletData.ucoins || 0,
    meritos: walletData.meritos || 0,
    ondas: walletData.ondas || 0,
    pendingBalance: walletData.pendingBalance || 0,
    monthlyChange: walletData.monthlyChange || 0,
    ayniLevel: walletData.ayniLevel || 25,
    collaborationScore: walletData.collaborationScore || 8.5,
    communityRank: walletData.communityRank || '#1,247',
  };

  return (
    <Box>
      {/* 🔄 Indicador de carga */}
      {isLoading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Sincronizando datos del wallet...
          </Typography>
        </Box>
      )}

      {/* 📊 Header con estadísticas generales */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Mi Wallet CoomÜnity
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="text.secondary">
              {isRealTime ? '🌐 Datos en tiempo real' : '📱 Datos offline'}
            </Typography>
            {isRealTime && (
              <Chip
                label="SINCRONIZADO"
                size="small"
                color="success"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        </Box>

        <Tooltip
          title={balanceVisible ? 'Ocultar balances' : 'Mostrar balances'}
        >
          <IconButton
            onClick={onToggleVisibility}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {balanceVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 💰 Tarjetas de balance principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{xs:12,md:6}}>
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

        <Grid size={{xs:12,md:6}}>
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
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{xs:12,sm:6,md:3}}>
          <motion.div
            onHoverStart={() => setHoveredCard('meritos')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              sx={{
                bgcolor:
                  hoveredCard === 'meritos' ? 'success.50' : 'background.paper',
                transition: 'all 0.3s ease',
                border: 1,
                borderColor:
                  hoveredCard === 'meritos' ? 'success.main' : 'divider',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Mëritos
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {balanceVisible
                    ? (normalizedData.meritos || 0).toLocaleString()
                    : '•••'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Contribuciones al Bien Común
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{xs:12,sm:6,md:3}}>
          <motion.div
            onHoverStart={() => setHoveredCard('ondas')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              sx={{
                bgcolor:
                  hoveredCard === 'ondas' ? 'warning.50' : 'background.paper',
                transition: 'all 0.3s ease',
                border: 1,
                borderColor:
                  hoveredCard === 'ondas' ? 'warning.main' : 'divider',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Lightbulb sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold">
                    Öndas
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {balanceVisible
                    ? (normalizedData.ondas || 0).toLocaleString()
                    : '•••'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Energía vibracional positiva
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ bgcolor: 'info.50', border: 1, borderColor: 'info.200' }}>
            <CardContent>
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
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:6,md:3}}>
          <Card
            sx={{ bgcolor: 'purple.50', border: 1, borderColor: 'purple.200' }}
          >
            <CardContent>
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
          </Card>
        </Grid>
      </Grid>

      {/* 🌱 Métricas Ayni */}
      <AyniMetrics
        ayniLevel={normalizedData.ayniLevel}
        collaborationScore={normalizedData.collaborationScore}
        communityRank={normalizedData.communityRank}
      />
    </Box>
  );
};
