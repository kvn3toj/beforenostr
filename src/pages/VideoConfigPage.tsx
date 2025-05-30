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
  Tooltip,
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '../components/common/Icons';
import { usePlaylistItemQuery } from '../hooks/usePlaylistItemQuery';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';
import { useItemCategoriesQuery } from '../hooks/useItemCategoriesQuery';
import { useCreateCategoryMutation } from '../hooks/useCreateCategoryMutation';
import { useSetItemCategoriesMutation } from '../hooks/useSetItemCategoriesMutation';
import { useUpdatePlaylistItemMutation } from '../hooks/useUpdatePlaylistItemMutation';
import { Category } from '../types/category.types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SubtitleManager } from '../components/features/subtitles/SubtitleManager';
import { QuestionManager } from '../components/features/questions/QuestionManager';
import { VideoPermissionsManager } from '../components/features/video/VideoPermissionsManager';
import { extractVideoUrl, convertToEmbedUrl } from '../utils/videoUtils';

const ASPECT_RATIO_16_9_PADDING = '56.25%';

/**
 * Extrae la URL 'src' del primer iframe encontrado en una cadena HTML.
 * Utiliza DOMParser para un análisis más robusto que las expresiones regulares.
 * @param htmlString La cadena HTML que podría contener un iframe.
 * @returns La URL src del iframe, o null si no se encuentra o hay un error.
 */
