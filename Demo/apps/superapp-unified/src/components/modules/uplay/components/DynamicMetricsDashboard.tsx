import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Avatar,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import {
  TrendingUp,
  EmojiEvents,
  Bolt,
  Star,
  Timeline,
  Insights,
  LocalFireDepartment,
  Psychology,
  Groups,
  Speed,
  Celebration,
  AutoAwesome,
  DataUsage,
  ShowChart,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, AreaChart, Area, BarChart, Bar } from 'recharts';

interface MetricsData {
  meritos: number;
  ondas: number;
  nivel: number;
  precision: number;
  racha: number;
  videosCompletados: number;
  tiempoTotal: number;
  preguntasRespondidas: number;
  logrosDesbloqueados: number;
  rankingComunidad: number;
}

interface ProgressData {
  date: string;
  meritos: number;
  ondas: number;
  precision: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface DynamicMetricsDashboardProps {
  metrics: MetricsData;
  progressHistory: ProgressData[];
  categoryProgress: CategoryData[];
  isLoading?: boolean;
  showAnimations?: boolean;
}

const COSMIC_COLORS = {
  blue: '#2563eb',
  violet: '#8b5cf6',
  gold: '#bfae60',
  silver: '#e5e4e2',
  gray: '#a1a1aa',
  lightViolet: '#a78bfa',
  lightBlue: '#60a5fa',
  background: 'rgba(36,41,70,0.92)',
  cardBg: 'rgba(60,60,100,0.85)',
  gradientBlue: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
  gradientViolet: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  gradientGold: 'linear-gradient(135deg, #bfae60 0%, #e5e4e2 100%)',
  gradientGray: 'linear-gradient(135deg, #a1a1aa 0%, #d1d5db 100%)',
};

const DynamicMetricsDashboard: React.FC<DynamicMetricsDashboardProps> = ({
  metrics,
  progressHistory,
  categoryProgress,
  isLoading = false,
  showAnimations = true,
}) => {
  const theme = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when metrics change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [metrics]);

