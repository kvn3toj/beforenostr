import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
} from '@mui/icons-material';

// 🌌 IMPORTS DEL DESIGN SYSTEM REVOLUCIONARIO
import { CosmicCard } from '../../../../design-system';

interface GamingStatsCardProps {
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  color: string;
}

const GamingStatsCard: React.FC<GamingStatsCardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
  color,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon />;
      case 'down':
        return <TrendingDownIcon />;
      default:
        return <TrendingFlatIcon />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#00ff88';
      case 'down':
        return '#ff4444';
      default:
        return '#ffaa00';
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <CosmicCard
        variant="elevated"
        element="fuego"
        enableGlow={true}
        enableAnimations={true}
        enableParticles={true}
        cosmicIntensity="intense"
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(42,42,42,0.9) 100%)`,
          border: `1px solid ${color}40`,
          boxShadow: `0 0 20px ${color}20`,
          '&:hover': {
            boxShadow: `0 0 30px ${color}40`,
            border: `1px solid ${color}80`,
          },
        }}
      >
        {/* Animated Background Glow */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{
            background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`,
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box position="relative" zIndex={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                textShadow: `0 0 10px ${color}60`,
              }}
            >
              {title}
            </Typography>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Chip
                icon={getTrendIcon()}
                label={`${change > 0 ? '+' : ''}${change}%`}
                size="small"
                sx={{
                  bgcolor: getTrendColor(),
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: `0 0 10px ${getTrendColor()}60`,
                  '& .MuiChip-icon': {
                    color: '#000',
                  },
                }}
              />
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
          >
            <Typography
              variant="h3"
              component="div"
              sx={{
                color: color,
                fontWeight: 'bold',
                mb: 1,
                textShadow: `0 0 20px ${color}80`,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {typeof value === 'number' ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {value.toLocaleString()}
                </motion.span>
              ) : (
                value
              )}
              <Typography
                component="span"
                variant="h5"
                sx={{
                  color: color,
                  opacity: 0.8,
                  ml: 0.5,
                }}
              >
                {unit}
              </Typography>
            </Typography>
          </motion.div>

          {/* Progress indicator */}
          <Box position="relative" mt={2}>
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
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
                  borderRadius: '2px',
                  boxShadow: `0 0 10px ${color}60`,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Gaming-style corner accent */}
        <Box
          position="absolute"
          top={8}
          right={8}
          width={20}
          height={20}
          sx={{
            background: `linear-gradient(45deg, ${color} 0%, transparent 100%)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
            opacity: 0.6,
          }}
        />
      </CosmicCard>
    </motion.div>
  );
};

export default GamingStatsCard;
