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
import { motion, AnimatePresence, easeOut, backOut, easeInOut } from 'framer-motion';
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
  gradientBlue: 'linear-gradient(135deg, #2563eb 0%, #6366f1 60%, #a78bfa 100%)',
  gradientViolet: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 60%, #e5e4e2 100%)',
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
      transition: { duration: 0.5, ease: easeOut }
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
      transition: { duration: 0.6, ease: backOut }
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
    <Box
      sx={{
        p: { xs: 1.5, md: 5 },
        background: 'rgba(36,41,70,0.72)',
        minHeight: '100vh',
        borderRadius: 6,
        boxShadow: '0 0 48px 0 #6366f144, 0 0 0 4px #8b5cf622',
        position: 'relative',
        overflow: 'hidden',
        mt: 4,
        mb: 8,
        mx: { xs: 0, md: 2 },
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(circle at 70% 10%, #a78bfa22 0%, transparent 80%)',
          pointerEvents: 'none',
        },
        '::after': {
          content: '""',
          position: 'absolute',
          left: '60%',
          top: '80%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2563eb22 0%, transparent 80%)',
          filter: 'blur(24px)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: COSMIC_COLORS.gradientBlue,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
              letterSpacing: 2,
              textShadow: '0 2px 8px #6366f144',
            }}
          >
            Dashboard Dinámico ÜPlay
          </Typography>
          <Typography variant="body1" sx={{ color: '#e5e4e2', opacity: 0.78, fontWeight: 400, letterSpacing: 1, mb: 1 }}>
            Métricas en tiempo real de tu progreso de aprendizaje
          </Typography>
        </Box>
      </motion.div>
      <Grid container spacing={3} sx={{ mb: 3, mt: 1, alignItems: 'stretch', justifyContent: 'center' }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={card.key} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.10 }}
            >
              <Card
                sx={{
                  background: card.gradient,
                  color: '#fff',
                  borderRadius: 24,
                  boxShadow: `0 4px 32px 0 ${card.color}22, 0 0 0 2px #fff1`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 140,
                  minWidth: 220,
                  maxWidth: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  transition: 'box-shadow 0.38s, transform 0.22s',
                  '&:hover': {
                    boxShadow: `0 8px 48px 0 ${card.color}44, 0 0 0 4px #fff2`,
                    transform: 'scale(1.025)',
                    background: `radial-gradient(circle at 70% 30%, #fff1 0%, transparent 70%), ${card.gradient}`,
                  },
                  '&:focus': {
                    outline: '2px solid #a78bfa',
                    boxShadow: '0 0 0 6px #a78bfa33',
                  },
                }}
                tabIndex={0}
                onClick={() => setSelectedMetric(selectedMetric === card.key ? null : card.key)}
              >
                {/* Overlay de luz sutil */}
                <Box sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                  background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  borderRadius: 24,
                }} />
                <CardContent sx={{ position: 'relative', zIndex: 1, width: '100%', p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <motion.div
                      animate={{ scale: [1, 1.04, 0.98, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: easeInOut }}
                    >
                      <card.icon sx={{ fontSize: 32, opacity: 0.92, color: card.color, filter: 'drop-shadow(0 0 6px #fff3)' }} />
                    </motion.div>
                    <Chip
                      label={card.trend}
                      size="small"
                      sx={{
                        background: COSMIC_COLORS.gradientViolet,
                        color: '#fff',
                        fontWeight: 600,
                        boxShadow: '0 1px 6px 0 rgba(99,102,241,0.13)',
                        borderRadius: 4,
                        px: 1.2,
                        py: 0.2,
                        fontSize: 13,
                        letterSpacing: 0.5,
                        border: '1.5px solid #fff2',
                      }}
                    />
                  </Box>
                  <motion.div
                    key={`${card.key}-${animationKey}`}
                    variants={numberVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: 1.5, lineHeight: 1.1, textShadow: '0 1px 6px #fff3, 0 0 4px #6366f122' }}>
                      {card.value}
                    </Typography>
                  </motion.div>
                  <Typography variant="subtitle1" sx={{ opacity: 0.96, mb: 0.5, fontWeight: 600, letterSpacing: 0.7, textShadow: '0 1px 4px #fff2' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.82, fontSize: 15, mb: 1, letterSpacing: 0.3, color: '#e5e4e2', textShadow: '0 1px 3px #6366f122' }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {/* --- CHARTS ARMONIOSOS --- */}
      <Grid container spacing={3} sx={{ mb: 2, alignItems: 'stretch', justifyContent: 'center' }}>
        {/* Progreso Temporal */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card sx={{ height: 260, background: 'rgba(60,60,100,0.55)', borderRadius: 18, boxShadow: '0 2px 24px 0 #6366f122', backdropFilter: 'blur(8px)', p: 0 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Timeline sx={{ mr: 1, color: COSMIC_COLORS.blue }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.7 }}>Progreso Temporal</Typography>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      icon={<TrendingUp />}
                      label={`+${derivedMetrics.growthRate}% crecimiento`}
                      sx={{ background: COSMIC_COLORS.gradientViolet, color: '#fff', fontWeight: 600, borderRadius: 3, px: 1, py: 0.2, fontSize: 13, letterSpacing: 0.5, boxShadow: '0 1px 6px 0 rgba(99,102,241,0.13)' }}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={progressHistory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="meritoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COSMIC_COLORS.gold} stopOpacity={0.7}/>
                        <stop offset="95%" stopColor={COSMIC_COLORS.gold} stopOpacity={0.08}/>
                      </linearGradient>
                      <linearGradient id="ondaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COSMIC_COLORS.blue} stopOpacity={0.7}/>
                        <stop offset="95%" stopColor={COSMIC_COLORS.blue} stopOpacity={0.08}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f022" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'rgba(36,41,70,0.92)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px -1px #6366f122',
                        color: '#fff',
                        fontSize: 13,
                      }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: COSMIC_COLORS.violet, fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="meritos"
                      stroke={COSMIC_COLORS.gold}
                      fillOpacity={1}
                      fill="url(#meritoGradient)"
                      strokeWidth={2.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="ondas"
                      stroke={COSMIC_COLORS.blue}
                      fillOpacity={1}
                      fill="url(#ondaGradient)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        {/* Distribución por Categorías */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ height: 260, background: 'rgba(60,60,100,0.55)', borderRadius: 18, boxShadow: '0 2px 24px 0 #8b5cf122', backdropFilter: 'blur(8px)', p: 0 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DataUsage sx={{ mr: 1, color: COSMIC_COLORS.violet }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, letterSpacing: 0.7 }}>Distribución por Categorías</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={categoryProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={48}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'rgba(36,41,70,0.92)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px -1px #8b5cf122',
                        color: '#fff',
                        fontSize: 13,
                      }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: COSMIC_COLORS.blue, fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 1.5 }}>
                  {categoryProgress.map((category, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          backgroundColor: category.color,
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1, fontSize: 13, color: '#e5e4e2' }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, color: '#fff' }}>
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
        <Card sx={{ mb: 4, background: COSMIC_COLORS.gradientViolet, color: '#fff', borderRadius: 7, boxShadow: '0 8px 40px 0 rgba(99,102,241,0.22)', backdropFilter: 'blur(18px)' }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 70%)',
            animation: 'cosmicGlow 7s ease-in-out infinite alternate',
            '@keyframes cosmicGlow': {
              '0%': { opacity: 0.7 },
              '100%': { opacity: 1 },
            },
            borderRadius: 7,
          }} />
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Celebration sx={{ mr: 2, color: COSMIC_COLORS.gold, filter: 'drop-shadow(0 0 8px #fff5)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>Logros Recientes</Typography>
              <Box sx={{ ml: 'auto' }}>
                <Chip
                  icon={<AutoAwesome />}
                  label={`${metrics.logrosDesbloqueados} logros desbloqueados`}
                  sx={{ background: COSMIC_COLORS.gradientGold, color: '#222', fontWeight: 700, borderRadius: 3, px: 1.5, py: 0.5, fontSize: 15, letterSpacing: 0.5, boxShadow: '0 2px 8px 0 rgba(99,102,241,0.18)' }}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Grid container spacing={2}>
              {[
                { title: 'Maestro Reciprocidad', description: 'Equilibrio perfecto en dar y recibir', rarity: 'legendary' },
                { title: 'Sabio Colaborativo', description: '100 respuestas correctas consecutivas', rarity: 'epic' },
                { title: 'Explorador Curioso', description: 'Completó todas las categorías', rarity: 'rare' },
                { title: 'Mentor Öndas', description: 'Generó 1000 Öndas positivas', rarity: 'common' },
              ].map((achievement, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.07, boxShadow: '0 12px 48px 0 rgba(191,174,96,0.22)' }}
                    whileTap={{ scale: 0.97 }}
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
                        borderRadius: 7,
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
                        <EmojiEvents sx={{ fontSize: 40, mb: 1, color: COSMIC_COLORS.gold, filter: 'drop-shadow(0 0 8px #fff5)' }} />
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, letterSpacing: 0.5 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: 15 }}>
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
        <Card sx={{ background: COSMIC_COLORS.gradientBlue, color: '#fff', borderRadius: 7, boxShadow: '0 8px 40px 0 rgba(99,102,241,0.22)', backdropFilter: 'blur(18px)' }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10) 0%, transparent 70%)',
            animation: 'cosmicGlow 8s ease-in-out infinite alternate',
            '@keyframes cosmicGlow': {
              '0%': { opacity: 0.7 },
              '100%': { opacity: 1 },
            },
            borderRadius: 7,
          }} />
          <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Insights sx={{ mr: 2, color: COSMIC_COLORS.violet, filter: 'drop-shadow(0 0 8px #fff5)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>Insights de la Comunidad</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px',
                    background: COSMIC_COLORS.gradientViolet,
                    border: '3px solid #fff',
                    boxShadow: '0 0 24px 0 #a78bfa88',
                  }}>
                    <Groups sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.blue, textShadow: '0 2px 8px #fff5' }}>
                    #{metrics.rankingComunidad}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2', fontWeight: 500 }}>
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
                    background: COSMIC_COLORS.gradientBlue,
                    border: '3px solid #fff',
                    boxShadow: '0 0 24px 0 #6366f188',
                  }}>
                    <ShowChart sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.violet, textShadow: '0 2px 8px #fff5' }}>
                    {derivedMetrics.avgPrecision}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2', fontWeight: 500 }}>
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
                    background: COSMIC_COLORS.gradientGold,
                    border: '3px solid #fff',
                    boxShadow: '0 0 24px 0 #bfae6088',
                  }}>
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COSMIC_COLORS.gold, textShadow: '0 2px 8px #fff5' }}>
                    +{derivedMetrics.growthRate}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e5e4e2', fontWeight: 500 }}>
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
