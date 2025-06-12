import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

// Import the enhanced mobile home component that has all the interactive features
import UPlayMobileHome from './UPlayMobileHome';

/**
 * UPlayMain Component
 *
 * Main entry point for the ÜPlay (GPL - Gamified Play List) module.
 * This component provides the interactive gamified video player experience
 * with questions, rewards, and user engagement tracking.
 *
 * Features:
 * - Interactive video player with timed questions
 * - Ayni-based reward system (Mëritos and Öndas)
 * - User progress tracking and level progression
 * - Responsive design optimized for mobile and desktop
 * - Navigation to individual video player pages
 *
 * Philosophy Integration:
 * - Ayni: Balanced exchange through learning and engagement
 * - Bien Común: Educational content that benefits the community
 * - Öndas: Positive energy generated through correct answers
 * - Mëritos: Recognition for contributing to collective knowledge
 */
const UPlayMain: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ FIXED: Now properly using responsive design
  // The UPlayMobileHome component will adapt its layout based on device type
  // Desktop users get an enhanced layout with better spacing and organization
  return <UPlayMobileHome isDesktop={!isMobile} />;
};

export default UPlayMain;
