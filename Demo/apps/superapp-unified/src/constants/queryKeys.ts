/**
 * 🔑 Query Keys - Constantes para React Query
 */

export const QUERY_KEYS = {
  // Users
  USERS: 'users',
  USER: (id: string) => ['user', id],
  CURRENT_USER: 'currentUser',
  USER_ROLES: (userId: string) => ['userRoles', userId],

  // Roles & Permissions
  ROLES: 'roles',
  ROLE: (id: string) => ['role', id],
  PERMISSIONS: 'permissions',
  AVAILABLE_PERMISSIONS: 'availablePermissions',

  // Content
  CONTENT_ITEMS: 'contentItems',
  CONTENT_ITEM: (id: string) => ['contentItem', id],

  // Videos
  VIDEOS: 'videos',
  VIDEO: (id: string) => ['video', id],
  VIDEO_PERMISSIONS: (videoId: string) => ['videoPermissions', videoId],

  // Playlists
  PLAYLISTS: 'playlists',
  PLAYLIST: (id: string) => ['playlist', id],
  PLAYLIST_ITEMS: (playlistId: string) => ['playlistItems', playlistId],

  // Mundos
  MUNDOS: 'mundos',
  MUNDO: (id: string) => ['mundo', id],

  // Categories & Folders
  CATEGORIES: 'categories',
  CATEGORY: (id: string) => ['category', id],
  FOLDERS: 'folders',
  FOLDER: (id: string) => ['folder', id],

  // Analytics
  ANALYTICS: {
    USERS_OVER_TIME: 'analytics.usersOverTime',
    ACTIVE_USERS_OVER_TIME: 'analytics.activeUsersOverTime',
    TOTAL_USERS: 'analytics.totalUsers',
    TOTAL_MUNDOS: 'analytics.totalMundos',
    TOTAL_PLAYLISTS: 'analytics.totalPlaylists',
    TOP_VIEWED_MUNDOS: 'analytics.topViewedMundos',
    TOP_VIEWED_PLAYLISTS: 'analytics.topViewedPlaylists',
    LEAST_VIEWED_MUNDOS: 'analytics.leastViewedMundos',
    LEAST_VIEWED_PLAYLISTS: 'analytics.leastViewedPlaylists',
    TOP_INTERACTED_CONTENT: 'analytics.topInteractedContent',
    LEAST_INTERACTED_MUNDOS: 'analytics.leastInteractedMundos',
    LEAST_INTERACTED_PLAYLISTS: 'analytics.leastInteractedPlaylists',
    MUNDOS_CREATED_OVER_TIME: 'analytics.mundosCreatedOverTime',
    PLAYLISTS_CREATED_OVER_TIME: 'analytics.playlistsCreatedOverTime',
    USERS_CREATED_OVER_TIME: 'analytics.usersCreatedOverTime',
  },

  // Questions
  QUESTIONS: 'questions',
  QUESTION: (id: string) => ['question', id],

  // Challenges
  CHALLENGES: 'challenges',
  CHALLENGE: (id: string) => ['challenge', id],
  USER_CHALLENGES: (userId: string) => ['userChallenges', userId],

  // Social
  SOCIAL_FEED: 'socialFeed',
  SOCIAL_POST: (id: string) => ['socialPost', id],
  USER_POSTS: (userId: string) => ['userPosts', userId],

  // Notifications
  NOTIFICATIONS: 'notifications',
  UNREAD_NOTIFICATIONS: 'unreadNotifications',
  USER_NOTIFICATIONS: (userId: string) => ['userNotifications', userId],

  // Marketplace
  MARKETPLACE_PRODUCTS: 'marketplaceProducts',
  MARKETPLACE_PRODUCT: (id: string) => ['marketplaceProduct', id],
  MARKETPLACE_CATEGORIES: 'marketplaceCategories',

  // Wallet & Economics
  WALLET: 'wallet',
  USER_WALLET: (userId: string) => ['userWallet', userId],
  TRANSACTIONS: 'transactions',
  USER_TRANSACTIONS: (userId: string) => ['userTransactions', userId],

  // LETS Integration
  LETS: {
    TRUST_RATINGS: 'lets.trustRatings',
    KNOWLEDGE_EXCHANGES: 'lets.knowledgeExchanges',
    NOTIFICATIONS: 'lets.notifications',
    USER_PROFILE: (userId: string) => ['lets.userProfile', userId],
  },
} as const; 