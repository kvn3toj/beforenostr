import React from 'react';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';

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
  const theme = useTheme();
  const percentage = Math.min((value / maxValue) * 100, 100);

  // Ring calculations
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const strokeWidth = 8;

  const getStatusColor = () => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getStatusText = () => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bueno';
    if (percentage >= 40) return 'Regular';
    return 'Mejorando';
  };

  return (
    <Paper
      elevation={0}
      className="guardian-progress-ring"
      sx={{
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        textAlign: 'center',
        position: 'relative',
        '&:hover': {
          borderColor: getStatusColor(),
          boxShadow: `0 2px 8px ${alpha(getStatusColor(), 0.1)}`,
        }
      }}
    >
      <Typography
        variant="subtitle1"
        component="h3"
        gutterBottom
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 600,
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
            stroke={theme.palette.divider}
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getStatusColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
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
          <Typography
            variant="h4"
            component="div"
            sx={{
              color: getStatusColor(),
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            / {maxValue}
          </Typography>
        </Box>
      </Box>

      {/* Status Badge */}
      <Box
        mt={2}
        px={2}
        py={0.5}
        sx={{
          backgroundColor: alpha(getStatusColor(), 0.1),
          border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
          borderRadius: 1,
          display: 'inline-block',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: getStatusColor(),
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        >
          {getStatusText()} ({percentage.toFixed(0)}%)
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProgressRing;
