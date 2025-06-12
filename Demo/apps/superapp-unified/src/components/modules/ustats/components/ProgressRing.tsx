import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  title: string;
  value: number;
  maxValue: number;
  color: string;
  size?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  title,
  value,
  maxValue,
  color,
  size = 120,
}) => {
  const percentage = (value / maxValue) * 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStatusColor = () => {
    if (percentage >= 80) return '#ff4444'; // Critical
    if (percentage >= 60) return '#ffaa00'; // Warning
    return color; // Normal
  };

  const getStatusText = () => {
    if (percentage >= 80) return 'CRITICAL';
    if (percentage >= 60) return 'WARNING';
    return 'OPTIMAL';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Paper
        sx={{
          p: 3,
          background: `linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)`,
          border: `1px solid ${color}40`,
          borderRadius: 2,
          boxShadow: `0 0 20px ${color}20`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: `0 0 30px ${color}40`,
          },
        }}
      >
        {/* Background Glow */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{
            background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
            zIndex: 1,
          }}
        />

        <Box position="relative" zIndex={2}>
          <Typography
            variant="subtitle1"
            component="h3"
            gutterBottom
            sx={{
              color: color,
              fontWeight: 'bold',
              textShadow: `0 0 10px ${color}60`,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {title}
          </Typography>

          <Box position="relative" display="inline-block">
            {/* SVG Progress Ring */}
            <svg
              width={size}
              height={size}
              style={{ transform: 'rotate(-90deg)' }}
            >
              {/* Background Circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />

              {/* Progress Circle */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={getStatusColor()}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: 'easeOut' }}
                style={{
                  filter: `drop-shadow(0 0 10px ${getStatusColor()}60)`,
                }}
              />

              {/* Pulsing center dot */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={3}
                fill={getStatusColor()}
                animate={{
                  r: [3, 6, 3],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  filter: `drop-shadow(0 0 5px ${getStatusColor()}80)`,
                }}
              />
            </svg>

            {/* Center Content */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    color: getStatusColor(),
                    fontWeight: 'bold',
                    textShadow: `0 0 10px ${getStatusColor()}80`,
                    mb: 0.5,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#fff',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}
                >
                  %
                </Typography>
              </motion.div>
            </Box>
          </Box>

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Box
              mt={2}
              px={2}
              py={0.5}
              sx={{
                background: `linear-gradient(45deg, ${getStatusColor()}20 0%, transparent 100%)`,
                border: `1px solid ${getStatusColor()}60`,
                borderRadius: 1,
                display: 'inline-block',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: getStatusColor(),
                  fontWeight: 'bold',
                  textShadow: `0 0 5px ${getStatusColor()}40`,
                  fontSize: '0.7rem',
                }}
              >
                {getStatusText()}
              </Typography>
            </Box>
          </motion.div>

          {/* Gaming corner accents */}
          <Box
            position="absolute"
            top={0}
            left={0}
            width={16}
            height={16}
            sx={{
              background: `linear-gradient(45deg, ${color} 0%, transparent 100%)`,
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              opacity: 0.6,
            }}
          />
          <Box
            position="absolute"
            bottom={0}
            right={0}
            width={16}
            height={16}
            sx={{
              background: `linear-gradient(225deg, ${color} 0%, transparent 100%)`,
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              opacity: 0.6,
            }}
          />
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ProgressRing;
