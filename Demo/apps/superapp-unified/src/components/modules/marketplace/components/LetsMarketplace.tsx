/**
 * 🏪 LETS Marketplace - Sistema de Intercambio Local
 * 
 * Marketplace basado en Ünits donde los usuarios pueden intercambiar
 * productos y servicios usando el sistema LETS (Local Exchange Trading System)
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Avatar,
  Rating,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as WalletIcon,
  SwapHoriz as ExchangeIcon,
  Handshake as HandshakeIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { 
  useLetsListings, 
  useUnitsWallet, 
  useCreateLetsListing,
  useFulfillLetsListing,
  useTrustScore,
  useUserLetsStats
} from '../../../../hooks/useLetsMarketplace';
import { useAuth } from '../../../../contexts/AuthContext';
import { LETS_CATEGORIES } from '../../../../types/lets';

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
      id={`lets-tabpanel-${index}`}
      aria-labelledby={`lets-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LetsMarketplace: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listingType, setListingType] = useState<'all' | 'offer' | 'request'>('all');
  const [maxUnitsValue, setMaxUnitsValue] = useState<number | ''>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Hooks para datos
  const { data: wallet } = useUnitsWallet(user?.id || '');
  const { data: userStats } = useUserLetsStats(user?.id || '');
  const { data: trustScore } = useTrustScore(user?.id || '');

  // Filtros para listings
  const filters = useMemo(() => ({
    ...(listingType !== 'all' && { type: listingType as 'offer' | 'request' }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(searchTerm && { search: searchTerm }),
    ...(maxUnitsValue && { maxUnitsValue: Number(maxUnitsValue) }),
    page: 1,
    limit: 20
  }), [listingType, selectedCategory, searchTerm, maxUnitsValue]);

  const { data: listingsData, isLoading: isLoadingListings } = useLetsListings(filters);
  const createListingMutation = useCreateLetsListing();
  const fulfillListingMutation = useFulfillLetsListing();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateListing = async (listingData: any) => {
    if (!user?.id) return;
    
    try {
      await createListingMutation.mutateAsync({
        ...listingData,
        userId: user.id
      });
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleFulfillListing = async (listingId: string) => {
    if (!user?.id) return;
    
    try {
      await fulfillListingMutation.mutateAsync({
        listingId,
        fulfillerId: user.id
      });
    } catch (error) {
      console.error('Error fulfilling listing:', error);
    }
  };

  // Componente para mostrar el wallet del usuario
  const WalletSummary = () => (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ color: 'white' }}>
          <WalletIcon sx={{ fontSize: 40 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mi Wallet LETS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {wallet?.balance || 0} Ünits
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Límite de crédito: {wallet?.creditLimit || 0} Ünits
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Confianza
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <StarIcon sx={{ color: '#ffd700' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {trustScore?.averageRating?.toFixed(1) || '0.0'}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              ({trustScore?.ratingCount || 0} valoraciones)
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          LETS Marketplace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema de Intercambio Local basado en Ünits - Economía Colaborativa CoomÜnity
        </Typography>
      </Box>

      {/* Información sobre LETS */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mb: 3 }}
      >
        <Typography variant="body2">
          <strong>¿Qué es LETS?</strong> Local Exchange Trading System - Un sistema donde el tiempo y las habilidades 
          tienen el mismo valor para todos. 1 hora = 1 Ünit, promoviendo la reciprocidad (Ayni) y el Bien Común.
        </Typography>
      </Alert>

      {/* Wallet del usuario */}
      <WalletSummary />

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar productos o servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ flex: 1 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={listingType}
                onChange={(e) => setListingType(e.target.value as any)}
                label="Tipo"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="offer">Ofertas</MenuItem>
                <MenuItem value="request">Solicitudes</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoría"
              >
                <MenuItem value="">Todas</MenuItem>
                {LETS_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateDialog(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Crear Listing
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Contenido principal */}
      {isLoadingListings ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Cargando listings del marketplace...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {listingsData?.listings?.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ExchangeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No hay listings disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sé el primero en crear un listing en el marketplace LETS
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateDialog(true)}
                >
                  Crear Primer Listing
                </Button>
              </Paper>
            </Grid>
          ) : (
            listingsData?.listings?.map((listing: any) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                      <Chip
                        label={listing.type === 'offer' ? 'OFERTA' : 'SOLICITUD'}
                        color={listing.type === 'offer' ? 'success' : 'primary'}
                        size="small"
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
                        {listing.unitsValue} Ünits
                      </Typography>
                    </Stack>

                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {listing.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {listing.description}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip label={listing.category} size="small" variant="outlined" />
                      {listing.estimatedHours && (
                        <Chip
                          icon={<ScheduleIcon />}
                          label={`${listing.estimatedHours}h`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {listing.location}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Divider />

                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleFulfillListing(listing.id)}
                      disabled={listing.userId === user?.id || listing.status !== 'active'}
                      sx={{
                        background: listing.type === 'offer' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        '&:hover': {
                          background: listing.type === 'offer'
                            ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        }
                      }}
                    >
                      {listing.type === 'offer' ? 'Comprar' : 'Ofrecer'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Dialog para crear listing */}
      <CreateListingDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateListing}
        isLoading={createListingMutation.isPending}
      />
    </Container>
  );
};

// Componente para el dialog de crear listing
const CreateListingDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ open, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'offer' as 'offer' | 'request',
    title: '',
    description: '',
    category: '',
    unitsValue: '',
    estimatedHours: '',
    location: '',
    tags: ''
  });

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      unitsValue: Number(formData.unitsValue),
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      availabilitySchedule: {}
    };
    onSubmit(submitData);
  };

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Crear Nuevo Listing LETS
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Listing</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label="Tipo de Listing"
            >
              <MenuItem value="offer">Oferta - Tengo algo para ofrecer</MenuItem>
              <MenuItem value="request">Solicitud - Necesito algo</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Título"
            value={formData.title}
            onChange={handleChange('title')}
            placeholder="Ej: Clases de guitarra, Reparación de bicicletas..."
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            value={formData.description}
            onChange={handleChange('description')}
            placeholder="Describe detalladamente lo que ofreces o necesitas..."
          />

          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category}
              onChange={handleChange('category')}
              label="Categoría"
            >
              {LETS_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={2}>
            <TextField
              type="number"
              label="Valor en Ünits"
              value={formData.unitsValue}
              onChange={handleChange('unitsValue')}
              placeholder="Ej: 25"
              sx={{ flex: 1 }}
            />
            <TextField
              type="number"
              label="Horas estimadas (opcional)"
              value={formData.estimatedHours}
              onChange={handleChange('estimatedHours')}
              placeholder="Ej: 2"
              sx={{ flex: 1 }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Ubicación"
            value={formData.location}
            onChange={handleChange('location')}
            placeholder="Ej: Centro de la ciudad, Online..."
          />

          <TextField
            fullWidth
            label="Tags (separados por comas)"
            value={formData.tags}
            onChange={handleChange('tags')}
            placeholder="Ej: música, principiantes, online"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !formData.title || !formData.description || !formData.unitsValue}
        >
          {isLoading ? 'Creando...' : 'Crear Listing'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LetsMarketplace; 