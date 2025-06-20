import React, { useState } from 'react';
import {
  Fab,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  School as SchoolIcon,
  Store as StoreIcon,
  Group as GroupIcon,
  PlayArrow as PlayIcon,
  AccountBalanceWallet as WalletIcon,
  Terminal as TerminalIcon,
} from '@mui/icons-material';
import { useDiscoveryTutorial } from './DiscoveryTutorialProvider';

const TUTORIAL_ICONS = {
  'console-discovery': <TerminalIcon />,
  'marketplace-discovery': <StoreIcon />,
  'social-discovery': <GroupIcon />,
  'uplay-discovery': <PlayIcon />,
  'wallet-discovery': <WalletIcon />,
};

export const TutorialFloatingButton: React.FC = () => {
  const { startTutorial, availableTutorials } = useDiscoveryTutorial();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTutorialStart = (tutorialId: string) => {
    startTutorial(tutorialId);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Tutoriales Discovery" placement="left">
        <Zoom in timeout={1000}>
          <Fab
            color="primary"
            aria-label="tutoriales"
            onClick={handleClick}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              zIndex: 1000,
            }}
          >
            <SchoolIcon />
          </Fab>
        </Zoom>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            minWidth: 280,
          }
        }}
      >
        <Box sx={{ p: 1, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            🎓 Tutoriales Discovery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aprende CoomÜnity paso a paso
          </Typography>
        </Box>
        
        {availableTutorials.map((tutorial) => (
          <MenuItem
            key={tutorial.id}
            onClick={() => handleTutorialStart(tutorial.id)}
            sx={{ 
              py: 1.5, 
              px: 2,
              '&:hover': {
                background: 'rgba(33, 150, 243, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {TUTORIAL_ICONS[tutorial.id as keyof typeof TUTORIAL_ICONS] || <SchoolIcon />}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {tutorial.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tutorial.description}
              </Typography>
              <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5 }}>
                <Chip 
                  label={tutorial.difficulty} 
                  size="small" 
                  sx={{ fontSize: '0.65rem', height: 18 }}
                  color={tutorial.difficulty === 'beginner' ? 'success' : 
                         tutorial.difficulty === 'intermediate' ? 'warning' : 'error'}
                />
                <Chip 
                  label={tutorial.estimatedTime} 
                  size="small" 
                  sx={{ fontSize: '0.65rem', height: 18 }}
                  variant="outlined"
                />
              </Box>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TutorialFloatingButton;
