import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';

// 🎯 Skeleton específico para WelcomeHeader
export const WelcomeHeaderSkeleton: React.FC = () => (
  <Card
    sx={{
      p: 'var(--space-6)',
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--home-card-bg)',
      border: '1px solid var(--home-card-border)',
      mb: 'var(--space-4)',
    }}
  >
    <Stack direction="row" alignItems="center" spacing={3}>
      <Skeleton
        variant="circular"
        width={64}
        height={64}
        sx={{ flexShrink: 0 }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{ mb: 'var(--space-1)' }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ mb: 'var(--space-2)' }}
        />
        <Stack direction="row" spacing={1}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: 'var(--radius-lg)' }}
          />
          <Skeleton
            variant="rectangular"
            width={80}
            height={36}
            sx={{ borderRadius: 'var(--radius-lg)' }}
          />
        </Stack>
      </Box>
    </Stack>
  </Card>
);

// 🎯 Skeleton específico para PrimaryDashboard
export const PrimaryDashboardSkeleton: React.FC = () => (
  <Card
    sx={{
      p: 'var(--space-6)',
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--home-card-bg)',
      border: '1px solid var(--home-card-border)',
      boxShadow: 'var(--shadow-lg)',
    }}
  >
    {/* Hero Section */}
    <Box sx={{ textAlign: 'center', mb: 'var(--space-6)' }}>
      <Skeleton
        variant="text"
        width={120}
        height={80}
        sx={{
          mx: 'auto',
          mb: 'var(--space-2)',
          fontSize: '4rem',
        }}
      />
      <Skeleton
        variant="text"
        width={200}
        height={32}
        sx={{ mx: 'auto', mb: 'var(--space-4)' }}
      />
      <Skeleton
        variant="rectangular"
        width={400}
        height={8}
        sx={{
          mx: 'auto',
          borderRadius: 'var(--radius-full)',
          mb: 'var(--space-2)',
        }}
      />
      <Skeleton variant="text" width={150} height={16} sx={{ mx: 'auto' }} />
    </Box>

    {/* Smart Insights */}
    <Box sx={{ mb: 'var(--space-6)' }}>
      <Skeleton
        variant="text"
        width={180}
        height={24}
        sx={{ mb: 'var(--space-3)' }}
      />
      <Stack spacing={2}>
        {[1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              p: 'var(--space-4)',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--gray-50)',
              border: '1px solid var(--gray-200)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ mt: 0.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={20}
                  sx={{ mb: 'var(--space-1)' }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={16}
                  sx={{ mb: 'var(--space-2)' }}
                />
                <Skeleton
                  variant="rectangular"
                  width={120}
                  height={32}
                  sx={{ borderRadius: 'var(--radius-lg)' }}
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>

    {/* Key Metrics */}
    <Grid container spacing={3}>
      {[1, 2, 3].map((index) => (
        <Grid size={{ xs: 4 }} key={index}>
          <Box sx={{ textAlign: 'center' }}>
            <Skeleton
              variant="text"
              width="80%"
              height={32}
              sx={{ mx: 'auto', mb: 'var(--space-1)' }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={16}
              sx={{ mx: 'auto' }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  </Card>
);

// 🎯 Skeleton específico para ModuleCards
export const ModuleCardsSkeleton: React.FC = () => (
  <Box>
    <Skeleton
      variant="text"
      width={200}
      height={32}
      sx={{
        mx: 'auto',
        mb: 'var(--space-4)',
        textAlign: 'center',
      }}
    />
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((index) => (
        <Grid size={{ xs: 12, sm: 6 }} key={index}>
          <Card
            sx={{
              p: 'var(--space-3)',
              borderRadius: 'var(--radius-3xl)',
              background: 'var(--home-card-bg)',
              border: '1px solid var(--home-card-border)',
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Skeleton
                variant="rectangular"
                width={48}
                height={48}
                sx={{ borderRadius: 'var(--radius-lg)' }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={24}
                  sx={{ mb: 0.5 }}
                />
                <Skeleton variant="text" width="50%" height={20} />
              </Box>
            </Stack>

            {/* Description */}
            <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="85%" height={16} sx={{ mb: 3 }} />

            {/* Stats */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ mx: 'auto', mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={16}
                    sx={{ mx: 'auto' }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ mx: 'auto', mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={16}
                    sx={{ mx: 'auto' }}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Last activity */}
            <Skeleton
              variant="text"
              width="40%"
              height={14}
              sx={{
                mx: 'auto',
                mt: 2,
                pt: 2,
                borderTop: '1px solid var(--gray-200)',
              }}
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// 🎯 Skeleton para WalletOverview
export const WalletOverviewSkeleton: React.FC = () => (
  <Card
    sx={{
      p: 'var(--space-4)',
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--home-card-bg)',
      border: '1px solid var(--home-card-border)',
    }}
  >
    <Stack spacing={3}>
      <Box>
        <Skeleton
          variant="text"
          width="60%"
          height={24}
          sx={{ mb: 'var(--space-1)' }}
        />
        <Skeleton variant="text" width="80%" height={32} />
      </Box>

      <Box>
        <Skeleton
          variant="text"
          width="50%"
          height={20}
          sx={{ mb: 'var(--space-1)' }}
        />
        <Skeleton variant="text" width="70%" height={24} />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={20} />
        </Grid>
      </Grid>
    </Stack>
  </Card>
);

// 🎯 Skeleton para QuickActions
export const QuickActionsSkeleton: React.FC = () => (
  <Card
    sx={{
      p: 'var(--space-4)',
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--home-card-bg)',
      border: '1px solid var(--home-card-border)',
    }}
  >
    <Skeleton
      variant="text"
      width="60%"
      height={24}
      sx={{ mb: 'var(--space-3)' }}
    />

    <Stack spacing={2}>
      {[1, 2, 3].map((index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width="100%"
          height={48}
          sx={{ borderRadius: 'var(--radius-lg)' }}
        />
      ))}
    </Stack>
  </Card>
);

// 🎯 Skeleton completo para toda la página Home
export const CompleteDashboardSkeleton: React.FC = () => (
  <Container maxWidth="xl" sx={{ py: 'var(--space-6)' }}>
    {/* Welcome Header */}
    <WelcomeHeaderSkeleton />

    <Grid container spacing={4}>
      {/* Panel principal */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <PrimaryDashboardSkeleton />
      </Grid>

      {/* Panel lateral */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack spacing={4}>
          <WalletOverviewSkeleton />
          <QuickActionsSkeleton />
        </Stack>
      </Grid>

      {/* Módulos principales */}
      <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
        <ModuleCardsSkeleton />
      </Grid>
    </Grid>
  </Container>
);

// 🎯 Skeleton para vista Smart simplificada
export const SmartDashboardSkeleton: React.FC = () => (
  <Container maxWidth="md" sx={{ py: 'var(--space-6)' }}>
    <Stack spacing={6}>
      {/* Smart Header */}
      <WelcomeHeaderSkeleton />

      {/* Primary Dashboard */}
      <PrimaryDashboardSkeleton />

      {/* Smart Actions */}
      <Card
        sx={{
          p: 'var(--space-4)',
          borderRadius: 'var(--radius-3xl)',
          background: 'var(--home-card-bg)',
          border: '1px solid var(--home-card-border)',
        }}
      >
        <Skeleton
          variant="text"
          width="50%"
          height={24}
          sx={{ mb: 'var(--space-3)' }}
        />
        <Grid container spacing={2}>
          {[1, 2, 3].map((index) => (
            <Grid size={{ xs: 4 }} key={index}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={80}
                sx={{ borderRadius: 'var(--radius-lg)' }}
              />
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Module Focus */}
      <Card
        sx={{
          p: 'var(--space-4)',
          borderRadius: 'var(--radius-3xl)',
          background: 'var(--home-card-bg)',
          border: '1px solid var(--home-card-border)',
        }}
      >
        <Skeleton
          variant="text"
          width="40%"
          height={24}
          sx={{ mb: 'var(--space-3)' }}
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ borderRadius: 'var(--radius-lg)' }}
        />
      </Card>
    </Stack>
  </Container>
);

// 🎯 Hook para mostrar skeleton basado en estado de carga
export const useHomeSkeletons = (
  isLoading: boolean,
  useSmartInterface: boolean = false
) => {
  if (!isLoading) return null;

  return useSmartInterface ? (
    <SmartDashboardSkeleton />
  ) : (
    <CompleteDashboardSkeleton />
  );
};

export default {
  WelcomeHeaderSkeleton,
  PrimaryDashboardSkeleton,
  ModuleCardsSkeleton,
  WalletOverviewSkeleton,
  QuickActionsSkeleton,
  CompleteDashboardSkeleton,
  SmartDashboardSkeleton,
  useHomeSkeletons,
};
