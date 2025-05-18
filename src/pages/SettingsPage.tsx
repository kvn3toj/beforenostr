import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Typography,
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  FormHelperText,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BackupIcon from '@mui/icons-material/Backup';
import { useHasRole } from '../hooks/useHasRole';
import { useSystemSettingsQuery } from '../hooks/system/useSystemSettingsQuery';
import { useUpdateSystemSettingsMutation } from '../hooks/system/useUpdateSystemSettingsMutation';
import { useRecentBackupsQuery } from '../hooks/system/useRecentBackupsQuery';
import { useServiceStatusesQuery } from '../hooks/system/useServiceStatusesQuery';
import { useInitiateBackupMutation } from '../hooks/system/useInitiateBackupMutation';
import type { SystemSettings, UpdateSystemSettingsData, BackupStatus, ServiceStatus } from '../types/system.types';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';

const settingsSchema = z.object({
  app_name: z.string().min(1, 'El nombre de la aplicación es requerido'),
  default_role_id: z.string().min(1, 'El rol por defecto es requerido'),
  maintenance_mode: z.boolean(),
  max_upload_size_mb: z.number().min(1, 'El tamaño máximo debe ser mayor a 0'),
  allowed_file_types: z.array(z.string()).min(1, 'Debe haber al menos un tipo de archivo permitido'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// Define column configuration for the recent backups table
const recentBackupsColumns: ColumnDefinition<BackupStatus>[] = [
  {
    header: 'ID',
    field: 'id',
    width: '20%',
  },
  {
    header: 'Fecha/Hora',
    field: 'timestamp',
    width: '25%',
    render: (item) => new Date(item.timestamp).toLocaleString(),
  },
  {
    header: 'Estado',
    field: 'status',
    width: '15%',
    render: (item) => {
      const statusColors = {
        success: 'success',
        failed: 'error',
        in_progress: 'warning',
      } as const;
      return (
        <Chip
          label={item.status === 'in_progress' ? 'En Progreso' : item.status === 'success' ? 'Exitoso' : 'Fallido'}
          color={statusColors[item.status]}
          size="small"
        />
      );
    },
  },
  {
    header: 'Tipo',
    field: 'type',
    width: '15%',
    render: (item) => item.type === 'manual' ? 'Manual' : 'Automático',
  },
  {
    header: 'Tamaño',
    field: 'file_size',
    width: '25%',
    align: 'right',
    render: (item) => item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
  },
];

// Define column configuration for the service statuses table
const serviceStatusesColumns: ColumnDefinition<ServiceStatus>[] = [
  {
    header: 'Servicio',
    field: 'name',
    width: '20%',
  },
  {
    header: 'Estado',
    field: 'status',
    width: '15%',
    render: (item) => {
      const statusColors = {
        ok: 'success',
        warning: 'warning',
        critical: 'error',
        unknown: 'default',
      } as const;
      const statusLabels = {
        ok: 'OK',
        warning: 'Advertencia',
        critical: 'Crítico',
        unknown: 'Desconocido',
      } as const;
      return (
        <Chip
          label={statusLabels[item.status]}
          color={statusColors[item.status]}
          size="small"
        />
      );
    },
  },
  {
    header: 'Última Verificación',
    field: 'last_checked',
    width: '25%',
    render: (item) => new Date(item.last_checked).toLocaleString(),
  },
  {
    header: 'Mensaje',
    field: 'message',
    width: '40%',
    render: (item) => item.message || 'Sin mensaje',
  },
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const isSuperAdmin = useHasRole('Super Admin');
  const { data: settings, isLoading: isLoadingSettings, isError: isErrorSettings, error: settingsError } = useSystemSettingsQuery();
  const { mutate: updateSettingsMutation, isPending: isUpdatingSettings } = useUpdateSystemSettingsMutation();
  const { 
    data: recentBackups, 
    isLoading: isLoadingBackups, 
    isError: isErrorBackups, 
    error: backupsError,
    refetch: refetchBackups 
  } = useRecentBackupsQuery();
  const { data: serviceStatuses, isLoading: isLoadingServices, isError: isErrorServices, error: servicesError } = useServiceStatusesQuery();
  const { mutate: initiateBackup, isPending: isInitiatingBackup } = useInitiateBackupMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  if (!isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: SettingsFormData) => {
    if (settings?.id) {
      updateSettingsMutation({ id: settings.id, data });
    }
  };

  if (isLoadingSettings) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isErrorSettings) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error al cargar la configuración: {settingsError?.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración del Sistema
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Nombre de la Aplicación"
              fullWidth
              {...register('app_name')}
              error={!!errors.app_name}
              helperText={errors.app_name?.message}
            />

            <TextField
              label="ID del Rol por Defecto"
              fullWidth
              {...register('default_role_id')}
              error={!!errors.default_role_id}
              helperText={errors.default_role_id?.message}
            />

            <FormControlLabel
              control={
                <Switch
                  {...register('maintenance_mode')}
                />
              }
              label="Modo Mantenimiento"
            />

            <TextField
              label="Tamaño Máximo de Subida (MB)"
              type="number"
              fullWidth
              {...register('max_upload_size_mb', { valueAsNumber: true })}
              error={!!errors.max_upload_size_mb}
              helperText={errors.max_upload_size_mb?.message}
            />

            <TextField
              label="Tipos de Archivo Permitidos"
              fullWidth
              {...register('allowed_file_types')}
              error={!!errors.allowed_file_types}
              helperText={errors.allowed_file_types?.message}
              placeholder="Ej: .jpg,.png,.pdf"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUpdatingSettings}
              sx={{ mt: 2 }}
            >
              {isUpdatingSettings ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Backups Recientes
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BackupIcon />}
              onClick={() => initiateBackup()}
              disabled={isInitiatingBackup}
            >
              {isInitiatingBackup ? 'Iniciando...' : 'Iniciar Backup Manual'}
            </Button>
            <Tooltip title="Refrescar">
              <span>
                <IconButton 
                  onClick={() => refetchBackups()} 
                  disabled={isLoadingBackups}
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
        <DataTable
          data={recentBackups}
          columns={recentBackupsColumns}
          isLoading={isLoadingBackups}
          isError={isErrorBackups}
          errorMessage={backupsError?.message}
          emptyMessage="No hay información de backups recientes disponible"
          // Pagination props (disabled for recent backups)
          page={0}
          pageSize={10}
          totalCount={recentBackups?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for recent backups)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Estado de Servicios del Sistema
        </Typography>
        <DataTable
          data={serviceStatuses}
          columns={serviceStatusesColumns}
          isLoading={isLoadingServices}
          isError={isErrorServices}
          errorMessage={servicesError?.message}
          emptyMessage="No hay información de estado de servicios disponible"
          // Pagination props (disabled for service statuses)
          page={0}
          pageSize={10}
          totalCount={serviceStatuses?.length || 0}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          // Sorting props (disabled for service statuses)
          sortBy={null}
          sortDirection={null}
          onSortChange={() => {}}
        />
      </Paper>
    </Container>
  );
}; 