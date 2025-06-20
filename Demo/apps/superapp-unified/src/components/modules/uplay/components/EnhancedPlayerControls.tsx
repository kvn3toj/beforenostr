import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Fade,
  Slider,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  ButtonGroup,
  Chip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Forward10 as Forward10Icon,
  Replay10 as Replay10Icon,
  Speed as SpeedIcon,
  HighQuality as QualityIcon,
  Subtitles as SubtitlesIcon,
  PictureInPicture as PipIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  VolumeDown as VolumeDownIcon,
  VolumeMute as VolumeMuteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedPlayerControlsProps {
  // Basic video state
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  showControls: boolean;
  isFullscreen?: boolean;
  
  // Enhanced features
  playbackSpeed?: number;
  quality?: string;
  isBuffering?: boolean;
  hasSubtitles?: boolean;
  subtitlesEnabled?: boolean;
  canPictureInPicture?: boolean;
  
  // Callbacks
  onPlayPause: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onToggleFullscreen?: () => void;
  onPlaybackSpeedChange?: (speed: number) => void;
  onQualityChange?: (quality: string) => void;
  onToggleSubtitles?: () => void;
  onTogglePictureInPicture?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onDownload?: () => void;
  onSettings?: () => void;
  
  // Utilities
  formatTime: (seconds: number) => string;
  
  // Layout options
  compact?: boolean;
  variant?: 'default' | 'minimal' | 'cinema';
}

