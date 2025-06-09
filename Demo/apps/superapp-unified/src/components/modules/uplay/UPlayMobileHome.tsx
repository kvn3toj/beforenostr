import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  Skeleton,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Quiz as QuizIcon,
} from '@mui/icons-material';

// Import mock data hook
import {
  useUPlayMockData,
  MockVideo,
  MockPlaylist,
} from '../../../hooks/useUPlayMockData';

// Placeholder Component for Video Thumbnail
const VideoThumbnail: React.FC<{
  width: number | string;
  height: number | string;
  className?: string;
}> = ({ width, height, className }) => (
  <Box
    className={className}
    sx={{
      width,
      height,
      backgroundColor: '#E0E0E0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Triangle shape */}
    <Box
      sx={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 0,
        height: 0,
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderBottom: '35px solid #9E9E9E',
      }}
    />
    {/* Rectangle shape */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '20%',
        left: '25%',
        width: '20px',
        height: '20px',
        backgroundColor: '#9E9E9E',
        borderRadius: 1,
      }}
    />
    {/* Circle shape */}
    <Box
      sx={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        width: '25px',
        height: '25px',
        backgroundColor: '#9E9E9E',
        borderRadius: '50%',
      }}
    />
  </Box>
);

// Status Chip Component
const StatusChip: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <Chip
    icon={
      <Avatar
        sx={{
          width: 18,
          height: 18,
          backgroundColor: '#49454F',
          '& .MuiAvatar-img': { width: '70%', height: '70%' },
        }}
      >
        {icon}
      </Avatar>
    }
    label={label}
    variant="outlined"
    size="small"
    sx={{
      borderColor: '#79747E',
      color: '#49454F',
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 500,
      height: 24,
      '& .MuiChip-label': {
        paddingLeft: 1,
      },
    }}
  />
);

// Video Card Component for horizontal lists
const VideoCard: React.FC<{
  video: MockVideo;
  onClick?: () => void;
}> = ({ video, onClick }) => (
  <Box
    sx={{
      width: 118,
      flexShrink: 0,
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick
        ? {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease-in-out',
          }
        : {},
    }}
    onClick={onClick}
  >
    <VideoThumbnail width={118} height={66} />
    <Box sx={{ mt: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: '#2B2A2A',
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '22px',
          mb: 0.5,
        }}
      >
        {video.title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: '#2B2A2A',
          fontFamily: 'Roboto',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '22px',
          display: 'block',
        }}
      >
        {video.description}
      </Typography>
    </Box>
  </Box>
);

