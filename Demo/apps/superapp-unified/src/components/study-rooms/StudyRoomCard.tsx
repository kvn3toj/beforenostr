import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';
import { StudyRoom } from '../../hooks/useStudyRooms';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface StudyRoomCardProps {
  room: StudyRoom;
  onJoin: (roomId: string) => void;
  onWatch: (videoId: string) => void;
  isJoining?: boolean;
  className?: string;
}

export const StudyRoomCard: React.FC<StudyRoomCardProps> = ({
  room,
  onJoin,
  onWatch,
  isJoining = false,
  className,
}) => {
  const participantCount = room.participants?.length || 0;
  const isAtCapacity = participantCount >= room.maxParticipants;
  const timeAgo = formatDistanceToNow(new Date(room.createdAt), { 
    addSuffix: true, 
    locale: es 
  });

  const handleJoinClick = () => {
    onJoin(room.id);
  };

  const handleWatchClick = () => {
    if (room.videoId) {
      onWatch(room.videoId);
    }
  };

  return (
    <Card 
      className={className}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {/* Status Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
        }}
      >
        <Chip
          label={room.isActive ? 'Activa' : 'Finalizada'}
          color={room.isActive ? 'success' : 'default'}
          size="small"
          variant="filled"
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Room Title */}
        <Typography 
          variant="h6" 
          component="h3"
          gutterBottom
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 1,
            pr: 8, // Space for status badge
          }}
        >
          {room.name}
        </Typography>

        {/* Description */}
        {room.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {room.description}
          </Typography>
        )}

        {/* Video Info */}
        {room.video && (
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              p: 1,
              backgroundColor: 'background.default',
              borderRadius: 1,
            }}
          >
            <VideocamIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {room.video.title}
            </Typography>
            {room.video.duration && (
              <Typography variant="caption" color="text.secondary">
                {Math.round(room.video.duration / 60)}min
              </Typography>
            )}
          </Box>
        )}

        {/* Room Stats */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          {/* Participants */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {participantCount}/{room.maxParticipants}
            </Typography>
          </Box>

          {/* Time */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {timeAgo}
            </Typography>
          </Box>
        </Box>

        {/* Participants Avatars */}
        {room.participants && room.participants.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Participantes:
            </Typography>
            <Box sx={{ display: 'flex', ml: 1 }}>
              {room.participants.slice(0, 3).map((participant, index) => (
                <Tooltip 
                  key={participant.id}
                  title={participant.user?.name || participant.userId}
                  arrow
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      fontSize: '0.75rem',
                      marginLeft: index > 0 ? '-8px' : 0,
                      border: '2px solid white',
                      backgroundColor: 'primary.main',
                    }}
                  >
                    {(participant.user?.name || participant.userId)?.[0]?.toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
              {room.participants.length > 3 && (
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: '0.65rem',
                    marginLeft: '-8px',
                    border: '2px solid white',
                    backgroundColor: 'grey.400',
                  }}
                >
                  +{room.participants.length - 3}
                </Avatar>
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          {/* Join Room Button */}
          <Button
            variant="contained"
            fullWidth
            disabled={!room.isActive || isAtCapacity || isJoining}
            onClick={handleJoinClick}
            startIcon={<PeopleIcon />}
            sx={{ flexGrow: 1 }}
          >
            {isJoining ? 'Uniéndose...' : 
             isAtCapacity ? 'Llena' : 
             'Unirse'}
          </Button>

          {/* Watch Solo Button */}
          <Tooltip title="Ver video individualmente" arrow>
            <IconButton
              color="primary"
              onClick={handleWatchClick}
              disabled={!room.videoId}
              sx={{ 
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              <PlayIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};