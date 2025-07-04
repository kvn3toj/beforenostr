import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Stack,
  Box,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Subtitles as SubtitlesIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  Storage as StorageIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  CloudDownload as DownloadIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Subtitle } from '@prisma/client';

interface SubtitleCardProps {
  subtitle: Subtitle;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export const SubtitleCard: React.FC<SubtitleCardProps> = ({
  subtitle,
  onToggleActive,
  onDelete,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleToggleActive = () => {
    onToggleActive(subtitle.id, !subtitle.isActive);
  };

  const handleDelete = () => {
    onDelete(subtitle.id);
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'es': '🇪🇸 Español',
      'en': '🇺🇸 English',
      'fr': '🇫🇷 Français',
      'de': '🇩🇪 Deutsch',
      'it': '🇮🇹 Italiano',
      'pt': '🇵🇹 Português',
    };
    return languages[code] || (code ? `🌐 ${code.toUpperCase()}` : '❓ Unknown');
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFormatColor = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'srt':
        return 'primary';
      case 'vtt':
        return 'secondary';
      case 'ass':
        return 'info';
      default:
        return 'default';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format?.toLowerCase()) {
      case 'srt':
        return '📄';
      case 'vtt':
        return '🎬';
      case 'ass':
        return '🎭';
      default:
        return '📝';
    }
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%',
        border: '2px solid',
        borderColor: subtitle.isActive ? 'success.light' : 'grey.200',
        borderRadius: 3,
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          elevation: 8,
          borderColor: subtitle.isActive ? 'success.main' : 'primary.light',
          transform: 'translateY(-4px)',
          '& .subtitle-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: subtitle.isActive 
            ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)'
            : 'linear-gradient(90deg, #bdbdbd 0%, #e0e0e0 100%)',
        }
      }}
    >
      <CardContent sx={{ pb: 1, p: 3 }}>
        {/* Header mejorado con icono y estado */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'success.light', 
              borderRadius: 2,
              color: 'success.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SubtitlesIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {getLanguageName(subtitle.languageCode || 'unknown')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Subtítulo #{subtitle.id}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={subtitle.isActive ? <ActiveIcon /> : <InactiveIcon />}
            label={subtitle.isActive ? 'Activo' : 'Inactivo'}
            size="small"
            color={subtitle.isActive ? 'success' : 'default'}
            variant="filled"
            sx={{ 
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: '1rem'
              }
            }}
          />
        </Box>

        {/* Metadatos principales mejorados */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label={`${getFormatIcon(subtitle.format || '')} ${subtitle.format ? subtitle.format.toUpperCase() : 'UNKNOWN'}`}
            size="small"
            variant="filled"
            color={getFormatColor(subtitle.format || '') as any}
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<LanguageIcon />}
            label={subtitle.languageCode || 'Unknown'}
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ fontWeight: 500 }}
          />
          {subtitle.content && (
            <Chip
              icon={<StorageIcon />}
              label={`${subtitle.content.length} caracteres`}
              size="small"
              variant="outlined"
              color="info"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Stack>

        {/* Información de fechas mejorada */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, 
            mb: 2, 
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                p: 0.5, 
                bgcolor: 'info.light', 
                borderRadius: 1,
                color: 'info.contrastText'
              }}>
                <ScheduleIcon fontSize="small" />
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                <strong>Creado:</strong> {formatDate(subtitle.createdAt)}
              </Typography>
            </Box>
            
            {subtitle.updatedAt && subtitle.updatedAt !== subtitle.createdAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  p: 0.5, 
                  bgcolor: 'warning.light', 
                  borderRadius: 1,
                  color: 'warning.contrastText'
                }}>
                  <ScheduleIcon fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                  <strong>Actualizado:</strong> {formatDate(subtitle.updatedAt)}
                </Typography>
              </Box>
            )}

            {subtitle.contentUrl && (
              <Box sx={{ 
                p: 1.5,
                bgcolor: 'primary.light',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'primary.main'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DownloadIcon fontSize="small" color="primary" />
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                    Archivo disponible
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  wordBreak: 'break-all',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  bgcolor: 'white',
                  p: 1,
                  borderRadius: 0.5,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  {subtitle.contentUrl}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </CardContent>

      <CardActions 
        className="subtitle-actions"
        sx={{ 
          justifyContent: 'flex-end', 
          pt: 0, 
          pb: 2, 
          px: 3,
          gap: 1,
          opacity: 0.7,
          transform: 'translateY(4px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Tooltip title={subtitle.isActive ? 'Desactivar subtítulo' : 'Activar subtítulo'} arrow>
          <IconButton
            onClick={handleToggleActive}
            disabled={disabled}
            color={subtitle.isActive ? 'success' : 'default'}
            size="medium"
            sx={{ 
              bgcolor: subtitle.isActive ? 'success.light' : 'grey.300',
              color: subtitle.isActive ? 'success.contrastText' : 'text.secondary',
              '&:hover': { 
                bgcolor: subtitle.isActive ? 'success.main' : 'grey.400',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            {subtitle.isActive ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Eliminar subtítulo" arrow>
          <IconButton
            onClick={handleDelete}
            disabled={disabled}
            color="error"
            size="medium"
            sx={{ 
              bgcolor: 'error.light',
              color: 'error.contrastText',
              '&:hover': { 
                bgcolor: 'error.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}; 