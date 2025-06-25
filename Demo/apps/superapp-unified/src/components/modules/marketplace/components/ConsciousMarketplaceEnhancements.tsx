import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FavoriteRounded,
  ChatBubbleOutline,
  TrendingUp,
  EmojiNature,
  AutoAwesome,
  SelfImprovement,
  Psychology,
  Balance,
  WaterDrop,
  VolunteerActivism,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../../lib/api-service';

// 🎭 TIPOS CONSCIENTES DEFINIDOS POR LOS GUARDIANES
interface ConsciousMarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'Lükas' | 'COP' | 'USD';
  category: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
    ayniScore: number;
    consciousnessLevel: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  };
  tags: string[];
  ayniScore: number;
  consciousnessLevel: 'SEED' | 'GROWING' | 'FLOURISHING' | 'TRANSCENDENT';
  bienComunContribution: number;
  sustainabilityScore: number;
  reciprocityBalance: number;
  impactLevel: 'local' | 'regional' | 'global';
  isFavorited?: boolean;
}

interface ConsciousMarketplaceProps {
  items: ConsciousMarketplaceItem[];
  onItemClick?: (item: ConsciousMarketplaceItem) => void;
}

// 🌟 SISTEMA DE CONSCIENCIA VISUAL - GUARDIANES ZENO + ARIA
const getConsciousnessVisualization = (level: string) => {
  const configurations = {
    TRANSCENDENT: {
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      glow: '0 0 20px rgba(251, 191, 36, 0.3)',
      icon: <AutoAwesome sx={{ fontSize: 16 }} />,
      label: 'Trascendente',
      description: 'Consciencia elevada que transforma realidades'
    },
    FLOURISHING: {
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: '0 0 15px rgba(16, 185, 129, 0.2)',
      icon: <EmojiNature sx={{ fontSize: 16 }} />,
      label: 'Floreciente',
      description: 'Crecimiento consciente en plena expansión'
    },
    GROWING: {
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      glow: '0 0 10px rgba(59, 130, 246, 0.2)',
      icon: <SelfImprovement sx={{ fontSize: 16 }} />,
      label: 'Creciendo',
      description: 'Consciencia en desarrollo y aprendizaje'
    },
    SEED: {
      color: '#6b7280',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      glow: '0 0 5px rgba(107, 114, 128, 0.1)',
      icon: <Psychology sx={{ fontSize: 16 }} />,
      label: 'Semilla',
      description: 'Potencial consciente germinando'
    }
  };

  return configurations[level as keyof typeof configurations] || configurations.SEED;
};

// 🛠️ MIRA + ☮️ PAX: Sistema de Chat Consciente
const useConsciousChat = () => {
  const navigate = useNavigate();

  const initiateConsciousConversation = useCallback(async (
    sellerId: string,
    sellerName: string,
    itemTitle: string
  ) => {
    try {
      // 🎯 ATLAS: Crear conversación con contexto consciente
      const response = await apiService.post('/social/conversations', {
        participantId: sellerId,
        type: 'marketplace_conscious_inquiry',
        context: {
          source: 'conscious_marketplace',
          itemTitle,
          sellerName,
          welcomeMessage: `¡Hola ${sellerName}! Me interesa "${itemTitle}". Me encantaría conocer más sobre cómo tu trabajo contribuye al Bien Común y cómo podemos crear un intercambio que honre el principio del Ayni. 🌱`,
          timestamp: new Date().toISOString(),
        }
      });

      const conversationId = (response as any).data?.conversationId || (response as any).data?.id;

      if (conversationId) {
        // 🌙 LUNA: Navegar con contexto de consciencia
        navigate(`/social/chat/${conversationId}`, {
          state: {
            chatType: 'conscious_marketplace',
            sellerName,
            itemTitle,
            philosophy: 'ayni'
          }
        });
      }
    } catch (error) {
      console.error('Error al iniciar conversación consciente:', error);
      // 🔮 PAX: Fallback armónico
      navigate(`/social/new-message?to=${sellerId}&context=conscious_marketplace&item=${encodeURIComponent(itemTitle)}`);
    }
  }, [navigate]);

  return { initiateConsciousConversation };
};

// 🎨 ARIA + 🔥 PHOENIX: Sistema de Favoritos Consciente
const useConsciousFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, action }: { itemId: string; action: 'add' | 'remove' }) => {
      const response = await apiService.post(`/marketplace/items/${itemId}/favorite`, {
        action,
        context: 'conscious_choice'
      });
      return (response as any).data;
    },
    onSuccess: (data: any, variables: { itemId: string; action: 'add' | 'remove' }) => {
      // 🔍 NIRA: Invalidar queries para actualizaciones en tiempo real
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'conscious-data'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'conscious-favorites'] });
    },
    onError: (error: any) => {
      console.error('Error en favoritos conscientes:', error);
    }
  });
};