const EnhancedPlayerControls: React.FC<EnhancedPlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  progress,
  showControls,
  isFullscreen = false,
  playbackSpeed = 1,
  quality = 'Auto',
  isBuffering = false,
  hasSubtitles = false,
  subtitlesEnabled = false,
  canPictureInPicture = false,
  onPlayPause,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onToggleFullscreen,
  onPlaybackSpeedChange,
  onQualityChange,
  onToggleSubtitles,
  onTogglePictureInPicture,
  onShare,
  onBookmark,
  onDownload,
  onSettings,
  formatTime,
  compact = false,
  variant = 'default',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Menu states
  const [speedMenuAnchor, setSpeedMenuAnchor] = useState<null | HTMLElement>(null);
  const [qualityMenuAnchor, setQualityMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Volume hover state
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Available options
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = ['Auto', '1080p', '720p', '480p', '360p', '240p'];
  
  const handleProgressChange = (_: Event, value: number | number[]) => {
    const newTime = (value as number / 100) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (_: Event, value: number | number[]) => {
    onVolumeChange(value as number / 100);
  };

  const handleVolumeHover = () => {
    setShowVolumeSlider(true);
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
  };

  const handleVolumeLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false);
    }, 1000);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeMuteIcon />;
    if (volume < 0.3) return <VolumeDownIcon />;
    if (volume < 0.7) return <VolumeUpIcon />;
    return <VolumeUpIcon />;
  };

  // Enhanced progress bar with hover preview
  const ProgressBarComponent = () => (
    <Box sx={{ position: 'relative', mb: 2 }}>
      <Slider
        value={progress}
        onChange={handleProgressChange}
        sx={{
          color: theme.palette.primary.main,
          height: 6,
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            backgroundColor: 'white',
            border: `2px solid ${theme.palette.primary.main}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: `0 0 0 8px ${theme.palette.primary.main}20`,
              transform: 'scale(1.2)',
            },
          },
          '& .MuiSlider-track': {
            border: 'none',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            height: 6,
            borderRadius: 3,
          },
          '& .MuiSlider-rail': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            height: 6,
            borderRadius: 3,
            opacity: 1,
          },
        }}
        aria-label="Progreso del video"
      />
      
      {/* Time display */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {formatTime(currentTime)}
        </Typography>
        
        {isBuffering && (
          <Chip
            label="Cargando..."
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '11px',
              height: 20,
            }}
          />
        )}
        
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '13px',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  );

  // Compact version for mobile
  if (compact || isMobile) {
    return (
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                backdropFilter: 'blur(10px)',
                padding: '12px 16px',
                zIndex: 10,
              }}
            >
              <ProgressBarComponent />
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Left controls */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    onClick={onPlayPause}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                      width: 44,
                      height: 44,
                    }}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>

                  <Box
                    onMouseEnter={handleVolumeHover}
                    onMouseLeave={handleVolumeLeave}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <IconButton onClick={onToggleMute} sx={{ color: 'white' }}>
                      {getVolumeIcon()}
                    </IconButton>
                    
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 80, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Slider
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            sx={{
                              width: 80,
                              color: 'white',
                              '& .MuiSlider-thumb': {
                                width: 12,
                                height: 12,
                              },
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </Stack>

                {/* Right controls */}
                <Stack direction="row" spacing={1}>
                  {onToggleFullscreen && (
                    <IconButton onClick={onToggleFullscreen} sx={{ color: 'white' }}>
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  )}
                </Stack>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Full desktop version
  return (
    <AnimatePresence>
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: variant === 'cinema' 
                ? 'linear-gradient(transparent, rgba(0,0,0,0.95))'
                : 'linear-gradient(transparent, rgba(0,0,0,0.85))',
              backdropFilter: 'blur(15px)',
              padding: variant === 'minimal' ? '12px 20px' : '20px 32px',
              zIndex: 10,
            }}
          >
            <ProgressBarComponent />

            {/* Main control row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Left controls */}
              <Stack direction="row" spacing={2} alignItems="center">
                {/* Previous/Replay */}
                {onSkipBackward && (
                  <Tooltip title="Retroceder 10s">
                    <IconButton
                      onClick={onSkipBackward}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <Replay10Icon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Play/Pause - Enhanced */}
                <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
                  <IconButton
                    onClick={onPlayPause}
                    sx={{
                      color: 'white',
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': { 
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'scale(1.05)',
                      },
                      width: 52,
                      height: 52,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
                  </IconButton>
                </Tooltip>

                {/* Next/Forward */}
                {onSkipForward && (
                  <Tooltip title="Adelantar 10s">
                    <IconButton
                      onClick={onSkipForward}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <Forward10Icon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Volume with enhanced slider */}
                <Box
                  onMouseEnter={handleVolumeHover}
                  onMouseLeave={handleVolumeLeave}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Tooltip title={isMuted ? 'Activar sonido' : 'Silenciar'}>
                    <IconButton
                      onClick={onToggleMute}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      {getVolumeIcon()}
                    </IconButton>
                  </Tooltip>
                  
                  <AnimatePresence>
                    {(showVolumeSlider || !isMobile) && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 100, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Slider
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          sx={{
                            width: 100,
                            color: 'white',
                            '& .MuiSlider-thumb': {
                              width: 14,
                              height: 14,
                              backgroundColor: 'white',
                              '&:hover': {
                                boxShadow: '0 0 0 8px rgba(255,255,255,0.16)',
                              },
                            },
                            '& .MuiSlider-track': {
                              height: 4,
                              border: 'none',
                            },
                            '& .MuiSlider-rail': {
                              height: 4,
                              backgroundColor: 'rgba(255,255,255,0.3)',
                            },
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>

                {/* Playback speed */}
                <Tooltip title="Velocidad de reproducción">
                  <Button
                    onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'white',
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: playbackSpeed !== 1 ? 'rgba(255,255,255,0.1)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                    }}
                    startIcon={<SpeedIcon fontSize="small" />}
                  >
                    {playbackSpeed}x
                  </Button>
                </Tooltip>
              </Stack>

              {/* Right controls */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Subtitles */}
                {hasSubtitles && (
                  <Tooltip title={subtitlesEnabled ? 'Ocultar subtítulos' : 'Mostrar subtítulos'}>
                    <IconButton
                      onClick={onToggleSubtitles}
                      sx={{
                        color: subtitlesEnabled ? theme.palette.primary.main : 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      <SubtitlesIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Quality */}
                <Tooltip title="Calidad de video">
                  <Button
                    onClick={(e) => setQualityMenuAnchor(e.currentTarget)}
                    sx={{
                      color: 'white',
                      minWidth: 'auto',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '11px',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                    }}
                    startIcon={<QualityIcon fontSize="small" />}
                  >
                    {quality}
                  </Button>
                </Tooltip>

                {/* Picture in Picture */}
                {canPictureInPicture && (
                  <Tooltip title="Imagen en imagen">
                    <IconButton
                      onClick={onTogglePictureInPicture}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <PipIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* More options */}
                <Tooltip title="Más opciones">
                  <IconButton
                    onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
                    sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Tooltip>

                {/* Settings */}
                {onSettings && (
                  <Tooltip title="Configuración">
                    <IconButton
                      onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Fullscreen */}
                {onToggleFullscreen && (
                  <Tooltip title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                    <IconButton
                      onClick={onToggleFullscreen}
                      sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                    >
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>

            {/* Menus */}
            {/* Speed Menu */}
            <Menu
              anchorEl={speedMenuAnchor}
              open={Boolean(speedMenuAnchor)}
              onClose={() => setSpeedMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              {speedOptions.map((speed) => (
                <MenuItem
                  key={speed}
                  selected={speed === playbackSpeed}
                  onClick={() => {
                    onPlaybackSpeedChange?.(speed);
                    setSpeedMenuAnchor(null);
                  }}
                  sx={{ color: 'white', minWidth: 100 }}
                >
                  {speed === 1 ? 'Normal' : `${speed}x`}
                </MenuItem>
              ))}
            </Menu>

            {/* Quality Menu */}
            <Menu
              anchorEl={qualityMenuAnchor}
              open={Boolean(qualityMenuAnchor)}
              onClose={() => setQualityMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              {qualityOptions.map((qual) => (
                <MenuItem
                  key={qual}
                  selected={qual === quality}
                  onClick={() => {
                    onQualityChange?.(qual);
                    setQualityMenuAnchor(null);
                  }}
                  sx={{ color: 'white', minWidth: 120 }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <QualityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={qual} />
                </MenuItem>
              ))}
            </Menu>

            {/* More Menu */}
            <Menu
              anchorEl={moreMenuAnchor}
              open={Boolean(moreMenuAnchor)}
              onClose={() => setMoreMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              {onShare && (
                <MenuItem onClick={() => { onShare(); setMoreMenuAnchor(null); }} sx={{ color: 'white' }}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <ShareIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Compartir" />
                </MenuItem>
              )}
              {onBookmark && (
                <MenuItem onClick={() => { onBookmark(); setMoreMenuAnchor(null); }} sx={{ color: 'white' }}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <BookmarkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Guardar" />
                </MenuItem>
              )}
              {onDownload && (
                <MenuItem onClick={() => { onDownload(); setMoreMenuAnchor(null); }} sx={{ color: 'white' }}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <DownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Descargar" />
                </MenuItem>
              )}
            </Menu>

            {/* Settings Menu */}
            <Menu
              anchorEl={settingsMenuAnchor}
              open={Boolean(settingsMenuAnchor)}
              onClose={() => setSettingsMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: 200,
                },
              }}
            >
              <MenuItem sx={{ color: 'white' }}>
                <ListItemText primary="Configuración de reproducción" secondary="Ajustar preferencias" />
              </MenuItem>
              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <MenuItem sx={{ color: 'white' }}>
                <ListItemText primary="Idioma de audio" />
              </MenuItem>
              <MenuItem sx={{ color: 'white' }}>
                <ListItemText primary="Estadísticas de reproducción" />
              </MenuItem>
            </Menu>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedPlayerControls; 