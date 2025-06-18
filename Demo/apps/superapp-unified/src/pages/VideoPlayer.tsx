import React from 'react';
import { Container, Typography, Box } from '@mui/material';

interface VideoPlayerProps {
  videoId: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ▶️ Video Player
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reproductor de video {videoId} en desarrollo
        </Typography>
      </Box>
    </Container>
  );
};

export default VideoPlayer; 