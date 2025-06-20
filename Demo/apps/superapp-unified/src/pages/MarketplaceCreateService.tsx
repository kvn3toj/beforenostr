import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Add as AddIcon,
  Preview,
  Publish,
  LocationOn,
  AttachMoney,
  Schedule,
  Category,
  Description,
  Image as ImageIcon,
  VideoCameraBack,
  Star,
} from '@mui/icons-material';
import { RevolutionaryWidget } from '../design-system/templates/RevolutionaryWidget';

// Seguindo mejores prácticas de UX de Contentsquare:
// - CTAs consistentes y notables
// - Visualización de conceptos importantes
// - Acciones "más suaves" para usuarios no listos

interface ServiceData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  deliveryTime: string;
  location: string;
  tags: string[];
  images: File[];
  videoUrl: string;
  isRemote: boolean;
  isFlexible: boolean;
}

const MarketplaceCreateService: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [serviceData, setServiceData] = useState<ServiceData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: 0,
    currency: 'ü',
    deliveryTime: '',
    location: '',
    tags: [],
    images: [],
    videoUrl: '',
    isRemote: true,
    isFlexible: false,
  });

  // Categorías alineadas con CoomÜnity (Bien Común)
  const impactCategories = [
    { id: 'sostenibilidad', name: 'Sostenibilidad', icon: '🌱' },
    { id: 'educacion', name: 'Educación', icon: '📚' },
    { id: 'salud', name: 'Salud & Bienestar', icon: '🏥' },
    { id: 'tecnologia-social', name: 'Tecnología Social', icon: '💻' },
    { id: 'economia-circular', name: 'Economía Circular', icon: '♻️' },
    { id: 'inclusion', name: 'Inclusión Social', icon: '🌈' },
  ];

  const steps = [
    'Información Básica',
    'Detalles del Servicio', 
    'Precio y Entrega',
    'Multimedia',
    'Vista Previa'
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Aquí se conectaría con el backend real
      console.log('📤 Creando servicio:', serviceData);
      
      // Simular creación exitosa
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/marketplace', { 
          state: { 
            message: '¡Servicio creado exitosamente! 🎉',
            type: 'success' 
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Error creando servicio:', error);
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setServiceData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Máximo 5 imágenes
    }));
  };

  const removeImage = (index: number) => {
    setServiceData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !serviceData.tags.includes(tag.trim())) {
      setServiceData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()].slice(0, 8) // Máximo 8 tags
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setServiceData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Información Básica
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Título del Servicio"
              value={serviceData.title}
              onChange={(e) => setServiceData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej: Desarrollo Web Sostenible para ONG"
              helperText="Sé específico y descriptivo (máximo 80 caracteres)"
              inputProps={{ maxLength: 80 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              value={serviceData.description}
              onChange={(e) => setServiceData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe qué ofreces, cómo contribuye al Bien Común y qué incluye el servicio..."
              helperText="Explica el valor que aportas (máximo 500 caracteres)"
              inputProps={{ maxLength: 500 }}
            />

            <FormControl fullWidth>
              <InputLabel>Categoría de Impacto</InputLabel>
              <Select
                value={serviceData.category}
                onChange={(e) => setServiceData(prev => ({ ...prev, category: e.target.value }))}
              >
                {impactCategories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );

      case 1: // Detalles del Servicio
        return (
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Ubicación"
              value={serviceData.location}
              onChange={(e) => setServiceData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ciudad, País o 'Remoto'"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={serviceData.isRemote}
                  onChange={(e) => setServiceData(prev => ({ ...prev, isRemote: e.target.checked }))}
                />
              }
              label="Servicio disponible de forma remota"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={serviceData.isFlexible}
                  onChange={(e) => setServiceData(prev => ({ ...prev, isFlexible: e.target.checked }))}
                />
              }
              label="Horarios flexibles"
            />

            <Box>
              <Typography variant="body2" gutterBottom>
                Tags de habilidades (presiona Enter para agregar)
              </Typography>
              <TextField
                fullWidth
                placeholder="Ej: React, Sostenibilidad, Design Thinking"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {serviceData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        );

      case 2: // Precio y Entrega
        return (
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio"
                  value={serviceData.price}
                  onChange={(e) => setServiceData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Moneda</InputLabel>
                  <Select
                    value={serviceData.currency}
                    onChange={(e) => setServiceData(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <MenuItem value="ü">ü Lükas</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="COP">COP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Tiempo de Entrega"
              value={serviceData.deliveryTime}
              onChange={(e) => setServiceData(prev => ({ ...prev, deliveryTime: e.target.value }))}
              placeholder="Ej: 1-2 semanas, 3-5 días hábiles"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Schedule />
                  </InputAdornment>
                ),
              }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              💡 <strong>Ayni Tip:</strong> Considera ofrecer descuentos por intercambios 
              colaborativos o contribuciones al Bien Común.
            </Alert>
          </Stack>
        );

      case 3: // Multimedia
        return (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Imágenes del Servicio
              </Typography>
              <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Subir Imágenes (máximo 5)
                </Button>
              </label>
              
              <Grid container spacing={2}>
                {serviceData.images.map((file, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Paper sx={{ p: 1, position: 'relative' }}>
                      <Typography variant="caption" noWrap>
                        {file.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        ✕
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <TextField
              fullWidth
              label="Video de Demostración (URL)"
              value={serviceData.videoUrl}
              onChange={(e) => setServiceData(prev => ({ ...prev, videoUrl: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VideoCameraBack />
                  </InputAdornment>
                ),
              }}
              helperText="Opcional: Agrega un video para mostrar tu trabajo"
            />
          </Stack>
        );

      case 4: // Vista Previa
        return (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight="bold">
                  {serviceData.title || 'Título del servicio'}
                </Typography>
                
                <Typography variant="body1">
                  {serviceData.description || 'Descripción del servicio'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {serviceData.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>

                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Precio
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {serviceData.currency} {serviceData.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Entrega
                    </Typography>
                    <Typography variant="body1">
                      {serviceData.deliveryTime || 'Por definir'}
                    </Typography>
                  </Grid>
                </Grid>

                <Alert severity="success">
                  ¡Tu servicio se ve genial! Contribuirás al {' '}
                  {impactCategories.find(cat => cat.id === serviceData.category)?.name || 'Bien Común'}.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <RevolutionaryWidget
      title="✨ Crear Servicio de Impacto"
      subtitle="Comparte tu talento para el Bien Común"
      variant="elevated"
      element="fuego" // Elemento fuego para acción y creación
      cosmicEffects={{
        enableParticles: true,
        particleTheme: 'creation',
        enableGlow: true,
        enableAnimations: true,
      }}
    >
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/marketplace')}
            sx={{ mb: 2 }}
          >
            Volver al Marketplace
          </Button>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Crear Servicio de Impacto
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comparte tu conocimiento y habilidades para generar un impacto positivo
          </Typography>
        </Box>

        {/* Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent sx={{ p: 4 }}>
            {renderStepContent()}

            {/* Progress */}
            {isSubmitting && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Creando tu servicio...
                </Typography>
              </Box>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
              >
                Anterior
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep < steps.length - 1 ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => setPreviewMode(!previewMode)}
                      startIcon={<Preview />}
                    >
                      Vista Previa
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={isSubmitting}
                    >
                      Siguiente
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    startIcon={<Publish />}
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C, #4CAF50)',
                      },
                    }}
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Servicio'}
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tips CoomÜnity */}
        <Alert severity="info" sx={{ mt: 3 }}>
          💡 <strong>Principio Ayni:</strong> Los servicios más valorados en CoomÜnity 
          son aquellos que buscan el equilibrio entre dar y recibir, contribuyendo 
          al crecimiento colectivo de la comunidad.
        </Alert>
      </Container>
    </RevolutionaryWidget>
  );
};

export default MarketplaceCreateService;