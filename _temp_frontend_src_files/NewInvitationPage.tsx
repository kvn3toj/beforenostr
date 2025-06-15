import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  CardGiftcard, 
  ArrowBack,
  Add,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { invitationService, CreateGiftCardData } from '../services/invitation.service';
import { userService } from '../services/user.service';
import { User } from '../types/user.types';

interface FormData {
  inviterId: string;
  invitedName: string;
  invitedEmail: string;
  unitsAmount: number;
  suggestions: string[];
}

const predefinedSuggestions = [
  'Cursos de programación',
  'Tutoriales de design',
  'Contenido de marketing',
  'Videos educativos',
  'Cursos de idiomas',
  'Talleres creativos',
  'Webinars especializados',
  'Certificaciones online'
];

export const NewInvitationPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [customSuggestion, setCustomSuggestion] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      inviterId: '',
      invitedName: '',
      invitedEmail: '',
      unitsAmount: 100,
      suggestions: []
    },
    mode: 'onChange'
  });

  // Obtener lista de usuarios para el selector de invitador
  const {
    data: users,
    isLoading: isLoadingUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers()
  });

  // Mutación para crear gift card
  const createGiftCardMutation = useMutation({
    mutationFn: (data: CreateGiftCardData) => invitationService.createGiftCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations-stats'] });
      navigate('/invitations', { 
        state: { 
          message: 'Invitación creada exitosamente',
          severity: 'success' 
        }
      });
    },
    onError: (error) => {
      console.error('Error creating gift card:', error);
    }
  });

  const watchedSuggestions = watch('suggestions');

  const onSubmit = (data: FormData) => {
    createGiftCardMutation.mutate(data);
  };

  const handleAddCustomSuggestion = () => {
    if (customSuggestion.trim() && !watchedSuggestions.includes(customSuggestion.trim())) {
      const newSuggestions = [...watchedSuggestions, customSuggestion.trim()];
      setValue('suggestions', newSuggestions);
      setCustomSuggestion('');
    }
  };

  const handleAddPredefinedSuggestion = (suggestion: string) => {
    if (!watchedSuggestions.includes(suggestion)) {
      const newSuggestions = [...watchedSuggestions, suggestion];
      setValue('suggestions', newSuggestions);
    }
  };

  const handleRemoveSuggestion = (index: number) => {
    const newSuggestions = watchedSuggestions.filter((_, i) => i !== index);
    setValue('suggestions', newSuggestions);
  };

  const handleInviterChange = (event: SelectChangeEvent<string>) => {
    setValue('inviterId', event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/invitations')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 0 }}>
            🎁 Nueva Invitación Gift Card
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Crea una nueva invitación con unidades para un usuario. Los campos marcados con (*) son obligatorios.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: 'primary.main' }}>
                <CardGiftcard color="primary" />
                Información de la Invitación
              </Typography>

              {/* Instrucciones claras */}
              <Alert severity="info" sx={{ mb: 3 }}>
                Completa la información para crear una nueva gift card de invitación. El usuario invitador será el "padre" del nuevo usuario invitado en el sistema de referidos.
              </Alert>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  {/* Selector de Invitador */}
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors.inviterId}>
                      <InputLabel>Usuario Invitador (Solver Padre) *</InputLabel>
                      <Controller
                        name="inviterId"
                        control={control}
                        rules={{ required: 'El usuario invitador es requerido' }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            label="Usuario Invitador (Solver Padre) *"
                            onChange={handleInviterChange}
                            disabled={isLoadingUsers}
                          >
                            {users?.map((user: User) => (
                              <MenuItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                                {user.roles?.includes('admin') && 
                                  <Chip label="Admin" size="small" sx={{ ml: 1 }} />
                                }
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.inviterId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.inviterId.message}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Nombre del Invitado */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="invitedName"
                      control={control}
                      rules={{ 
                        required: 'El nombre del invitado es requerido',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nombre del Invitado *"
                          fullWidth
                          error={!!errors.invitedName}
                          helperText={errors.invitedName?.message}
                          placeholder="Ej: Juan Pérez"
                        />
                      )}
                    />
                  </Grid>

                  {/* Email del Invitado */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="invitedEmail"
                      control={control}
                      rules={{ 
                        required: 'El email del invitado es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email del Invitado *"
                          fullWidth
                          type="email"
                          error={!!errors.invitedEmail}
                          helperText={errors.invitedEmail?.message}
                          placeholder="invitado@ejemplo.com"
                        />
                      )}
                    />
                  </Grid>

                  {/* Cantidad de Unidades */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="unitsAmount"
                      control={control}
                      rules={{ 
                        required: 'La cantidad de unidades es requerida',
                        min: { value: 1, message: 'Mínimo 1 unidad' },
                        max: { value: 10000, message: 'Máximo 10,000 unidades' }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Cantidad de Ünits *"
                          fullWidth
                          type="number"
                          error={!!errors.unitsAmount}
                          helperText={errors.unitsAmount?.message || 'Unidades que recibirá el invitado'}
                          inputProps={{ min: 1, max: 10000 }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Agregar Sugerencia Personalizada */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Sugerencias de Contenido
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        label="Agregar sugerencia personalizada"
                        value={customSuggestion}
                        onChange={(e) => setCustomSuggestion(e.target.value)}
                        fullWidth
                        placeholder="Ej: Curso de React avanzado"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSuggestion();
                          }
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleAddCustomSuggestion}
                        disabled={!customSuggestion.trim()}
                        startIcon={<Add />}
                        sx={{ minWidth: 120 }}
                      >
                        Agregar
                      </Button>
                    </Box>

                    {/* Sugerencias Predefinidas */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      O selecciona sugerencias predefinidas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {predefinedSuggestions.map((suggestion) => (
                        <Chip
                          key={suggestion}
                          label={suggestion}
                          onClick={() => handleAddPredefinedSuggestion(suggestion)}
                          disabled={watchedSuggestions.includes(suggestion)}
                          variant={watchedSuggestions.includes(suggestion) ? 'filled' : 'outlined'}
                          clickable={!watchedSuggestions.includes(suggestion)}
                          size="small"
                        />
                      ))}
                    </Box>

                    {/* Sugerencias Seleccionadas */}
                    {watchedSuggestions.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Sugerencias seleccionadas:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {watchedSuggestions.map((suggestion, index) => (
                            <Chip
                              key={index}
                              label={suggestion}
                              onDelete={() => handleRemoveSuggestion(index)}
                              deleteIcon={<DeleteIcon />}
                              color="primary"
                              variant="filled"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  {/* Botones de Acción */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/invitations')}
                        disabled={createGiftCardMutation.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || createGiftCardMutation.isPending}
                        startIcon={createGiftCardMutation.isPending ? <CircularProgress size={20} /> : <CardGiftcard />}
                      >
                        {createGiftCardMutation.isPending ? 'Creando...' : 'Crear Invitación'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Panel de Información */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ℹ️ Información
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Al crear una invitación se generará automáticamente:
                </Typography>
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 16 }}>
                  <li>Un token único para el canje</li>
                  <li>Fecha de expiración (30 días)</li>
                  <li>Estado inicial: "ENVIADA"</li>
                </ul>
              </Alert>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Importante:</strong> Una vez creada la invitación, no podrás modificar 
                  el email del destinatario ni la cantidad de unidades.
                </Typography>
              </Alert>

              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Las sugerencias ayudan al invitado</strong> a descubrir contenido 
                  relevante durante su experiencia inicial en la plataforma.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error de creación */}
      {createGiftCardMutation.error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Error al crear la invitación: {
            createGiftCardMutation.error instanceof Error 
              ? createGiftCardMutation.error.message 
              : 'Error desconocido'
          }
        </Alert>
      )}
    </Box>
  );
}; 