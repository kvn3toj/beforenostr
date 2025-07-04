import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { Box } from '@mui/material';

// Función para extraer el ID del video de varios formatos de URL de YouTube
const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface YouTubePlayerProps {
  url: string;
  onReady: (event: any) => void;
  onStateChange: (event: any) => void;
  onError: (event: any) => void;
  onPlaybackRateChange: (event: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ url, onReady, onStateChange, onError, onPlaybackRateChange }) => {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        backgroundColor: 'black'
      }}>
        Error: URL de YouTube no válida.
      </Box>
    );
  }

  const opts: YouTubeProps['opts'] = {
    playerVars: {
      autoplay: 1, // Autoplay para iniciar la carga
      controls: 0, // Ocultar controles nativos
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      fs: 0, // Deshabilitar botón de pantalla completa nativo
    },
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // Ensure video is below overlays
        overflow: 'hidden', // Prevent video from overflowing
        '& iframe': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          objectFit: 'contain' // Ensures video fits without cropping
        }
      }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        onPlaybackRateChange={onPlaybackRateChange}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default YouTubePlayer;
