import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Avatar,
  Card,
  CardContent,
  Fade,
  Skeleton,
  useTheme,
  alpha,
  Checkbox,
  Toolbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  VideoLibrary as VideoIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
  IndeterminateCheckBox as IndeterminateCheckBoxIcon,
  MoreVert as MoreVertIcon,
  SelectAll as SelectAllIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContentItemsQuery } from '../hooks/features/content/useContentItemsQuery';
import { useDeleteContentItemMutation, useBulkDeleteContentItemsMutation } from '../hooks/features/content/useDeleteContentItemMutation';
import { DeleteConfirmDialog } from '../components/common/DeleteConfirmDialog';
import { ContentItem } from '../types/contentItem.types';
import { getVideoThumbnail } from '../utils/videoUtils';

export const ItemsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  
  console.log('>>> ItemsPage: Component rendering');

  // Estado para paginación y eliminación
  const [page] = useState(0);
  const [pageSize] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  // Estado para selección múltiple
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkActionsAnchor, setBulkActionsAnchor] = useState<null | HTMLElement>(null);

  // Query para obtener content items
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useContentItemsQuery({
    page,
    pageSize,
    sortBy: 'title',
    sortDirection: 'asc',
    filters: {}
  });

  // Mutación para eliminar items
  const deleteItemMutation = useDeleteContentItemMutation();
  const bulkDeleteMutation = useBulkDeleteContentItemsMutation();

  console.log('>>> ItemsPage: useContentItemsQuery status:', { 
    isLoading, 
    isError, 
    data, 
    error: error?.message || error 
  });

  // Función helper para formatear duración
  const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return '-';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Funciones de selección múltiple
  const handleToggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedItems(new Set());
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    const items = data?.data || [];
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleBulkActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setBulkActionsAnchor(event.currentTarget);
  };

  const handleBulkActionsClose = () => {
    setBulkActionsAnchor(null);
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedItems);
    console.log('Bulk delete:', idsToDelete);
    
    try {
      await bulkDeleteMutation.mutateAsync(idsToDelete);
      setSelectedItems(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error('Error in bulk delete:', error);
    }
    
    handleBulkActionsClose();
  };

  const handleEditItem = (itemId: string) => {
    console.log('>>> ItemsPage: Navigating to edit item:', itemId);
    navigate(`/items/${itemId}/config`);
  };

  const handleDeleteItem = (item: ContentItem) => {
    console.log('>>> ItemsPage: Delete item requested:', item.id);
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteItemMutation.mutateAsync(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCreateItem = () => {
    console.log('>>> ItemsPage: Create new item requested');
    // TODO: Implementar creación
  };

  const handleViewItem = (itemId: string) => {
    console.log('>>> ItemsPage: View item requested:', itemId);
    // TODO: Implementar vista previa
  };

  // Componente de loading mejorado
  const LoadingSkeleton = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
      </Box>
      <Paper sx={{ p: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="rectangular" width={100} height={56} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );

  if (isLoading) {
    console.log('>>> ItemsPage: Loading state');
    return <LoadingSkeleton />;
  }

  if (isError) {
    console.error('>>> ItemsPage: Error loading content items:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('error_loading_items', 'Error loading content items')}
          </Typography>
          <Typography variant="body2">
            {error?.message || t('unknown_error', 'Unknown error occurred')}
          </Typography>
        </Alert>
      </Box>
    );
  }

  console.log('>>> ItemsPage: Data loaded:', data);
  console.log('>>> ItemsPage: Number of items:', data?.data?.length);

  const items = data?.data || [];
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < items.length;
  const isAllSelected = selectedItems.size === items.length && items.length > 0;

  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 3 }}>
        {/* Header minimalista */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              {t('content_items_management_title', 'Content Items Management')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('manage_video_content', 'Manage your video content and learning materials')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!selectionMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<SelectAllIcon />}
                  onClick={handleToggleSelectionMode}
                  sx={{ borderRadius: 1 }}
                >
                  {t('select', 'Select')}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateItem}
                  sx={{ borderRadius: 1 }}
                >
                  {t('create_new_item', 'Create New Item')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleToggleSelectionMode}
                  sx={{ borderRadius: 1 }}
                >
                  {t('cancel', 'Cancel')}
                </Button>
                {selectedItems.size > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<MoreVertIcon />}
                    onClick={handleBulkActionsClick}
                    disabled={bulkDeleteMutation.isPending}
                    sx={{ borderRadius: 1 }}
                  >
                    {bulkDeleteMutation.isPending ? (
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                    ) : null}
                    {t('actions', 'Actions')} ({selectedItems.size})
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>

        {/* Estadísticas simples */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VideoIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              <strong>{items.length}</strong> {t('total_items', 'Total Items')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              <strong>{formatDuration(items.reduce((total, item) => total + (item.duration || 0), 0))}</strong> {t('total_duration', 'Total Duration')}
            </Typography>
          </Box>
        </Box>

        {/* Tabla minimalista */}
        <Paper sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {selectionMode && (
                    <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper' }}>
                      <Checkbox
                        indeterminate={isIndeterminate}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        indeterminateIcon={<IndeterminateCheckBoxIcon />}
                      />
                    </TableCell>
                  )}
                  <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('content', 'Content')}
                  </TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('playlist', 'Playlist')}
                  </TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('type', 'Type')}
                  </TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('duration', 'Duration')}
                  </TableCell>
                  <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('status', 'Status')}
                  </TableCell>
                  <TableCell align="center" sx={{ bgcolor: 'background.paper', fontWeight: 600 }}>
                    {t('actions', 'Actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={selectionMode ? 7 : 6} align="center" sx={{ py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <VideoIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                          {t('no_items_found', 'No content items found')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('create_first_item', 'Create your first content item to get started')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) :
                  items.map((item: ContentItem) => {
                    const thumbnailUrl = getVideoThumbnail(item.content, 'medium');
                    const isSelected = selectedItems.has(item.id);
                    
                    return (
                      <TableRow 
                        key={item.id} 
                        hover
                        selected={isSelected}
                        sx={{
                          '&:hover': {
                            bgcolor: alpha(theme.palette.action.hover, 0.5),
                          }
                        }}
                      >
                        {selectionMode && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelectItem(item.id)}
                              icon={<CheckBoxOutlineBlankIcon />}
                              checkedIcon={<CheckBoxIcon />}
                            />
                          </TableCell>
                        )}

                        {/* Contenido con thumbnail y título */}
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 80,
                                height: 45,
                                borderRadius: 1,
                                overflow: 'hidden',
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                              }}
                            >
                              {thumbnailUrl ? (
                                <>
                                  <Avatar
                                    src={thumbnailUrl}
                                    variant="rectangular"
                                    sx={{ width: '100%', height: '100%' }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <PlayIcon sx={{ color: 'white', fontSize: 12 }} />
                                  </Box>
                                </>
                              ) : (
                                <VideoIcon sx={{ fontSize: 20, color: 'text.disabled' }} />
                              )}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  mb: 0.5
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {item.description || t('no_description', 'No description available')}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Playlist */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.playlistId}
                          </Typography>
                        </TableCell>

                        {/* Tipo */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item.itemTypeId}
                          </Typography>
                        </TableCell>

                        {/* Duración */}
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              color: 'text.primary'
                            }}
                          >
                            {formatDuration(item.duration)}
                          </Typography>
                        </TableCell>

                        {/* Estado */}
                        <TableCell>
                          <Chip
                            label={item.isActive ? t('active', 'Active') : t('inactive', 'Inactive')}
                            color={item.isActive ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </TableCell>

                        {/* Acciones */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title={t('view', 'View')}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewItem(item.id)}
                                sx={{ color: 'text.secondary' }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('edit', 'Edit')}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditItem(item.id)}
                                sx={{ color: 'text.secondary' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('delete', 'Delete')}>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteItem(item)}
                                sx={{ color: 'text.secondary' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Menu de acciones masivas */}
        <Menu
          anchorEl={bulkActionsAnchor}
          open={Boolean(bulkActionsAnchor)}
          onClose={handleBulkActionsClose}
        >
          <MenuItem onClick={handleBulkDelete} disabled={bulkDeleteMutation.isPending}>
            <ListItemIcon>
              {bulkDeleteMutation.isPending ? (
                <CircularProgress size={16} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {bulkDeleteMutation.isPending 
                ? t('deleting', 'Deleting...')
                : `${t('delete_selected', 'Delete Selected')} (${selectedItems.size})`
              }
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Información de depuración simple */}
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            {t('debug_info', 'Debug Info')}: {items.length} {t('items_loaded', 'items loaded')}
            {selectionMode && selectedItems.size > 0 && (
              <> • {selectedItems.size} {t('selected', 'selected')}</>
            )}
          </Typography>
        </Box>

        {/* Diálogo de confirmación de eliminación */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          title={t('confirm_delete_item', 'Confirm Item Deletion')}
          message={t('confirm_delete_item_message', 'Are you sure you want to delete this content item? This action cannot be undone and will remove all associated data.')}
          itemName={itemToDelete?.title}
          isLoading={deleteItemMutation.isPending}
        />
      </Box>
    </Fade>
  );
}; 