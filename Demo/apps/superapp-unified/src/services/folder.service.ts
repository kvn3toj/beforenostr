/**
 * 📁 Folder Service - Real Backend Integration
 * 
 * Servicio de carpetas que se conecta exclusivamente al backend NestJS real.
 * Implementa gestión completa de carpetas con datos reales.
 */

import { apiService } from './api.service';
import { PlaylistFolder } from '../types/folder.types';

export type CreateFolderData = {
  name: string;
  mundo_id: string;
};

/**
 * 📋 Obtener carpetas por mundo
 */
export const fetchFolders = async (mundoId: string): Promise<PlaylistFolder[]> => {
  try {
    console.log('📋 [FolderService] Fetching folders for mundo:', mundoId);
    
    const response = await apiService.get<PlaylistFolder[]>(`/folders?mundo_id=${mundoId}`);
    
    console.log('✅ [FolderService] Folders fetched successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to fetch folders:', error);
    
    if (error.statusCode === 404) {
      console.warn('🔄 [FolderService] No folders found for mundo, returning empty array');
      return [];
    }
    
    throw new Error(error.message || 'Error al cargar las carpetas');
  }
};

/**
 * ➕ Crear nueva carpeta
 */
export const createFolder = async (folderData: CreateFolderData, userId: string): Promise<PlaylistFolder> => {
  try {
    console.log('➕ [FolderService] Creating folder:', folderData, 'for user:', userId);

    const response = await apiService.post<PlaylistFolder>('/folders', {
      name: folderData.name,
      mundo_id: folderData.mundo_id,
      order_index: 0,
      is_pinned: false,
      is_deleted: false,
      created_by: userId
    });
    
    console.log('✅ [FolderService] Folder created successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to create folder:', error);
    
    if (error.statusCode === 409) {
      throw new Error('Ya existe una carpeta con ese nombre');
    } else if (error.statusCode === 400) {
      throw new Error('Datos de carpeta inválidos');
    }
    
    throw new Error(error.message || 'Error al crear la carpeta');
  }
};

/**
 * 📌 Actualizar estado de pin de carpeta
 */
export const updateFolderPinStatus = async (id: string, isPinned: boolean): Promise<PlaylistFolder> => {
  try {
    console.log('📌 [FolderService] Updating pin status:', id, isPinned);
    
    const response = await apiService.put<PlaylistFolder>(`/folders/${id}`, {
      is_pinned: isPinned,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ [FolderService] Pin status updated successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to update pin status:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    }
    
    throw new Error(error.message || 'Error al actualizar el estado de pin');
  }
};

/**
 * 🗑️ Eliminación suave de carpeta
 */
export const softDeleteFolder = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ [FolderService] Soft deleting folder:', id);
    
    await apiService.delete(`/folders/${id}`);
    
    console.log('✅ [FolderService] Folder soft deleted successfully');
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to soft delete folder:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    }
    
    throw new Error(error.message || 'Error al eliminar la carpeta');
  }
};

/**
 * ✏️ Actualizar nombre de carpeta
 */
export const updateFolderName = async (id: string, name: string): Promise<PlaylistFolder> => {
  try {
    console.log('✏️ [FolderService] Updating folder name:', id, name);
    
    const response = await apiService.put<PlaylistFolder>(`/folders/${id}`, {
      name: name,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ [FolderService] Folder name updated successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to update folder name:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    } else if (error.statusCode === 409) {
      throw new Error('Ya existe una carpeta con ese nombre');
    }
    
    throw new Error(error.message || 'Error al actualizar el nombre de la carpeta');
  }
};

/**
 * 🔄 Actualizar carpeta completa
 */
export const updateFolder = async (id: string, folderData: any): Promise<PlaylistFolder> => {
  try {
    console.log('🔄 [FolderService] Updating folder:', id, folderData);
    
    const response = await apiService.put<PlaylistFolder>(`/folders/${id}`, folderData);
    
    console.log('✅ [FolderService] Folder updated successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to update folder:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    }
    
    throw new Error(error.message || 'Error al actualizar la carpeta');
  }
};

/**
 * 🗑️ Eliminación permanente de carpeta
 */
export const deleteFolder = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ [FolderService] Permanently deleting folder:', id);
    
    await apiService.delete(`/folders/${id}`);
    
    console.log('✅ [FolderService] Folder permanently deleted successfully');
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to permanently delete folder:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    }
    
    throw new Error(error.message || 'Error al eliminar la carpeta permanentemente');
  }
};

/**
 * 📁 Obtener carpeta por ID
 */
export const fetchFolderById = async (id: string): Promise<PlaylistFolder> => {
  try {
    console.log('📁 [FolderService] Fetching folder by ID:', id);
    
    const response = await apiService.get<PlaylistFolder>(`/folders/${id}`);
    
    console.log('✅ [FolderService] Folder fetched successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ [FolderService] Failed to fetch folder:', error);
    
    if (error.statusCode === 404) {
      throw new Error('Carpeta no encontrada');
    }
    
    throw new Error(error.message || 'Error al obtener la carpeta');
  }
}; 