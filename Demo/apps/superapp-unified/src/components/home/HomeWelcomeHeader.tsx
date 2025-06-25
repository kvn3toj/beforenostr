import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Avatar, Skeleton } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTimeOfDay } from '../../hooks/home/useTimeOfDay';

const getGreetingByTime = (hour: number) => {
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

export const HomeWelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const { formattedTime } = useTimeOfDay();
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.fullName || 'Coomuner');
      setIsLoading(false);
    }
  }, [user]);

  const currentHour = new Date().getHours();
  const greeting = getGreetingByTime(currentHour);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: '16px',
        borderColor: '#e2e8f0',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {isLoading ? (
        <Skeleton variant="circular" width={64} height={64} sx={{ mr: 2 }} />
      ) : (
        <Avatar
          sx={{
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            mr: 2,
            bgcolor: 'primary.main',
            fontSize: '1.75rem',
          }}
          src={user?.avatarUrl || undefined}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      )}
      <Box>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton variant="text" width={200} height={24} />
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
              {greeting},
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ¡Qué bueno verte de nuevo! Son las {formattedTime}.
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};
