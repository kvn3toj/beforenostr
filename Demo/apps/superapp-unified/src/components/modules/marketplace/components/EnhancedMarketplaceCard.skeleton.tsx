import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  alpha,
} from '@mui/material';
import { useGuardianColors } from '../../../../components/theme/GuardianColorProvider';
import { MODULE_COLORS } from '../../../../theme/colors';

export const EnhancedMarketplaceCardSkeleton: React.FC = () => {
  const { palette, getElementColor } = useGuardianColors();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        backgroundColor: palette.background,
        border: `1px solid ${alpha(palette.divider, 0.8)}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: getElementColor('tierra'),
          zIndex: 1,
        },
      }}
    >
      <Skeleton
        variant="rectangular"
        height={180}
        sx={{
          bgcolor: alpha(palette.divider, 0.4),
          transform: 'scale(1)',
          transformOrigin: 'center',
        }}
      />
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        backgroundColor: palette.background,
      }}>
        <Skeleton
          variant="text"
          width="40%"
          sx={{
            mb: 1,
            bgcolor: alpha(palette.divider, 0.5),
            height: 24,
          }}
        />
        <Skeleton
          variant="text"
          width="80%"
          sx={{
            bgcolor: alpha(palette.divider, 0.5),
            height: 20,
          }}
        />
        <Skeleton
          variant="text"
          width="60%"
          sx={{
            mb: 2,
            bgcolor: alpha(palette.divider, 0.5),
            height: 20,
          }}
        />

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{ bgcolor: alpha(MODULE_COLORS.marketplace, 0.2) }}
            />
            <Skeleton
              variant="text"
              width="50%"
              sx={{ bgcolor: alpha(palette.divider, 0.5) }}
            />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Skeleton
              variant="text"
              width="30%"
              sx={{ bgcolor: alpha(palette.divider, 0.5) }}
            />
            <Skeleton
              variant="text"
              width="30%"
              sx={{ bgcolor: alpha(palette.divider, 0.5) }}
            />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Skeleton
              variant="text"
              width="25%"
              height={32}
              sx={{ bgcolor: alpha(MODULE_COLORS.marketplace, 0.2) }}
            />
            <Skeleton
              variant="text"
              width="20%"
              sx={{ bgcolor: alpha(palette.divider, 0.5) }}
            />
        </Stack>

        <Stack direction="row" spacing={1} mt="auto">
          <Skeleton
            variant="rounded"
            width="100%"
            height={36}
            sx={{
              bgcolor: alpha(palette.divider, 0.5),
              borderRadius: 1,
            }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={36}
            sx={{
              bgcolor: alpha(MODULE_COLORS.marketplace, 0.15),
              borderRadius: 1,
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
