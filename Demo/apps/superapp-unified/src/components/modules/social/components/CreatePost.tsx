/**
 * ✍️ CreatePost Component
 * 
 * Componente para crear nuevas publicaciones en el feed social
 * con soporte para texto, imágenes y videos.
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Videocam as VideocamIcon,
  EmojiEmotions as EmojiIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

// Hooks
import { useCreatePost } from '../../../../hooks/useRealBackendData';

interface CreatePostProps {
  authorName?: string;
  authorAvatar?: string;
  onPostCreated?: () => void;
  placeholder?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  authorName = 'Tú',
  authorAvatar = '/assets/images/avatars/current-user.jpg',
  onPostCreated,
  placeholder = '¿Qué está pasando en tu viaje de CoomÜnity? ¡Comparte tu experiencia con Reciprocidad!'
}) => {
  // Estados locales
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Referencias
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  // Hook de mutación
  const createPostMutation = useCreatePost();

  // Emojis populares de CoomÜnity
  const popularEmojis = [
    '🚀', '💚', '✨', '🌱', '🤝', '❤️', '🔥', '💫',
    '🌟', '🎯', '💪', '🙏', '🌈', '⚡', '🎉', '💡'
  ];

  // Manejar selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 10MB.');
      return;
    }

    // Validar tipo
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Solo se permiten imágenes y videos.');
      return;
    }

    setSelectedMedia(file);
    setMediaType(isImage ? 'image' : 'video');

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remover media seleccionado
  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  // Manejar envío del post
  const handleSubmit = async () => {
    if (!content.trim() && !selectedMedia) {
      alert('Escribe algo o adjunta un archivo para publicar.');
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        content: content.trim(),
        type: selectedMedia ? (mediaType! === 'image' ? 'IMAGE' : 'VIDEO') : 'TEXT',
        media: selectedMedia || undefined
      });

      // Limpiar formulario
      setContent('');
      handleRemoveMedia();
      
      // Callback opcional
      onPostCreated?.();

    } catch (error) {
      console.error('Error creando post:', error);
      alert('Error al crear la publicación. Inténtalo de nuevo.');
    }
  };

  // Manejar inserción de emoji
  const handleEmojiSelect = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiMenu(false);
  };

  // Detectar hashtags y menciones en el texto
  const getCharacterCount = () => {
    return content.length;
  };

  const isNearLimit = getCharacterCount() > 400;
  const isOverLimit = getCharacterCount() > 500;

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      {/* Progreso de carga */}
      {createPostMutation.isPending && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      )}

      <CardContent sx={{ pb: 1 }}>
        {/* Header con avatar */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            src={authorAvatar}
            alt={authorName}
            sx={{ width: 40, height: 40 }}
          >
            {authorName.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {authorName}
            </Typography>

            {/* Campo de texto principal */}
            <TextField
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={3}
              maxRows={8}
              fullWidth
              variant="outlined"
              data-testid="create-post-input"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  '& fieldset': {
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '1rem',
                  lineHeight: 1.5,
                }
              }}
              disabled={createPostMutation.isPending}
            />

            {/* Contador de caracteres */}
            {content.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Typography
                  variant="caption"
                  color={isOverLimit ? 'error' : isNearLimit ? 'warning.main' : 'text.secondary'}
                >
                  {getCharacterCount()}/500
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Preview de media */}
        {mediaPreview && (
          <Box sx={{ position: 'relative', mt: 2, borderRadius: 2, overflow: 'hidden' }}>
            {mediaType === 'image' && (
              <img
                src={mediaPreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
              />
            )}
            {mediaType === 'video' && (
              <video
                src={mediaPreview}
                controls
                style={{
                  width: '100%',
                  maxHeight: '300px',
                }}
              />
            )}
            <IconButton
              onClick={handleRemoveMedia}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }
              }}
              size="small"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Sugerencias de hashtags */}
        {content.length > 10 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Hashtags sugeridos para tu publicación:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {['#CoomÜnity', '#Reciprocidad', '#BienComún', '#Metanöia', '#Colaboración'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => setContent(prev => prev + (prev.endsWith(' ') ? '' : ' ') + tag + ' ')}
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Mensaje de error */}
        {createPostMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al crear la publicación. Verifica tu conexión e inténtalo de nuevo.
          </Alert>
        )}
      </CardContent>

      <CardActions sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
          {/* Botones de media */}
          <Tooltip title="Adjuntar imagen">
            <IconButton
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.click();
                }
              }}
              size="small"
              sx={{ color: 'text.secondary' }}
              disabled={createPostMutation.isPending}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Adjuntar video">
            <IconButton
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'video/*';
                  fileInputRef.current.click();
                }
              }}
              size="small"
              sx={{ color: 'text.secondary' }}
              disabled={createPostMutation.isPending}
            >
              <VideocamIcon />
            </IconButton>
          </Tooltip>

          {/* Botón de emojis */}
          <Tooltip title="Agregar emoji">
            <IconButton
              ref={emojiButtonRef}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setShowEmojiMenu(true);
              }}
              size="small"
              sx={{ color: 'text.secondary' }}
              disabled={createPostMutation.isPending}
            >
              <EmojiIcon />
            </IconButton>
          </Tooltip>

          {/* Espaciador */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botón de publicar */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              createPostMutation.isPending || 
              isOverLimit || 
              (!content.trim() && !selectedMedia)
            }
            startIcon={<SendIcon />}
                          data-testid="create-post-button"
            sx={{
              borderRadius: 2,
              backgroundColor: '#E91E63',
              '&:hover': {
                backgroundColor: '#C2185B',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
              }
            }}
          >
            {createPostMutation.isPending ? 'Publicando...' : 'Publicar'}
          </Button>
        </Box>
      </CardActions>

      {/* Input de archivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="Seleccionar archivo de imagen o video"
      />

      {/* Menú de emojis */}
      <Menu
        anchorEl={anchorEl}
        open={showEmojiMenu}
        onClose={() => setShowEmojiMenu(false)}
        PaperProps={{
          sx: {
            maxWidth: 280,
            p: 1,
          }
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 0.5 }}>
          {popularEmojis.map((emoji) => (
            <Button
              key={emoji}
              onClick={() => handleEmojiSelect(emoji)}
              sx={{
                minWidth: 'auto',
                width: 32,
                height: 32,
                fontSize: '1.2rem',
                p: 0,
              }}
            >
              {emoji}
            </Button>
          ))}
        </Box>
      </Menu>
    </Card>
  );
};

export default CreatePost; 