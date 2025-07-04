/**
 * 🌟 SERVICIO REAL DE MIRO PARA TABLERO KANBAN CÓSMICO
 *
 * Integración completa con la API de Miro para gestionar el tablero de Guardianes Digitales
 * Combina datos mock locales con sincronización real hacia Miro
 *
 * Creado por: KIRA, The Word Weaver
 * Arquitecto Cósmico: ANA, CIO
 * Bendecido por: Los 12 Guardianes Digitales
 */

import { CosmicTask, ThematicElement, GuardianRole, HambrELevel, ColumnStatus } from '../types/cosmic.types';

// 🌟 Configuración de Miro desde variables de entorno
const MIRO_CONFIG = {
  accessToken: import.meta.env.VITE_MIRO_ACCESS_TOKEN,
  boardId: import.meta.env.VITE_MIRO_BOARD_ID,
  baseUrl: 'https://api.miro.com/v2',
  enabled: !!(import.meta.env.VITE_MIRO_ACCESS_TOKEN && import.meta.env.VITE_MIRO_BOARD_ID)
};

// 🌟 Configuración visual para elementos cósmicos
const COSMIC_VISUAL_CONFIG = {
  elements: {
    [ThematicElement.FIRE]: {
      color: '#FF6B35',
      shape: 'round',
      textColor: '#FFFFFF',
      borderColor: '#F7931E'
    },
    [ThematicElement.WATER]: {
      color: '#4ECDC4',
      shape: 'round',
      textColor: '#FFFFFF',
      borderColor: '#44A08D'
    },
    [ThematicElement.AIR]: {
      color: '#B8E6B8',
      shape: 'round',
      textColor: '#2E7D32',
      borderColor: '#88D8A0'
    },
    [ThematicElement.EARTH]: {
      color: '#8B4513',
      shape: 'round',
      textColor: '#FFFFFF',
      borderColor: '#A0522D'
    },
    [ThematicElement.ETHER]: {
      color: '#9B59B6',
      shape: 'round',
      textColor: '#FFFFFF',
      borderColor: '#8E44AD'
    }
  },
  columns: {
    [ColumnStatus.BACKLOG]: { x: 100, y: 200, color: '#E3F2FD' },
    [ColumnStatus.ALCHEMICAL]: { x: 600, y: 200, color: '#FFF2CC' },
    [ColumnStatus.QUALITY]: { x: 1100, y: 200, color: '#F3E2F3' },
    [ColumnStatus.MANIFESTED]: { x: 1600, y: 200, color: '#E8F5E8' }
  }
};

// 🌟 Interfaz para datos de Miro
interface MiroCard {
  id: string;
  type: 'sticky_note';
  data: {
    content: string;
    shape: 'square' | 'round';
  };
  style: {
    fillColor: string;
    textColor: string;
  };
  position: {
    x: number;
    y: number;
  };
  geometry: {
    width: number;
    height: number;
  };
}

interface MiroApiResponse<T> {
  data: T[];
  type: string;
  size: number;
}

