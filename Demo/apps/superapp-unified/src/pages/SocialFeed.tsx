import React from 'react';
import { Box } from '@mui/material';
import SocialFeedComponent from '../components/modules/social/components/SocialFeed';

export const SocialFeed: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <SocialFeedComponent />
    </Box>
  );
};

export default SocialFeed; 