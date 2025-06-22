import React from 'react';
import { Grid, Box, Typography } from '@mui/material';

// Test component to verify Grid syntax
const TestGrid: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Grid Component Test
      </Typography>

      {/* Test 1: Regular Grid with item prop (v4/v5 syntax) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
            Grid item xs=12 md=6 (v4/v5 syntax)
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'secondary.light', color: 'white' }}>
            Grid item xs=12 md=6 (v4/v5 syntax)
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestGrid;
