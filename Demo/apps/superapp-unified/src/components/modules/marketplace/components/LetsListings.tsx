// 🔄 Componente de Listados LETS - Ofertas y Demandas
// Sistema de intercambio local basado en Ünits y reciprocidad

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tooltip,
  IconButton,
  Fab,
  Alert,
  Divider,
  CircularProgress,
  Paper,
  InputAdornment,
  Autocomplete,
  FormControlLabel,
  Switch,
  Badge
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  LocationOn,
  AccessTime,
  Star,
  TrendingUp,
  TrendingDown,
  Handshake,
  Category,
  Schedule,
  Person,
  Security,
  Info,
  Close,
  LocalOffer,
  RequestPage
} from '@mui/icons-material';
import {
  useLetsListings,
  useCreateLetsListing,
  useUpdateLetsListing,
  useDeleteLetsListing
} from '../../../../hooks/useLetsIntegration';
import { useAuth } from '../../../../contexts/AuthContext';
import { LETS_CATEGORIES, LetsSearchFilters, CreateLetsListingDto } from '../../../../types/lets';

export const LetsListings: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LetsSearchFilters>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: listings = [], isLoading, refetch } = useLetsListings(filters);
  const createMutation = useCreateLetsListing();

  const handleFilterChange = (key: keyof LetsSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Cargando intercambios LETS...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🔄 Intercambios LETS Locales
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Economía colaborativa basada en principios de Reciprocidad
          </Typography>
        </Box>
        
        <Fab
          color="primary"
          onClick={() => setCreateModalOpen(true)}
          sx={{
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252, #26C6DA)',
            }
          }}
        >
          <Add />
        </Fab>
      </Box>

      {/* Filtros */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2} display="flex" alignItems="center" gap={1}>
          <FilterList color="primary" />
          Filtros de Búsqueda
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por título, descripción o tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="offer">🤲 Ofertas</MenuItem>
                <MenuItem value="request">🙏 Demandas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {Object.entries(LETS_CATEGORIES).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Ubicación"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <Search />
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Limpiar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Estadísticas rápidas */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <TrendingUp color="success" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {listings?.filter(l => l.type === 'offer').length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ofertas Activas
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <TrendingDown color="warning" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {listings?.filter(l => l.type === 'request').length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Demandas Activas
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Handshake color="primary" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {listings?.length || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Intercambios
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Category color="info" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {new Set(listings?.map(l => l.category)).size || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Categorías Activas
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de intercambios */}
      <Grid container spacing={2}>
        {listings && listings.length > 0 ? (
          listings.map((listing) => (
            <Grid item xs={12} md={6} lg={4} key={listing.id}>
              <LetsListingCard
                listing={listing}
                onInteract={() => {
                  console.log('Interactuando con listing:', listing.id);
                }}
                currentUserId={user?.id}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                No se encontraron intercambios
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {Object.keys(filters).length > 0 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Sé el primero en crear un intercambio LETS'
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateModalOpen(true)}
              >
                Crear Intercambio
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Modal de creación */}
      <CreateLetsListingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          try {
            await createMutation.mutateAsync(data);
            setCreateModalOpen(false);
            refetch();
          } catch (error) {
            console.error('Error creando listado:', error);
          }
        }}
        isLoading={createMutation.isPending}
      />
    </Box>
  );
};

// Componente de tarjeta individual
interface LetsListingCardProps {
  listing: any;
  onInteract: () => void;
  currentUserId?: string;
}

const LetsListingCard: React.FC<LetsListingCardProps> = ({ 
  listing, 
  onInteract, 
  currentUserId 
}) => {
  const isOffer = listing.type === 'offer';
  const isOwner = listing.userId === currentUserId;
  const trustScore = listing.user?.trustScore || 0;

  return (
    <Card
      sx={{
        p: 2,
        height: '100%',
        border: `2px solid ${isOffer ? '#4CAF50' : '#FF9800'}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: isOffer ? '#2E7D32' : '#F57C00'
        },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Indicador de tipo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderLeft: '40px solid transparent',
          borderTop: `40px solid ${isOffer ? '#4CAF50' : '#FF9800'}`,
        }}
      />

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
        <Chip
          label={isOffer ? '🤲 OFREZCO' : '🙏 NECESITO'}
          size="small"
          sx={{
            bgcolor: isOffer ? '#E8F5E8' : '#FFF3E0',
            color: isOffer ? '#2E7D32' : '#F57C00',
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}
        />
        
        <Box display="flex" alignItems="center" gap={0.5}>
          <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {listing.location || 'Sin ubicación'}
          </Typography>
        </Box>
      </Box>

      {/* Título y descripción */}
      <Typography variant="h6" fontWeight="bold" mb={1} noWrap>
        {listing.title}
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        mb={2}
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {listing.description}
      </Typography>

      {/* Información del usuario */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Avatar
          src={listing.user?.avatar}
          sx={{ width: 24, height: 24 }}
        >
          {listing.user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="caption" color="text.secondary">
          {listing.user?.name || 'Usuario'}
        </Typography>
        <Tooltip title={`Confianza: ${(trustScore * 100).toFixed(0)}%`}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Security sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {(trustScore * 100).toFixed(0)}%
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Precio y tiempo */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {listing.unitsValue} Ünits
          </Typography>
          {listing.estimatedHours && (
            <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
              <AccessTime sx={{ fontSize: 12 }} />
              ≈ {listing.estimatedHours}h
            </Typography>
          )}
        </Box>
        <Chip
          label={listing.category}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      </Box>

      {/* Tags */}
      <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
        {listing.tags?.slice(0, 3).map((tag: string, index: number) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{ 
              fontSize: '0.7rem',
              height: 20,
              bgcolor: 'rgba(0,0,0,0.05)'
            }}
          />
        ))}
        {listing.tags?.length > 3 && (
          <Chip
            label={`+${listing.tags.length - 3}`}
            size="small"
            sx={{ 
              fontSize: '0.7rem',
              height: 20,
              bgcolor: 'rgba(0,0,0,0.1)'
            }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Botones de acción */}
      <Box display="flex" gap={1}>
        {!isOwner ? (
          <Button
            fullWidth
            variant="contained"
            onClick={onInteract}
            sx={{
              background: isOffer
                ? 'linear-gradient(45deg, #4CAF50, #81C784)'
                : 'linear-gradient(45deg, #FF9800, #FFB74D)',
              color: 'white',
              '&:hover': {
                background: isOffer
                  ? 'linear-gradient(45deg, #2E7D32, #66BB6A)'
                  : 'linear-gradient(45deg, #F57C00, #FFA726)',
              }
            }}
          >
            {isOffer ? 'Contactar Proveedor' : 'Ofrecer Ayuda'}
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ flex: 1 }}
            >
              Eliminar
            </Button>
          </>
        )}
      </Box>

      {/* Fecha de expiración */}
      <Typography variant="caption" color="text.secondary" mt={1} display="block">
        Expira: {new Date(listing.expiresAt).toLocaleDateString()}
      </Typography>
    </Card>
  );
};

// Modal de creación de listado
interface CreateLetsListingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLetsListingDto) => Promise<void>;
  isLoading: boolean;
}

const CreateLetsListingModal: React.FC<CreateLetsListingModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<CreateLetsListingDto>({
    type: 'offer',
    title: '',
    description: '',
    category: '',
    unitsValue: 0,
    estimatedHours: undefined,
    location: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || formData.unitsValue <= 0) {
      return;
    }

    await onSubmit(formData);
    
    // Reset form
    setFormData({
      type: 'offer',
      title: '',
      description: '',
      category: '',
      unitsValue: 0,
      estimatedHours: undefined,
      location: '',
      tags: []
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Add color="primary" />
          Crear Nuevo Intercambio LETS
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* Tipo */}
          <FormControl fullWidth>
            <InputLabel>Tipo de Intercambio</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'offer' | 'request' }))}
            >
              <MenuItem value="offer">🤲 Ofrezco (Tengo algo para compartir)</MenuItem>
              <MenuItem value="request">🙏 Necesito (Busco algo específico)</MenuItem>
            </Select>
          </FormControl>

          {/* Título */}
          <TextField
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            required
            helperText="Describe brevemente lo que ofreces o necesitas"
          />

          {/* Descripción */}
          <TextField
            label="Descripción Detallada"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
            required
            helperText="Proporciona detalles específicos, requisitos, condiciones, etc."
          />

          <Grid container spacing={2}>
            {/* Categoría */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {Object.entries(LETS_CATEGORIES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Valor en Ünits */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Valor en Ünits"
                type="number"
                value={formData.unitsValue}
                onChange={(e) => setFormData(prev => ({ ...prev, unitsValue: parseFloat(e.target.value) || 0 }))}
                fullWidth
                required
                inputProps={{ min: 0.01, step: 0.01 }}
                helperText="Precio justo basado en tiempo/esfuerzo"
              />
            </Grid>

            {/* Horas estimadas */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Horas Estimadas (opcional)"
                type="number"
                value={formData.estimatedHours || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseFloat(e.target.value) || undefined }))}
                fullWidth
                inputProps={{ min: 0.1, step: 0.1 }}
                helperText="Para servicios basados en tiempo"
              />
            </Grid>

            {/* Ubicación */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Ubicación (opcional)"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                fullWidth
                helperText="Ciudad, barrio o zona"
              />
            </Grid>
          </Grid>

          {/* Tags */}
          <Box>
            <TextField
              label="Agregar Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              fullWidth
              helperText="Palabras clave para facilitar la búsqueda"
              InputProps={{
                endAdornment: (
                  <Button onClick={addTag} size="small">
                    Agregar
                  </Button>
                )
              }}
            />
            
            {formData.tags.length > 0 && (
              <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Información sobre Ayni */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Principio Ayni:</strong> Los intercambios LETS se basan en reciprocidad justa. 
              El valor en Ünits debe reflejar el tiempo, esfuerzo y valor real del intercambio.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !formData.title || !formData.description || !formData.category || formData.unitsValue <= 0}
        >
          {isLoading ? 'Creando...' : 'Crear Intercambio'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 