import ReciprocidadSocialMetrics from './ReciprocidadSocialMetrics';
import { SocialWelcomeHeader } from './SocialWelcomeHeader';
import { CommunityFeed } from './CommunityFeed';
import { ConnectionsManager } from './ConnectionsManager';
import { SocialChatArea } from './SocialChatArea';
import { CollaborationHub } from './CollaborationHub';

// Re-exportar tipos desde la fuente única de verdad
export type {
  ReciprocidadSocialMetricsProps,
  UserStatsReciprocidad,
  CommunityMetrics,
  NotificationData
} from '@/types/reciprocidad.types';

export {
    ReciprocidadSocialMetrics,
    SocialWelcomeHeader,
    CommunityFeed,
    ConnectionsManager,
    SocialChatArea,
    CollaborationHub
};
