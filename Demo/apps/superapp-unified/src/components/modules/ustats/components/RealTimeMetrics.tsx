import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Speed as SpeedIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Memory as MemoryIcon,
  Wifi as WifiIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';

interface RealTimeData {
  activeUsers: number;
  searchesPerMinute: number;
  conversionRate: number;
  serverLoad: number;
}

interface RealTimeMetricsProps {
  data: RealTimeData;
}

interface MetricCard {
  key: keyof RealTimeData;
  title: string;
  icon: React.ReactNode;
  color: string;
  unit: string;
  formatter: (value: number) => string;
  getStatus: (value: number) => { status: string; color: string };
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ data }) => {
  const [previousData, setPreviousData] = useState(data);
  const [changes, setChanges] = useState<Record<string, number>>({});

  const GAMING_COLORS = {
    primary: '#00ff88',
    secondary: '#ff0088',
    accent: '#ffaa00',
    neon: '#00ffff',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
  };

  // Track changes in data
  useEffect(() => {
    const newChanges: Record<string, number> = {};

    Object.keys(data).forEach((key) => {
      const currentValue = data[key as keyof RealTimeData];
      const previousValue = previousData[key as keyof RealTimeData];

      if (currentValue !== previousValue) {
        newChanges[key] = currentValue - previousValue;
      }
    });

    setChanges(newChanges);
    setPreviousData(data);
  }, [data, previousData]);

  const metrics: MetricCard[] = [
    {
      key: 'activeUsers',
      title: 'Active Users',
      icon: <PeopleIcon />,
      color: GAMING_COLORS.primary,
      unit: '',
      formatter: (value) => value.toLocaleString(),
      getStatus: (value) => {
        if (value > 1500)
          return { status: 'PEAK', color: GAMING_COLORS.success };
        if (value > 1000)
          return { status: 'HIGH', color: GAMING_COLORS.accent };
        if (value > 500) return { status: 'NORMAL', color: GAMING_COLORS.neon };
        return { status: 'LOW', color: GAMING_COLORS.error };
      },
    },
    {
      key: 'searchesPerMinute',
      title: 'Searches/Min',
      icon: <SpeedIcon />,
      color: GAMING_COLORS.secondary,
      unit: '/min',
      formatter: (value) => value.toString(),
      getStatus: (value) => {
        if (value > 30)
          return { status: 'BLAZING', color: GAMING_COLORS.success };
        if (value > 20) return { status: 'FAST', color: GAMING_COLORS.accent };
        if (value > 10) return { status: 'STEADY', color: GAMING_COLORS.neon };
        return { status: 'SLOW', color: GAMING_COLORS.error };
      },
    },
    {
      key: 'conversionRate',
      title: 'Conversion Rate',
      icon: <TrendingUpIcon />,
      color: GAMING_COLORS.accent,
      unit: '%',
      formatter: (value) => value.toFixed(1),
      getStatus: (value) => {
        if (value > 25)
          return { status: 'EXCELLENT', color: GAMING_COLORS.success };
        if (value > 20) return { status: 'GREAT', color: GAMING_COLORS.accent };
        if (value > 15) return { status: 'GOOD', color: GAMING_COLORS.neon };
        return { status: 'NEEDS WORK', color: GAMING_COLORS.error };
      },
    },
    {
      key: 'serverLoad',
      title: 'Server Load',
      icon: <MemoryIcon />,
      color: GAMING_COLORS.neon,
      unit: '%',
      formatter: (value) => value.toString(),
      getStatus: (value) => {
        if (value > 80)
          return { status: 'CRITICAL', color: GAMING_COLORS.error };
        if (value > 60) return { status: 'HIGH', color: GAMING_COLORS.warning };
        if (value > 40)
          return { status: 'MODERATE', color: GAMING_COLORS.accent };
        return { status: 'OPTIMAL', color: GAMING_COLORS.success };
      },
    },
  ];

  const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({
    metric,
  }) => {
    const value = data[metric.key];
    const change = changes[metric.key] || 0;
    const status = metric.getStatus(value);
    const hasChange = Math.abs(change) > 0;

    return (
      <motion.div
        layout
        whileHover={{ scale: 1.05, rotateY: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Paper
          sx={{
            p: 3,
            background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
            border: `1px solid ${metric.color}40`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${metric.color}20`,
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 0 30px ${metric.color}40`,
              border: `1px solid ${metric.color}80`,
            },
          }}
        >
          {/* Live indicator */}
          <motion.div
            animate={{
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: GAMING_COLORS.success,
              boxShadow: `0 0 10px ${GAMING_COLORS.success}`,
            }}
          />

          {/* Background glow */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            sx={{
              background: `radial-gradient(circle at center, ${metric.color}15 0%, transparent 70%)`,
              zIndex: 1,
            }}
          />

          <Box position="relative" zIndex={2}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  color: metric.color,
                  mr: 1,
                  filter: `drop-shadow(0 0 8px ${metric.color}80)`,
                }}
              >
                {metric.icon}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textShadow: `0 0 5px ${metric.color}40`,
                }}
              >
                {metric.title}
              </Typography>
            </Box>

            {/* Value with animation */}
            <Box position="relative" mb={2}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      color: metric.color,
                      fontWeight: 'bold',
                      textShadow: `0 0 20px ${metric.color}80`,
                      mb: 0.5,
                    }}
                  >
                    {metric.formatter(value)}
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{
                        color: metric.color,
                        opacity: 0.8,
                        ml: 0.5,
                      }}
                    >
                      {metric.unit}
                    </Typography>
                  </Typography>
                </motion.div>
              </AnimatePresence>

              {/* Change indicator */}
              <AnimatePresence>
                {hasChange && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{
                        color:
                          change > 0
                            ? GAMING_COLORS.success
                            : GAMING_COLORS.error,
                      }}
                    >
                      <FlashIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {change > 0 ? '+' : ''}
                        {change}
                        {change > 0 ? ' ↗️' : ' ↘️'}
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Status badge */}
            <motion.div
              animate={hasChange ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Chip
                label={status.status}
                size="small"
                sx={{
                  bgcolor: status.color,
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: `0 0 10px ${status.color}60`,
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                }}
              />
            </motion.div>

            {/* Progress bar for certain metrics */}
            {(metric.key === 'serverLoad' ||
              metric.key === 'conversionRate') && (
              <Box mt={2}>
                <Box
                  sx={{
                    height: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        metric.key === 'serverLoad'
                          ? `${value}%`
                          : `${Math.min(100, (value / 30) * 100)}%`,
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${status.color} 0%, ${status.color}80 100%)`,
                      borderRadius: '2px',
                      boxShadow: `0 0 8px ${status.color}60`,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Gaming corner accents */}
            <Box
              position="absolute"
              top={0}
              left={0}
              width={12}
              height={12}
              sx={{
                background: `linear-gradient(45deg, ${metric.color} 0%, transparent 100%)`,
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                opacity: 0.6,
              }}
            />
            <Box
              position="absolute"
              bottom={0}
              right={0}
              width={12}
              height={12}
              sx={{
                background: `linear-gradient(225deg, ${metric.color} 0%, transparent 100%)`,
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                opacity: 0.6,
              }}
            />
          </Box>
        </Paper>
      </motion.div>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
        border: `1px solid ${GAMING_COLORS.primary}40`,
        borderRadius: 2,
        boxShadow: `0 0 30px ${GAMING_COLORS.primary}20`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Grid Effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        sx={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <Box position="relative" zIndex={2}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{
              color: GAMING_COLORS.primary,
              fontWeight: 'bold',
              textShadow: `0 0 15px ${GAMING_COLORS.primary}60`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <WifiIcon sx={{ mr: 1 }} />
            🔴 LIVE METRICS DASHBOARD
          </Typography>

          <motion.div
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Chip
              label="REAL-TIME"
              size="small"
              sx={{
                bgcolor: GAMING_COLORS.success,
                color: '#000',
                fontWeight: 'bold',
                boxShadow: `0 0 12px ${GAMING_COLORS.success}60`,
                animation: 'pulse 2s infinite',
              }}
            />
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={metric.key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MetricCardComponent metric={metric} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* System Status */}
        <Box mt={3} textAlign="center">
          <motion.div
            animate={{
              textShadow: [
                `0 0 5px ${GAMING_COLORS.primary}60`,
                `0 0 20px ${GAMING_COLORS.primary}80`,
                `0 0 5px ${GAMING_COLORS.primary}60`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: GAMING_COLORS.primary,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              ⚡ ALL SYSTEMS OPERATIONAL ⚡
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Paper>
  );
};

export default RealTimeMetrics;
