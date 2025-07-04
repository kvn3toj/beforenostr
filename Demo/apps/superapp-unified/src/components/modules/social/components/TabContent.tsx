import React from 'react';
import { Box, Grid } from '@mui/material';
import {
  ReciprocidadSocialMetrics,
  CommunityFeed,
  ConnectionsManager,
  CollaborationHub,
} from './enhanced';
import ElegantPostCard from './ElegantPostCard';
import { mockPosts, mockUserStats, mockCommunityMetrics, Post } from '../utils/mockData';

interface TabContentProps {
  activeTab: number;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  // En una implementación real, los datos se pasarían como props
  // o se obtendrían a través de hooks de React Query dentro de cada componente.
  const communityFeedPosts = mockPosts;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {communityFeedPosts.map((post: Post) => (
                  <ElegantPostCard key={post.id} post={post} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <ReciprocidadSocialMetrics
                userStats={mockUserStats}
                communityMetrics={mockCommunityMetrics}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <ConnectionsManager
            connections={[]}
            isLoading={false}
            isError={false}
            onRefresh={() => {}}
            userStats={mockUserStats}
          />
        );
      case 2:
        return (
            <CollaborationHub
                userStats={mockUserStats}
                isConnected={true}
                onCreateCircle={() => {}}
                onJoinCircle={() => {}}
            />
        );
      case 3:
        return (
          <ReciprocidadSocialMetrics
            userStats={mockUserStats}
            communityMetrics={mockCommunityMetrics}
            detailed={true}
          />
        );
      default:
        return null;
    }
  };

  return <Box sx={{ mt: 4 }}>{renderTabContent()}</Box>;
};

export default TabContent;
