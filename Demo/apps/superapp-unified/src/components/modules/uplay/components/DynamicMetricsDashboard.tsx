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

const COLORS = {
  primary: '#2563eb',
  meritos: '#fbbf24',
  ondas: '#10b981',
  racha: '#ef4444',
  precision: '#8b5cf6',
  nivel: '#06b6d4',
  background: '#f8fafc',
  cardBg: '#ffffff',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    const avgPrecision = progressHistory.reduce((acc, curr) => acc + curr.precision, 0) / progressHistory.length || 0;
    const totalRewards = metrics.meritos + metrics.ondas;
    const efficiencyScore = (metrics.precision * metrics.racha) / 100;
    const growthRate = progressHistory.length > 1 
      ? ((progressHistory[progressHistory.length - 1].meritos - progressHistory[0].meritos) / progressHistory[0].meritos) * 100 
      : 0;

    return {
      avgPrecision: Math.round(avgPrecision),
      totalRewards,
      efficiencyScore: Math.round(efficiencyScore),
      growthRate: Math.round(growthRate),
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
      color: COLORS.meritos,
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      description: 'Puntos por contribuciones al Bien Común',
      trend: '+12%'
    },
    {
      key: 'ondas',
      title: 'Öndas',
      value: metrics.ondas,
      icon: Bolt,
      color: COLORS.ondas,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Energía vibracional positiva',
      trend: '+8%'
    },
    {
      key: 'nivel',
      title: 'Nivel',
      value: metrics.nivel,
      icon: Star,
      color: COLORS.nivel,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      description: 'Progresión en conocimiento',
      trend: 'Subió 1'
    },
    {
      key: 'precision',
      title: 'Precisión',
      value: `${metrics.precision}%`,
      icon: Psychology,
      color: COLORS.precision,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      description: 'Exactitud en respuestas',
      trend: '+5%'
    },
    {
      key: 'racha',
      title: 'Racha',
      value: metrics.racha,
      icon: LocalFireDepartment,
      color: COLORS.racha,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      description: 'Días consecutivos de aprendizaje',
      trend: 'Activa'
    },
    {
      key: 'efficiency',
      title: 'Eficiencia',
      value: derivedMetrics.efficiencyScore,
      icon: Speed,
      color: COLORS.primary,
      gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      description: 'Índice de eficiencia de aprendizaje',
      trend: '+15%'
    }
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} sx={{ color: COLORS.primary }} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando métricas dinámicas...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: COLORS.background, minHeight: '100vh' }}>
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
              background: COLORS.gradient,
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
                  color: 'white',
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
                    background: 'rgba(255,255,255,0.1)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover::before': {
                    transform: 'translateX(100%)',
                  }
                }}
                onClick={() => setSelectedMetric(selectedMetric === card.key ? null : card.key)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <card.icon sx={{ fontSize: 40, opacity: 0.9 }} />
                    <Chip 
                      label={card.trend} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
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
                  
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    {card.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
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
                  <Timeline sx={{ mr: 2, color: COLORS.primary }} />
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
                        <stop offset="5%" stopColor={COLORS.meritos} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.meritos} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="ondaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.ondas} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS.ondas} stopOpacity={0.1}/>
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
                      stroke={COLORS.meritos} 
                      fillOpacity={1} 
                      fill="url(#meritoGradient)"
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ondas" 
                      stroke={COLORS.ondas} 
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
                  <DataUsage sx={{ mr: 2, color: COLORS.primary }} />
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
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Celebration sx={{ mr: 2, color: COLORS.primary }} />
              <Typography variant="h6">Logros Recientes</Typography>
              <Box sx={{ ml: 'auto' }}>
                <Chip 
                  icon={<AutoAwesome />} 
                  label={`${metrics.logrosDesbloqueados} logros desbloqueados`}
                  color="primary"
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
                          ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                          : achievement.rarity === 'epic'
                          ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                          : achievement.rarity === 'rare'
                          ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
                          : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                        color: 'white'
                      }}
                    >
                      <CardContent>
                        <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" sx={{ mb: 1 }}>
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
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Insights sx={{ mr: 2, color: COLORS.primary }} />
              <Typography variant="h6">Insights de la Comunidad</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    margin: '0 auto 16px',
                    background: COLORS.gradient 
                  }}>
                    <Groups sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.primary }}>
                    #{metrics.rankingComunidad}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
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
                    background: COLORS.gradient 
                  }}>
                    <ShowChart sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.ondas }}>
                    {derivedMetrics.avgPrecision}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
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
                    background: COLORS.gradient 
                  }}>
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: COLORS.meritos }}>
                    +{derivedMetrics.growthRate}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
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