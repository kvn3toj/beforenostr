export interface Playlist {
  id: string;
  mundo_id: string;
  name: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  published_at: string | null;
  unpublished_at: string | null;
  version: number; // Current version number
}

export interface PlaylistVersion {
  id: string;
  playlist_id: string;
  version: number;
  timestamp: string;
  changed_by_user_id: string;
  // Playlist fields at this version
  name: string;
  description?: string;
  mundo_id: string;
  order_index: number;
  is_active: boolean;
  published_at: string | null;
  unpublished_at: string | null;
}

export interface PlaylistVersionDiff {
  field: keyof Playlist;
  oldValue: any;
  newValue: any;
}

export type CreatePlaylistData = Pick<Playlist, 'name' | 'mundo_id' | 'published_at' | 'unpublished_at'> & {
  description?: string;
  is_active?: boolean;
};
export type UpdatePlaylistData = Pick<Playlist, 'name' | 'mundo_id' | 'published_at' | 'unpublished_at'> & {
  description?: string;
  is_active?: boolean;
}; 