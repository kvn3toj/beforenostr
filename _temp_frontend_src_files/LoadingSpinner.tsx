import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useThemeMode } from '../../contexts/ThemeContext';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circular' | 'dots' | 'pulse' | 'coomunity';
  color?: 'primary' | 'secondary' | 'ayni' | 'inherit';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 20,
  md: 32,
  lg: 48,
  xl: 64,
};

const colorMap = {
  primary: 'var(--coomunity-primary-500)',
  secondary: 'var(--coomunity-secondary-500)',
  ayni: 'var(--coomunity-gold-500)',
  inherit: 'currentColor',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'circular',
  color = 'primary',
  message,
  fullScreen = false,
  className = '',
}) => {
  const { isDarkMode } = useThemeMode();
  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color];

  const renderSpinner = () => {
    switch (variant) {
      case 'circular':
        return (
          <CircularProgress
            size={spinnerSize}
            sx={{
              color: spinnerColor,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        );

      case 'dots':
        return (
          <Box className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: spinnerColor }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </Box>
        );

      case 'pulse':
        return (
          <motion.div
            className="rounded-full"
            style={{
              width: spinnerSize,
              height: spinnerSize,
              backgroundColor: spinnerColor,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );

      case 'coomunity':
        return (
          <motion.div
            className="relative"
            style={{ width: spinnerSize, height: spinnerSize }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: spinnerColor,
                borderRightColor: `${spinnerColor}80`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Inner pulse */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{ backgroundColor: `${spinnerColor}20` }}
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Center dot */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: spinnerColor }}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  const content = (
    <Box
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      sx={{
        color: isDarkMode ? 'white' : 'text.primary',
      }}
    >
      {renderSpinner()}
      {message && (
        <Typography
          variant="body2"
          className="text-center animate-pulse"
          sx={{
            color: 'inherit',
            fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        className="fixed inset-0 z-50 flex items-center justify-center"
        sx={{
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}; 