const UPlayMobileHome: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Use mock data hook
  const {
    isLoading,
    userStats,
    continueWatching,
    staffPlaylists,
    myPlaylists,
    createdPlaylist,
    formatDuration,
    getProgressText,
  } = useUPlayMockData();

  const handleVideoClick = (video: MockVideo) => {
    console.log('Playing video:', video.title);
    // Navigate to interactive video demo
    navigate('/interactive-video');
  };

  const handleContinueWatching = () => {
    console.log('Continuing video:', continueWatching.title);
    // Navigate to interactive video demo
    navigate('/interactive-video');
  };

  const handleInteractiveDemo = () => {
    navigate('/interactive-video');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          backgroundColor: '#FFF',
          p: 2,
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={202}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width={118} height={66} />
          <Skeleton variant="rectangular" width={118} height={66} />
          <Skeleton variant="rectangular" width={118} height={66} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#FFF',
        position: 'relative',
      }}
    >
      {/* Status Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          height: 44,
          px: 2.5,
          py: 1,
        }}
      >
        <Typography
          sx={{
            color: '#1D1B20',
            fontFamily: 'Roboto',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
          }}
        >
          9:30
        </Typography>

        {/* Right Icons - Signal, WiFi, Battery */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Box sx={{ opacity: 0.1 }}>📶</Box>
          <Box>📶</Box>
          <Box sx={{ opacity: 0.3 }}>🔋</Box>
        </Box>
      </Box>

      {/* Top App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#FFF',
          color: '#1D1B20',
          borderBottom: '1px solid #CAC4D0',
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: 1,
          }}
        >
          <IconButton edge="start" sx={{ mr: 1 }} aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="h1"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontFamily: 'Roboto',
              fontSize: '22px',
              fontWeight: 400,
              lineHeight: '28px',
            }}
          >
            ÜPlay
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small">
              <SearchIcon />
            </IconButton>
            <IconButton size="small">
              <NotificationsIcon />
            </IconButton>
            <IconButton size="small">
              <MessageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ px: 2, py: 2, pb: 10 }}>
        {/* Status Chips */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <StatusChip
            icon={<PersonIcon sx={{ fontSize: 12 }} />}
            label={`${userStats.activePlayers} jugadores activos`}
          />
          <StatusChip
            icon={<PersonIcon sx={{ fontSize: 12 }} />}
            label={`${userStats.burnedPlayers} jugadores quemados`}
          />
        </Stack>

        {/* Welcome Message */}
        <Typography
          sx={{
            color: '#1E1D1D',
            fontFamily: 'Montserrat',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 'normal',
            mb: 2,
          }}
        >
          Bienvenida,
          <br />
          {userStats.name}
        </Typography>
        {/* Interactive Video Demo Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<QuizIcon />}
            onClick={handleInteractiveDemo}
            sx={{
              backgroundColor: '#6750A4',
              color: 'white',
              borderRadius: 2,
              py: 1.5,
              mb: 2,
              '&:hover': {
                backgroundColor: '#5A47A0',
              },
            }}
          >
            🎮 Probar Reproductor Interactivo
          </Button>
        </Box>

        {/* Continue Watching Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: '#2B2A2A',
              fontFamily: 'Roboto',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '22px',
              mb: 1,
            }}
          >
            Continuar viendo
          </Typography>

          {/* Main Video Thumbnail */}
          <Box
            sx={{
              position: 'relative',
              mb: 2,
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.01)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
            onClick={handleContinueWatching}
          >
            <VideoThumbnail width="100%" height={202} />
            {/* Play overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlayIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </Box>

          {/* Video Info with Progress */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Progress Circle */}
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={continueWatching.progress || 0}
                size={48}
                thickness={4}
                sx={{
                  color: '#6750A4',
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ fontSize: '10px', fontWeight: 600 }}
                >
                  {`${continueWatching.progress || 0}%`}
                </Typography>
              </Box>
            </Box>

            {/* Video Details */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#2B2A2A',
                  fontFamily: 'Roboto',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '22px',
                  mb: 0.5,
                }}
              >
                {continueWatching.title}
              </Typography>
              <Typography
                sx={{
                  color: '#2B2A2A',
                  fontFamily: 'Roboto',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: '22px',
                }}
              >
                {continueWatching.description}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#6750A4',
                  fontFamily: 'Roboto',
                  fontSize: '11px',
                  fontWeight: 500,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {getProgressText(continueWatching.progress || 0)} •{' '}
                {formatDuration(continueWatching.duration)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Staff Playlists Section */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              color: '#2B2A2A',
              fontFamily: 'Roboto',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '22px',
              mb: 2,
            }}
          >
            Playlists del Staff
          </Typography>

          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
            {staffPlaylists.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </Stack>
        </Box>

        {/* My Playlists Section */}
        <Box>
          <Typography
            sx={{
              color: '#2B2A2A',
              fontFamily: 'Roboto',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '22px',
              mb: 2,
            }}
          >
            Mis playlists
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            sx={{ overflowX: 'auto', pb: 1, mb: 2 }}
          >
            {myPlaylists.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
              />
            ))}
          </Stack>

          {/* Playlist Card */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              gap: 2,
              cursor: 'pointer',
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#F5F5F5',
                transition: 'background-color 0.2s ease-in-out',
              },
            }}
            onClick={() =>
              console.log('Opening playlist:', createdPlaylist.name)
            }
          >
            {/* Playlist Icon - 2x2 grid */}
            <Box
              sx={{
                width: 50,
                height: 56,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 25,
                  height: 28,
                  backgroundColor: '#D9D9D9',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 25,
                  height: 28,
                  backgroundColor: '#B9B8B8',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 25,
                  height: 28,
                  backgroundColor: '#B9B8B8',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 25,
                  height: 28,
                  backgroundColor: '#D9D9D9',
                }}
              />
            </Box>

            {/* Playlist Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: '#2D2D2D',
                  fontFamily: 'Montserrat',
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  mb: 0.5,
                }}
              >
                {createdPlaylist.name}
              </Typography>
              <Typography
                sx={{
                  color: '#2D2D2D',
                  fontFamily: 'Montserrat',
                  fontSize: '10px',
                  fontWeight: 400,
                  lineHeight: 'normal',
                }}
              >
                {createdPlaylist.videoCount} Videos {createdPlaylist.merits}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UPlayMobileHome;
