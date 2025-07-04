import React from 'react';
import { Paper, Tabs, Tab, useTheme } from '@mui/material';
import {
  People as PeopleIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

interface SocialTabsProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const SocialTabs: React.FC<SocialTabsProps> = ({ activeTab, onTabChange }) => {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        mb: 4,
        borderRadius: '16px',
        borderColor: theme.palette.divider,
        boxShadow: 'none',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            height: '3px',
            borderRadius: '2px',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            color: theme.palette.text.secondary,
          },
          '& .Mui-selected': {
            color: theme.palette.primary.main,
          },
        }}
      >
        <Tab icon={<PeopleIcon />} iconPosition="start" label="Círculo Sagrado" />
        <Tab icon={<ChatIcon />} iconPosition="start" label="Conexiones Conscientes" />
        <Tab icon={<GroupsIcon />} iconPosition="start" label="Colaboración Creativa" />
        <Tab icon={<TrendingIcon />} iconPosition="start" label="Métricas Reciprocidad" />
      </Tabs>
    </Paper>
  );
};

export default SocialTabs;
