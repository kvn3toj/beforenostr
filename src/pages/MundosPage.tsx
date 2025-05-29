import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon, Public as WorldIcon, Visibility as ViewIcon } from '../components/common/Icons';
import { useMundosQuery } from '../hooks/useMundosQuery';
import { DataTable, ColumnDefinition } from '../components/common/DataTable/DataTable';
import { Mundo, CreateMundoData, UpdateMundoData } from '../types/mundo.types';
import { useQueryClient } from '@tanstack/react-query';
import { MundoForm } from '../components/features/mundos/components/MundoForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { useHasRole } from '../hooks/useHasRole';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useCreateMundoMutation } from '../hooks/features/mundos/useCreateMundoMutation';
import { useUpdateMundoMutation } from '../hooks/features/mundos/useUpdateMundoMutation';
import { useDeleteMundoMutation } from '../hooks/features/mundos/useDeleteMundoMutation';

export const MundosPage: React.FC = () => {
  const { t } = useTranslation();
  // Verificar permisos
  const isSuperAdmin = useHasRole('Super Admin');
  const isContentAdmin = useHasRole('Content Admin');
  const canManageMundos = isSuperAdmin || isContentAdmin;

  // States for dialogs
  const [isCreateMundoDialogOpen, setIsCreateMundoDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mundoToEdit, setMundoToEdit] = useState<Mundo | null>(null);
  const [mundoToDelete, setMundoToDelete] = useState<Mundo | null>(null);

  // Estados para paginación, ordenamiento y filtrado
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    is_active: undefined as boolean | undefined,
  });

  // Queries and mutations
  const { data: mundosData, isLoading, error } = useMundosQuery({
    page,
    pageSize,
    sortBy,
    sortDirection,
    filters,
  });

  const mundos = mundosData?.data || [];
  const totalCount = mundosData?.count || 0;

  // Debug logging
  console.log('[MundosPage] mundosData:', mundosData);
  console.log('[MundosPage] mundos array:', mundos);
  console.log('[MundosPage] totalCount:', totalCount);
  console.log('[MundosPage] isLoading:', isLoading);
  console.log('[MundosPage] error:', error);

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Use new mutation hooks
  const { mutate: createMundoMutation, isPending: isCreating } = useCreateMundoMutation();
  const { mutate: updateMundoMutation, isPending: isUpdating } = useUpdateMundoMutation();
  const { mutate: deleteMundoMutation, isPending: isDeleting } = useDeleteMundoMutation();

  // Calcular estadísticas
  const activeMundos = mundos.filter(mundo => mundo.is_active).length;
  const inactiveMundos = mundos.filter(mundo => !mundo.is_active).length;

  // Handlers para paginación, ordenamiento y filtrado
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset a la primera página al cambiar tamaño
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // Toggle direction
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortBy(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: event.target.value });
    setPage(0); // Reset a la primera página al cambiar filtro
  };

  const handleStatusFilterChange = (event: any) => {
    const value = event.target.value;
    setFilters({ 
      ...filters, 
      is_active: value === 'all' ? undefined : value === 'active' 
    });
    setPage(0);
  };

  // Handlers
  const handleEditClick = (mundo: Mundo) => {
    setMundoToEdit(mundo);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (mundo: Mundo) => {
    setMundoToDelete(mundo);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setMundoToEdit(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setMundoToDelete(null);
  };

  // Define column configuration for the mundos table
  const mundoColumns: ColumnDefinition<Mundo>[] = [
    {
      header: t('table_header_name'),
      field: 'name',
      width: '25%',
      sortField: 'name',
      render: (mundo) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorldIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {mundo.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {mundo.id.slice(0, 8)}...
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      header: t('table_header_description'),
      field: 'description',
      width: '30%',
      render: (mundo) => (
        <Tooltip title={mundo.description || '-'}>
          <Typography 
            noWrap 
            sx={{ 
              maxWidth: '200px',
              color: mundo.description ? 'text.primary' : 'text.secondary',
              fontStyle: mundo.description ? 'normal' : 'italic'
            }}
          >
            {mundo.description || 'Sin descripción'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      header: t('table_header_status'),
      field: 'is_active',
      width: '15%',
      align: 'center',
      sortField: 'is_active',
      render: (mundo) => (
        <Chip
          label={mundo.is_active ? t('mundo_status_active') : t('mundo_status_inactive')}
          color={mundo.is_active ? 'success' : 'error'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      header: t('table_header_created_at'),
      field: 'created_at',
      width: '15%',
      sortField: 'created_at',
      render: (mundo) => {
        try {
          return (
            <Box>
              <Typography variant="body2">
                {mundo.created_at && mundo.created_at !== 'null'
                  ? format(new Date(mundo.created_at), 'dd/MM/yyyy', { locale: es })
                  : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {mundo.created_at && mundo.created_at !== 'null'
                  ? format(new Date(mundo.created_at), 'HH:mm', { locale: es })
                  : ''}
              </Typography>
            </Box>
          );
        } catch (error) {
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        }
      },
    },
    {
      header: t('table_header_actions'),
      width: '15%',
      align: 'center',
      render: (mundo) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implementar vista de detalles
                console.log('Ver detalles:', mundo);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={canManageMundos ? t('tooltip_edit_mundo') : t('tooltip_no_permission_edit_mundos')}>
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(mundo);
                }}
                disabled={!canManageMundos}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={canManageMundos ? t('tooltip_delete_mundo') : t('tooltip_no_permission_delete_mundos')}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(mundo);
                }}
                disabled={!canManageMundos}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Handlers
  const handleRowClick = (mundo: Mundo) => {
    // Navegar o mostrar detalles del mundo si es necesario
    console.log('Row clicked:', mundo);
  };

  const handleCreateMundo = (data: CreateMundoData) => {
    createMundoMutation(data);
    setIsCreateMundoDialogOpen(false); // Close dialog on mutate call
  };

  const handleUpdateMundo = (data: UpdateMundoData) => {
    if (mundoToEdit) {
      updateMundoMutation({ id: mundoToEdit.id, data });
      handleCloseEditDialog(); // Close dialog on mutate call
    } else {
      toast.error(t('error_no_mundo_to_edit'));
    }
  };

  const handleConfirmDelete = () => {
    if (mundoToDelete) {
      deleteMundoMutation(mundoToDelete.id);
      handleCloseDeleteDialog(); // Close dialog on mutate call
    } else {
      toast.error(t('error_no_mundo_to_delete'));
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorldIcon color="primary" />
          {t('mundos_management_title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Gestiona los mundos de tu plataforma de gamificación
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Mundos
                    </Typography>
                    <Typography variant="h4">
                      {totalCount}
                    </Typography>
                  </Box>
                  <WorldIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Mundos Activos
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {activeMundos}
                    </Typography>
                  </Box>
                  <Chip label="Activo" color="success" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Mundos Inactivos
                    </Typography>
                    <Typography variant="h4" color="error.main">
                      {inactiveMundos}
                    </Typography>
                  </Box>
                  <Chip label="Inactivo" color="error" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Tasa de Actividad
                    </Typography>
                    <Typography variant="h4" color="info.main">
                      {totalCount > 0 ? Math.round((activeMundos / totalCount) * 100) : 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    bgcolor: 'info.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="caption" color="info.contrastText" fontWeight="bold">
                      %
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Controls Section */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
            {/* Create Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateMundoDialogOpen(true)}
              disabled={!canManageMundos}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: { xs: '100%', md: 'auto' },
              }}
            >
              {t('create_new_mundo_button')}
            </Button>

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ minWidth: { xs: '100%', md: 'auto' } }}>
              <TextField
                label={t('search_by_name_placeholder')}
                variant="outlined"
                size="small"
                value={filters.name}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: '250px' }}
              />
              <FormControl size="small" sx={{ minWidth: '150px' }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.is_active === undefined ? 'all' : filters.is_active ? 'active' : 'inactive'}
                  onChange={handleStatusFilterChange}
                  label="Estado"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="active">Activos</MenuItem>
                  <MenuItem value="inactive">Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Card>
      </Box>

      {/* Data Table */}
      <DataTable
        columns={mundoColumns}
        data={mundos}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortChange={handleSortChange}
        loading={isLoading}
        error={error}
        onRowClick={handleRowClick}
        emptyMessage={t('empty_mundos_table_message')}
      />

      {/* Create Mundo Dialog */}
      <Dialog open={isCreateMundoDialogOpen} onClose={() => setIsCreateMundoDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('create_new_mundo_button')}</DialogTitle>
        <MundoForm
          onSubmit={handleCreateMundo}
          onCancel={() => setIsCreateMundoDialogOpen(false)}
          isLoading={isCreating}
        />
      </Dialog>

      {/* Edit Mundo Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('tooltip_edit_mundo')}</DialogTitle>
        {mundoToEdit && (
          <MundoForm
            initialData={mundoToEdit}
            onSubmit={handleUpdateMundo}
            onCancel={handleCloseEditDialog}
            isLoading={isUpdating}
          />
        )}
      </Dialog>

      {/* Delete Mundo Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title={t('dialog_title_confirm_deletion')}
        message={t('dialog_confirm_delete_mundo_message', { name: mundoToDelete?.name })}
        isLoading={isDeleting}
        confirmButtonText={t('button_delete')}
        cancelButtonText={t('button_cancel')}
      />
    </Container>
  );
}; 