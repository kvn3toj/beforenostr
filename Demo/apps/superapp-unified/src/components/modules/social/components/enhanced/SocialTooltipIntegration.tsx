import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Badge,
  Paper,
  Stack,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  ChatBubbleOutline,
  Share,
  People,
  TrendingUp,
  Star,
  Balance,
  GroupWork,
} from '@mui/icons-material';

// Import SmartTooltip and Education Context
import { SmartTooltip } from '../../../../education/SmartTooltip';
import { useLetsEducation } from '../../../../../contexts/LetsEducationContext';

// ===== 🎯 EJEMPLO DE INTEGRACIÓN: POST CARD CON TOOLTIPS ===== //
interface SocialPostCardWithTooltipsProps {
  post: {
    author: {
      name: string;
      ayniScore: number;
      meritos: number;
      trustScore: number;
    };
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      ayniPoints: number;
    };
    metadata: {
      isBienComun: boolean;
    };
  };
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export const SocialPostCardWithTooltips: React.FC<SocialPostCardWithTooltipsProps> = ({
  post,
  onLike,
  onComment,
  onShare,
}) => {
  const theme = useTheme();
  const { state } = useLetsEducation();

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        {/* Author Section with Trust and Meritos Tooltips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6">{post.author.name}</Typography>

          {/* Mëritos with Tooltip */}
          <SmartTooltip
            concept="meritos"
            userLevel={state.userLevel}
            placement="top"
          >
            <Chip
              icon={<Star sx={{ color: '#4CAF50' }} />}
              label={`${post.author.meritos} Mëritos`}
              size="small"
              sx={{
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                color: '#4CAF50',
                cursor: 'help',
              }}
            />
          </SmartTooltip>

          {/* Trust Score with Tooltip */}
          <SmartTooltip
            concept="trust"
            userLevel={state.userLevel}
            placement="top"
          >
            <Chip
              icon={<Star sx={{ color: '#FF9800' }} />}
              label={`${post.author.trustScore}/5 Confianza`}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 152, 0, 0.1)',
                color: '#FF9800',
                cursor: 'help',
              }}
            />
          </SmartTooltip>

          {/* Ayni Balance with Tooltip */}
          <SmartTooltip
            concept="balance"
            userLevel={state.userLevel}
            placement="top"
          >
            <Chip
              icon={<Balance sx={{ color: '#9C27B0' }} />}
              label={`${post.author.ayniScore}% Balance`}
              size="small"
              sx={{
                bgcolor: 'rgba(156, 39, 176, 0.1)',
                color: '#9C27B0',
                cursor: 'help',
              }}
            />
          </SmartTooltip>
        </Box>

        {/* Bien Común Badge with Tooltip */}
        {post.metadata.isBienComun && (
          <Box sx={{ mb: 2 }}>
            <SmartTooltip
              concept="bien-comun"
              userLevel={state.userLevel}
              placement="right"
            >
              <Chip
                icon={<GroupWork />}
                label="Contribución al Bien Común"
                sx={{
                  bgcolor: 'rgba(33, 150, 243, 0.1)',
                  color: '#2196F3',
                  cursor: 'help',
                }}
              />
            </SmartTooltip>
          </Box>
        )}

        {/* Social Interaction Buttons with Tooltips */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {/* Like Button with Interactions Tooltip */}
          <SmartTooltip
            concept="interactions"
            userLevel={state.userLevel}
            placement="bottom"
          >
            <IconButton
              onClick={onLike}
              sx={{
                color: '#E91E63',
                bgcolor: 'rgba(233, 30, 99, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(233, 30, 99, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={post.engagement.likes} color="error">
                <Favorite />
              </Badge>
            </IconButton>
          </SmartTooltip>

          {/* Comment Button with Community Tooltip */}
          <SmartTooltip
            concept="community"
            userLevel={state.userLevel}
            placement="bottom"
          >
            <IconButton
              onClick={onComment}
              sx={{
                color: '#2196F3',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={post.engagement.comments} color="primary">
                <ChatBubbleOutline />
              </Badge>
            </IconButton>
          </SmartTooltip>

          {/* Share Button with Exchanges Tooltip */}
          <SmartTooltip
            concept="exchanges"
            userLevel={state.userLevel}
            placement="bottom"
          >
            <IconButton
              onClick={onShare}
              sx={{
                color: '#4CAF50',
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Badge badgeContent={post.engagement.shares} color="success">
                <Share />
              </Badge>
            </IconButton>
          </SmartTooltip>

          {/* Ayni Points with Ayni Tooltip */}
          <SmartTooltip
            concept="ayni"
            userLevel={state.userLevel}
            placement="bottom"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: 'rgba(233, 30, 99, 0.1)',
                borderRadius: 2,
                cursor: 'help',
              }}
            >
              <TrendingUp sx={{ color: '#E91E63', fontSize: 18 }} />
              <Typography variant="caption" sx={{ color: '#E91E63', fontWeight: 600 }}>
                {post.engagement.ayniPoints} Ayni
              </Typography>
            </Box>
          </SmartTooltip>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ===== 🎯 EJEMPLO DE INTEGRACIÓN: MÉTRICAS SOCIALES CON TOOLTIPS ===== //
interface SocialMetricsWithTooltipsProps {
  userStats: {
    dailyInteractions: number;
    ayniExchanges: number;
    communityTrust: number;
    activeCircles: number;
  };
}

export const SocialMetricsWithTooltips: React.FC<SocialMetricsWithTooltipsProps> = ({
  userStats,
}) => {
  const { state } = useLetsEducation();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        📊 Métricas Sociales Inteligentes
      </Typography>

      <Stack direction="row" spacing={3} flexWrap="wrap">
        {/* Daily Interactions with Smart Tooltip */}
        <SmartTooltip
          concept="interactions"
          userLevel={state.userLevel}
          placement="top"
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(96, 125, 139, 0.1)',
              cursor: 'help',
              '&:hover': {
                bgcolor: 'rgba(96, 125, 139, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography variant="h4" sx={{ color: '#607D8B', fontWeight: 'bold' }}>
              {userStats.dailyInteractions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Interacciones hoy
            </Typography>
          </Box>
        </SmartTooltip>

        {/* Ayni Exchanges with Smart Tooltip */}
        <SmartTooltip
          concept="exchanges"
          userLevel={state.userLevel}
          placement="top"
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              cursor: 'help',
              '&:hover': {
                bgcolor: 'rgba(233, 30, 99, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography variant="h4" sx={{ color: '#E91E63', fontWeight: 'bold' }}>
              {userStats.ayniExchanges}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Intercambios Ayni
            </Typography>
          </Box>
        </SmartTooltip>

        {/* Community Trust with Smart Tooltip */}
        <SmartTooltip
          concept="trust"
          userLevel={state.userLevel}
          placement="top"
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              cursor: 'help',
              '&:hover': {
                bgcolor: 'rgba(255, 152, 0, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
              {userStats.communityTrust}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Confianza Comunitaria
            </Typography>
          </Box>
        </SmartTooltip>

        {/* Active Circles with Smart Tooltip */}
        <SmartTooltip
          concept="community"
          userLevel={state.userLevel}
          placement="top"
        >
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              cursor: 'help',
              '&:hover': {
                bgcolor: 'rgba(33, 150, 243, 0.2)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
              {userStats.activeCircles}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Círculos Activos
            </Typography>
          </Box>
        </SmartTooltip>
      </Stack>
    </Paper>
  );
};

// ===== 🎯 EJEMPLO DE USO COMPLETO ===== //
export const SocialTooltipIntegrationDemo: React.FC = () => {
  const { state } = useLetsEducation();

  // Mock data para demostración
  const mockPost = {
    author: {
      name: "María González",
      ayniScore: 85,
      meritos: 127,
      trustScore: 4.7,
    },
    engagement: {
      likes: 23,
      comments: 8,
      shares: 5,
      ayniPoints: 15,
    },
    metadata: {
      isBienComun: true,
    },
  };

  const mockStats = {
    dailyInteractions: 89,
    ayniExchanges: 23,
    communityTrust: 85,
    activeCircles: 5,
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🧠 Demostración: Social Module + Smart Tooltips
      </Typography>

      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Nivel de usuario actual: <strong>{state.userLevel}</strong>
        (Los tooltips se adaptan automáticamente al nivel)
      </Typography>

      {/* Métricas Sociales con Tooltips */}
      <SocialMetricsWithTooltips userStats={mockStats} />

      {/* Post de ejemplo con Tooltips */}
      <SocialPostCardWithTooltips
        post={mockPost}
        onLike={() => console.log('Like clicked')}
        onComment={() => console.log('Comment clicked')}
        onShare={() => console.log('Share clicked')}
      />

      <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}>
        💡 Pasa el cursor sobre los elementos marcados para ver los tooltips contextuales
      </Typography>
    </Box>
  );
};