// 🌌 COSMOS: Componente Principal del Marketplace Consciente
const ConsciousMarketplaceCard: React.FC<{
  item: ConsciousMarketplaceItem;
  onItemClick?: (item: ConsciousMarketplaceItem) => void;
}> = ({ item, onItemClick }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const { initiateConsciousConversation } = useConsciousChat();
  const { mutate: toggleFavorite } = useConsciousFavorites();

  const consciousness = getConsciousnessVisualization(item.consciousnessLevel);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({
      itemId: item.id,
      action: item.isFavorited ? 'remove' : 'add'
    });
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    initiateConsciousConversation(item.seller.id, item.seller.name, item.title);
  };

  const formatConsciousPrice = (price: number, currency: string) => {
    switch (currency) {
      case 'Lükas':
        return `ü ${price.toLocaleString()}`;
      case 'COP':
        return `$${price.toLocaleString()} COP`;
      case 'USD':
        return `$${price.toLocaleString()} USD`;
      default:
        return `ü ${price.toLocaleString()}`;
    }
  };

  return (
    <Card
      onClick={() => onItemClick?.(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 3,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(consciousness.color, 0.02)} 0%, transparent 100%)`,
        border: `1px solid ${alpha(consciousness.color, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 40px ${alpha(consciousness.color, 0.15)}, ${consciousness.glow}`,
          border: `1px solid ${alpha(consciousness.color, 0.3)}`,
        },
      }}
    >
      {/* 🌟 Header de Consciencia */}
      <Box sx={{ position: 'relative', height: 200 }}>
        <Box
          component="img"
          src={item.images[0] || '/images/servicio-domicilio.png'}
          alt={item.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/servicio-domicilio.png';
          }}
        />

        {/* Overlay de Consciencia */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, transparent 0%, ${alpha(consciousness.color, 0.1)} 100%)`,
          }}
        />

        {/* Badge de Nivel de Consciencia */}
        <Chip
          icon={consciousness.icon}
          label={consciousness.label}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: consciousness.gradient,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            boxShadow: consciousness.glow,
          }}
        />

        {/* Botón de Favorito */}
        <IconButton
          onClick={handleFavoriteToggle}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
              transform: 'scale(1.1)',
            },
          }}
        >
          <FavoriteRounded
            sx={{
              color: item.isFavorited ? '#e91e63' : alpha(theme.palette.text.secondary, 0.6),
              transition: 'color 0.2s ease',
            }}
          />
        </IconButton>
      </Box>

      {/* 💫 Contenido Consciente */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
          {item.description}
        </Typography>

        {/* 🏷️ Tags Conscientes */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {item.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                backgroundColor: alpha(consciousness.color, 0.1),
                color: consciousness.color,
                fontWeight: 500,
              }}
            />
          ))}
        </Box>

        {/* 📊 Métricas de Consciencia */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Balance sx={{ fontSize: 16, color: consciousness.color }} />
            <Typography variant="caption" color="text.secondary">
              Ayni Score
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: consciousness.color }}>
              {item.ayniScore}/100
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={item.ayniScore}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(consciousness.color, 0.1),
              '& .MuiLinearProgress-bar': {
                background: consciousness.gradient,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* 👤 Información del Vendedor Consciente */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar src={item.seller.avatar} sx={{ width: 32, height: 32 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {item.seller.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={item.seller.rating} size="small" readOnly precision={0.1} />
              <Typography variant="caption" color="text.secondary">
                ({item.seller.reviewCount})
              </Typography>
            </Box>
          </Box>
          <WaterDrop sx={{ fontSize: 16, color: consciousness.color }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: consciousness.color }}>
            {item.seller.ayniScore}
          </Typography>
        </Box>

        {/* 💰 Precio y Acciones */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: consciousness.color }}>
            {formatConsciousPrice(item.price, item.currency)}
          </Typography>

          <Button
            onClick={handleChatClick}
            startIcon={<ChatBubbleOutline />}
            variant="outlined"
            size="small"
            sx={{
              borderColor: consciousness.color,
              color: consciousness.color,
              '&:hover': {
                backgroundColor: alpha(consciousness.color, 0.1),
                borderColor: consciousness.color,
              },
            }}
          >
            Chat Consciente
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// 🎭 COMPONENTE PRINCIPAL ORQUESTADO POR TODOS LOS GUARDIANES
const ConsciousMarketplaceEnhancements: React.FC<ConsciousMarketplaceProps> = ({
  items,
  onItemClick
}) => {
  const theme = useTheme();

  // 🔍 NIRA: Análisis de métricas conscientes
  const consciousnessMetrics = useMemo(() => {
    const totalItems = items.length;
    const avgAyniScore = items.reduce((sum, item) => sum + item.ayniScore, 0) / totalItems;
    const avgSustainability = items.reduce((sum, item) => sum + item.sustainabilityScore, 0) / totalItems;
    const avgBienComun = items.reduce((sum, item) => sum + item.bienComunContribution, 0) / totalItems;

    return {
      totalItems,
      avgAyniScore: Math.round(avgAyniScore),
      avgSustainability: Math.round(avgSustainability),
      avgBienComun: Math.round(avgBienComun),
    };
  }, [items]);

  return (
    <Box>
      {/* 📊 Dashboard de Métricas Conscientes */}
      <Card sx={{ mb: 3, background: alpha(theme.palette.primary.main, 0.02) }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: theme.palette.primary.main }} />
            Métricas de Consciencia del Marketplace
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {consciousnessMetrics.avgAyniScore}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Promedio Ayni Score
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                {consciousnessMetrics.avgSustainability}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sostenibilidad Promedio
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {consciousnessMetrics.avgBienComun}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Contribución Bien Común
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 🎨 Grid de Productos Conscientes */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
        {items.map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item.id}>
            <Box>
              <ConsciousMarketplaceCard
                item={item}
                onItemClick={onItemClick}
              />
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};

export { ConsciousMarketplaceEnhancements };
export default useConsciousChat;
