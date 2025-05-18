import { Card, CardContent, Box, CardActionArea, Typography, Button, CardActions } from '@mui/material';
import { PlaylistItem } from '../../types/playlistItem.types';
import { Settings as SettingsIcon, Delete as DeleteIcon } from '@mui/icons-material';

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
            position: 'relative'
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
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