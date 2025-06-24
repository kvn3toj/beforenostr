import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Button,
  IconButton,
  Rating,
  Skeleton,
  Tooltip,
  Badge,
  Fade,
  Stack,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Star,
  Verified,
  FavoriteBorder,
  Favorite,
  Share,
  MoreVert,
  PlayArrow,
  CheckCircle,
  TrendingUp,
  Build,
  AutoAwesome,
  Chat,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { Product } from '../../../types/marketplace';
import { formatPrice, safeToLocaleString } from '../../../utils/numberUtils';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../lib/api-service';

interface Service extends Omit<Product, 'type'> {
  type: 'service';
  duration?: string;
  responseTime?: string;
  deliveryMethod?: 'online' | 'presencial' | 'hibrido';
  skills: string[];
  experience: string;
  availability: 'inmediata' | 'programada' | 'flexible';
}

interface ServicesListProps {
  services: Service[];
  isLoading?: boolean;
  onServiceClick?: (service: Service) => void;
  onToggleFavorite?: (serviceId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services = [],
  isLoading = false,
  onServiceClick,
  onToggleFavorite,
  viewMode = 'grid',
}) => {
  const { user } = useAuth();
  const [favoriteServices, setFavoriteServices] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleToggleFavorite = (serviceId: string) => {
    setFavoriteServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
    onToggleFavorite?.(serviceId);
  };

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      // Priorizar servicios trending y verificados
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      if (a.seller.verified && !b.seller.verified) return -1;
      if (!a.seller.verified && b.seller.verified) return 1;
      return b.rating - a.rating; // Por rating descendente
    });
  }, [services]);

  // 🛠️ MIRA + ☮️ PAX: Chat Consciente entre Emprendedores
  const useProviderChat = () => {
    const navigate = useNavigate();

    const openChatWithProvider = useCallback(async (providerId: string, providerName: string) => {
      try {
        // 🎯 ATLAS: Crear o obtener conversación existente con el proveedor
        const response = await apiService.post('/social/conversations', {
          participantId: providerId,
          type: 'marketplace_inquiry',
          context: {
            source: 'services_list',
            providerName,
            timestamp: new Date().toISOString(),
          }
        });

                 const conversationId = (response as any).data?.conversationId || (response as any).data?.id;

        if (conversationId) {
          // 🌙 LUNA: Navegar al chat con contexto consciente
          navigate(`/social/chat/${conversationId}`, {
            state: {
              providerName,
              chatType: 'marketplace_inquiry',
              welcomeMessage: `¡Hola! Me interesa conocer más sobre tus servicios. ¿Podrías contarme más sobre cómo trabajas desde la filosofía del Bien Común?`
            }
          });
        } else {
          throw new Error('No se pudo crear la conversación');
        }
      } catch (error) {
        console.error('Error al abrir chat con proveedor:', error);

        // 🔮 PAX: Fallback consciente - usar sistema de mensajería simple
        const fallbackChatUrl = `/social/new-message?to=${providerId}&context=marketplace&provider=${encodeURIComponent(providerName)}`;
        navigate(fallbackChatUrl);
      }
    }, [navigate]);

    return { openChatWithProvider };
  };

  const { openChatWithProvider } = useProviderChat();

  const handleContactProvider = (providerId: string, providerName: string) => {
    openChatWithProvider(providerId, providerName);
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={28} />
                <Skeleton variant="text" height={20} width="80%" />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (services.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Build sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No hay servicios disponibles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora diferentes categorías o ajusta tus filtros para encontrar servicios
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
      {sortedServices.map((service, index) => (
        <Grid item xs={12} sm={6} md={4} key={service.id}>
          <Fade in timeout={200 + index * 50}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                position: 'relative',
                overflow: 'visible',
              }}
              onClick={() => onServiceClick?.(service)}
            >
              {/* Badges */}
              <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                <Stack direction="row" spacing={1}>
                  {service.trending && (
                    <Chip
                      icon={<TrendingUp />}
                      label="Trending"
                      size="small"
                      color="error"
                      variant="filled"
                    />
                  )}
                  {service.featured && (
                    <Chip
                      icon={<AutoAwesome />}
                      label="Destacado"
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                  )}
                </Stack>
              </Box>

              {/* Actions */}
              <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                <Stack direction="row" spacing={1}>
                  <Tooltip title={favoriteServices.has(service.id) ? "Quitar de favoritos" : "Agregar a favoritos"}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(service.id);
                      }}
                      aria-label={favoriteServices.has(service.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        minWidth: 44,
                        minHeight: 44,
                        width: 44,
                        height: 44,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          bgcolor: 'rgba(255, 255, 255, 1)',
                          transform: 'scale(1.1)',
                        },
                        '&:focus': {
                          outline: '2px solid #2196f3',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      {favoriteServices.has(service.id) ? (
                        <Favorite color="error" fontSize="small" />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Compartir servicio">
                    <IconButton
                      size="small"
                      aria-label="Compartir servicio"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        minWidth: 44,
                        minHeight: 44,
                        width: 44,
                        height: 44,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { 
                          bgcolor: 'rgba(255, 255, 255, 1)',
                          transform: 'scale(1.1)',
                        },
                        '&:focus': {
                          outline: '2px solid #2196f3',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <Share fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* Service Image */}
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                  background: service.image
                    ? `url(${service.image})`
                    : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {service.availability === 'inmediata' && (
                  <Chip
                    icon={<Schedule />}
                    label="Disponible ahora"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.9)',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Service Title */}
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                  }}
                >
                  {service.title}
                </Typography>

                {/* Service Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                  }}
                >
                  {service.description}
                </Typography>

                {/* Skills Tags */}
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                  {service.skills.slice(0, 3).map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                  ))}
                  {service.skills.length > 3 && (
                    <Chip
                      label={`+${service.skills.length - 3}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 24 }}
                    />
                  )}
                </Stack>

                {/* Seller Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={service.seller.avatar}
                    alt={service.seller.name}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {service.seller.name}
                      </Typography>
                      {service.seller.verified && (
                        <Verified color="primary" sx={{ fontSize: 16 }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={service.rating}
                        readOnly
                        size="small"
                        precision={0.1}
                        sx={{ fontSize: '1rem' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        ({service.reviewCount || 0})
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Service Meta */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOn color="action" sx={{ fontSize: 16 }} />
                    <Typography variant="caption" color="text.secondary">
                      {service.location}
                    </Typography>
                  </Box>
                  {service.responseTime && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime color="action" sx={{ fontSize: 16 }} />
                      <Typography variant="caption" color="text.secondary">
                        {service.responseTime}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Price and Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {service.currency === 'ü' ? `${service.price} Lükas` : `$${safeToLocaleString(service.price)}`}
                    </Typography>
                    {service.duration && (
                      <Typography variant="caption" color="text.secondary">
                        {service.duration}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Chat />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactProvider(service.seller.id, service.seller.name);
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Contactar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServicesList;
