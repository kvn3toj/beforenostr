/**
 * 🎓 Tutorial Service - Gestión de completación de tutoriales discovery
 * 
 * Servicio específico para manejar la completación de tutoriales discovery
 * y la integración con el sistema de recompensas del backend NestJS
 */

import { apiService } from '../lib/api-service';

// 🏷️ Interfaces para tutoriales discovery
export interface TutorialCompletionData {
  tutorialId: string;
  userId: string;
  completedAt: Date;
  stepsCompleted: number;
  totalSteps: number;
  timeSpent: number; // en segundos
}

export interface TutorialRewards {
  ondas: number;
  meritos: number;
  description: string;
  source: 'TUTORIAL_COMPLETION';
}

export interface TutorialCompletionResponse {
  success: boolean;
  tutorialCompletion: TutorialCompletionData;
  rewards: TutorialRewards;
  message: string;
  newMeritBalance?: number;
  newOndasBalance?: number;
}

// 🎯 API endpoints para tutoriales
const TUTORIAL_ENDPOINTS = {
  complete: '/tutorials/complete',
  progress: '/tutorials/progress',
  rewards: '/merits',
  userMetrics: (userId: string) => `/users/${userId}/ayni-metrics`
} as const;

class TutorialService {
  /**
   * 🏆 Completar tutorial discovery y otorgar recompensas
   */
  async completeTutorial(
    tutorialId: string,
    completionData: Omit<TutorialCompletionData, 'tutorialId' | 'completedAt'>
  ): Promise<TutorialCompletionResponse> {
    try {
      console.log(`🎓 TutorialService: Completing tutorial ${tutorialId}...`);
      
      const payload: TutorialCompletionData = {
        tutorialId,
        completedAt: new Date(),
        ...completionData
      };

      // 1. Registrar completación del tutorial
      const completionResponse = await this.recordTutorialCompletion(payload);
      
      // 2. Otorgar recompensas
      const rewards = this.calculateRewards(tutorialId, completionData.stepsCompleted, completionData.totalSteps);
      const rewardResponse = await this.awardTutorialRewards(completionData.userId, rewards);

      // 3. Obtener nuevos balances del usuario
      const updatedMetrics = await this.getUserUpdatedMetrics(completionData.userId);

      const response: TutorialCompletionResponse = {
        success: true,
        tutorialCompletion: payload,
        rewards,
        message: `¡Tutorial "${tutorialId}" completado exitosamente!`,
        newMeritBalance: updatedMetrics.meritos,
        newOndasBalance: updatedMetrics.ondas
      };

      console.log(`✅ TutorialService: Tutorial ${tutorialId} completed successfully`, response);
      return response;

    } catch (error) {
      console.error(`❌ TutorialService: Error completing tutorial ${tutorialId}:`, error);
      throw new Error(`Failed to complete tutorial ${tutorialId}: ${error.message}`);
    }
  }

  /**
   * 📝 Registrar completación del tutorial (mock - integrará con backend)
   */
  private async recordTutorialCompletion(data: TutorialCompletionData): Promise<boolean> {
    try {
      // Por ahora guardamos en localStorage, pero esto debería ir al backend
      const completionKey = `tutorial-completion-${data.tutorialId}`;
      const completionRecord = {
        ...data,
        completedAt: data.completedAt.toISOString()
      };
      
      localStorage.setItem(completionKey, JSON.stringify(completionRecord));
      
      // También guardamos un registro de todos los tutoriales completados
      const allCompletions = this.getAllCompletedTutorials();
      allCompletions.push(completionRecord);
      localStorage.setItem('tutorial-completions-all', JSON.stringify(allCompletions));

      console.log(`📝 Tutorial completion recorded for ${data.tutorialId}`);
      return true;

      // 🔮 INTEGRACIÓN FUTURA CON BACKEND:
      // return await apiService.post(TUTORIAL_ENDPOINTS.complete, data);
      
    } catch (error) {
      console.error('❌ Error recording tutorial completion:', error);
      throw error;
    }
  }

  /**
   * 🏆 Calcular recompensas según el tutorial completado
   */
  private calculateRewards(tutorialId: string, stepsCompleted: number, totalSteps: number): TutorialRewards {
    // Recompensas base por tutorial
    const baseRewards: Record<string, { ondas: number; meritos: number }> = {
      'marketplace-discovery': { ondas: 25, meritos: 5 },
      'uplay-discovery': { ondas: 30, meritos: 7 },
      'social-discovery': { ondas: 20, meritos: 4 },
      'wallet-discovery': { ondas: 15, meritos: 3 },
      'console-discovery': { ondas: 50, meritos: 10 }
    };

    const baseReward = baseRewards[tutorialId] || { ondas: 10, meritos: 2 };
    
    // Aplicar multiplicador de completación
    const completionMultiplier = stepsCompleted / totalSteps;
    const ondasAwarded = Math.round(baseReward.ondas * completionMultiplier);
    const meritosAwarded = Math.round(baseReward.meritos * completionMultiplier);

    return {
      ondas: ondasAwarded,
      meritos: meritosAwarded,
      description: `Tutorial "${tutorialId}" completado con ${stepsCompleted}/${totalSteps} pasos`,
      source: 'TUTORIAL_COMPLETION'
    };
  }

