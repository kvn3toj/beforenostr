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
  Badge,
  Stack,
  CardContent,
  CardActions
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
  useDeleteLetsListing
} from '../../../../hooks/useLetsIntegration';
import { useAuth } from '../../../../contexts/AuthContext';
import { LETS_CATEGORIES, LetsSearchFilters, CreateLetsListingDto } from '../../../../types/lets';

export const LetsListings: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<LetsSearchFilters>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rawListings = [], isLoading, refetch } = useLetsListings(filters);
  const createMutation = useCreateLetsListing();

  // 🛡️ VALIDACIÓN ROBUSTA: Asegurar que listings sea siempre un array válido
  const listings = useMemo(() => {
    // Si rawListings es null, undefined, o no es un array, devolver array vacío
    if (!rawListings || !Array.isArray(rawListings)) {
      console.warn('⚠️ [LetsListings] rawListings no es un array válido:', rawListings);
      return [];
    }
    return rawListings;
  }, [rawListings]);

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

  // 📊 ESTADÍSTICAS SEGURAS: Con validaciones adicionales
  const stats = useMemo(() => {
    // Asegurar que listings es un array antes de hacer operaciones
    const validListings = Array.isArray(listings) ? listings : [];

    return {
      offers: validListings.filter(l => l?.type === 'offer').length,
      requests: validListings.filter(l => l?.type === 'request').length,
      total: validListings.length,
      categories: new Set(validListings.map(l => l?.category).filter(Boolean)).size
    };
  }, [listings]);

  if (isLoading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
        <Typography sx={{ mt: 1 }}>Cargando intercambios LETS...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Box>
          <Typography variant="h5" fontWeight="600">
            Intercambios LETS
          </Typography>
          <Typography color="text.secondary">
            Explora ofertas y demandas en la comunidad
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateModalOpen(true)}
        >
          Crear Publicación
        </Button>
      </Stack>

      {/* Filtros */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="offer">Ofertas</MenuItem>
                <MenuItem value="request">Demandas</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Categoría"
              >
                <MenuItem value="">Todas</MenuItem>
                {Object.values(LETS_CATEGORIES).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen de Estadísticas */}
      <Paper variant="outlined">
        <Grid container>
          <Grid item xs={6} md={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {stats.offers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ofertas Activas
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} sx={{ p: 2, textAlign: 'center', borderLeft: { xs: 0, md: 1 }, borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold">
              {stats.requests}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Demandas Activas
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} sx={{ p: 2, textAlign: 'center', borderTop: { xs: 1, md: 0 }, borderLeft: { xs: 0, md: 1 }, borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Intercambios
            </Typography>
          </Grid>
          <Grid item xs={6} md={3} sx={{ p: 2, textAlign: 'center', borderTop: { xs: 1, md: 0 }, borderLeft: { xs: 1, md: 1 }, borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight="bold">
              {stats.categories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categorías Activas
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Listados */}
      <Grid container spacing={2}>
        {listings.map((listing) => (
          <Grid item key={listing.id} xs={12} sm={6} md={4} lg={3}>
            <LetsListingCard listing={listing} onInteract={() => {}} currentUserId={user?.id} />
          </Grid>
        ))}
      </Grid>

      {/* Modal de Creación (estilo base aplicado) */}
      <CreateLetsListingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          if (!user?.id) {
            console.error("No se puede crear la publicación sin ID de usuario");
            return;
          }
          await createMutation.mutateAsync({ ...data, userId: user.id });
          setCreateModalOpen(false);
        }}
        isLoading={createMutation.isPending}
      />
    </Stack>
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
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
        >
          <Box>
            <Chip
              label={isOffer ? 'Oferta' : 'Demanda'}
              color={isOffer ? 'success' : 'warning'}
              size="small"
              sx={{ mb: 1.5, fontWeight: 600 }}
            />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {listing.title}
            </Typography>
          </Box>
          <Tooltip title={listing.user.name || 'Usuario'}>
            <Avatar
              alt={listing.user.name || 'Usuario'}
              src={listing.user.avatarUrl || undefined}
            />
          </Tooltip>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {listing.description}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <LocalOffer fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Categoría: {listing.category}
          </Typography>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          size="small"
          onClick={onInteract}
          startIcon={<Handshake />}
        >
          Ver Intercambio
        </Button>
      </CardActions>
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
