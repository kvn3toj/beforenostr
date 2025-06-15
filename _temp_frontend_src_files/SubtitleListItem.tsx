import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '../../common/Icons';
import { useTranslation } from 'react-i18next';
import { Subtitle } from '@prisma/client';

interface SubtitleListItemProps {
  subtitle: Subtitle;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export const SubtitleListItem: React.FC<SubtitleListItemProps> = ({
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
      'es': 'Español',
      'en': 'English',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'pt': 'Português',
    };
    return languages[code] || (code ? code.toUpperCase() : 'Unknown');
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

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2, 
        border: subtitle.isActive ? '2px solid #4caf50' : '1px solid #e0e0e0',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left side - Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h6" component="div">
              {getLanguageName(subtitle.languageCode || 'unknown')}
            </Typography>
            
            <Chip 
              label={subtitle.format ? subtitle.format.toUpperCase() : 'UNKNOWN'} 
              size="small" 
              variant="outlined" 
            />
            
            <Chip
              label={subtitle.isActive ? t('subtitle_active_label') : t('subtitle_inactive_label')}
              size="small"
              color={subtitle.isActive ? 'success' : 'default'}
              variant={subtitle.isActive ? 'filled' : 'outlined'}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Creado: {formatDate(subtitle.createdAt)}
          </Typography>

          {subtitle.updatedAt && subtitle.updatedAt !== subtitle.createdAt && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Actualizado: {formatDate(subtitle.updatedAt)}
            </Typography>
          )}

          {subtitle.content && (
            <Typography variant="body2" color="text.secondary">
              Tamaño: {subtitle.content.length} caracteres
            </Typography>
          )}

          {subtitle.contentUrl && (
            <Typography variant="body2" color="text.secondary">
              URL: {subtitle.contentUrl}
            </Typography>
          )}
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
          <Tooltip title={subtitle.isActive ? t('button_deactivate') : t('button_activate')}>
            <IconButton
              onClick={handleToggleActive}
              disabled={disabled}
              color={subtitle.isActive ? 'success' : 'default'}
            >
              {subtitle.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title={t('button_delete_subtitle')}>
            <IconButton
              onClick={handleDelete}
              disabled={disabled}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}; 