import React from 'react';
import {
  Box,
  IconButton,
  Fade,
  Slider,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  PlayArrowIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  SkipNextIcon,
  SettingsIcon,
  AddIcon,
  FullscreenIcon,
  FullscreenExitIcon,
} from '@mui/icons-material';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  showControls: boolean;
  isFullscreen?: boolean;
  onPlayPause: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleFullscreen?: () => void;
  onSettings?: () => void;
  onAddToPlaylist?: () => void;
  formatTime: (seconds: number) => string;
  compact?: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  progress,
  showControls,
  isFullscreen = false,
  onPlayPause,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onToggleFullscreen,
  onSettings,
  onAddToPlaylist,
  formatTime,
  compact = false,
}) => {
  const handleProgressChange = (_: Event, value: number | number[]) => {
    const newTime = (value as number / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    onVolumeChange(value as number / 100);
  };

  if (compact) {
    return (
      <Fade in={showControls || !isPlaying} timeout={300}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            {/* Play/Pause */}
            <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
              <IconButton
                onClick={onPlayPause}
                sx={{ color: 'white', p: 1 }}
                size="small"
              >
                {isPlaying ? (
                  <PauseIcon sx={{ fontSize: 20 }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Progress */}
            <Box sx={{ flex: 1, mx: 2 }}>
              <Slider
                value={progress}
                onChange={handleProgressChange}
                sx={{
                  color: 'white',
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
                aria-label="Progreso del video"
              />
            </Box>

            {/* Volume */}
            <Tooltip title={isMuted ? 'Activar sonido' : 'Silenciar'}>
              <IconButton
                onClick={onToggleMute}
                sx={{ color: 'white', p: 1 }}
                size="small"
              >
                {isMuted ? (
                  <VolumeOffIcon sx={{ fontSize: 20 }} />
                ) : (
                  <VolumeUpIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={showControls || !isPlaying} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(84, 83, 83, 1)',
          padding: '15px 28px',
          zIndex: 10,
        }}
      >
        {/* Progress bar */}
        <Box sx={{ mb: 2 }}>
          <Slider
            value={progress}
            onChange={handleProgressChange}
            sx={{
              color: 'rgba(45, 45, 45, 1)',
              height: 4,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                backgroundColor: 'rgba(45, 45, 45, 1)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(45, 45, 45, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                border: 'none',
                backgroundColor: 'rgba(45, 45, 45, 1)',
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(217, 217, 217, 1)',
              },
            }}
            aria-label="Progreso del video"
          />
          
          {/* Time display */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {formatTime(currentTime)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Control buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
              <IconButton
                onClick={onPlayPause}
                sx={{ color: 'white', p: 0 }}
                aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              >
                {isPlaying ? (
                  <PauseIcon sx={{ width: '17px', height: '12px' }} />
                ) : (
                  <PlayArrowIcon sx={{ width: '17px', height: '12px' }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Siguiente">
              <IconButton sx={{ color: 'white', p: 0 }} aria-label="Siguiente video">
                <SkipNextIcon sx={{ width: '16px', height: '16px' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={isMuted ? 'Activar sonido' : 'Silenciar'}>
              <IconButton
                onClick={onToggleMute}
                sx={{ color: 'white', p: 0 }}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <VolumeOffIcon sx={{ width: '24px', height: '24px' }} />
                ) : (
                  <VolumeUpIcon sx={{ width: '24px', height: '24px' }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Volume slider */}
            <Box
              sx={{
                width: 80,
                mx: 1,
                display: { xs: 'none', md: 'block' },
              }}
            >
              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                sx={{
                  color: 'white',
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(255, 255, 255, 0.16)',
                    },
                  },
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
                aria-label="Volumen"
              />
            </Box>
          </Box>

          {/* Right controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
            {onAddToPlaylist && (
              <Tooltip title="Agregar a playlist">
                <IconButton
                  onClick={onAddToPlaylist}
                  sx={{ color: 'white', p: 0 }}
                  aria-label="Agregar a playlist"
                >
                  <AddIcon sx={{ width: '24px', height: '24px' }} />
                </IconButton>
              </Tooltip>
            )}

            {onSettings && (
              <Tooltip title="Configuración">
                <IconButton
                  onClick={onSettings}
                  sx={{ color: 'white', p: 0 }}
                  aria-label="Configuración del reproductor"
                >
                  <SettingsIcon sx={{ width: '24px', height: '24px' }} />
                </IconButton>
              </Tooltip>
            )}

            {onToggleFullscreen && (
              <Tooltip title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                <IconButton
                  onClick={onToggleFullscreen}
                  sx={{ color: 'white', p: 0 }}
                  aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                  {isFullscreen ? (
                    <FullscreenExitIcon sx={{ width: '24px', height: '24px' }} />
                  ) : (
                    <FullscreenIcon sx={{ width: '24px', height: '24px' }} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};

export default PlayerControls; 