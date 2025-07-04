export interface Mundo {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  createdBy?: string | null;
  created_by?: string | null;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
  isActive: boolean;
  is_active?: boolean;
  publishedAt?: string | null;
  published_at?: string | null;
  unpublishedAt?: string | null;
  unpublished_at?: string | null;
  version?: number;
  slug?: string;
  orderInMundo?: number;
}

export interface MundoVersion {
  id: string;
  mundoId: string;
  mundo_id?: string;
  version: number;
  timestamp: string;
  changedByUserId: string;
  changed_by_user_id?: string;
  name: string;
  description: string | null;
  thumbnailUrl?: string | null;
  thumbnail_url?: string | null;
  isActive: boolean;
  is_active?: boolean;
  publishedAt?: string | null;
  published_at?: string | null;
  unpublishedAt?: string | null;
  unpublished_at?: string | null;
}

export interface MundoVersionDiff {
  field: keyof Mundo;
  oldValue: any;
  newValue: any;
}

export interface CreateMundoData {
  name: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  isActive?: boolean;
  is_active?: boolean;
  publishedAt?: string | null;
  published_at?: string | null;
  unpublishedAt?: string | null;
  unpublished_at?: string | null;
}

export interface UpdateMundoData {
  name?: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  isActive?: boolean;
  is_active?: boolean;
  publishedAt?: string | null;
  published_at?: string | null;
  unpublishedAt?: string | null;
  unpublished_at?: string | null;
  version?: number;
} 