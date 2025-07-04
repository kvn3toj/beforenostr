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
} from '@mui/material';
import {
  School as SchoolIcon,
  Store as StoreIcon,
  Group as GroupIcon,
  PlayArrow as PlayIcon,
  AccountBalanceWallet as WalletIcon,
  Terminal as TerminalIcon,
  HelpOutline,
} from '@mui/icons-material';
import { useDiscoveryTutorial } from './DiscoveryTutorialProvider';

const TUTORIAL_ICONS: Record<string, React.ReactElement> = {
  'console-discovery': <TerminalIcon fontSize="small" />,
  'marketplace-discovery': <StoreIcon fontSize="small" />,
  'social-discovery': <GroupIcon fontSize="small" />,
  'uplay-discovery': <PlayIcon fontSize="small" />,
  'wallet-discovery': <WalletIcon fontSize="small" />,
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
        <Fab
          color="secondary"
          aria-label="tutoriales"
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1050,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
            },
          }}
        >
          <HelpOutline />
        </Fab>
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
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: -1,
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            minWidth: 320,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
            🎓 Tutoriales Discovery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aprende CoomÜnity paso a paso.
          </Typography>
        </Box>

        {availableTutorials.map((tutorial) => (
          <MenuItem
            key={tutorial.id}
            onClick={() => handleTutorialStart(tutorial.id)}
            sx={{
              py: 1.5,
              px: 2,
              alignItems: 'flex-start',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#f8fafc',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: 'text.secondary' }}>
              {TUTORIAL_ICONS[tutorial.id] || <SchoolIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {tutorial.title}
                </Typography>
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {tutorial.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={tutorial.difficulty}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        borderRadius: '6px',
                      }}
                      color={tutorial.difficulty === 'beginner' ? 'success' :
                             tutorial.difficulty === 'intermediate' ? 'warning' : 'error'}
                      variant="filled"
                    />
                    <Chip
                      label={tutorial.estimatedTime}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        borderRadius: '6px',
                        borderColor: '#e2e8f0',
                        color: 'text.secondary',
                      }}
                    />
                  </Box>
                </>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TutorialFloatingButton;
