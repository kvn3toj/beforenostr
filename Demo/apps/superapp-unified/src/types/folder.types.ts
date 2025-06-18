/**
 * 📁 Folder Types - Tipos para carpetas y organización de contenido
 */

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  created_at: string;
  updated_at: string;
  itemCount: number;
  children?: Folder[];
}

export interface FolderCreateData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface FolderUpdateData {
  name?: string;
  description?: string;
  parentId?: string;
} 