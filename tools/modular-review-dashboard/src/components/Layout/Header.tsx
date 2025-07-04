import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  MoreVert as MoreIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';

type StatusType = 'healthy' | 'warning' | 'critical';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    // TODO: Implementar refresh de datos
    console.log('Refreshing data...');
  };

  const handleRunReview = () => {
    // TODO: Implementar ejecución de nuevo review
    console.log('Running new review...');
  };

  const handleDownloadReport = () => {
    // TODO: Implementar descarga de reporte
    console.log('Downloading report...');
  };

  // Mock data - esto vendría de un hook de datos reales
  const lastUpdate = new Date().toLocaleString();
  const totalIssues = 42;
  const criticalIssues = 3;
  const status: StatusType = 'healthy';

  const getStatusColor = (
    statusValue: StatusType
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (statusValue) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (statusValue: StatusType): string => {
    switch (statusValue) {
      case 'healthy':
        return 'Saludable';
      case 'warning':
        return 'Atención';
      case 'critical':
        return 'Crítico';
      default:
        return 'Desconocido';
    }
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Current status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div" fontWeight={600}>
            Dashboard de Revisión de Código
          </Typography>

          <Chip
            label={getStatusText(status)}
            color={getStatusColor(status)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Center - Statistics */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" fontWeight={600}>
              {totalIssues}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Issues Totales
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              fontWeight={600}
              color={criticalIssues > 0 ? 'error.main' : 'text.primary'}
            >
              {criticalIssues}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Críticos
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={500}>
              Última actualización
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lastUpdate}
            </Typography>
          </Box>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RunIcon />}
            onClick={handleRunReview}
            size="small"
          >
            Ejecutar Review
          </Button>

          <IconButton onClick={handleRefresh} size="small">
            <RefreshIcon />
          </IconButton>

          <IconButton onClick={handleDownloadReport} size="small">
            <DownloadIcon />
          </IconButton>

          <IconButton onClick={handleMenuOpen} size="small">
            <MoreIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              Ver historial completo
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Exportar datos</MenuItem>
            <MenuItem onClick={handleMenuClose}>Configurar alertas</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
