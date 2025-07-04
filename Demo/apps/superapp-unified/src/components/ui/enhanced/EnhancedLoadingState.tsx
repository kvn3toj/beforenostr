import React from 'react';
import { Box, Typography, Skeleton, CircularProgress } from '@mui/material';

interface EnhancedLoadingStateProps {
  type?: 'shimmer' | 'pulse' | 'skeleton' | 'spinner';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  showMessage?: boolean;
  variant?: 'card' | 'text' | 'avatar' | 'custom';
  className?: string;
  children?: React.ReactNode;
}

export const EnhancedLoadingState: React.FC<EnhancedLoadingStateProps> = ({
  type = 'shimmer',
  size = 'md',
  message = 'Cargando...',
  showMessage = true,
  variant = 'card',
  className = '',
  children
}) => {
  const config = {
    sm: { height: 120, width: '100%', fontSize: '0.75rem' },
    md: { height: 200, width: '100%', fontSize: '0.875rem' },
    lg: { height: 300, width: '100%', fontSize: '1rem' }
  }[size];

  const renderShimmerLoading = () => (
    <Box
      className={`loading-shimmer ${className}`}
      sx={{
        height: config.height,
        width: config.width,
        borderRadius: 'var(--home-card-border-radius)',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200px 100%'
      }}
    />
  );

  const renderPulseLoading = () => (
    <Box
      className={`smooth-transition ${className}`}
      sx={{
        height: config.height,
        width: config.width,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 'var(--home-card-border-radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <Box
        className=""
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: 'rgba(99, 102, 241, 0.6)'
          }}
        />
      </Box>
      {showMessage && (
        <Typography
          variant="body2"
          className="coomunity-body2"
          sx={{
            color: 'rgba(99, 102, 241, 0.8)',
            fontSize: config.fontSize,
            fontWeight: 500
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  const renderSkeletonLoading = () => {
    if (variant === 'card') {
      return (
        <Box
          className={`smooth-transition ${className}`}
          sx={{
            p: 3,
            borderRadius: 'var(--home-card-border-radius)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Header skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              className=""
              sx={{ mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                className=""
              />
              <Skeleton
                variant="text"
                width="40%"
                height={16}
                className=""
              />
            </Box>
          </Box>
          
          {/* Content skeleton */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={80}
            className=""
            sx={{ mb: 2, borderRadius: 2 }}
          />
          
          {/* Footer skeleton */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Skeleton
              variant="rectangular"
              width={80}
              height={32}
              className=""
              sx={{ borderRadius: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={32}
              className=""
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </Box>
      );
    }

    if (variant === 'text') {
      return (
        <Box className={className} sx={{ width: '100%' }}>
          <Skeleton
            variant="text"
            width="80%"
            height={32}
            className=""
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={24}
            className=""
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="90%"
            height={20}
            className=""
          />
        </Box>
      );
    }

    if (variant === 'avatar') {
      return (
        <Box className={className} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            className=""
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="70%"
              height={24}
              className=""
              sx={{ mb: 0.5 }}
            />
            <Skeleton
              variant="text"
              width="50%"
              height={20}
              className=""
            />
          </Box>
        </Box>
      );
    }

    return children || renderShimmerLoading();
  };

  const renderSpinnerLoading = () => (
    <Box
      className={`smooth-transition ${className}`}
      sx={{
        height: config.height,
        width: config.width,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 3,
        borderRadius: 'var(--home-card-border-radius)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.03) 100%)'
      }}
    >
      <Box className="">
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'rgba(99, 102, 241, 0.8)',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
      </Box>
      
      {showMessage && (
        <Typography
          variant="body2"
          className="coomunity-body2"
          sx={{
            color: 'rgba(99, 102, 241, 0.8)',
            fontSize: config.fontSize,
            fontWeight: 500,
            textAlign: 'center'
          }}
        >
          {message}
        </Typography>
      )}
      
      {/* Floating dots indicator */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            className=""
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.6)',
              opacity: 0.7
            }}
          />
        ))}
      </Box>
    </Box>
  );

  // Render based on type
  switch (type) {
    case 'pulse':
      return renderPulseLoading();
    case 'skeleton':
      return renderSkeletonLoading();
    case 'spinner':
      return renderSpinnerLoading();
    case 'shimmer':
    default:
      return renderShimmerLoading();
  }
};

export default EnhancedLoadingState; 