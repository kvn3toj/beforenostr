import React from 'react';
import {
  Box,
  Container,
  Grid,
  Skeleton,
} from '@mui/material';

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Skeleton variant="rectangular" width="100%" height={400} />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={80}
                height={60}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 2 }} />
          <Box sx={{ mt: 3 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                variant="text"
                width="100%"
                height={20}
                sx={{ mt: 0.5 }}
              />
            ))}
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={150} height={48} />
            <Skeleton variant="rectangular" width={120} height={48} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
