import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { TaskDTO } from '@/types/task.dto';

// Cargar variables de entorno desde el .env en la raíz del sync-engine
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { GAMIFIER_API_URL, GAMIFIER_API_TOKEN } = process.env;

if (!GAMIFIER_API_URL || !GAMIFIER_API_TOKEN) {
  throw new Error(
    'GAMIFIER_API_URL y GAMIFIER_API_TOKEN deben estar definidos en el archivo .env'
  );
}

/**
 * Cliente de API para interactuar con los endpoints de tareas del Gamifier Admin.
 */
class GamifierClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: GAMIFIER_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GAMIFIER_API_TOKEN}`,
      },
    });
  }

  /**
   * Obtiene todas las tareas del Gamifier Admin.
   * @returns Una promesa que se resuelve en un array de TaskDTO.
   */
  async getTasks(): Promise<TaskDTO[]> {
    try {
      const response = await this.api.get<TaskDTO[]>('/tasks');
      console.log('Tareas obtenidas del Gamifier Admin exitosamente.');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las tareas del Gamifier Admin:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarea en el Gamifier Admin.
   * @param task - El objeto TaskDTO de la tarea a crear.
   * @returns Una promesa que se resuelve con la tarea creada.
   */
  async createTask(task: Omit<TaskDTO, 'id'>): Promise<TaskDTO> {
    try {
      const response = await this.api.post<TaskDTO>('/tasks', task);
      console.log(`Tarea "${task.description}" creada exitosamente.`);
      return response.data;
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      throw error;
    }
  }

  /**
   * Actualiza una tarea existente en el Gamifier Admin.
   * @param id - El ID de la tarea a actualizar.
   * @param taskUpdate - Un objeto con los campos de la tarea a actualizar.
   * @returns Una promesa que se resuelve con la tarea actualizada.
   */
  async updateTask(id: string, taskUpdate: Partial<TaskDTO>): Promise<TaskDTO> {
    try {
      const response = await this.api.put<TaskDTO>(`/tasks/${id}`, taskUpdate);
      console.log(`Tarea con ID "${id}" actualizada exitosamente.`);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la tarea con ID "${id}":`, error);
      throw error;
    }
  }
}

export const gamifierClient = new GamifierClient();
