import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Chip, useTheme, alpha } from '@mui/material';
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
  const theme = useTheme();
  const [previousData, setPreviousData] = useState(data);
  const [changes, setChanges] = useState<Record<string, number>>({});

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
      color: theme.palette.primary.main,
      unit: '',
      formatter: (value) => value.toLocaleString(),
      getStatus: (value) => {
        if (value > 1500)
          return { status: 'PEAK', color: theme.palette.success.main };
        if (value > 1000)
          return { status: 'HIGH', color: theme.palette.warning.main };
        if (value > 500) return { status: 'NORMAL', color: theme.palette.info.main };
        return { status: 'LOW', color: theme.palette.error.main };
      },
    },
    {
      key: 'searchesPerMinute',
      title: 'Searches/Min',
      icon: <SpeedIcon />,
      color: theme.palette.secondary.main,
      unit: '/min',
      formatter: (value) => value.toString(),
      getStatus: (value) => {
        if (value > 30)
          return { status: 'BLAZING', color: theme.palette.success.main };
        if (value > 20) return { status: 'FAST', color: theme.palette.warning.main };
        if (value > 10) return { status: 'STEADY', color: theme.palette.info.main };
        return { status: 'SLOW', color: theme.palette.error.main };
      },
    },
    {
      key: 'conversionRate',
      title: 'Conversion Rate',
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      unit: '%',
      formatter: (value) => value.toFixed(1),
      getStatus: (value) => {
        if (value > 25)
          return { status: 'EXCELLENT', color: theme.palette.success.main };
        if (value > 20) return { status: 'GREAT', color: theme.palette.warning.main };
        if (value > 15) return { status: 'GOOD', color: theme.palette.info.main };
        return { status: 'NEEDS WORK', color: theme.palette.error.main };
      },
    },
    {
      key: 'serverLoad',
      title: 'Server Load',
      icon: <MemoryIcon />,
      color: theme.palette.warning.main,
      unit: '%',
      formatter: (value) => value.toString(),
      getStatus: (value) => {
        if (value > 80)
          return { status: 'CRITICAL', color: theme.palette.error.main };
        if (value > 60) return { status: 'HIGH', color: theme.palette.warning.main };
        if (value > 40)
          return { status: 'MODERATE', color: theme.palette.info.main };
        return { status: 'OPTIMAL', color: theme.palette.success.main };
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
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderLeft: `4px solid ${metric.color}`,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: metric.color,
              boxShadow: `0 2px 8px ${alpha(metric.color, 0.1)}`,
            },
          }}
        >
          {/* Live indicator */}
          <motion.div
            animate={{
              opacity: [1, 0.3, 1],
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
              background: status.color,
            }}
          />

          <Box position="relative" zIndex={2}>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  color: metric.color,
                  mr: 1,
                }}
              >
                {metric.icon}
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
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
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: metric.color,
                      lineHeight: 1,
                    }}
                  >
                    {metric.formatter(value)}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: change > 0 ? theme.palette.success.main : theme.palette.error.main,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        mt: 0.5,
                      }}
                    >
                      {change > 0 ? '+' : ''}
                      {metric.formatter(Math.abs(change))}
                      {metric.unit}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Status */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Chip
                label={status.status}
                size="small"
                sx={{
                  backgroundColor: alpha(status.color, 0.1),
                  color: status.color,
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  border: `1px solid ${alpha(status.color, 0.3)}`,
                }}
              />
            </Box>

            {/* Performance bar */}
            <Box position="relative">
              <Box
                sx={{
                  height: 4,
                  backgroundColor: alpha(theme.palette.divider, 0.3),
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((value / getMaxValue(metric.key)) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: metric.color,
                    borderRadius: 2,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Background effect */}
          <motion.div
            animate={{
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at 80% 20%, ${alpha(metric.color, 0.1)} 0%, transparent 50%)`,
              pointerEvents: 'none',
            }}
          />
        </Paper>
      </motion.div>
    );
  };

  // Helper function to determine max values for progress bars
  const getMaxValue = (key: keyof RealTimeData): number => {
    switch (key) {
      case 'activeUsers':
        return 2000;
      case 'searchesPerMinute':
        return 50;
      case 'conversionRate':
        return 30;
      case 'serverLoad':
        return 100;
      default:
        return 100;
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          🔴 Live Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time system performance indicators
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} lg={3} key={metric.key}>
            <MetricCardComponent metric={metric} />
          </Grid>
        ))}
      </Grid>

      {/* Global indicators */}
      <Box mt={3} display="flex" gap={2} flexWrap="wrap">
        <Chip
          icon={<WifiIcon />}
          label="Connection Active"
          variant="outlined"
          sx={{
            color: theme.palette.success.main,
            borderColor: alpha(theme.palette.success.main, 0.3),
            backgroundColor: alpha(theme.palette.success.main, 0.05),
          }}
        />
        <Chip
          icon={<FlashIcon />}
          label={`Last Update: ${new Date().toLocaleTimeString()}`}
          variant="outlined"
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
          }}
        />
      </Box>
    </Box>
  );
};

export default RealTimeMetrics;
