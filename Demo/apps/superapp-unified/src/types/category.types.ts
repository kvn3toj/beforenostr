/**
 * 🏷️ Category Types - Tipos para categorías de contenido
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  itemCount: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface CategoryUpdateData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
} 