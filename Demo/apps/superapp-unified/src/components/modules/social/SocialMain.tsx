import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { SocialWelcomeHeader } from './components/enhanced';
import SocialTabs from './components/SocialTabs';
import TabContent from './components/TabContent';
import { mockUserStats } from './utils/mockData';


const SocialMain: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <SocialWelcomeHeader
            userName={(user?.fullName ?? '').split(' ')[0] || 'Coompanero'}
            userLevel={mockUserStats.socialLevel}
            isBackendConnected={true}
            notificationCount={5}
            onNotificationClick={() => console.log('notif click')}
            onSettingsClick={() => console.log('settings click')}
          />
        </Box>

        <SocialTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <TabContent activeTab={activeTab} />

      </Container>
    </Box>
  );
};

export default SocialMain;
