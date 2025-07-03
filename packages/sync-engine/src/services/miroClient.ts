import axios from 'axios';
import { TaskDTO } from '../types/task.dto';

// TODO: Move to a config file
const MIRO_API_BASE_URL = 'https://api.miro.com/v2';

/**
 * Interface for the Miro API Client.
 * This defines the contract for interacting with the Miro API.
 * Using an interface allows for easier mocking in tests.
 */
export interface IMiroClient {
  getBoard(boardId: string): Promise<any>;
  getTasksFromBoard(boardId: string): Promise<any[]>;
  createTaskOnBoard(boardId: string, task: TaskDTO, position: {x: number, y: number}): Promise<any>;
  updateTaskOnBoard(boardId: string, itemId: string, task: Partial<TaskDTO>): Promise<any>;
  // Future methods:
  // getTasks(boardId: string): Promise<TaskDTO[]>;
  // updateTask(boardId: string, taskId: string, task: Partial<TaskDTO>): Promise<TaskDTO>;
  // createTask(boardId: string, task: TaskDTO): Promise<TaskDTO>;
}

/**
 * Axios-based client for the Miro REST API.
 * This implementation provides direct control over the API communication.
 */
class MiroClient implements IMiroClient {
  private apiClient;

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error('[MiroClient] Access Token is required.');
    }

    this.apiClient = axios.create({
      baseURL: MIRO_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetches a specific board by its ID.
   * @param boardId The ID of the board to fetch.
   * @returns The board object.
   */
  public async getBoard(boardId: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/boards/${boardId}`);
      return response.data;
    } catch (error) {
      console.error(`[MiroClient] Error fetching board ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches all app_card items from a specific board.
   * @param boardId The ID of the board to fetch items from.
   * @returns A promise that resolves to an array of item objects.
   */
  public async getTasksFromBoard(boardId: string): Promise<any[]> {
    try {
      const response = await this.apiClient.get(`/boards/${boardId}/app_cards`);
      return response.data.data; // The actual items are in response.data.data
    } catch (error) {
      console.error(`[MiroClient] Error fetching tasks from board ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Creates a new app_card on a board from a TaskDTO.
   * @param boardId The ID of the board where the card will be created.
   * @param task The TaskDTO object containing the task data.
   * @param position The position (x, y) where the card will be created on the board.
   * @returns The created item object.
   */
  public async createTaskOnBoard(boardId: string, task: TaskDTO, position: {x: number, y: number}): Promise<any> {
    try {
      const cardData = {
        data: {
          title: `[${task.id}] ${task.description}`,
          // You can add more fields from the TaskDTO to the description as needed
          // description: `Priority: ${task.priority}\\nEffort: ${task.effort}h`,
        },
        style: {
          // Customize card color based on priority, for example
        },
        position: {
          origin: 'center',
          ...position,
        },
      };

      const response = await this.apiClient.post(`/boards/${boardId}/app_cards`, cardData);
      return response.data;
    } catch (error) {
      console.error(`[MiroClient] Error creating task on board ${boardId}:`, error);
      throw error;
    }
  }

  /**
   * Updates an existing app_card on a board.
   * @param boardId The ID of the board where the card exists.
   * @param itemId The ID of the item (app_card) to update.
   * @param task The partial TaskDTO object containing the data to update.
   * @returns The updated item object.
   */
  public async updateTaskOnBoard(boardId: string, itemId: string, task: Partial<TaskDTO>): Promise<any> {
    try {
      const cardData: { data: { title?: string } } = { data: {} };

      if (task.description && task.id) {
        // Assuming the ID is present in the title, we need to preserve it.
        // This part might need a more robust implementation, like fetching the card first.
        cardData.data.title = `[${task.id}] ${task.description}`;
      }
      // Add other fields to update as necessary
      // e.g., if (task.status) { cardData.data.status = task.status; }

      const response = await this.apiClient.patch(`/boards/${boardId}/app_cards/${itemId}`, cardData);
      return response.data;
    } catch (error) {
      console.error(`[MiroClient] Error updating task ${itemId} on board ${boardId}:`, error);
      throw error;
    }
  }
}

// Singleton instance of the client
// This ensures that we have a single, configurable instance of the client.
let clientInstance: IMiroClient | null = null;

export const getMiroClient = (accessToken?: string): IMiroClient => {
  if (!clientInstance) {
    if (!accessToken) {
      throw new Error('[getMiroClient] AccessToken must be provided on first initialization.');
    }
    clientInstance = new MiroClient(accessToken);
  }
  return clientInstance;
};

// For testing purposes, allows resetting the singleton
export const resetMiroClient = () => {
  clientInstance = null;
}
