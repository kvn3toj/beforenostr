import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  PlayArrow, 
  MovieCreation, 
  ShoppingCart, 
  Group, 
  Close,
  VideoLibrary,
  SportsEsports,
  EmojiEvents,
  Analytics
} from '@mui/icons-material';

export const PilgrimJourney: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  // Datos del análisis extraído
  const videoData = {
    title: "CoomÜnity Pilgrim Experience",
    vimeoId: "383005433",
    playerType: "Vimeo",
    hasCustomPlayer: true,
    totalButtons: 4,
    overlayCount: 2
  };

  const floatingButtons = [
    {
      id: 'cinema',
      name: 'Cinema',
      icon: <MovieCreation />,
      color: '#e57373' as const,
      description: 'Experiencias audiovisuales inmersivas'
    },
    {
      id: 'plaza',
      name: 'Plaza',
      icon: <ShoppingCart />,
      color: '#4fc3f7' as const,
      description: 'Intercambio y marketplace'
    },
    {
      id: 'aldea',
      name: 'Aldea',
      icon: <Group />,
      color: '#81c784' as const,
      description: 'Comunidad y conexiones'
    }
  ];

  const interactiveFeatures = [
    { icon: <VideoLibrary />, text: 'Reproductor Vimeo integrado', count: '1' },
    { icon: <SportsEsports />, text: 'Botones flotantes hexagonales', count: '4' },
    { icon: <EmojiEvents />, text: 'Overlays interactivos', count: '2' },
    { icon: <Analytics />, text: 'Elementos interactivos', count: '5' }
  ];

  const handleFloatingButtonClick = (buttonId: string) => {
    setActiveOverlay(buttonId);
    setFloatingMenuOpen(false);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🎮 Pilgrim Journey
        </Typography>
        <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
          Experiencia gamificada de desarrollo personal
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
          <Chip label={`Reproductor ${videoData.playerType}`} color="primary" size="small" />
          <Chip label={`${videoData.totalButtons} Botones Flotantes`} color="secondary" size="small" />
          <Chip label="Experiencia Interactiva" color="success" size="small" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Video Player Principal */}
        <Grid size={{xs:12,md:8}}>
          <Card elevation={3} sx={{ position: 'relative', borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9 aspect ratio
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '12px 12px 0 0',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {/* Placeholder del reproductor Vimeo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <PlayArrow sx={{ fontSize: 80, mb: 2, opacity: 0.8 }} />
                    <Typography variant="h5" component="h3" gutterBottom>
                      {videoData.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Video ID: {videoData.vimeoId}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.6 }}>
                      Reproductor personalizado CoomÜnity
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              {/* Información del video */}
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" component="h4" gutterBottom>
                  Experiencia Pilgrim Interactiva
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reproductor con {videoData.totalButtons} botones flotantes hexagonales para navegación inmersiva 
                  entre Cinema, Plaza y Aldea. Incluye {videoData.overlayCount} overlays interactivos para 
                  una experiencia gamificada completa.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de Características */}
        <Grid size={{xs:12,md:4}}>
          <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom color="primary">
                🔍 Análisis del Reproductor
              </Typography>
              <List dense>
                {interactiveFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.text}
                      secondary={`Cantidad: ${feature.count}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Navegación Flotante Simulada */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom color="primary">
                🎯 Navegación Flotante
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Botones hexagonales flotantes para navegación inmersiva:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {floatingButtons.map((button) => (
                  <Paper 
                    key={button.id}
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-2px)',
                        bgcolor: `${button.color}15`
                      }
                    }}
                    onClick={() => handleFloatingButtonClick(button.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        color: button.color,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {button.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {button.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {button.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón Flotante Principal (simulado) */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
            transform: 'scale(1.1) rotate(45deg)'
          },
          transition: 'all 0.3s ease',
          transform: floatingMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)'
        }}
        onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
      >
        <SportsEsports />
      </Fab>

      {/* Mini botones flotantes (cuando el menú está abierto) */}
      {floatingMenuOpen && (
        <>
          {floatingButtons.map((button, index) => (
            <Fab
              key={button.id}
              size="small"
              sx={{
                position: 'fixed',
                bottom: 90 + (index * 60),
                right: 30,
                bgcolor: button.color,
                color: 'white',
                '&:hover': {
                  bgcolor: button.color,
                  transform: 'scale(1.2)'
                },
                transition: 'all 0.3s ease',
                animation: `slideIn 0.3s ease ${index * 0.1}s both`
              }}
              onClick={() => handleFloatingButtonClick(button.id)}
            >
              {button.icon}
            </Fab>
          ))}
        </>
      )}

      {/* Overlays de las secciones */}
      {floatingButtons.map((button) => (
        <Dialog
          key={button.id}
          open={activeOverlay === button.id}
          onClose={closeOverlay}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: `${button.color}15`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {button.icon}
              <Typography variant="h6" component="h3">
                Sección {button.name}
              </Typography>
            </Box>
            <IconButton onClick={closeOverlay}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom color={button.color}>
                🎭 {button.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {button.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta sección representa el overlay interactivo que se activaría 
                con los botones flotantes hexagonales del reproductor original.
                Incluye iframe embedido para una experiencia completa.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Chip 
                  label="Overlay Interactivo" 
                  sx={{ bgcolor: `${button.color}25`, color: button.color }}
                />
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      ))}

      {/* Estilos CSS adicionales */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </Container>
  );
}; 