  // Calculate derived metrics with defensive programming
  const derivedMetrics = useMemo(() => {
    // Validate progressHistory
    const validProgressHistory = Array.isArray(progressHistory) ? progressHistory : [];

    // Calculate with fallbacks to prevent NaN
    const avgPrecision = validProgressHistory.length > 0
      ? validProgressHistory.reduce((acc, curr) => acc + (curr?.precision || 0), 0) / validProgressHistory.length
      : 0;

    const totalRewards = (metrics?.meritos || 0) + (metrics?.ondas || 0);
    const efficiencyScore = ((metrics?.precision || 0) * (metrics?.racha || 0)) / 100;

    let growthRate = 0;
    if (validProgressHistory.length > 1) {
      const firstValue = validProgressHistory[0]?.meritos || 0;
      const lastValue = validProgressHistory[validProgressHistory.length - 1]?.meritos || 0;
      if (firstValue > 0) {
        growthRate = ((lastValue - firstValue) / firstValue) * 100;
      }
    }

    return {
      avgPrecision: Math.round(isNaN(avgPrecision) ? 0 : avgPrecision),
      totalRewards: isNaN(totalRewards) ? 0 : totalRewards,
      efficiencyScore: Math.round(isNaN(efficiencyScore) ? 0 : efficiencyScore),
      growthRate: Math.round(isNaN(growthRate) ? 0 : growthRate),
    };
  }, [metrics, progressHistory]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "backOut" }
    }
  };

  // Metric cards configuration
  const metricCards = [
    {
      key: 'meritos',
      title: 'Mëritos',
      value: metrics.meritos,
      icon: EmojiEvents,
      color: COSMIC_COLORS.gold,
      gradient: COSMIC_COLORS.gradientGold,
      description: 'Puntos por contribuciones al Bien Común',
      trend: '+12%'
    },
    {
      key: 'ondas',
      title: 'Öndas',
      value: metrics.ondas,
      icon: Bolt,
      color: COSMIC_COLORS.blue,
      gradient: COSMIC_COLORS.gradientBlue,
      description: 'Energía vibracional positiva',
      trend: '+8%'
    },
    {
      key: 'nivel',
      title: 'Nivel',
      value: metrics.nivel,
      icon: Star,
      color: COSMIC_COLORS.violet,
      gradient: COSMIC_COLORS.gradientViolet,
      description: 'Progresión en conocimiento',
      trend: 'Subió 1'
    },
    {
      key: 'precision',
      title: 'Precisión',
      value: `${metrics.precision}%`,
      icon: Psychology,
      color: COSMIC_COLORS.violet,
      gradient: COSMIC_COLORS.gradientViolet,
      description: 'Exactitud en respuestas',
      trend: '+5%'
    },
    {
      key: 'racha',
      title: 'Racha',
      value: metrics.racha,
      icon: LocalFireDepartment,
      color: COSMIC_COLORS.gold,
      gradient: COSMIC_COLORS.gradientGold,
      description: 'Días consecutivos de aprendizaje',
      trend: 'Activa'
    },
    {
      key: 'efficiency',
      title: 'Eficiencia',
      value: derivedMetrics.efficiencyScore,
      icon: Speed,
      color: COSMIC_COLORS.blue,
      gradient: COSMIC_COLORS.gradientBlue,
      description: 'Índice de eficiencia de aprendizaje',
      trend: '+15%'
    }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} sx={{ color: COSMIC_COLORS.blue }} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando métricas dinámicas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: COSMIC_COLORS.background, minHeight: '100vh' }}>
      {/* Header with animated title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: COSMIC_COLORS.gradientBlue,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            Dashboard Dinámico ÜPlay
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Métricas en tiempo real de tu progreso de aprendizaje
          </Typography>
        </Box>
      </motion.div>

      {/* Main Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.key}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
            >
              <Card
                sx={{
                  background: card.gradient,
                  color: '#fff',
                  borderRadius: 5,
                  boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 5,
                    pointerEvents: 'none',
                  },
                  '&:hover': {
                    boxShadow: '0 8px 32px 0 rgba(99,102,241,0.22)',
                  },
                }}
                onClick={() => setSelectedMetric(selectedMetric === card.key ? null : card.key)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <card.icon sx={{ fontSize: 40, opacity: 0.9, color: card.color }} />
                    <Chip
                      label={card.trend}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.18)',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <motion.div
                    key={`${card.key}-${animationKey}`}
                    variants={numberVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                  </motion.div>
                  <Typography variant="h6" sx={{ opacity: 0.92, mb: 1, fontWeight: 600 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Interactive Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Progress Timeline */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Timeline sx={{ mr: 2, color: COSMIC_COLORS.blue }} />
                  <Typography variant="h6">Progreso Temporal</Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${derivedMetrics.growthRate}% crecimiento`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={progressHistory}>
                    <defs>
                      <linearGradient id="meritoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COSMIC_COLORS.gold} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COSMIC_COLORS.gold} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="ondaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COSMIC_COLORS.blue} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COSMIC_COLORS.blue} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="meritos"
                      stroke={COSMIC_COLORS.gold}
                      fillOpacity={1}
                      fill="url(#meritoGradient)"
                      strokeWidth={3}
                    />
                    <Area
                      type="monotone"
                      dataKey="ondas"
                      stroke={COSMIC_COLORS.blue}
                      fillOpacity={1}
                      fill="url(#ondaGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DataUsage sx={{ mr: 2, color: COSMIC_COLORS.blue }} />
                  <Typography variant="h6">Distribución por Categorías</Typography>
                </Box>

                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>

                <Box sx={{ mt: 2 }}>
                  {categoryProgress.map((category, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor: category.color,
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {category.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Achievement Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card sx={{ mb: 4, background: COSMIC_COLORS.gradientViolet, color: '#fff', borderRadius: 5, boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)', backdropFilter: 'blur(8px)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Celebration sx={{ mr: 2, color: COSMIC_COLORS.gold }} />
              <Typography variant="h6">Logros Recientes</Typography>
              <Box sx={{ ml: 'auto' }}>
                <Chip
                  icon={<AutoAwesome />}
                  label={`${metrics.logrosDesbloqueados} logros desbloqueados`}
                  sx={{ background: COSMIC_COLORS.gradientGold, color: '#222', fontWeight: 700 }}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Grid container spacing={2}>
              {[
                { title: 'Maestro Ayni', description: 'Equilibrio perfecto en dar y recibir', rarity: 'legendary' },
                { title: 'Sabio Colaborativo', description: '100 respuestas correctas consecutivas', rarity: 'epic' },
                { title: 'Explorador Curioso', description: 'Completó todas las categorías', rarity: 'rare' },
                { title: 'Mentor Öndas', description: 'Generó 1000 Öndas positivas', rarity: 'common' },
              ].map((achievement, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      sx={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: achievement.rarity === 'legendary'
                          ? COSMIC_COLORS.gradientGold
                          : achievement.rarity === 'epic'
                          ? COSMIC_COLORS.gradientViolet
                          : achievement.rarity === 'rare'
                          ? COSMIC_COLORS.gradientBlue
                          : COSMIC_COLORS.gradientGray,
                        color: '#fff',
                        borderRadius: 5,
                        boxShadow: '0 4px 24px 0 rgba(99,102,241,0.12)',
                        backdropFilter: 'blur(8px)',
                        minHeight: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      <CardContent>
                        <EmojiEvents sx={{ fontSize: 40, mb: 1, color: COSMIC_COLORS.gold }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {achievement.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card sx={{ background: COSMIC_COLORS.gradientBlue, color: '#fff', borderRadius: 5, boxShadow: '0 4px 24px 0 rgba(99,102,241,0.18)', backdropFilter: 'blur(8px)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Insights sx={{ mr: 2, color: COSMIC_COLORS.violet }} />
              <Typography variant="h6">Insights de la Comunidad</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    background: COSMIC_COLORS.gradientViolet
                  }}>
                    <Groups sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.blue }}>
                    #{metrics.rankingComunidad}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2' }}>
                    Ranking en la Comunidad
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    background: COSMIC_COLORS.gradientBlue
                  }}>
                    <ShowChart sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.violet }}>
                    {derivedMetrics.avgPrecision}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2' }}>
                    Precisión Promedio Global
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    background: COSMIC_COLORS.gradientGold
                  }}>
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.gold }}>
                    +{derivedMetrics.growthRate}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2' }}>
                    Crecimiento este Mes
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default DynamicMetricsDashboard;
