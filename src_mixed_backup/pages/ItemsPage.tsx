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
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  VideoLibrary as VideoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContentItemsQuery } from '../hooks/features/content/useContentItemsQuery';
import { ContentItem } from '../types/contentItem.types';
import { getVideoThumbnail } from '../utils/videoUtils';

export const ItemsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  console.log('>>> ItemsPage: Component rendering');

  // Estado para paginación
  const [page] = useState(0);
  const [pageSize] = useState(10);

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

  console.log('>>> ItemsPage: useContentItemsQuery status:', { 
    isLoading, 
    isError, 
    data, 
    error: error?.message || error 
  });

  if (isLoading) {
    console.log('>>> ItemsPage: Loading state');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading content items...</Typography>
      </Box>
    );
  }

  if (isError) {
    console.error('>>> ItemsPage: Error loading content items:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading content items: {error?.message || 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  console.log('>>> ItemsPage: Data loaded:', data);
  console.log('>>> ItemsPage: Number of items:', data?.data?.length);

  const items = data?.data || [];

  const handleEditItem = (itemId: string) => {
    console.log('>>> ItemsPage: Navigating to edit item:', itemId);
    navigate(`/items/${itemId}/config`);
  };

  const handleDeleteItem = (itemId: string) => {
    console.log('>>> ItemsPage: Delete item requested:', itemId);
    // TODO: Implementar eliminación
  };

  const handleCreateItem = () => {
    console.log('>>> ItemsPage: Create new item requested');
    // TODO: Implementar creación
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('content_items_management_title', 'Content Items Management')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateItem}
        >
          {t('create_new_item', 'Create New Item')}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width="120px">{t('thumbnail', 'Thumbnail')}</TableCell>
                <TableCell>{t('title', 'Title')}</TableCell>
                <TableCell>{t('description', 'Description')}</TableCell>
                <TableCell>{t('playlist', 'Playlist')}</TableCell>
                <TableCell>{t('item_type', 'Item Type')}</TableCell>
                <TableCell>{t('status', 'Status')}</TableCell>
                <TableCell>{t('actions', 'Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {t('no_items_found', 'No content items found')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) :
                items.map((item: ContentItem) => {
                  const thumbnailUrl = getVideoThumbnail(item.content, 'medium');
                  
                  return (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            width: 100,
                            height: 56,
                            borderRadius: 1,
                            overflow: 'hidden',
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={`Thumbnail de ${item.title}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                // Fallback si la imagen no carga
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <Box
                            sx={{
                              display: thumbnailUrl ? 'none' : 'flex',
                              width: '100%',
                              height: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'text.secondary'
                            }}
                          >
                            <VideoIcon fontSize="large" />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.playlistId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.itemTypeId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.isActive ? t('active', 'Active') : t('inactive', 'Inactive')}
                          color={item.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title={t('configure', 'Configure')}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditItem(item.id)}
                            >
                              <SettingsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('edit', 'Edit')}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditItem(item.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('delete', 'Delete')}>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteItem(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
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

      {/* Información de depuración */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Debug Info: {items.length} items loaded, Total count: {data?.count || 0}
        </Typography>
      </Box>
    </Box>
  );
}; 