export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  playlistId: string;
  itemTypeId: string;
  content: string;
  order?: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}

export interface ItemType {
  id: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateContentItemData = {
  title: string;
  description?: string;
  playlistId: string;
  itemTypeId: string;
  content: string;
  order?: number;
  isActive?: boolean;
};

export type UpdateContentItemData = {
  title?: string;
  description?: string;
  playlistId?: string;
  itemTypeId?: string;
  content?: string;
  order?: number;
  isActive?: boolean;
};

export interface FetchContentItemsParams {
  page: number; // 0-indexed
  pageSize: number;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    title?: string;
    playlistId?: string;
    itemTypeId?: string;
    isActive?: boolean;
  };
} 