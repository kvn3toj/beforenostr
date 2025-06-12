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
  ayniBalance: number;
  lastInteraction: string;
  isOnline: boolean;
  connectionType: 'collaborator' | 'mentor' | 'mentee' | 'peer';
  sharedInterests: string[];
  mutualConnections: number;
  recentActivity: string;
}

interface UserStats {
  ayniBalance: number;
  socialLevel: string;
  connectionsCount: number;
  collaborationsCount: number;
  trustScore: number;
}

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
    ayniBalance: 0.95,
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
    ayniBalance: 0.82,
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
    ayniBalance: 0.88,
    lastInteraction: '3h',
    isOnline: true,
    connectionType: 'peer',
    sharedInterests: ['emprendimiento', 'educación'],
    mutualConnections: 15,
    recentActivity: 'Celebró logros del círculo',
  },
];

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

  const getAyniBalanceColor = (balance: number) => {
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
              label={`${Math.round(connection.ayniBalance * 100)}%`}
              size="small"
              color={getAyniBalanceColor(connection.ayniBalance)}
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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState<string>('all');

  // Usar conexiones mock si no hay datos del backend
  const connections = backendConnections.length > 0 ? [] : mockConnections; // Placeholder para mapear datos reales

  const handleMenuClick = (event: React.MouseEvent, connectionId: string) => {
    setMenuAnchor(event.currentTarget as HTMLElement);
    setSelectedConnection(connectionId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedConnection(null);
  };

  const handleChatClick = (connectionId: string) => {
    console.log(`💬 Abrir chat con conexión: ${connectionId}`);
  };

  const filteredConnections = connections.filter((connection) => {
    if (filter === 'all') return true;
    return connection.connectionType === filter;
  });

  if (isError) {
    return (
      <Card>
        <CardContent>
          <Alert
            severity="error"
            action={
              <Button size="small" onClick={onRefresh} startIcon={<Refresh />}>
                Reintentar
              </Button>
            }
          >
            Error cargando conexiones
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {/* 📊 Resumen de conexiones */}
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            '#2196F3',
            0.1
          )} 0%, ${alpha('#E91E63', 0.05)} 100%)`,
          border: `1px solid ${alpha('#2196F3', 0.2)}`,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            🤝 Mis Conexiones Ayni
          </Typography>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {userStats.connectionsCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Conexiones
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {Math.round(userStats.ayniBalance * 100)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Balance Ayni
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="warning.main">
                  {userStats.trustScore}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Confianza
                </Typography>
              </Box>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={userStats.ayniBalance * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha('#2196F3', 0.1),
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#2196F3',
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Tu red social está creciendo de manera equilibrada
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* 🎛️ Controles y filtros */}
      <Card>
        <CardContent sx={{ pb: '16px !important' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight="bold">
              Red de Colaboración
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
                <Refresh />
              </IconButton>
              <Button startIcon={<PersonAdd />} size="small" variant="outlined">
                Conectar
              </Button>
            </Stack>
          </Stack>

          {/* Filtros por tipo de conexión */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label="Todas"
              color={filter === 'all' ? 'primary' : 'default'}
              onClick={() => setFilter('all')}
              size="small"
            />
            <Chip
              label="Mentores"
              color={filter === 'mentor' ? 'secondary' : 'default'}
              onClick={() => setFilter('mentor')}
              size="small"
            />
            <Chip
              label="Colaboradores"
              color={filter === 'collaborator' ? 'primary' : 'default'}
              onClick={() => setFilter('collaborator')}
              size="small"
            />
            <Chip
              label="Pares"
              color={filter === 'peer' ? 'success' : 'default'}
              onClick={() => setFilter('peer')}
              size="small"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 📋 Lista de conexiones */}
      <Card>
        <CardContent>
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Cargando conexiones...
              </Typography>
            </Box>
          ) : filteredConnections.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Group sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {filter === 'all'
                  ? 'No tienes conexiones aún'
                  : `No tienes ${filter}s en tu red`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comienza a construir tu red de colaboración CoomÜnity
              </Typography>
              <Button
                startIcon={<PersonAdd />}
                variant="contained"
                sx={{ mt: 2, bgcolor: '#2196F3' }}
              >
                Buscar Conexiones
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filteredConnections.length}{' '}
                {filter === 'all' ? 'conexiones' : `${filter}s`} en tu red
              </Typography>
              {filteredConnections.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onChatClick={handleChatClick}
                  onMenuClick={handleMenuClick}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 🎯 Sugerencias de conexión */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            💡 Conexiones Sugeridas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Basadas en tus intereses y colaboraciones
          </Typography>
          <Stack spacing={1}>
            <Paper sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.05) }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: '#4CAF50' }}>M</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    María González
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Experta en economía circular • 3 conexiones mutuas
                  </Typography>
                </Box>
                <Button size="small" startIcon={<PersonAdd />}>
                  Conectar
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      {/* 📱 Menú contextual */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Psychology sx={{ mr: 1 }} />
          Ver perfil completo
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Handshake sx={{ mr: 1 }} />
          Proponer intercambio Ayni
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Favorite sx={{ mr: 1 }} />
          Recomendar a otros
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Desconectar
        </MenuItem>
      </Menu>
    </Stack>
  );
};
