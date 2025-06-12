import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface ActivityData {
  time: string;
  searches: number;
  conversions: number;
  users: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [liveData, setLiveData] = useState(data);

  const GAMING_COLORS = {
    primary: '#00ff88',
    secondary: '#ff0088',
    accent: '#ffaa00',
    background: '#0a0a0a',
    cardBg: '#1a1a1a',
    neon: '#00ffff',
  };

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prevData) =>
        prevData.map((item, index) => {
          if (index === prevData.length - 1) {
            // Update the last data point to simulate real-time changes
            return {
              ...item,
              searches: Math.max(
                50,
                item.searches + Math.floor(Math.random() * 20 - 10)
              ),
              conversions: Math.max(
                5,
                item.conversions + Math.floor(Math.random() * 6 - 3)
              ),
              users: Math.max(
                100,
                item.users + Math.floor(Math.random() * 50 - 25)
              ),
            };
          }
          return item;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value: number, type: string) => {
    switch (type) {
      case 'searches':
        if (value > 120)
          return { status: 'HIGH', color: GAMING_COLORS.primary };
        if (value > 80)
          return { status: 'NORMAL', color: GAMING_COLORS.accent };
        return { status: 'LOW', color: GAMING_COLORS.secondary };
      case 'conversions':
        if (value > 20)
          return { status: 'EXCELLENT', color: GAMING_COLORS.primary };
        if (value > 15) return { status: 'GOOD', color: GAMING_COLORS.accent };
        return { status: 'NEEDS IMPROVEMENT', color: GAMING_COLORS.secondary };
      default:
        return { status: 'NORMAL', color: GAMING_COLORS.accent };
    }
  };

  const currentSearches = liveData[liveData.length - 1]?.searches || 0;
  const currentConversions = liveData[liveData.length - 1]?.conversions || 0;
  const searchStatus = getMetricStatus(currentSearches, 'searches');
  const conversionStatus = getMetricStatus(currentConversions, 'conversions');

  return (
    <Paper
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${GAMING_COLORS.cardBg} 0%, #2a2a2a 100%)`,
        border: `1px solid ${GAMING_COLORS.accent}40`,
        borderRadius: 2,
        boxShadow: `0 0 20px ${GAMING_COLORS.accent}20`,
        height: 400,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        sx={{
          background: `radial-gradient(circle at bottom left, ${GAMING_COLORS.accent}10 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      <Box position="relative" zIndex={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: GAMING_COLORS.accent,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${GAMING_COLORS.accent}60`,
            }}
          >
            ⚡ Live Activity Feed
          </Typography>

          <Box display="flex" gap={1}>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Chip
                label={`SEARCHES: ${searchStatus.status}`}
                size="small"
                sx={{
                  bgcolor: searchStatus.color,
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: `0 0 10px ${searchStatus.color}60`,
                }}
              />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              <Chip
                label={`CONVERSIONS: ${conversionStatus.status}`}
                size="small"
                sx={{
                  bgcolor: conversionStatus.color,
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: `0 0 10px ${conversionStatus.color}60`,
                }}
              />
            </motion.div>
          </Box>
        </Box>

        <Box height={320}>
          {liveData.map((dataPoint, index) => (
            <motion.div
              key={dataPoint.time}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Box mb={3}>
                <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                  {dataPoint.time}
                </Typography>

                {/* Searches Bar */}
                <Box mb={1}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: GAMING_COLORS.primary }}
                    >
                      Searches
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff' }}>
                      {dataPoint.searches}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dataPoint.searches / 200) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${GAMING_COLORS.primary} 0%, ${GAMING_COLORS.primary}80 100%)`,
                        boxShadow: `0 0 8px ${GAMING_COLORS.primary}60`,
                      },
                    }}
                  />
                </Box>

                {/* Conversions Bar */}
                <Box mb={1}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: GAMING_COLORS.secondary }}
                    >
                      Conversions
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff' }}>
                      {dataPoint.conversions}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dataPoint.conversions / 50) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${GAMING_COLORS.secondary} 0%, ${GAMING_COLORS.secondary}80 100%)`,
                        boxShadow: `0 0 6px ${GAMING_COLORS.secondary}60`,
                      },
                    }}
                  />
                </Box>

                {/* Users Bar */}
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: GAMING_COLORS.neon }}
                    >
                      Active Users
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff' }}>
                      {dataPoint.users}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dataPoint.users / 500) * 100}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${GAMING_COLORS.neon} 0%, ${GAMING_COLORS.neon}80 100%)`,
                        boxShadow: `0 0 4px ${GAMING_COLORS.neon}60`,
                      },
                    }}
                  />
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Gaming corner accents */}
        <Box
          position="absolute"
          top={0}
          right={0}
          width={20}
          height={20}
          sx={{
            background: `linear-gradient(225deg, ${GAMING_COLORS.accent} 0%, transparent 100%)`,
            clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
            opacity: 0.6,
          }}
        />
      </Box>
    </Paper>
  );
};

export default ActivityChart;
