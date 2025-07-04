import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  alpha,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

export const MarketplaceMobileHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1, position: 'relative', mr: 1 }}>
          <Box
            sx={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'text.disabled',
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Buscar productos y servicios..."
            sx={{
              pl: '40px',
              width: '100%',
              py: 0.5,
              borderRadius: '20px',
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.1),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.15),
              },
            }}
          />
        </Box>

        <IconButton
          sx={{ color: 'text.secondary', mr: 0.5 }}
          onClick={() => handleNavigate('/marketplace/dashboard')}
        >
          <DashboardIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MarketplaceMobileHeader;
