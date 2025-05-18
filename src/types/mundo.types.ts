export interface Mundo {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  published_at: string | null;
  unpublished_at: string | null;
  version: number; // Current version number
}

export interface MundoVersion {
  id: string;
  mundo_id: string;
  version: number;
  timestamp: string;
  changed_by_user_id: string;
  // Mundo fields at this version
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  published_at: string | null;
  unpublished_at: string | null;
}

export interface MundoVersionDiff {
  field: keyof Mundo;
  oldValue: any;
  newValue: any;
}

export interface CreateMundoData {
  name: string;
  description?: string;
  thumbnail_url?: string;
  is_active?: boolean;
  published_at?: string | null;
  unpublished_at?: string | null;
}

export interface UpdateMundoData {
  name?: string;
  description?: string;
  thumbnail_url?: string;
  is_active?: boolean;
  published_at?: string | null;
  unpublished_at?: string | null;
} 