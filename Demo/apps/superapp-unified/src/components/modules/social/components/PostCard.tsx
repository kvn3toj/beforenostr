/**
 * 📝 PostCard Component
 * 
 * Componente para mostrar una publicación individual del feed social
 * con funcionalidades de like, comentarios y opciones.
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Chip,
  Box,
  Collapse,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
} from '@mui/icons-material';

// Hooks
import {
  useLikePost,
  usePostComments,
  useCreateComment,
  useLikeComment,
} from '../../../../hooks/useRealBackendData';

// Tipos
import type { SocialPost, PostComment } from '../../../../types';

interface PostCardProps {
  post: SocialPost;
  formatTime: (dateString: string) => string;
  onPostClick?: (postId: string) => void;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  formatTime,
  onPostClick,
  compact = false
}) => {
  // Estados locales
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Hooks de mutación
  const likePostMutation = useLikePost();
  const createCommentMutation = useCreateComment();
  const likeCommentMutation = useLikeComment();

  // Hook para obtener comentarios (solo cuando están visibles)
  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError
  } = usePostComments(post.id, 0, 5);

  const comments = commentsData?.data || [];

  // Manejar like del post
  const handleLikePost = async () => {
    try {
      await likePostMutation.mutateAsync({
        postId: post.id,
        action: post.isLikedByCurrentUser ? 'unlike' : 'like'
      });
    } catch (error) {
      console.error('Error con like:', error);
    }
  };

  // Manejar toggle de comentarios
  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  // Manejar envío de comentario
  const handleSendComment = async () => {
    if (!commentText.trim() || createCommentMutation.isPending) return;

    try {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        content: commentText.trim()
      });
      setCommentText('');
    } catch (error) {
      console.error('Error enviando comentario:', error);
    }
  };

  // Manejar like de comentario
  const handleLikeComment = async (commentId: string) => {
    try {
      await likeCommentMutation.mutateAsync({
        postId: post.id,
        commentId
      });
    } catch (error) {
      console.error('Error con like de comentario:', error);
    }
  };

  // Formatear hashtags en el contenido
  const formatContent = (content: string) => {
    return content.split(' ').map((word, index) => {
      if (word.startsWith('#')) {
        return (
          <Chip
            key={index}
            label={word}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ 
              mr: 0.5, 
              mb: 0.5,
              fontSize: '0.75rem',
              height: 'auto',
              '& .MuiChip-label': {
                px: 1,
                py: 0.5
              }
            }}
          />
        );
      }
      return word + ' ';
    });
  };

  return (
    <Card
      sx={{
        mb: 2,
        boxShadow: 2,
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease-in-out'
        },
        cursor: onPostClick ? 'pointer' : 'default'
      }}
      onClick={() => onPostClick?.(post.id)}
    >
      {/* Header del post */}
      <CardHeader
        avatar={
          <Avatar
            src={post.authorAvatar}
            alt={post.authorName}
            sx={{ width: 40, height: 40 }}
          >
            {post.authorName.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {post.authorName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatTime(post.timestamp)}
          </Typography>
        }
        action={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        }
        sx={{ pb: 1 }}
      />

      {/* Contenido del post */}
      <CardContent sx={{ pt: 0, pb: 1 }}>
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.5,
            color: 'text.primary',
            wordWrap: 'break-word'
          }}
        >
          {formatContent(post.content)}
        </Typography>

        {/* Media si existe */}
        {post.media && (
          <Box sx={{ mt: 2 }}>
            {post.type === 'image' && (
              <img
                src={post.media}
                alt="Post media"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            )}
            {post.type === 'video' && (
              <video
                controls
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px'
                }}
              >
                <source src={post.media} type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            )}
          </Box>
        )}
      </CardContent>

      {/* Acciones del post */}
      <CardActions disableSpacing sx={{ pt: 0, pb: 2, px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
          {/* Like */}
          <Tooltip title={post.isLikedByCurrentUser ? 'Quitar like' : 'Me gusta'}>
            <Button
              startIcon={
                post.isLikedByCurrentUser ? (
                  <FavoriteIcon sx={{ color: '#E91E63' }} />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                handleLikePost();
              }}
              disabled={likePostMutation.isPending}
              size="small"
              sx={{
                minWidth: 'auto',
                color: post.isLikedByCurrentUser ? '#E91E63' : 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(233, 30, 99, 0.08)'
                }
              }}
            >
              {post.likesCount}
            </Button>
          </Tooltip>

          {/* Comentarios */}
          <Tooltip title="Comentarios">
            <Button
              startIcon={<CommentIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleComments();
              }}
              size="small"
              sx={{
                minWidth: 'auto',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              {post.commentsCount}
            </Button>
          </Tooltip>

          {/* Compartir */}
          <Tooltip title="Compartir">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implementar funcionalidad de compartir
                console.log('Compartir post:', post.id);
              }}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>

      {/* Sección de comentarios (colapsable) */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2 }}>
          {/* Input para nuevo comentario */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
              multiline
              maxRows={3}
              size="small"
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <IconButton
              onClick={handleSendComment}
              disabled={!commentText.trim() || createCommentMutation.isPending}
              color="primary"
              sx={{
                mt: 0.5,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                },
                '&:disabled': {
                  backgroundColor: 'grey.300'
                }
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Lista de comentarios */}
          {commentsLoading && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Cargando comentarios...
            </Typography>
          )}

          {commentsError && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
              Error cargando comentarios
            </Typography>
          )}

          {comments.length > 0 && (
            <List dense sx={{ pt: 0 }}>
              {comments.map((comment: PostComment) => (
                <ListItem
                  key={comment.id}
                  alignItems="flex-start"
                  sx={{
                    px: 0,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={comment.authorAvatar}
                      alt={comment.authorName}
                      sx={{ width: 32, height: 32 }}
                    >
                      {comment.authorName.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                          {comment.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatTime(comment.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mt: 0.5, mb: 1 }}>
                          {comment.content}
                        </Typography>
                        <Button
                          startIcon={
                            comment.isLikedByCurrentUser ? (
                              <FavoriteIcon sx={{ fontSize: '12px', color: '#E91E63' }} />
                            ) : (
                              <FavoriteBorderIcon sx={{ fontSize: '12px' }} />
                            )
                          }
                          onClick={() => handleLikeComment(comment.id)}
                          size="small"
                          sx={{
                            minWidth: 'auto',
                            fontSize: '0.7rem',
                            px: 1,
                            py: 0.25,
                            color: comment.isLikedByCurrentUser ? '#E91E63' : 'text.secondary'
                          }}
                        >
                          {comment.likesCount || ''}
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {comments.length === 0 && !commentsLoading && !commentsError && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No hay comentarios aún. ¡Sé el primero en comentar!
            </Typography>
          )}
        </Box>
      </Collapse>

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          Compartir
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          Reportar
        </MenuItem>
        {post.authorId === 'current-user-id' && (
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
            Eliminar
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default PostCard; 