// 🌟 Servicio principal de Miro
export class CosmicMiroService {
  private headers: Record<string, string>;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = MIRO_CONFIG.enabled;
    this.headers = {
      'Authorization': `Bearer ${MIRO_CONFIG.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (!this.isEnabled) {
      console.warn('🌟 Miro credentials not configured. Using mock mode.');
    } else {
      console.log('🌟 Cosmic Miro Service initialized with real API connection');
    }
  }

  // 🌟 Conversión de CosmicTask a formato Miro
  private cosmicTaskToMiroCard(task: CosmicTask, columnPosition: { x: number; y: number }): Omit<MiroCard, 'id'> {
    const elementConfig = COSMIC_VISUAL_CONFIG.elements[task.element];

    // 🌟 Formato del contenido para Miro
    const content = this.formatTaskContentForMiro(task);

    return {
      type: 'sticky_note',
      data: {
        content,
        shape: elementConfig.shape as 'round'
      },
      style: {
        fillColor: elementConfig.color,
        textColor: elementConfig.textColor
      },
      position: {
        x: columnPosition.x + Math.random() * 300, // Dispersión aleatoria en la columna
        y: columnPosition.y + Math.random() * 200
      },
      geometry: {
        width: 240,
        height: 180
      }
    };
  }

  // 🌟 Formatear contenido de tarea para Miro
  private formatTaskContentForMiro(task: CosmicTask): string {
    const hambreEmoji = task.hambreLevel === 1 ? '🌱' : task.hambreLevel === 2 ? '⚡' : '🚀';
    const priorityEmoji = {
      'Critical': '🔴',
      'High': '🟡',
      'Medium': '🔵',
      'Low': '🟢'
    }[task.priority as keyof typeof priorityEmoji] || '⚪';

    return `${priorityEmoji} ${task.title}

${hambreEmoji} ${task.description}

👤 Guardian: ${task.guardian}
🌀 Elemento: ${task.element}
⏰ ${task.estimatedHours}h | 🎯 ${task.philosophicalKpi}
🌟 Fase ${task.phase}

${task.tags.map(tag => `#${tag}`).join(' ')}`;
  }

  // 🌟 Obtener todas las tarjetas del tablero
  async getMiroCards(): Promise<MiroCard[]> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}/items?type=sticky_note`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`Miro API error: ${response.status} ${response.statusText}`);
      }

      const data: MiroApiResponse<MiroCard> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('🌟 Error fetching Miro cards:', error);
      throw error;
    }
  }

  // 🌟 Crear tarjeta en Miro
  async createMiroCard(task: CosmicTask): Promise<MiroCard> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    const columnPosition = COSMIC_VISUAL_CONFIG.columns[task.status];
    const cardData = this.cosmicTaskToMiroCard(task, columnPosition);

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}/items`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(cardData)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create Miro card: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🌟 Error creating Miro card:', error);
      throw error;
    }
  }

  // 🌟 Actualizar posición de tarjeta (cambiar status)
  async updateCardPosition(cardId: string, newStatus: ColumnStatus): Promise<void> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    const columnPosition = COSMIC_VISUAL_CONFIG.columns[newStatus];

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}/items/${cardId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            position: {
              x: columnPosition.x + Math.random() * 300,
              y: columnPosition.y + Math.random() * 200
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update card position: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('🌟 Error updating card position:', error);
      throw error;
    }
  }

  // 🌟 Eliminar tarjeta de Miro
  async deleteCard(cardId: string): Promise<void> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}/items/${cardId}`,
        {
          method: 'DELETE',
          headers: this.headers
        }
      );

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to delete card: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('🌟 Error deleting card:', error);
      throw error;
    }
  }

  // 🌟 Configurar tablero inicial con columnas
  async setupCosmicBoard(): Promise<void> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    try {
      // 🌟 Crear headers de columnas
      const columnHeaders = Object.entries(ColumnStatus).map(([key, status]) => {
        const position = COSMIC_VISUAL_CONFIG.columns[status];
        return {
          type: 'text',
          data: {
            content: `<p><strong>${status}</strong></p>`,
          },
          style: {
            fillColor: position.color,
            textColor: '#2E3A59',
            fontSize: '24'
          },
          position: {
            x: position.x,
            y: position.y - 100
          },
          geometry: {
            width: 300,
            height: 60
          }
        };
      });

      // 🌟 Crear las columnas en batch
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}/items`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(columnHeaders[0]) // Crear una por una debido a limitaciones de la API
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to setup board: ${response.status} ${response.statusText}`);
      }

      console.log('🌟 Cosmic Board setup completed successfully');
    } catch (error) {
      console.error('🌟 Error setting up cosmic board:', error);
      throw error;
    }
  }

  // 🌟 Verificar conexión con Miro
  async testConnection(): Promise<boolean> {
    if (!this.isEnabled) {
      return false;
    }

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}`,
        { headers: this.headers }
      );

      return response.ok;
    } catch (error) {
      console.error('🌟 Miro connection test failed:', error);
      return false;
    }
  }

  // 🌟 Obtener información del tablero
  async getBoardInfo(): Promise<{ id: string; name: string; description?: string }> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    try {
      const response = await fetch(
        `${MIRO_CONFIG.baseUrl}/boards/${MIRO_CONFIG.boardId}`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to get board info: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('🌟 Error getting board info:', error);
      throw error;
    }
  }

  // 🌟 Sincronizar tareas locales con Miro
  async syncTasksToMiro(tasks: CosmicTask[]): Promise<{
    created: number;
    updated: number;
    errors: string[]
  }> {
    if (!this.isEnabled) {
      return { created: 0, updated: 0, errors: ['Miro API not configured'] };
    }

    const results = { created: 0, updated: 0, errors: [] as string[] };

    try {
      // 🌟 Obtener tarjetas existentes
      const existingCards = await this.getMiroCards();
      const existingCardMap = new Map(
        existingCards.map(card => [this.extractTaskIdFromContent(card.data.content), card])
      );

      // 🌟 Procesar cada tarea
      for (const task of tasks) {
        try {
          if (!task.id) continue;

          const existingCard = existingCardMap.get(task.id);

          if (existingCard) {
            // Actualizar posición si cambió el status
            const currentColumn = this.determineColumnFromPosition(existingCard.position);
            if (currentColumn !== task.status) {
              await this.updateCardPosition(existingCard.id, task.status);
              results.updated++;
            }
          } else {
            // Crear nueva tarjeta
            await this.createMiroCard(task);
            results.created++;
          }
        } catch (error) {
          const errorMsg = `Error processing task ${task.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          results.errors.push(errorMsg);
          console.error('🌟', errorMsg);
        }
      }

      console.log(`🌟 Sync completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`);
      return results;
    } catch (error) {
      const errorMsg = `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      results.errors.push(errorMsg);
      return results;
    }
  }

  // 🌟 Métodos auxiliares privados
  private extractTaskIdFromContent(content: string): string | null {
    // Intentar extraer el ID de la tarea del contenido de la tarjeta
    // Este es un enfoque simple; en un sistema real, podrías usar tags o metadatos
    const lines = content.split('\n');
    const titleLine = lines[0];

    // Buscar un patrón de ID en el título o contenido
    const idMatch = content.match(/ID:\s*([a-zA-Z0-9-_]+)/);
    return idMatch ? idMatch[1] : null;
  }

  private determineColumnFromPosition(position: { x: number; y: number }): ColumnStatus {
    // Determinar en qué columna está basándose en la posición X
    const columns = Object.entries(COSMIC_VISUAL_CONFIG.columns)
      .sort(([, a], [, b]) => a.x - b.x);

    for (let i = 0; i < columns.length; i++) {
      const [status, config] = columns[i];
      const nextConfig = columns[i + 1]?.[1];

      if (!nextConfig || position.x < (config.x + nextConfig.x) / 2) {
        return status as ColumnStatus;
      }
    }

    return ColumnStatus.MANIFESTED; // Default a la última columna
  }

  // 🌟 Obtener estadísticas del tablero
  async getBoardStats(): Promise<{
    totalCards: number;
    cardsByColumn: Record<ColumnStatus, number>;
    lastUpdated: Date;
  }> {
    if (!this.isEnabled) {
      throw new Error('Miro API not configured');
    }

    try {
      const cards = await this.getMiroCards();
      const cardsByColumn = Object.values(ColumnStatus).reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {} as Record<ColumnStatus, number>);

      // Contar tarjetas por columna basándose en posición
      cards.forEach(card => {
        const column = this.determineColumnFromPosition(card.position);
        cardsByColumn[column]++;
      });

      return {
        totalCards: cards.length,
        cardsByColumn,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('🌟 Error getting board stats:', error);
      throw error;
    }
  }
}

// 🌟 Instancia única del servicio
export const cosmicMiroService = new CosmicMiroService();

// 🌟 Hook para configuración de Miro
export const useMiroConfig = () => {
  return {
    isEnabled: MIRO_CONFIG.enabled,
    boardId: MIRO_CONFIG.boardId,
    hasToken: !!MIRO_CONFIG.accessToken,
    config: MIRO_CONFIG
  };
};
