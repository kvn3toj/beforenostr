import { apiService } from './api.service';
import { PlaylistFolder } from '../types/folder.types';

export type CreateFolderData = {
  name: string;
  mundo_id: string;
};

export const fetchFolders = async (mundoId: string): Promise<PlaylistFolder[]> => {
  try {
    return await apiService.get(`/folders?mundo_id=${mundoId}`);
  } catch (error) {
    console.warn('[Folders] Backend no disponible, devolviendo datos mock');
    return [];
  }
};

export const createFolder = async (folderData: CreateFolderData, userId: string): Promise<PlaylistFolder> => {
  console.log('Creando carpeta con user ID:', userId);

  try {
    return await apiService.post('/folders', {
      name: folderData.name,
      mundo_id: folderData.mundo_id,
      order_index: 0,
      is_pinned: false,
      is_deleted: false,
      created_by: userId
    });
  } catch (error) {
    console.warn('[Folders] Backend no disponible para crear folder');
    throw error;
  }
};

export const updateFolderPinStatus = async (id: string, isPinned: boolean): Promise<PlaylistFolder> => {
  try {
    return await apiService.put(`/folders/${id}`, {
      is_pinned: isPinned,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('[Folders] Backend no disponible para actualizar pin');
    throw error;
  }
};

export const softDeleteFolder = async (id: string): Promise<void> => {
  try {
    await apiService.delete(`/folders/${id}`);
  } catch (error) {
    console.warn('[Folders] Backend no disponible para eliminar folder');
    throw error;
  }
};

export const updateFolderName = async (id: string, name: string): Promise<PlaylistFolder> => {
  try {
    return await apiService.put(`/folders/${id}`, {
      name,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.warn('[Folders] Backend no disponible para actualizar nombre');
    throw error;
  }
};

export const updateFolder = async (id: string, folderData: any): Promise<PlaylistFolder> => {
  try {
    return await apiService.put(`/folders/${id}`, folderData);
  } catch (error) {
    console.warn('[Folders] Backend no disponible para actualizar folder');
    throw error;
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  try {
    return await apiService.delete(`/folders/${id}`);
  } catch (error) {
    console.warn('[Folders] Backend no disponible para eliminar folder');
    throw error;
  }
};

export const fetchFolderById = async (id: string): Promise<PlaylistFolder> => {
  try {
    return await apiService.get(`/folders/${id}`);
  } catch (error) {
    console.warn('[Folders] Backend no disponible para obtener folder');
    throw error;
  }
}; 