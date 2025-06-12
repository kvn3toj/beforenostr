import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  WorkspacePremium,
  Group,
  Schedule,
  Star,
  LocalFireDepartment,
  Psychology,
  MonetizationOn,
  EmojiEvents,
  Timeline,
  Refresh,
  InfoOutlined,
} from '@mui/icons-material';

interface ChallengeStatsProps {
  stats: {
    total: number;
    active: number;
    participating: number;
    completed: number;
    totalPoints?: number;
    currentStreak?: number;
    weeklyCompleted?: number;
    averageRating?: number;
    totalParticipants?: number;
    successRate?: number;
  };
  userStats?: {
    totalMerits: number;
    totalLukas: number;
    totalOndas: number;
    level: number;
    currentExp: number;
    nextLevelExp: number;
    badges: number;
    rank?: number;
    weeklyProgress: number;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
  tooltip?: string;
}> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary.main',
  progress,
  trend,
  tooltip,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <TrendingUp sx={{ fontSize: 16, color: 'success.main', ml: 0.5 }} />
        );
      case 'down':
        return (
          <TrendingUp
            sx={{
              fontSize: 16,
              color: 'error.main',
              ml: 0.5,
              transform: 'rotate(180deg)',
            }}
          />
        );
      default:
        return null;
    }
  };

  const content = (
    <Card
      sx={{
        height: '100%',
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 40,
              height: 40,
              mr: 1.5,
              boxShadow: 2,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: color,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {value}
              {getTrendIcon()}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontWeight: 500 }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        {subtitle && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: progress ? 1 : 0 }}
          >
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: color,
              },
            }}
          />
        )}
      </CardContent>
    </Card>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#2196F3',
  backgroundColor = '#f0f0f0',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" fontWeight={600} color={color}>
          {Math.round(progress)}%
        </Typography>
      </Box>
    </Box>
  );
};

export const ChallengeStats: React.FC<ChallengeStatsProps> = ({
  stats,
  userStats,
  loading = false,
  onRefresh,
}) => {
  const participationRate =
    stats.total > 0 ? (stats.participating / stats.total) * 100 : 0;
  const completionRate =
    stats.participating > 0 ? (stats.completed / stats.participating) * 100 : 0;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          📊 Estadísticas de Desafíos
        </Typography>
        {onRefresh && (
          <Tooltip title="Actualizar estadísticas">
            <IconButton onClick={onRefresh} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Total Desafíos"
            value={stats.total}
            icon={<EmojiEvents />}
            color="#FF6B35"
            tooltip="Número total de desafíos disponibles en la plataforma"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Activos"
            value={stats.active}
            icon={<LocalFireDepartment />}
            color="#4CAF50"
            trend="up"
            tooltip="Desafíos actualmente disponibles para unirse"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Participando"
            value={stats.participating}
            icon={<Group />}
            color="#2196F3"
            subtitle={`${participationRate.toFixed(1)}% de participación`}
            tooltip="Desafíos en los que estás participando actualmente"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Completados"
            value={stats.completed}
            icon={<WorkspacePremium />}
            color="#9C27B0"
            trend="up"
            tooltip="Desafíos que has completado exitosamente"
          />
        </Grid>
      </Grid>

      {/* User Progress Section */}
      {userStats && (
        <>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            🏆 Tu Progreso en CoomÜnity
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Experience Progress */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Nivel {userStats.level}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <ProgressRing
                    progress={
                      (userStats.currentExp / userStats.nextLevelExp) * 100
                    }
                    size={100}
                    color="#FF6B35"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {userStats.currentExp}/{userStats.nextLevelExp} EXP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userStats.nextLevelExp - userStats.currentExp} EXP para el
                  siguiente nivel
                </Typography>
              </Card>
            </Grid>

            {/* Rewards Summary */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  💰 Recompensas Acumuladas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 1 }}
                      >
                        <WorkspacePremium />
                      </Avatar>
                      <Typography variant="h6" color="warning.main">
                        {userStats.totalMerits.toLocaleString()}
                      </Typography>
                      <Typography variant="caption">Mëritos</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}
                      >
                        <MonetizationOn />
                      </Avatar>
                      <Typography variant="h6" color="success.main">
                        {userStats.totalLukas.toLocaleString()}
                      </Typography>
                      <Typography variant="caption">Lükas</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                        <Psychology />
                      </Avatar>
                      <Typography variant="h6" color="info.main">
                        {userStats.totalOndas.toLocaleString()}
                      </Typography>
                      <Typography variant="caption">Öndas</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Avatar
                        sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}
                      >
                        <Star />
                      </Avatar>
                      <Typography variant="h6" color="secondary.main">
                        {userStats.badges}
                      </Typography>
                      <Typography variant="caption">Insignias</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* Weekly Progress */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                📅 Progreso Semanal
              </Typography>
              {userStats.rank && (
                <Chip
                  label={`#${userStats.rank} en el ranking`}
                  color="primary"
                  size="small"
                  icon={<EmojiEvents />}
                />
              )}
            </Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Meta semanal: {userStats.weeklyProgress}% completada
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={userStats.weeklyProgress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background:
                        'linear-gradient(90deg, #4CAF50, #8BC34A, #CDDC39)',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary.main">
                      {stats.weeklyCompleted || 0}
                    </Typography>
                    <Typography variant="caption">Esta semana</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                      {stats.currentStreak || 0}
                    </Typography>
                    <Typography variant="caption">Racha de días</Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </>
      )}

      {/* Platform Stats */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          🌍 Estadísticas de la Comunidad
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {stats.totalParticipants?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Participantes totales
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {stats.successRate?.toFixed(1) || '0'}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasa de éxito promedio
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {stats.averageRating?.toFixed(1) || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calificación promedio
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {stats.totalPoints?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mëritos totales
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Ayni Philosophy Note */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <InfoOutlined color="primary" />
        <Typography variant="body2" color="text.secondary">
          <strong>Filosofía Ayni:</strong> Los desafíos en CoomÜnity están
          diseñados para fomentar la reciprocidad y el Bien Común. Cada
          participación contribuye al crecimiento colectivo de nuestra
          comunidad. 🌱
        </Typography>
      </Box>
    </Box>
  );
};
