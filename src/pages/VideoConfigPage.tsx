import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Paper,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { usePlaylistItemQuery } from '../hooks/usePlaylistItemQuery';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';
import { useItemCategoriesQuery } from '../hooks/useItemCategoriesQuery';
import { useCreateCategoryMutation } from '../hooks/useCreateCategoryMutation';
import { useSetItemCategoriesMutation } from '../hooks/useSetItemCategoriesMutation';
import { Category } from '../types/category';
import { toast } from 'sonner';

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
      id={`video-config-tabpanel-${index}`}
      aria-labelledby={`video-config-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `video-config-tab-${index}`,
    'aria-controls': `video-config-tabpanel-${index}`,
  };
}

interface CreateCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Crear Nueva Categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la categoría"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={!name.trim() || isLoading}>
            {isLoading ? 'Creando...' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const VideoConfigPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Estado local para formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  
  // Queries
  const { 
    data: item, 
    isLoading, 
    error 
  } = usePlaylistItemQuery(itemId);

  const {
    data: allCategories,
    isLoading: isLoadingCategories
  } = useCategoriesQuery();

  const {
    data: assignedCategoryIds,
    isLoading: isLoadingAssignedCategories
  } = useItemCategoriesQuery(itemId);

  // Mutations
  const { 
    mutate: createCategoryMutate, 
    isPending: isCreatingCategory 
  } = useCreateCategoryMutation();

  const {
    mutate: setItemCategoriesMutate,
    isPending: isSettingCategories
  } = useSetItemCategoriesMutation();

  // Effects
  useEffect(() => {
    if (assignedCategoryIds) {
      setSelectedCategoryIds(assignedCategoryIds);
    }
  }, [assignedCategoryIds]);

  // Handlers
  const handleCreateCategory = (name: string) => {
    createCategoryMutate(name, {
      onSuccess: () => {
        setIsCreateCategoryDialogOpen(false);
        toast.success('Categoría creada exitosamente');
      },
      onError: (error) => {
        toast.error(`Error al crear la categoría: ${error.message}`);
      }
    });
  };

  const handleCategoriesChange = (_event: React.SyntheticEvent, newValue: Category[]) => {
    const newIds = newValue.map(cat => cat.id);
    setSelectedCategoryIds(newIds);
    
    if (itemId) {
      setItemCategoriesMutate(
        { itemId, categoryIds: newIds },
        {
          onSuccess: () => {
            toast.success('Categorías actualizadas exitosamente');
          },
          onError: (error) => {
            toast.error(`Error al actualizar las categorías: ${error.message}`);
            // Revertir la selección en caso de error
            setSelectedCategoryIds(assignedCategoryIds || []);
          }
        }
      );
    }
  };

  // Funciones
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleBackClick = () => {
    navigate(-1); // Volver a la página anterior
  };
  
  const handleSaveConfig = () => {
    console.log('Guardar configuración:', { title, description });
    // Aquí implementarías la mutación para actualizar el ítem
  };
  
  // Renderizado de estados de carga y error
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar el video: {(error as Error)?.message || 'Error desconocido'}
      </Alert>
    );
  }
  
  if (!item) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        No se encontró el video solicitado
      </Alert>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabecera */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Configurar Video
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Reproductor de Video */}
      <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: '56.25%', // Aspect ratio 16:9
            position: 'relative',
            overflow: 'hidden',
            '& iframe': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            },
          }}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </Paper>
      
      {/* Pestañas de Configuración */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="video configuration tabs"
          >
            <Tab label="Configuración" {...a11yProps(0)} />
            <Tab label="Preguntas" {...a11yProps(1)} />
            <Tab label="Permisos" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        {/* Tab: Configuración */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" sx={{ '& .MuiTextField-root': { mb: 3 } }}>
            <TextField
              fullWidth
              label="Título del video"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ingresa un título descriptivo"
            />
            
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agrega una descripción del contenido"
            />
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Categorías
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Autocomplete
                  multiple
                  options={allCategories || []}
                  loading={isLoadingCategories}
                  value={(allCategories || []).filter(cat => selectedCategoryIds.includes(cat.id))}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={handleCategoriesChange}
                  disabled={isSettingCategories}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categorías"
                      placeholder="Seleccionar o buscar..."
                      sx={{ minWidth: 300 }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setIsCreateCategoryDialogOpen(true)}
                  disabled={isCreatingCategory}
                >
                  + Crear categoría
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Administrador de subtítulos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Funcionalidad de subtítulos pendiente de implementar.
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 4 }}
              onClick={handleSaveConfig}
            >
              Publicar video
            </Button>
          </Box>
        </TabPanel>
        
        {/* Tab: Preguntas */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            Aquí podrás añadir preguntas interactivas al video.
            Funcionalidad pendiente de implementar.
          </Typography>
        </TabPanel>
        
        {/* Tab: Permisos */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Configura quién puede ver este video.
            Funcionalidad pendiente de implementar.
          </Typography>
        </TabPanel>
      </Box>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        open={isCreateCategoryDialogOpen}
        onClose={() => setIsCreateCategoryDialogOpen(false)}
        onSubmit={handleCreateCategory}
        isLoading={isCreatingCategory}
      />
    </Container>
  );
}; 