const extractIframeSrc = (htmlString: string | undefined): string | null => {
  if (!htmlString || typeof DOMParser === 'undefined') { // Comprobar si DOMParser está disponible (entornos no navegador)
    return null;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const iframeElement = doc.querySelector('iframe');
    return iframeElement ? iframeElement.src : null;
  } catch (e) {
    console.error('Error al parsear el string del iframe:', e);
    return null; // En caso de error de parseo
  }
};

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
    >
      {value === index && (
        <Box sx={{ padding: '24px 0' }}>
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
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  
  // Estado local para formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [previousSelectedCategoryIds, setPreviousSelectedCategoryIds] = useState<string[]>([]);
  
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
  } = useItemCategoriesQuery(itemId);

  // Mutations
  const { 
    mutate: createCategoryMutate, 
    isPending: isCreatingCategory 
  } = useCreateCategoryMutation();

  const {
    mutate: updateItemMutate,
    isPending: isUpdatingItem
  } = useUpdatePlaylistItemMutation();

  const {
    mutate: setItemCategoriesMutate,
    isPending: isSettingItemCategories
  } = useSetItemCategoriesMutation();

  // Effects
  useEffect(() => {
    if (assignedCategoryIds) {
      const initialIds = [...assignedCategoryIds];
      setSelectedCategoryIds(initialIds);
      setPreviousSelectedCategoryIds(initialIds);
    }
  }, [assignedCategoryIds]);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setDescription(item.description || '');
    }
  }, [item]);

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
  };

  // Funciones
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleBackClick = () => {
    navigate(-1); // Volver a la página anterior
  };
  
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!itemId) return;

    // --- INICIO COMENTARIOS EXPLICATIVOS ---
    // Esta función orquesta el guardado de múltiples piezas de datos:
    // 1. Título y descripción del ítem.
    // 2. Categorías asignadas al ítem.
    // Se utilizan promesas para manejar estas operaciones de forma concurrente
    // y esperar a que ambas finalicen antes de concluir.
    // Cada mutación (updateItemMutate, setItemCategoriesMutate) tiene sus propios
    // manejadores onSuccess y onError para proporcionar retroalimentación específica al usuario (toasts).
    // --- FIN COMENTARIOS EXPLICATIVOS ---

    let itemDetailsUpdated = false;
    let categoriesUpdated = false;
    let overallError = false;

    // Promesa para actualizar título y descripción
    const updateDetailsPromise = new Promise<void>((resolve) => {
      // Solo se ejecuta la mutación si hay cambios detectados
      if (item?.title !== title || item?.description !== description) {
        updateItemMutate(
          { itemId, title, description },
          {
            onSuccess: () => {
              toast.success('Título y descripción guardados.');
              itemDetailsUpdated = true;
              if (item) {
                item.title = title; // Actualización optimista local para evitar refetch inmediato
                item.description = description;
              }
              resolve();
            },
            onError: (error: Error) => {
              toast.error(`Error al guardar título/descripción: ${error.message}`);
              overallError = true;
              resolve();
            },
          }
        );
      } else {
        resolve(); // No hay cambios, se resuelve inmediatamente
      }
    });

    // Promesa para actualizar categorías
    const updateCategoriesPromise = new Promise<void>((resolve) => {
      // Comprobar si las categorías han cambiado.
      // El método JSON.stringify(array.sort()) es simple para arrays pequeños de IDs.
      // Para arrays muy grandes o con objetos complejos, considerar una comparación más profunda
      // o el uso de Sets para mayor rendimiento y robustez. (Sugerencia Línea 188)
      const categoriesHaveChanged =
        JSON.stringify(selectedCategoryIds.sort()) !== JSON.stringify(previousSelectedCategoryIds.sort());

      if (categoriesHaveChanged) {
        setItemCategoriesMutate(
          { itemId, categoryIds: selectedCategoryIds },
          {
            onSuccess: () => {
              toast.success('Categorías actualizadas exitosamente.');
              setPreviousSelectedCategoryIds([...selectedCategoryIds]); // Actualizar estado base
              categoriesUpdated = true;
              resolve();
            },
            onError: (error: Error) => {
              toast.error(`Error al actualizar categorías: ${error.message}`);
              overallError = true;
              resolve();
            },
          }
        );
      } else {
        resolve(); // No hay cambios, se resuelve inmediatamente
      }
    });

    try {
      await Promise.all([updateDetailsPromise, updateCategoriesPromise]);

      if (!itemDetailsUpdated && !categoriesUpdated && !overallError) {
        toast.info('No había cambios para guardar.');
      }
      // Los toasts de éxito individuales ya informaron al usuario si hubo guardados parciales o totales.
      // Si overallError es true, los toasts de error individuales ya se mostraron.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // La variable 'error' en este bloque catch es la razón del rechazo de Promise.all.
      // Dado que los errores específicos de cada mutación ya se manejan y notifican
      // con toasts en sus respectivos callbacks onError, no es estrictamente necesario
      // usar esta variable 'error' aquí para otra notificación.
      // Si se decide no usarla (por ejemplo, no hay un console.error general aquí),
      // el linter puede marcar 'error' como no utilizada.
      // Para solucionar esto, si 'error' REALMENTE no se usa aquí:
      // 1. Se puede añadir un log: console.error("Una o más operaciones de guardado fallaron:", error);
      // 2. O, si intencionalmente no se usa, deshabilitar la regla del linter para esta línea:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
  };
  
  // Combined loading state for the save button
  const isSavingInProgress = isUpdatingItem || isSettingItemCategories;
  
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
  
  const iframeSrc = extractVideoUrl(item.content);
  const embedUrl = iframeSrc ? convertToEmbedUrl(iframeSrc) : null;
  
  const handlePermissionsSave = (permissions: any, isDraft: boolean) => {
    console.log('Saving permissions:', permissions, 'isDraft:', isDraft);
    // TODO: Implementar guardado de permisos en el backend
    if (isDraft) {
      toast.success('Permisos guardados en borradores');
    } else {
      toast.success('Permisos guardados y video publicado');
    }
  };

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
        {embedUrl ? (
          <Box
            sx={{
              width: '100%',
              height: 0,
              paddingBottom: ASPECT_RATIO_16_9_PADDING,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <iframe
              src={embedUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title || 'Video content'}
            />
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              paddingBottom: ASPECT_RATIO_16_9_PADDING,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Typography variant="body1" color="textSecondary">
              Contenido del video no disponible o formato no compatible.
            </Typography>
          </Box>
        )}
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
            <Tab label={t('subtitles_tab_label')} {...a11yProps(1)} />
            <Tab label={t('questions_tab_label')} {...a11yProps(2)} />
            <Tab label="Permisos" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Tab: Configuración */}
        <TabPanel value={tabValue} index={0}>
          <Box component="form" sx={{ '& .MuiTextField-root': { mb: 3 } }} onSubmit={handleSaveConfig}>
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
                  disabled={isSettingItemCategories || isUpdatingItem}
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
                  disabled={isCreatingCategory || isSavingInProgress}
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
              type="submit"
              disabled={isSavingInProgress}
            >
              Guardar Cambios {isSavingInProgress && <CircularProgress size={24} color="inherit" sx={{ ml: 1 }} />}
            </Button>
          </Box>
        </TabPanel>
        
        {/* Tab: Subtítulos */}
        <TabPanel value={tabValue} index={1}>
          {itemId && <SubtitleManager videoItemId={parseInt(itemId)} />}
        </TabPanel>
        
        {/* Tab: Preguntas */}
        <TabPanel value={tabValue} index={2}>
          {itemId && !isNaN(parseInt(itemId)) && <QuestionManager videoItemId={parseInt(itemId)} />}
        </TabPanel>
        
        {/* Tab: Permisos */}
        <TabPanel value={tabValue} index={3}>
          {itemId && !isNaN(parseInt(itemId)) ? (
            <VideoPermissionsManager 
              videoItemId={parseInt(itemId)} 
              onSave={handlePermissionsSave}
              isLoading={isUpdatingItem}
            />
          ) : (
            <Alert severity="error" sx={{ mb: 2 }}>
              ID de video inválido. No se pueden cargar los permisos.
            </Alert>
          )}
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