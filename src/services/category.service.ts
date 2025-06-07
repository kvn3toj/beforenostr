import { apiService } from './api.service';
import { Category } from '../types/category.types';

// TODO: Reemplazar con datos reales una vez que el backend implemente los endpoints de categorías
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Educación', created_at: new Date().toISOString() },
  { id: '2', name: 'Entretenimiento', created_at: new Date().toISOString() },
  { id: '3', name: 'Tecnología', created_at: new Date().toISOString() },
  { id: '4', name: 'Ciencia', created_at: new Date().toISOString() },
];

// 🚀 Backend NestJS habilitado - Migración Fase 2.4
const BACKEND_CATEGORIES_ENABLED = typeof window !== 'undefined' && 
  (globalThis as any)?.process?.env?.VITE_ENABLE_REAL_BACKEND !== 'false' ||
  true; // Por defecto habilitado para migración

export const fetchCategories = async (): Promise<Category[]> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Usando datos mock - backend deshabilitado por configuración');
    return MOCK_CATEGORIES;
  }
  
  try {
    console.info('[Categories] Conectando al backend NestJS en puerto 3002...');
    const response: any = await apiService.get('/categories');
    console.info('[Categories] ✅ Datos obtenidos del backend real');
    return response.data || response; // Manejar diferentes formatos de respuesta
  } catch (error: any) {
    console.warn('[Categories] ⚠️ Backend no disponible, usando fallback a datos mock:', error);
    return MOCK_CATEGORIES;
  }
};

export const createCategory = async (name: string): Promise<Category> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando creación de categoría - backend deshabilitado por configuración');
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString()
    };
    MOCK_CATEGORIES.push(newCategory);
    return newCategory;
  }

  try {
    console.info('[Categories] Creando categoría en backend NestJS...');
    const response: any = await apiService.post('/categories', { name });
    console.info('[Categories] ✅ Categoría creada en backend real');
    return response.data || response;
  } catch (error: any) {
    console.error('[Categories] ❌ Error al crear categoría en backend:', error);
    throw new Error(`Error al crear categoría: ${error?.message || 'Error desconocido'}`);
  }
};

export const updateCategory = async (id: string, categoryData: any): Promise<Category> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando actualización de categoría - backend deshabilitado por configuración');
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (category) {
      category.name = categoryData.name || category.name;
      return category;
    }
    throw new Error('Categoría no encontrada');
  }

  try {
    console.info('[Categories] Actualizando categoría en backend NestJS...');
    const response: any = await apiService.put(`/categories/${id}`, categoryData);
    console.info('[Categories] ✅ Categoría actualizada en backend real');
    return response.data || response;
  } catch (error: any) {
    console.error('[Categories] ❌ Error al actualizar categoría en backend:', error);
    throw new Error(`Error al actualizar categoría: ${error?.message || 'Error desconocido'}`);
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando eliminación de categoría - backend deshabilitado por configuración');
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_CATEGORIES.splice(index, 1);
    }
    return;
  }

  try {
    console.info('[Categories] Eliminando categoría en backend NestJS...');
    await apiService.delete(`/categories/${id}`);
    console.info('[Categories] ✅ Categoría eliminada en backend real');
  } catch (error: any) {
    console.error('[Categories] ❌ Error al eliminar categoría en backend:', error);
    throw new Error(`Error al eliminar categoría: ${error?.message || 'Error desconocido'}`);
  }
};

// Obtener los IDs de categorías asignadas a un item específico
export const fetchItemCategoryIds = async (itemId: string): Promise<string[]> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando categorías de item - endpoints de backend no implementados');
    // Retornar algunas categorías mock para demostración
    return ['1', '2'];
  }

  try {
    const data = await apiService.get(`/items/${itemId}/categories`);
    return data || [];
  } catch (error) {
    console.warn('[Categories] Backend no disponible para obtener categorías del item');
    return [];
  }
};

// Asignar múltiples categorías a un item (reemplazando las existentes)
export const setItemCategories = async (itemId: string, categoryIds: string[]): Promise<void> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando asignación de categorías - endpoints de backend no implementados');
    return;
  }

  try {
    await apiService.put(`/items/${itemId}/categories`, { categoryIds });
  } catch (error) {
    console.warn('[Categories] Backend no disponible para asignar categorías');
    throw error;
  }
}; 