  /**
   * 💎 Otorgar recompensas a través del backend
   */
  private async awardTutorialRewards(userId: string, rewards: TutorialRewards): Promise<boolean> {
    try {
      console.log(`💎 Awarding tutorial rewards:`, rewards);

      // 🔮 INTEGRACIÓN FUTURA: Usar endpoint del backend para otorgar méritos
      // const meritData = {
      //   userId,
      //   type: 'MERITO',
      //   amount: rewards.meritos,
      //   source: 'CHALLENGE_COMPLETION',
      //   relatedEntityId: `tutorial-${tutorialId}`
      // };
      // await apiService.post(TUTORIAL_ENDPOINTS.rewards, meritData);

      // 💾 Por ahora simulamos otorgando las recompensas en localStorage
      const currentRewards = this.getStoredRewards();
      const newRewards = {
        ondas: currentRewards.ondas + rewards.ondas,
        meritos: currentRewards.meritos + rewards.meritos
      };
      
      localStorage.setItem('user-rewards', JSON.stringify(newRewards));
      
      console.log(`✅ Tutorial rewards awarded successfully:`, newRewards);
      return true;

    } catch (error) {
      console.error('❌ Error awarding tutorial rewards:', error);
      throw error;
    }
  }

  /**
   * 📊 Obtener métricas actualizadas del usuario
   */
  private async getUserUpdatedMetrics(userId: string): Promise<{ ondas: number; meritos: number }> {
    try {
      // 🔮 INTEGRACIÓN FUTURA: Usar endpoint del backend
      // const metrics = await apiService.get(TUTORIAL_ENDPOINTS.userMetrics(userId));
      // return { ondas: metrics.ondas, meritos: metrics.meritos };

      // 💾 Por ahora usar datos simulados de localStorage
      const storedRewards = this.getStoredRewards();
      return storedRewards;

    } catch (error) {
      console.error('❌ Error getting updated user metrics:', error);
      // Fallback a valores por defecto
      return { ondas: 0, meritos: 0 };
    }
  }

  /**
   * 📚 Obtener todos los tutoriales completados
   */
  getAllCompletedTutorials(): TutorialCompletionData[] {
    try {
      const stored = localStorage.getItem('tutorial-completions-all');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error getting completed tutorials:', error);
      return [];
    }
  }

  /**
   * ✅ Verificar si un tutorial específico está completado
   */
  isTutorialCompleted(tutorialId: string): boolean {
    try {
      const completionKey = `tutorial-completion-${tutorialId}`;
      return localStorage.getItem(completionKey) !== null;
    } catch (error) {
      console.error(`❌ Error checking tutorial completion for ${tutorialId}:`, error);
      return false;
    }
  }

  /**
   * 📈 Obtener progreso del tutorial
   */
  getTutorialProgress(tutorialId: string): { completed: boolean; completedAt?: string } {
    try {
      const completionKey = `tutorial-completion-${tutorialId}`;
      const stored = localStorage.getItem(completionKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        return {
          completed: true,
          completedAt: data.completedAt
        };
      }
      
      return { completed: false };
    } catch (error) {
      console.error(`❌ Error getting tutorial progress for ${tutorialId}:`, error);
      return { completed: false };
    }
  }

  /**
   * 💾 Obtener recompensas almacenadas
   */
  private getStoredRewards(): { ondas: number; meritos: number } {
    try {
      const stored = localStorage.getItem('user-rewards');
      return stored ? JSON.parse(stored) : { ondas: 0, meritos: 0 };
    } catch (error) {
      console.error('❌ Error getting stored rewards:', error);
      return { ondas: 0, meritos: 0 };
    }
  }

  /**
   * 🔄 Sincronizar con backend (para implementación futura)
   */
  async syncWithBackend(userId: string): Promise<boolean> {
    try {
      console.log(`🔄 Syncing tutorial progress with backend for user ${userId}...`);
      
      // 🔮 IMPLEMENTACIÓN FUTURA:
      // 1. Obtener completaciones locales
      // 2. Enviar al backend para sincronización
      // 3. Recibir estado actualizado
      // 4. Actualizar localStorage con datos del backend
      
      console.log(`✅ Tutorial sync completed (mock implementation)`);
      return true;

    } catch (error) {
      console.error('❌ Error syncing with backend:', error);
      throw error;
    }
  }

  /**
   * 🧹 Limpiar datos de tutoriales (útil para testing)
   */
  clearTutorialData(): void {
    try {
      const keys = [
        'tutorial-completions-all',
        'user-rewards'
      ];
      
      // Limpiar completaciones específicas
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tutorial-completion-')) {
          localStorage.removeItem(key);
        }
      }
      
      // Limpiar otros datos
      keys.forEach(key => localStorage.removeItem(key));
      
      console.log('🧹 Tutorial data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing tutorial data:', error);
    }
  }
}

// 🎯 Export singleton instance
export const tutorialService = new TutorialService();
export default tutorialService; 