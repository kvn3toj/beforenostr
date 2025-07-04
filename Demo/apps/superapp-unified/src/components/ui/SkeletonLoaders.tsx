import React from 'react';
import { 
  Box, 
  Skeleton, 
  Card, 
  CardContent, 
  Grid, 
  Typography,
  Avatar 
} from '@mui/material';

// Skeleton para el Dashboard completo
export const DashboardSkeleton: React.FC = () => (
  <Box sx={{ py: 3 }}>
    {/* Header skeleton - More precise button simulation */}
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Skeleton variant="rectangular" width={200} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={180} height={36} sx={{ borderRadius: 1 }} />
    </Box>

    {/* Welcome section skeleton - More precise structure */}
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Skeleton variant="circular" width={60} height={60} />
      <Box sx={{ flex: 1 }}>
        {/* Simulate "¡Bienvenido, [Name]! 👋" - larger greeting */}
        <Skeleton variant="text" width="65%" height={48} sx={{ mb: 1 }} />
        {/* Simulate subtitle */}
        <Skeleton variant="text" width="45%" height={24} />
      </Box>
    </Box>

    {/* Cards grid skeleton */}
    <Grid container spacing={3}>
      {/* Gamification Card Skeleton */}
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            {/* Header with icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={28} />
            </Box>
            
            {/* Stats container - two large numbers side by side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                {/* Large number for Öndas points */}
                <Skeleton variant="text" width="70%" height={56} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={16} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                {/* Large number for happiness % */}
                <Skeleton variant="text" width={60} height={56} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
            </Box>

            {/* Level chip */}
            <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 3, mb: 2 }} />
            
            {/* Progress section with precise measurements */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 4 }} />
            </Box>
            
            {/* Badges with icon simulation */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Skeleton variant="rectangular" width={95} height={24} sx={{ borderRadius: 3 }} />
              <Skeleton variant="rectangular" width={85} height={24} sx={{ borderRadius: 3 }} />
              <Skeleton variant="rectangular" width={30} height={24} sx={{ borderRadius: 3 }} />
            </Box>
            
            {/* Action button */}
            <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Wallet Card Skeleton */}
      <Grid item xs={12} md={6} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            {/* Header with wallet icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="40%" height={28} />
            </Box>
            
            {/* Large balance number */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="85%" height={56} sx={{ mb: 1 }} />
              {/* Trend indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton variant="text" width="60%" height={16} />
              </Box>
            </Box>

            {/* ÜCoins section with specific styling */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'warning.50', 
              borderRadius: 2, 
              mb: 2,
              border: 1,
              borderColor: 'warning.200',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="text" width="50%" height={14} />
            </Box>

            {/* Action button */}
            <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions Card Skeleton */}
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Skeleton variant="text" width="70%" height={28} sx={{ mb: 2 }} />
            {/* 2x2 grid of action buttons */}
            <Grid container spacing={1}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={6} key={item}>
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Card Skeleton - Full width */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Header with notification icon and badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="rectangular" width={24} height={20} sx={{ borderRadius: 3 }} />
            </Box>

            {/* Notification list items */}
            {[1, 2, 3].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="30%" height={14} />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

// Skeleton para el Marketplace - Refined for actual content structure
export const MarketplaceSkeleton: React.FC = () => (
  <Box sx={{ py: 3 }}>
    {/* Header skeleton */}
    <Skeleton variant="text" width="60%" height={48} sx={{ mx: 'auto', mb: 4 }} />
    
    {/* Search section skeleton */}
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={56} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>

    {/* Popular desires skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} variant="rectangular" width={120} height={32} sx={{ borderRadius: 4 }} />
        ))}
      </Box>
    </Box>

    {/* Create ad button skeleton */}
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Skeleton variant="rectangular" width={200} height={56} sx={{ mx: 'auto', borderRadius: 1 }} />
    </Box>

    {/* Gigs grid skeleton - Refined for actual gig card structure */}
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="text" width="25%" height={32} sx={{ mx: 'auto', mb: 3 }} />
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card>
              {/* Image with correct height */}
              <Skeleton variant="rectangular" width="100%" height={150} />
              <CardContent>
                {/* User section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </Box>
                </Box>
                
                {/* Title and price section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="text" width="60%" height={28} />
                  {/* Price with logo simulation */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="text" width={60} height={32} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Box>
                </Box>
                
                {/* Service options icons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="circular" width={20} height={20} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
);

// Skeleton para formularios de autenticación
export const AuthFormSkeleton: React.FC = () => (
  <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
    <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 3 }} />
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1, mt: 2 }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto', mt: 2 }} />
    </Box>
  </Box>
);

// Skeleton para la verificación de rutas protegidas
export const AppLayoutSkeleton: React.FC = () => (
  <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
    {/* Header skeleton */}
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={150} height={32} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Box>
    </Box>
    
    {/* Content skeleton */}
    <Box sx={{ flex: 1, p: 3 }}>
      <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 2 }} />
    </Box>
  </Box>
);

// Skeleton para elementos de lista
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <Box>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
      </Box>
    ))}
  </Box>
);

// Skeleton para cards de datos estadísticos
export const StatCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={48} />
          <Skeleton variant="text" width="50%" height={16} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Skeleton variant="text" width={60} height={48} />
          <Skeleton variant="text" width={80} height={16} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 3, mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1, mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
      </Box>
    </CardContent>
  </Card>
);

// Skeleton para resultados de búsqueda - Refined for search result structure
export const SearchLoadingSkeleton: React.FC = () => (
  <Box sx={{ mt: 2 }}>
    {/* Results count message */}
    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map((item) => (
        <Card key={item} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Product/service image */}
            <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}>
              {/* Title */}
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
              {/* Description */}
              <Skeleton variant="text" width="90%" height={16} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Price with currency */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="text" width={60} height={20} />
                  <Skeleton variant="circular" width={16} height={16} />
                </Box>
                {/* Action button */}
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  </Box>
);

// Enhanced Progress Bar Component for consistent usage
export const ContextualProgress: React.FC<{
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  height?: number;
  borderRadius?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  label?: string;
}> = ({
  variant = 'determinate',
  value,
  height = 8,
  borderRadius = 4,
  color = 'primary',
  showPercentage = false,
  label
}) => (
  <Box>
    {label && (
      <Typography variant="body2" gutterBottom>
        {label}
      </Typography>
    )}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ flex: 1 }}>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={height} 
          sx={{ 
            borderRadius,
            animation: 'pulse 1.5s ease-in-out infinite'
          }} 
        />
      </Box>
      {showPercentage && value && (
        <Skeleton variant="text" width={40} height={16} />
      )}
    </Box>
  </Box>
);

// ✅ SOLUCIÓN: Exportación por defecto para React.lazy() compatibility
const SkeletonLoaders = {
  Dashboard: DashboardSkeleton,
  Marketplace: MarketplaceSkeleton,
  AuthForm: AuthFormSkeleton,
  AppLayout: AppLayoutSkeleton,
  ListItem: ListItemSkeleton,
  StatCard: StatCardSkeleton,
  SearchLoading: SearchLoadingSkeleton,
  ContextualProgress,
};

export default SkeletonLoaders; 