import { apiService } from './api.service';
import { 
  ContentItem, 
  ItemType, 
  CreateContentItemData, 
  UpdateContentItemData, 
  FetchContentItemsParams 
} from '../types/contentItem.types';

// Configuración de URLs base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';
const CONTENT_ITEMS_ENDPOINT = `${API_BASE_URL}/content/items`;
const ITEM_TYPES_ENDPOINT = `${API_BASE_URL}/content/item-types`;

// ===== CONTENT ITEMS CRUD =====

export const fetchContentItems = async (params: FetchContentItemsParams): Promise<{ data: ContentItem[]; count: number }> => {
  try {
    // Temporarily use the test endpoint that works without authentication
    const response = await apiService.get<{ status: string; itemCount: number; items: any[] }>('/content/items/test');
    
    if (response.status === 'ok') {
      const allItems = normalizeContentItems(response.items);
      
      // Apply filters
      let filteredItems = allItems;
      
      if (params.filters.title) {
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(params.filters.title!.toLowerCase())
        );
      }
      
      if (params.filters.playlistId) {
        filteredItems = filteredItems.filter(item => 
          item.playlistId === params.filters.playlistId
        );
      }
      
      if (params.filters.itemTypeId) {
        filteredItems = filteredItems.filter(item => 
          item.itemTypeId === params.filters.itemTypeId
        );
      }
      
      if (params.filters.isActive !== undefined) {
        filteredItems = filteredItems.filter(item => 
          item.isActive === params.filters.isActive
        );
      }
      
      // Apply sorting
      if (params.sortBy) {
        filteredItems.sort((a, b) => {
          const aValue = (a as any)[params.sortBy!];
          const bValue = (b as any)[params.sortBy!];
          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return params.sortDirection === 'desc' ? -comparison : comparison;
        });
      }
      
      // Apply pagination
      const startIndex = params.page * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);
      
      return {
        data: paginatedItems,
        count: filteredItems.length
      };
    } else {
      throw new Error('Backend returned error status');
    }
  } catch (error) {
    console.error('Error fetching content items:', error);
    throw error;
  }
};

export const fetchContentItemsByPlaylist = async (playlistId: string, includeInactive = false): Promise<ContentItem[]> => {
  try {
    const endpoint = includeInactive 
      ? `/content/playlists/${playlistId}/items/admin`
      : `/content/playlists/${playlistId}/items`;
    
    const itemsRaw = await apiService.get<any[]>(endpoint);
    return normalizeContentItems(itemsRaw);
  } catch (error) {
    console.error('Error fetching content items by playlist:', error);
    throw error;
  }
};

export const fetchContentItemById = async (id: string): Promise<ContentItem> => {
  try {
    const itemRaw = await apiService.get<any>(`/content/items/${id}`);
    return normalizeContentItem(itemRaw);
  } catch (error) {
    console.error('Error fetching content item by ID:', error);
    throw error;
  }
};

export const createContentItem = async (playlistId: string, data: CreateContentItemData): Promise<ContentItem> => {
  try {
    const itemRaw = await apiService.post<any>(`/content/playlists/${playlistId}/items`, {
      ...data,
      playlistId, // Asegurar que el playlistId esté incluido
    });
    return normalizeContentItem(itemRaw);
  } catch (error) {
    console.error('Error creating content item:', error);
    throw error;
  }
};

export const updateContentItem = async (id: string, data: UpdateContentItemData): Promise<ContentItem> => {
  try {
    const itemRaw = await apiService.put<any>(`/content/items/${id}`, data);
    return normalizeContentItem(itemRaw);
  } catch (error) {
    console.error('Error updating content item:', error);
    throw error;
  }
};

export const deleteContentItem = async (id: string): Promise<void> => {
  try {
    await apiService.delete<void>(`/content/items/${id}`);
  } catch (error) {
    console.error('Error deleting content item:', error);
    throw error;
  }
};

// ===== ITEM TYPES =====

export const fetchItemTypes = async (): Promise<ItemType[]> => {
  try {
    const itemTypesRaw = await apiService.get<any[]>('/content/item-types');
    return normalizeItemTypes(itemTypesRaw);
  } catch (error) {
    console.error('Error fetching item types:', error);
    throw error;
  }
};

export const fetchItemTypeById = async (id: string): Promise<ItemType> => {
  try {
    const itemTypeRaw = await apiService.get<any>(`/content/item-types/${id}`);
    return normalizeItemType(itemTypeRaw);
  } catch (error) {
    console.error('Error fetching item type by ID:', error);
    throw error;
  }
};

// ===== UTILITY FUNCTIONS =====

// Función auxiliar para normalizar content items del backend
const normalizeContentItem = (item: any): ContentItem => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    playlistId: item.playlistId,
    itemTypeId: item.itemTypeId,
    content: item.content,
    order: item.order,
    isActive: item.isActive ?? true,
    isDeleted: item.isDeleted ?? false,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdById: item.createdById,
  };
};

// Función auxiliar para normalizar array de content items
const normalizeContentItems = (items: any[]): ContentItem[] => {
  return items.map(normalizeContentItem);
};

// Función auxiliar para normalizar item types del backend
const normalizeItemType = (itemType: any): ItemType => {
  return {
    id: itemType.id,
    name: itemType.name,
    description: itemType.description,
    isDeleted: itemType.isDeleted ?? false,
    createdAt: itemType.createdAt,
    updatedAt: itemType.updatedAt,
  };
};

// Función auxiliar para normalizar array de item types
const normalizeItemTypes = (itemTypes: any[]): ItemType[] => {
  return itemTypes.map(normalizeItemType);
}; 