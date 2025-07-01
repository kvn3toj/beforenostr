export const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  CONTENT_ADMIN: 'Content Admin',
  USER: 'User',
  EDITOR: 'Editor',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];