import { apiService } from './api.service';
import { Category } from '../types/category.types';

// TODO: Reemplazar con datos reales una vez que el backend implemente los endpoints de categorías
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Educación', created_at: new Date().toISOString() },
  { id: '2', name: 'Entretenimiento', created_at: new Date().toISOString() },
  { id: '3', name: 'Tecnología', created_at: new Date().toISOString() },
  { id: '4', name: 'Ciencia', created_at: new Date().toISOString() },
];

// Flag para habilitar/deshabilitar llamadas al backend
const BACKEND_CATEGORIES_ENABLED = false;

export const fetchCategories = async (): Promise<Category[]> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Usando datos mock - endpoints de backend no implementados');
    return MOCK_CATEGORIES;
  }
  
  try {
    return await apiService.get('/categories');
  } catch (error) {
    console.warn('[Categories] Backend no disponible, devolviendo datos mock');
    return MOCK_CATEGORIES;
  }
};

export const createCategory = async (name: string): Promise<Category> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando creación de categoría - endpoints de backend no implementados');
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      created_at: new Date().toISOString()
    };
    MOCK_CATEGORIES.push(newCategory);
    return newCategory;
  }

  try {
    return await apiService.post('/categories', { name });
  } catch (error) {
    console.warn('[Categories] Backend no disponible para crear categoría');
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: any): Promise<Category> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando actualización de categoría - endpoints de backend no implementados');
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    if (category) {
      category.name = categoryData.name || category.name;
      return category;
    }
    throw new Error('Categoría no encontrada');
  }

  try {
    return await apiService.put(`/categories/${id}`, categoryData);
  } catch (error) {
    console.warn('[Categories] Backend no disponible para actualizar categoría');
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!BACKEND_CATEGORIES_ENABLED) {
    console.info('[Categories] Simulando eliminación de categoría - endpoints de backend no implementados');
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_CATEGORIES.splice(index, 1);
    }
    return;
  }

  try {
    return await apiService.delete(`/categories/${id}`);
  } catch (error) {
    console.warn('[Categories] Backend no disponible para eliminar categoría');
    throw error;
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