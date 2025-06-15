import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { MoreVert, Refresh, Settings, Fullscreen, Close } from '@mui/icons-material';

export interface DashboardWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  loading?: boolean;
  error?: string;
  refreshable?: boolean;
  configurable?: boolean;
  removable?: boolean;
  fullscreenable?: boolean;
}

export interface DashboardProps {
  widgets: DashboardWidget[];
  onRefresh?: (widgetId: string) => void;
  onConfigure?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
  onFullscreen?: (widgetId: string) => void;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  widgets,
  onRefresh,
  onConfigure,
  onRemove,
  onFullscreen,
  loading = false,
  title,
  subtitle,
  actions,
  sx,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, widgetId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedWidget(widgetId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedWidget(null);
  };

  const handleMenuAction = (action: string) => {
    if (!selectedWidget) return;

    switch (action) {
      case 'refresh':
        onRefresh?.(selectedWidget);
        break;
      case 'configure':
        onConfigure?.(selectedWidget);
        break;
      case 'fullscreen':
        onFullscreen?.(selectedWidget);
        break;
      case 'remove':
        onRemove?.(selectedWidget);
        break;
    }
    handleMenuClose();
  };

  const renderWidgetActions = (widget: DashboardWidget) => {
    const hasActions = widget.refreshable || widget.configurable || widget.removable || widget.fullscreenable;
    
    if (!hasActions) return null;

    return (
      <IconButton
        size="small"
        onClick={(e) => handleMenuOpen(e, widget.id)}
        sx={{ color: 'text.secondary' }}
      >
        <MoreVert />
      </IconButton>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    const { component: Component, props = {}, loading: widgetLoading, error } = widget;

    if (widgetLoading || loading) {
      return (
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={120} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" variant="outlined">
            <Typography variant="body2">
              Error al cargar el widget: {error}
            </Typography>
          </Alert>
        </Box>
      );
    }

    return <Component {...props} />;
  };

  return (
    <Box sx={sx}>
      {/* Header */}
      {(title || subtitle || actions) && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            {title && (
              <Typography variant="h4" component="h1" gutterBottom>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Widgets Grid */}
      <Grid container spacing={3}>
        {widgets.map((widget) => (
          <Grid
            item
            key={widget.id}
            xs={widget.gridProps?.xs || 12}
            sm={widget.gridProps?.sm || 6}
            md={widget.gridProps?.md || 4}
            lg={widget.gridProps?.lg || 3}
            xl={widget.gridProps?.xl || 3}
          >
            <Paper
              elevation={1}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Widget Header */}
              <Box
                sx={{
                  p: 2,
                  pb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" component="h3" noWrap>
                  {widget.title}
                </Typography>
                {renderWidgetActions(widget)}
              </Box>

              {/* Widget Content */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {renderWidget(widget)}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Widget Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedWidget && widgets.find(w => w.id === selectedWidget)?.refreshable && (
          <MenuItem onClick={() => handleMenuAction('refresh')}>
            <Refresh sx={{ mr: 1 }} fontSize="small" />
            Actualizar
          </MenuItem>
        )}
        {selectedWidget && widgets.find(w => w.id === selectedWidget)?.fullscreenable && (
          <MenuItem onClick={() => handleMenuAction('fullscreen')}>
            <Fullscreen sx={{ mr: 1 }} fontSize="small" />
            Pantalla completa
          </MenuItem>
        )}
        {selectedWidget && widgets.find(w => w.id === selectedWidget)?.configurable && (
          <MenuItem onClick={() => handleMenuAction('configure')}>
            <Settings sx={{ mr: 1 }} fontSize="small" />
            Configurar
          </MenuItem>
        )}
        {selectedWidget && widgets.find(w => w.id === selectedWidget)?.removable && [
          <Divider key="divider" />,
          <MenuItem key="remove" onClick={() => handleMenuAction('remove')} sx={{ color: 'error.main' }}>
            <Close sx={{ mr: 1 }} fontSize="small" />
            Remover
          </MenuItem>
        ]}
      </Menu>

      {/* Empty State */}
      {widgets.length === 0 && !loading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay widgets configurados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega widgets para comenzar a visualizar información del sistema
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 