import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  TextField,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreIcon,
  Send as SendIcon,
  PlayArrow as PlayIcon,
  EmojiEvents as TrophyIcon,
  VideoCameraFront as VideoIcon,
} from '@mui/icons-material';
import { Publication, Comment, CreateCommentData } from '../../hooks/useSocial';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface SocialFeedCardProps {
  publication: Publication;
  onLike: (targetId: string, targetType: 'publication' | 'comment') => void;
  onComment: (data: CreateCommentData) => void;
  onShare?: (publicationId: string) => void;
  onEdit?: (publicationId: string) => void;
  onDelete?: (publicationId: string) => void;
  currentUserId?: string;
  className?: string;
}

export const SocialFeedCard: React.FC<SocialFeedCardProps> = ({
  publication,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  currentUserId,
  className,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isLiked = publication.likes?.some(like => like.userId === currentUserId) || false;
  const likesCount = publication._count?.likes || publication.likes?.length || 0;
  const commentsCount = publication._count?.comments || publication.comments?.length || 0;
  const isOwner = publication.userId === currentUserId;

  const timeAgo = formatDistanceToNow(new Date(publication.createdAt), { 
    addSuffix: true, 
    locale: es 
  });

  const handleLikeClick = () => {
    onLike(publication.id, 'publication');
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment({
        publicationId: publication.id,
        content: commentText.trim(),
      });
      setCommentText('');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit?.(publication.id);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(publication.id);
  };

  const handleShare = () => {
    onShare?.(publication.id);
  };

  const getPublicationTypeIcon = () => {
    const metadata = publication.metadata;
    
    if (metadata?.type === 'video_review') {
      return <VideoIcon color="primary" fontSize="small" />;
    }
    
    if (metadata?.type === 'challenge_completed') {
      return <TrophyIcon color="warning" fontSize="small" />;
    }
    
    if (metadata?.type === 'study_room_created') {
      return <PlayIcon color="secondary" fontSize="small" />;
    }

    return null;
  };

  const getPublicationMetadata = () => {
    const metadata = publication.metadata;
    
    if (metadata?.type === 'video_review') {
      return (
        <Chip
          icon={<VideoIcon />}
          label={`Reseña de Video ${metadata.rating ? `⭐${metadata.rating}/5` : ''}`}
          size="small"
          color="primary"
          variant="outlined"
        />
      );
    }
    
    if (metadata?.type === 'challenge_completed') {
      return (
        <Chip
          icon={<TrophyIcon />}
          label={`+${metadata.meritsEarned || 0} mëritos ganados`}
          size="small"
          color="warning"
          variant="filled"
        />
      );
    }
    
    if (metadata?.type === 'study_room_created') {
      return (
        <Chip
          icon={<PlayIcon />}
          label="Sala de Estudio Creada"
          size="small"
          color="secondary"
          variant="outlined"
        />
      );
    }

    return null;
  };

  return (
    <Card className={className} sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar 
            sx={{ width: 40, height: 40, mr: 2, backgroundColor: 'primary.main' }}
          >
            {publication.user?.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {publication.user?.name || 'Usuario'}
              </Typography>
              {getPublicationTypeIcon()}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {timeAgo}
            </Typography>
          </Box>

          {/* Menu Button */}
          {(isOwner || onShare) && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: 1 }}
            >
              <MoreIcon />
            </IconButton>
          )}
        </Box>

        {/* Publication Metadata */}
        {getPublicationMetadata() && (
          <Box sx={{ mb: 2 }}>
            {getPublicationMetadata()}
          </Box>
        )}

        {/* Content */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {publication.content}
        </Typography>

        {/* Visibility Badge */}
        {publication.visibility !== 'public' && (
          <Chip
            label={publication.visibility === 'friends' ? 'Solo Amigos' : 'Privado'}
            size="small"
            variant="outlined"
            color="default"
            sx={{ mb: 1 }}
          />
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          {/* Like Button */}
          <Button
            startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={handleLikeClick}
            color={isLiked ? 'error' : 'inherit'}
            size="small"
          >
            {likesCount}
          </Button>

          {/* Comment Button */}
          <Button
            startIcon={<CommentIcon />}
            onClick={() => setShowComments(!showComments)}
            size="small"
          >
            {commentsCount}
          </Button>

          {/* Share Button */}
          {onShare && (
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
              size="small"
            >
              Compartir
            </Button>
          )}
        </Box>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* New Comment Input */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Avatar 
              sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}
            >
              {currentUserId?.[0]?.toUpperCase() || 'Y'}
            </Avatar>
            <TextField
              fullWidth
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
              multiline
              maxRows={3}
              size="small"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim()}
                    size="small"
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* Comments List */}
          {publication.comments && publication.comments.length > 0 && (
            <List disablePadding>
              {publication.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start" disablePadding>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ width: 32, height: 32, backgroundColor: 'secondary.main' }}
                    >
                      {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {comment.user?.name || 'Usuario'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(comment.createdAt), { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'pre-line',
                          wordBreak: 'break-word',
                        }}
                      >
                        {comment.content}
                      </Typography>
                    }
                  />
                  
                  {/* Comment Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onLike(comment.id, 'comment')}
                      color={comment.likes?.some(like => like.userId === currentUserId) ? 'error' : 'default'}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption" color="text.secondary">
                      {comment._count?.likes || comment.likes?.length || 0}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}

          {commentsCount > (publication.comments?.length || 0) && (
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button size="small" variant="text">
                Ver {commentsCount - (publication.comments?.length || 0)} comentarios más
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {isOwner && onEdit && (
          <MenuItem onClick={handleEdit}>
            <Typography variant="body2">Editar</Typography>
          </MenuItem>
        )}
        {isOwner && onDelete && (
          <MenuItem onClick={handleDelete}>
            <Typography variant="body2" color="error">Eliminar</Typography>
          </MenuItem>
        )}
        {onShare && (
          <MenuItem onClick={handleShare}>
            <Typography variant="body2">Compartir</Typography>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};