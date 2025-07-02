import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Box,
  Stack,
  Button,
  Alert,
  LinearProgress,
  Badge,
  alpha,
  useTheme,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  Chat,
  MoreVert,
  Star,
  Handshake,
  TrendingUp,
  Group,
  PersonAdd,
  Circle,
  Refresh,
  Search,
  FilterList,
  Psychology,
  Favorite,
} from '@mui/icons-material';

interface Connection {
  id: string;
  name: string;
  level: string;
  trustScore: number;
  reciprocidadBalance: number;
  lastInteraction: string;
  isOnline: boolean;
  connectionType: 'collaborator' | 'mentor' | 'mentee' | 'peer';
  sharedInterests: string[];
  mutualConnections: number;
  recentActivity: string;
}

import { UserStatsReciprocidad } from '@/types/reciprocidad.types';

// Usar el tipo consolidado - alias temporal para compatibilidad
type UserStats = UserStatsReciprocidad;

interface ConnectionsManagerProps {
  connections: any[]; // Datos del backend
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  userStats: UserStats;
}

// 🎭 Datos mock de conexiones
const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Ana María Rodríguez',
    level: 'Guardiana de Sabiduría',
    trustScore: 4.9,
    reciprocidadBalance: 0.95,
    lastInteraction: '2h',
    isOnline: true,
    connectionType: 'mentor',
    sharedInterests: ['agricultura', 'sostenibilidad'],
    mutualConnections: 12,
    recentActivity: 'Compartió conocimiento sobre huertos urbanos',
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    level: 'Tejedor de Redes',
    trustScore: 4.7,
    reciprocidadBalance: 0.82,
    lastInteraction: '1d',
    isOnline: false,
    connectionType: 'collaborator',
    sharedInterests: ['diseño', 'traducción'],
    mutualConnections: 8,
    recentActivity: 'Propuso intercambio de servicios',
  },
  {
    id: '3',
    name: 'Luz Elena Castro',
    level: 'Colaboradora Equilibrada',
    trustScore: 4.8,
    reciprocidadBalance: 0.88,
    lastInteraction: '3h',
    isOnline: true,
    connectionType: 'peer',
    sharedInterests: ['emprendimiento', 'educación'],
    mutualConnections: 15,
    recentActivity: 'Celebró logros del círculo',
  },
];

const UNIFIED_CARD_STYLE = {
  p: { xs: 2, md: 3 },
  borderRadius: 4,
  height: '100%',
  boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(0, 0, 0, 0.02)',
  backgroundColor: 'background.paper',
};

const ConnectionCard: React.FC<{
  connection: Connection;
  onChatClick: (connectionId: string) => void;
  onMenuClick: (event: React.MouseEvent, connectionId: string) => void;
}> = ({ connection, onChatClick, onMenuClick }) => {
  const theme = useTheme();

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'mentor':
        return '#9C27B0';
      case 'mentee':
        return '#FF9800';
      case 'collaborator':
        return '#2196F3';
      case 'peer':
        return '#4CAF50';
      default:
        return theme.palette.primary.main;
    }
  };

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case 'mentor':
        return 'Mentor';
      case 'mentee':
        return 'Aprendiz';
      case 'collaborator':
        return 'Colaborador';
      case 'peer':
        return 'Par';
      default:
        return 'Conexión';
    }
  };

  const getReciprocidadBalanceColor = (balance: number) => {
    if (balance >= 0.8) return 'success';
    if (balance >= 0.6) return 'warning';
    return 'error';
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 1,
        border: `1px solid ${alpha(
          getConnectionTypeColor(connection.connectionType),
          0.2
        )}`,
        bgcolor: alpha(getConnectionTypeColor(connection.connectionType), 0.02),
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          bgcolor: alpha(
            getConnectionTypeColor(connection.connectionType),
            0.05
          ),
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            sx={{
              bgcolor: getConnectionTypeColor(connection.connectionType),
              width: 48,
              height: 48,
            }}
          >
            {connection.name.charAt(0)}
          </Avatar>
          <Circle
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              fontSize: 12,
              color: connection.isOnline ? '#4CAF50' : '#757575',
              bgcolor: 'background.paper',
              borderRadius: '50%',
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {connection.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {connection.level} • {connection.lastInteraction}
              </Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <IconButton
                size="small"
                onClick={() => onChatClick(connection.id)}
                sx={{
                  bgcolor: alpha(
                    getConnectionTypeColor(connection.connectionType),
                    0.1
                  ),
                  '&:hover': {
                    bgcolor: alpha(
                      getConnectionTypeColor(connection.connectionType),
                      0.2
                    ),
                  },
                }}
              >
                <Chat fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => onMenuClick(e, connection.id)}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
            <Chip
              label={getConnectionTypeLabel(connection.connectionType)}
              size="small"
              sx={{
                bgcolor: alpha(
                  getConnectionTypeColor(connection.connectionType),
                  0.1
                ),
                color: getConnectionTypeColor(connection.connectionType),
                fontWeight: 'bold',
              }}
            />
            <Chip
              icon={<Star sx={{ fontSize: 14 }} />}
              label={connection.trustScore}
              size="small"
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<Handshake sx={{ fontSize: 14 }} />}
              label={`${Math.round(connection.reciprocidadBalance * 100)}%`}
              size="small"
              color={getReciprocidadBalanceColor(connection.reciprocidadBalance)}
              variant="outlined"
            />
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {connection.recentActivity}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
            {connection.sharedInterests.slice(0, 2).map((interest, index) => (
              <Chip
                key={index}
                label={`#${interest}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {connection.sharedInterests.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{connection.sharedInterests.length - 2} más
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({
  connections: backendConnections,
  isLoading,
  isError,
  onRefresh,
  userStats,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Usa los datos mock si los del backend están vacíos o cargando
  const connections = (!backendConnections || backendConnections.length === 0) && !isLoading ? mockConnections : backendConnections;

  const handleMenuClick = (event: React.MouseEvent, connectionId: string) => {
    setAnchorEl(event.currentTarget as HTMLElement);
    setSelectedConnection(connectionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedConnection(null);
  };

  const handleChatClick = (connectionId: string) => {
    console.log(`Iniciar chat con ${connectionId}`);
  };

  if (isError) {
    return (
      <Alert severity="error" action={<Button onClick={onRefresh}>Reintentar</Button>}>
        No se pudieron cargar las conexiones.
      </Alert>
    );
  }

  return (
    <Paper sx={UNIFIED_CARD_STYLE}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Conexiones Conscientes ({connections.length})
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <FilterList />
          </IconButton>
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Stack>
      </Stack>

      {isLoading ? (
        <LinearProgress />
      ) : (
        <List sx={{ p: 0 }}>
          {connections.map((connection: Connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onChatClick={handleChatClick}
              onMenuClick={handleMenuClick}
            />
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Ver Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Enviar Méritos</MenuItem>
        <MenuItem onClick={handleMenuClose}>Eliminar Conexión</MenuItem>
      </Menu>
    </Paper>
  );
};
