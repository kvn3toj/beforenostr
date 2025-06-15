import { Card, CardContent, Box, CardActionArea, Typography, Button, CardActions } from '@mui/material';
import { PlaylistItem } from '../../types/playlistItem.types';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { extractIframeSrc } from '../../utils/videoUtils';

interface PlaylistItemCardProps {
  item: PlaylistItem;
  onNavigate?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export const PlaylistItemCard = ({ item, onNavigate, onDelete }: PlaylistItemCardProps) => {
  // Extraer título del iframe si está disponible (como respaldo visual)
  const getIframeTitle = () => {
    const titleMatch = item.content.match(/title="([^"]*?)"/);
    return titleMatch ? titleMatch[1] : 'Video';
  };
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea 
        onClick={() => onNavigate && onNavigate(item.id)}
        disabled={!onNavigate}
      >
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
          }}
        >
          {(() => {
            const src = extractIframeSrc(item.content);
            if (src) {
              return (
                <iframe
                  src={src}
                  title={item.title || getIframeTitle()}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              );
            }
            return (
              <Box sx={{ color: 'white', textAlign: 'center', width: '100%' }}>
                {t('video_content_not_available')}
              </Box>
            );
          })()}
        </Box>
        <CardContent>
          <Typography variant="subtitle1" component="div" noWrap>
            {/* Usar título del item si existe, o extraer del iframe */}
            {item.title || getIframeTitle()}
          </Typography>
          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {item.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ mt: 'auto', justifyContent: 'flex-end' }}>
        {onNavigate && (
          <Button 
            size="small" 
            startIcon={<SettingsIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(item.id);
            }}
          >
            Configurar
          </Button>
        )}
        {onDelete && (
          <Button 
            size="small" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  );
}; 