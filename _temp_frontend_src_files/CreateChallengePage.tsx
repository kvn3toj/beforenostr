import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowBack, Save, EmojiEvents } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createChallenge, CreateChallengeDto } from '../services/challenge.service';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

// Enums basados en el DTO del backend
enum ChallengeType {
  CUSTOM = 'CUSTOM',
  AUTOMATED = 'AUTOMATED',
}

enum ChallengeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

interface CreateChallengeFormData {
  name: string;
  slug: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  startDate: Date | null;
  endDate: Date | null;
  config?: any; // Configuración opcional
}

export const CreateChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateChallengeFormData>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      type: ChallengeType.CUSTOM,
      status: ChallengeStatus.DRAFT,
      startDate: new Date(),
      endDate: null,
      config: {},
    },
  });

  // Mutación para crear desafío
  const createChallengeMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: (data) => {
      toast.success('¡Desafío creado exitosamente!');
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      navigate('/challenges');
    },
    onError: (error: any) => {
      console.error('Error creating challenge:', error);
      toast.error('Error al crear el desafío: ' + (error.message || 'Error desconocido'));
    },
  });

  const watchedName = watch('name');

  // Auto-generar slug basado en el nombre
  React.useEffect(() => {
    if (watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, setValue]);

  const onSubmit = async (data: CreateChallengeFormData) => {
    if (!user?.id) {
      toast.error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const challengeData: CreateChallengeDto = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        createdBy: user.id,
        config: data.config || {},
      };

      await createChallengeMutation.mutateAsync(challengeData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/challenges');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              sx={{ minWidth: 'auto' }}
            >
              Volver
            </Button>
            <EmojiEvents sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                🏆 Crear Nuevo Desafío
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configura un nuevo desafío para motivar a los usuarios. Los campos marcados con (*) son obligatorios.
              </Typography>
            </Box>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Información Básica
                  </Typography>

                  {/* Instrucciones claras */}
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Define la información básica del desafío. El nombre debe ser descriptivo y motivador para los usuarios.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ 
                          required: 'El nombre del desafío es obligatorio',
                          minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Nombre del Desafío *"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message || 'Nombre atractivo y descriptivo del desafío'}
                            placeholder="Ej: Completar 5 Videos Educativos"
                            required
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="slug"
                        control={control}
                        rules={{ 
                          required: 'El slug es obligatorio',
                          pattern: { 
                            value: /^[a-z0-9-]+$/, 
                            message: 'El slug solo puede contener letras minúsculas, números y guiones' 
                          }
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Identificador (Slug) *"
                            fullWidth
                            error={!!errors.slug}
                            helperText={errors.slug?.message || 'Se genera automáticamente del nombre - Usado para URLs'}
                            disabled
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="description"
                        control={control}
                        rules={{ 
                          required: 'La descripción es obligatoria',
                          minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Descripción *"
                            fullWidth
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description?.message || 'Explica claramente el objetivo y los requisitos del desafío'}
                            placeholder="Describe el objetivo y requisitos del desafío..."
                            required
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Configuración */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Configuración del Sistema
                  </Typography>

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Define el tipo y estado inicial del desafío.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Tipo de Desafío</InputLabel>
                            <Select {...field} label="Tipo de Desafío">
                              <MenuItem value={ChallengeType.CUSTOM}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label="PERSONALIZADO" size="small" color="primary" />
                                  <Typography variant="body2">Configuración manual</Typography>
                                </Box>
                              </MenuItem>
                              <MenuItem value={ChallengeType.AUTOMATED}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label="AUTOMATIZADO" size="small" color="secondary" />
                                  <Typography variant="body2">Reglas automáticas</Typography>
                                </Box>
                              </MenuItem>
                            </Select>
                            <FormHelperText>Personalizado permite configuración manual, Automatizado usa reglas predefinidas</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Estado Inicial</InputLabel>
                            <Select {...field} label="Estado Inicial">
                              <MenuItem value={ChallengeStatus.DRAFT}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label="BORRADOR" size="small" color="default" />
                                  <Typography variant="body2">En preparación</Typography>
                                </Box>
                              </MenuItem>
                              <MenuItem value={ChallengeStatus.ACTIVE}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label="ACTIVO" size="small" color="success" />
                                  <Typography variant="body2">Disponible para usuarios</Typography>
                                </Box>
                              </MenuItem>
                              <MenuItem value={ChallengeStatus.INACTIVE}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Chip label="INACTIVO" size="small" color="error" />
                                  <Typography variant="body2">No disponible</Typography>
                                </Box>
                              </MenuItem>
                            </Select>
                            <FormHelperText>Recomendado: Borrador para revisar antes de activar</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Fechas */}
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Programación Temporal
                  </Typography>

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Define cuándo estará disponible el desafío. Las fechas son opcionales.
                  </Alert>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Fecha de Inicio"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.startDate,
                                helperText: errors.startDate?.message || 'Cuándo los usuarios podrán participar',
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Fecha de Fin (Opcional)"
                            value={field.value}
                            onChange={field.onChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.endDate,
                                helperText: errors.endDate?.message || 'Dejar vacío para desafío sin límite de tiempo',
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Botones de Acción */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={16} /> : <Save />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creando...' : 'Crear Desafío'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>

        {/* Error de la mutación */}
        {createChallengeMutation.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al crear el desafío: {createChallengeMutation.error?.message || 'Error desconocido'}
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
}; 