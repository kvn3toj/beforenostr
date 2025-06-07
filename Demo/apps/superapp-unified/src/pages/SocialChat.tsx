import React from 'react';
import { Box } from '@mui/material';
import ChatArea from '../components/modules/social/components/ChatArea';

export const SocialChat: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatArea />
    </Box>
  );
};

export default SocialChat; 