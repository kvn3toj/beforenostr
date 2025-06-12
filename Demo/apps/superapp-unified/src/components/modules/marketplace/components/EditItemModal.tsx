import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Alert,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  LocalOffer,
  LocationOn,
  Category,
  Description,
  Title,
  AttachMoney,
} from '@mui/icons-material';
import { useUpdateMarketplaceItem } from '../../../../hooks/useRealBackendData';

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: {
    id: string;
    title: string;
    description: string;
    type: string;
    priceUnits: number;
    priceToins: number;
    currency: string;
    location: string;
    tags: string[];
  } | null;
}

const ITEM_TYPES = [
  { value: 'SERVICE', label: 'Servicio', color: '#2196F3' },
  { value: 'PRODUCT', label: 'Producto', color: '#FF9800' },
  { value: 'DIGITAL_CONTENT', label: 'Contenido Digital', color: '#9C27B0' },
  { value: 'EXPERIENCE', label: 'Experiencia', color: '#4CAF50' },
  { value: 'SKILL_EXCHANGE', label: 'Intercambio de Habilidades', color: '#FF5722' },
];

const CURRENCIES = [
  { value: 'LUKAS', label: 'Lükas (ü)', symbol: 'ü' },
  { value: 'USD', label: 'Dólares', symbol: '$' },
  { value: 'EUR', label: 'Euros', symbol: '€' },
];

const SUGGESTED_TAGS = [
  'ayni', 'colaborativo', 'sostenible', 'educación', 'tecnología',
  'salud', 'arte', 'música', 'deporte', 'cocina', 'idiomas',
  'programación', 'diseño', 'escritura', 'consultoría', 'coaching',
  'bienestar', 'mindfulness', 'agricultura', 'ecología',
];

const EditItemModal: React.FC<EditItemModalProps> = ({
  open,
  onClose,
  onSuccess,
  item,
}) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SERVICE',
    priceUnits: 0,
    priceToins: 0,
    currency: 'LUKAS',
    location: '',
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const updateItemMutation = useUpdateMarketplaceItem();

  // Initialize form with item data when modal opens
  useEffect(() => {
    if (item && open) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'SERVICE',
        priceUnits: item.priceUnits || 0,
        priceToins: item.priceToins || 0,
        currency: item.currency || 'LUKAS',
        location: item.location || '',
        tags: item.tags || [],
      });
      setError(null);
      setNewTag('');
    }
  }, [item, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null); // Clear error when user starts typing
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (formData.priceUnits < 0) {
      setError('El precio no puede ser negativo');
      return false;
    }
    if (!formData.location.trim()) {
      setError('La ubicación es requerida');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !item) return;

    try {
      setError(null);
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        priceUnits: Number(formData.priceUnits),
        priceToins: Number(formData.priceToins),
        currency: formData.currency,
        location: formData.location.trim(),
        tags: formData.tags,
      };

      await updateItemMutation.mutateAsync({
        itemId: item.id,
        updateData,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error actualizando item:', error);
      setError(
        error?.message || 'Error al actualizar el item. Inténtalo nuevamente.'
      );
    }
  };

  const handleClose = () => {
    if (updateItemMutation.isPending) return; // Prevent closing while submitting
    onClose();
  };

  if (!item) return null;

  const selectedType = ITEM_TYPES.find((type) => type.value === formData.type);
  const selectedCurrency = CURRENCIES.find((curr) => curr.value === formData.currency);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      data-testid="edit-item-modal"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
            Editar Item del Marketplace
          </Typography>
          <IconButton
            onClick={handleClose}
            disabled={updateItemMutation.isPending}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Título */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: Clases de programación en Python"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Title color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={updateItemMutation.isPending}
              required
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe tu servicio, producto o experiencia en detalle..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={updateItemMutation.isPending}
              required
            />
          </Grid>

          {/* Tipo y Ubicación */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.type}
                label="Tipo"
                onChange={(e) => handleInputChange('type', e.target.value)}
                disabled={updateItemMutation.isPending}
                startAdornment={<Category color="action" sx={{ mr: 1 }} />}
              >
                {ITEM_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: type.color,
                        }}
                      />
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ubicación"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ej: Online, Medellín, Colombia"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={updateItemMutation.isPending}
              required
            />
          </Grid>

          {/* Precios */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={formData.currency}
                label="Moneda"
                onChange={(e) => handleInputChange('currency', e.target.value)}
                disabled={updateItemMutation.isPending}
              >
                {CURRENCIES.map((currency) => (
                  <MenuItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Precio Principal"
              value={formData.priceUnits}
              onChange={(e) => handleInputChange('priceUnits', e.target.value)}
              data-testid="item-price-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {selectedCurrency?.symbol}
                  </InputAdornment>
                ),
              }}
              disabled={updateItemMutation.isPending}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Precio Secundario (Toins)"
              value={formData.priceToins}
              onChange={(e) => handleInputChange('priceToins', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    🪙
                  </InputAdornment>
                ),
              }}
              disabled={updateItemMutation.isPending}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Etiquetas
            </Typography>
            
            {/* Tags actuales */}
            {formData.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                      disabled={updateItemMutation.isPending}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Input para nuevas tags */}
            <TextField
              fullWidth
              label="Agregar etiquetas"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe una etiqueta y presiona Enter"
              disabled={updateItemMutation.isPending}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalOffer color="action" />
                  </InputAdornment>
                ),
                endAdornment: newTag.trim() && (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => addTag(newTag)}
                      size="small"
                      disabled={updateItemMutation.isPending}
                    >
                      Agregar
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            {/* Tags sugeridas */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Etiquetas sugeridas:
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {SUGGESTED_TAGS.filter(
                    (tag) => !formData.tags.includes(tag)
                  )
                    .slice(0, 8)
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => addTag(tag)}
                        variant="outlined"
                        size="small"
                        disabled={updateItemMutation.isPending}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={updateItemMutation.isPending}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateItemMutation.isPending}
          startIcon={<SaveIcon />}
          data-testid="edit-item-submit"
          sx={{
            background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
            '&:hover': {
              background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
            },
          }}
        >
          {updateItemMutation.isPending ? 'Actualizando...' : 'Actualizar Item'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { EditItemModal }; 