/**
 * 🛒 MarketplaceManager Component - Gamifier Admin
 * 
 * Gestión completa del marketplace GMP (Gamified Match Place)
 * Permite aprobar/rechazar listings, gestión masiva de productos/servicios y monitoreo de transacciones
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Store as StoreIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  MonetizationOn as MoneyIcon,
} from '@mui/icons-material';

// Types
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'service';
  category: string;
  price: number;
  currency: 'lukas' | 'ondas' | 'usd';
  images: string[];
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    trustLevel: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'inactive';
  location?: string;
  tags: string[];
  analytics?: {
    views: number;
    favorites: number;
    messages: number;
    conversions: number;
  };
  createdAt: string;
  updatedAt: string;
  moderationNotes?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`marketplace-tabpanel-${index}`}
      aria-labelledby={`marketplace-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MarketplaceManager: React.FC = () => {
  // State
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dialog states
  const [isModerationDialogOpen, setIsModerationDialogOpen] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  // Mock data para desarrollo
  const mockItems: MarketplaceItem[] = [
    {
      id: '1',
      title: 'Clases de Filosofía Andina - Ayni y Reciprocidad',
      description: 'Sesiones personalizadas sobre filosofía andina, enfocadas en el concepto de Ayni y su aplicación en la vida moderna.',
      type: 'service',
      category: 'Educación',
      price: 150,
      currency: 'lukas',
      images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
      seller: {
        id: 'seller1',
        name: 'María Elena Quispe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        rating: 4.8,
        trustLevel: 95
      },
      status: 'pending',
      location: 'La Paz, Bolivia',
      tags: ['filosofía', 'ayni', 'educación', 'cultura andina'],
      analytics: {
        views: 245,
        favorites: 32,
        messages: 18,
        conversions: 5
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: '2',
      title: 'Quinoa Orgánica Premium - Cosecha 2024',
      description: 'Quinoa orgánica de alta calidad, cultivada en los Andes bolivianos siguiendo métodos tradicionales.',
      type: 'product',
      category: 'Alimentos',
      price: 25,
      currency: 'ondas',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      seller: {
        id: 'seller2',
        name: 'Carlos Mamani',
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4.9,
        trustLevel: 98
      },
      status: 'approved',
      location: 'Oruro, Bolivia',
      tags: ['quinoa', 'orgánico', 'alimentos', 'saludable'],
      analytics: {
        views: 512,
        favorites: 78,
        messages: 34,
        conversions: 12
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z'
    }
  ];

  // Effects
  useEffect(() => {
    loadItems();
  }, []);

  // Handlers
  const loadItems = async () => {
    setIsLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      await new Promise(resolve => setTimeout(resolve, 800));
      setItems(mockItems);
    } catch (err) {
      setError('Error cargando items del marketplace');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject', notes?: string) => {
    setIsLoading(true);
    try {
      // TODO: Llamada real al backend
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, status: action === 'approve' ? 'approved' : 'rejected', moderationNotes: notes }
          : item
      ));
      setIsModerationDialogOpen(false);
      setSelectedItem(null);
      setModerationNotes('');
    } catch (err) {
      setError(`Error ${action === 'approve' ? 'aprobando' : 'rechazando'} el item`);
    } finally {
      setIsLoading(false);
    }
  };

  const openModerationDialog = (item: MarketplaceItem, action: 'approve' | 'reject') => {
    setSelectedItem(item);
    setModerationAction(action);
    setModerationNotes(item.moderationNotes || '');
    setIsModerationDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'sold': return 'info';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'sold': return 'Vendido';
      case 'inactive': return 'Inactivo';
      default: return status;
    }
  };

  const filteredItems = statusFilter === 'all' 
    ? items 
    : items.filter(item => item.status === statusFilter);

  const pendingCount = items.filter(item => item.status === 'pending').length;

  // Render
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <StoreIcon fontSize="large" />
            MarketplaceManager - GMP
            {pendingCount > 0 && (
              <Badge badgeContent={pendingCount} color="warning" sx={{ ml: 1 }}>
                <WarningIcon color="warning" />
              </Badge>
            )}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestión completa del marketplace gamificado con moderación de contenido
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 'fit-content' }}
        >
          Crear Item
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Items
                {pendingCount > 0 && <Badge badgeContent={pendingCount} color="warning" />}
              </Box>
            } 
            icon={<ShoppingCartIcon />} 
          />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Moderación" icon={<WarningIcon />} />
        </Tabs>
      </Box>

      {/* Items Tab */}
      <TabPanel value={tabValue} index={0}>
        {/* Filter Controls */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendientes</MenuItem>
              <MenuItem value="approved">Aprobados</MenuItem>
              <MenuItem value="rejected">Rechazados</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            {filteredItems.length} items encontrados
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredItems.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.images[0]}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" noWrap sx={{ flexGrow: 1, mr: 1 }}>
                        {item.title}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={getStatusText(item.status)} 
                        color={getStatusColor(item.status) as any}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden' }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={item.seller.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.seller.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Confianza: {item.seller.trustLevel}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        size="small" 
                        label={`${item.price} ${item.currency.toUpperCase()}`} 
                        icon={<MoneyIcon />}
                        color="primary"
                      />
                      <Chip 
                        size="small" 
                        label={item.type === 'product' ? 'Producto' : 'Servicio'} 
                      />
                    </Box>

                    {item.analytics && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block">
                          👁️ {item.analytics.views} vistas • ❤️ {item.analytics.favorites} favoritos
                        </Typography>
                        <Typography variant="caption" display="block">
                          💬 {item.analytics.messages} mensajes • ✅ {item.analytics.conversions} conversiones
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Box>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="primary">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    {item.status === 'pending' && (
                      <Box>
                        <Tooltip title="Aprobar">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => openModerationDialog(item, 'approve')}
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => openModerationDialog(item, 'reject')}
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Items</Typography>
                <Typography variant="h4">{items.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">Pendientes</Typography>
                <Typography variant="h4">{pendingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">Aprobados</Typography>
                <Typography variant="h4">
                  {items.filter(item => item.status === 'approved').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Vistas</Typography>
                <Typography variant="h4">
                  {items.reduce((sum, item) => sum + (item.analytics?.views || 0), 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Moderación Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Items Pendientes de Moderación</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.filter(item => item.status === 'pending').map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.description.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={item.seller.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography variant="body2">{item.seller.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={item.type === 'product' ? 'Producto' : 'Servicio'} 
                    />
                  </TableCell>
                  <TableCell>
                    {item.price} {item.currency.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => openModerationDialog(item, 'approve')}
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openModerationDialog(item, 'reject')}
                    >
                      <ThumbDownIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Moderation Dialog */}
      <Dialog 
        open={isModerationDialogOpen} 
        onClose={() => setIsModerationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {moderationAction === 'approve' ? 'Aprobar Item' : 'Rechazar Item'}
        </DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedItem.description}
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label={moderationAction === 'approve' ? 'Comentarios (opcional)' : 'Razón del rechazo'}
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                sx={{ mt: 2 }}
                required={moderationAction === 'reject'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModerationDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => selectedItem && handleModerationAction(selectedItem.id, moderationAction!, moderationNotes)}
            variant="contained"
            color={moderationAction === 'approve' ? 'success' : 'error'}
            startIcon={moderationAction === 'approve' ? <ApproveIcon /> : <RejectIcon />}
          >
            {moderationAction === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketplaceManager; 