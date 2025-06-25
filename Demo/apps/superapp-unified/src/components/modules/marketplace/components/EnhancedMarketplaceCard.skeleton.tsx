import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
} from '@mui/material';

export const EnhancedMarketplaceCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.1)',
      }}
    >
      <Skeleton variant="rectangular" height={180} />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="50%" />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="30%" />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Skeleton variant="text" width="25%" height={32} />
            <Skeleton variant="text" width="20%" />
        </Stack>

        <Stack direction="row" spacing={1} mt="auto">
          <Skeleton variant="rounded" width="100%" height={36} />
          <Skeleton variant="rounded" width="100%" height={36} />
        </Stack>
      </CardContent>
    </Card>
  );
};
