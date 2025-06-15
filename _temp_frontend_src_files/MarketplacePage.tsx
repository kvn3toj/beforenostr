import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { 
  Store, 
  ShoppingCart, 
  AttachMoney, 
  Inventory,
  AddShoppingCart 
} from '@mui/icons-material';
import { apiService } from '../services/api.service';

interface MarketplaceStats {
  totalItems: number;
  totalSellers: number;
  averageItemsPerSeller: number;
  lastUpdated: string;
}

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  sellerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MarketplaceItemsResponse {
  items: MarketplaceItem[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const fetchMarketplaceStats = async (): Promise<MarketplaceStats> => {
  return apiService.get<MarketplaceStats>('/marketplace/stats');
};

const fetchMarketplaceItems = async (): Promise<MarketplaceItemsResponse> => {
  return apiService.get<MarketplaceItemsResponse>('/marketplace/items');
};

export const MarketplacePage: React.FC = () => {
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: fetchMarketplaceStats,
  });

  const {
    data: itemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
  } = useQuery({
    queryKey: ['marketplace-items'],
    queryFn: fetchMarketplaceItems,
  });

  if (isLoadingStats || isLoadingItems) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (statsError || itemsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading marketplace data: {(statsError || itemsError) instanceof Error ? 
            (statsError || itemsError)?.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Marketplace
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Tienda virtual y intercambio de productos/servicios
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.totalItems || 0}
                  </Typography>
                </Box>
                <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Vendedores
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.totalSellers || 0}
                  </Typography>
                </Box>
                <Store sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Promedio por Vendedor
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {stats?.averageItemsPerSeller || 0}
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Items Disponibles
                  </Typography>
                  <Typography variant="h4" component="h2">
                    {itemsResponse?.total || 0}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Items Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Items del Marketplace
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddShoppingCart />}
              size="small"
              disabled={true} // Disabled until implementation
            >
              Añadir Item
            </Button>
          </Box>
          
          {itemsResponse && itemsResponse.items.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Vendedor</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsResponse.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.type} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          ${item.price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status} 
                          color={item.status === 'ACTIVE' ? 'success' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {item.sellerId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay items registrados en el marketplace.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* API Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sistema de Marketplace
          </Typography>
          
          {stats && stats.totalItems > 0 ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Marketplace activo con {stats.totalItems} items de {stats.totalSellers} vendedores.
              Última actualización: {new Date(stats.lastUpdated).toLocaleString()}
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              El marketplace está disponible pero aún no tiene items registrados.
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Endpoints disponibles para gestión del marketplace:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Gestión de Items:
              </Typography>
              <Box component="ul" sx={{ fontSize: '0.875rem', color: 'text.secondary', pl: 2 }}>
                <li>POST /marketplace/items - Crear nuevo item</li>
                <li>GET /marketplace/items - Listar todos los items</li>
                <li>GET /marketplace/items/:id - Obtener item específico</li>
                <li>PUT /marketplace/items/:id - Actualizar item</li>
                <li>DELETE /marketplace/items/:id - Eliminar item</li>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                Búsqueda y Estadísticas:
              </Typography>
              <Box component="ul" sx={{ fontSize: '0.875rem', color: 'text.secondary', pl: 2 }}>
                <li>GET /marketplace/items/search - Buscar items</li>
                <li>GET /marketplace/sellers/:id/items - Items por vendedor</li>
                <li>GET /marketplace/stats - Estadísticas generales</li>
              </Box>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Funcionalidades del Marketplace:</strong>
            </Typography>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>Gestión completa de items (crear, leer, actualizar, eliminar)</li>
              <li>Sistema de búsqueda avanzada con filtros</li>
              <li>Gestión de vendedores y sus productos</li>
              <li>Estadísticas y métricas del marketplace</li>
              <li>Soporte para diferentes tipos de productos/servicios</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
}; 