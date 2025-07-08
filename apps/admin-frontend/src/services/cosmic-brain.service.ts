/**
 * 🌌 Cosmic Brain Service
 * 
 * Servicio para interactuar con el backend del AI Cosmic Brain.
 * Proporciona métodos para obtener datos del dashboard, métricas,
 * misiones, estado de guardianes y funcionalidades de evolución.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: API centralizada para el equipo
 * - Ayni: Balance entre funcionalidad y performance
 * - Neguentropía: Estructura clara y mantenible
 * - Metanöia: Evolución continua del sistema
 */

import { api } from '../config/api';
import { 
  CosmicDashboardData, 
  PhilosophyMetrics, 
  SystemHealth, 
  Mission, 
  HarmonyMetrics, 
  GuardianStatus,
  GuardianType,
  EvolutionResult 
} from '../types/cosmic-brain.types';

export class CosmicBrainService {
  private static readonly BASE_PATH = '/admin/cosmic-brain';

  // ============================================================================
  // 🖥️ Dashboard Methods
  // ============================================================================

  /**
   * Obtener datos completos del dashboard cósmico
   */
  static async getDashboardData(options?: {
    includeGuardianDetails?: boolean;
    includePhilosophyMetrics?: boolean;
    includeActiveMissions?: boolean;
    includeHarmonyMetrics?: boolean;
  }): Promise<CosmicDashboardData> {
    const params = new URLSearchParams();
    
    if (options?.includeGuardianDetails) {
      params.append('includeGuardianDetails', 'true');
    }
    if (options?.includePhilosophyMetrics) {
      params.append('includePhilosophyMetrics', 'true');
    }
    if (options?.includeActiveMissions) {
      params.append('includeActiveMissions', 'true');
    }
    if (options?.includeHarmonyMetrics) {
      params.append('includeHarmonyMetrics', 'true');
    }

    const queryString = params.toString();
    const url = `${this.BASE_PATH}/dashboard${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<CosmicDashboardData>(url);
    return response.data;
  }

  // ============================================================================
  // 📊 Metrics Methods
  // ============================================================================

  /**
   * Obtener métricas filosóficas CoomÜnity
   */
  static async getPhilosophyMetrics(): Promise<PhilosophyMetrics> {
    const response = await api.get<PhilosophyMetrics>(`${this.BASE_PATH}/metrics/philosophy`);
    return response.data;
  }

  /**
   * Obtener métricas de salud del sistema
   */
  static async getSystemHealth(): Promise<SystemHealth> {
    const response = await api.get<SystemHealth>(`${this.BASE_PATH}/metrics/system-health`);
    return response.data;
  }

  /**
   * Obtener métricas de armonía del equipo
   */
  static async getHarmonyMetrics(): Promise<HarmonyMetrics> {
    const response = await api.get<HarmonyMetrics>(`${this.BASE_PATH}/harmony`);
    return response.data;
  }

  // ============================================================================
  // 🎯 Mission Methods
  // ============================================================================

  /**
   * Obtener misiones activas del AI Cosmic Brain
   */
  static async getActiveMissions(options?: {
    limit?: number;
    status?: string;
  }): Promise<Mission[]> {
    const params = new URLSearchParams();
    
    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }
    if (options?.status) {
      params.append('status', options.status);
    }

    const queryString = params.toString();
    const url = `${this.BASE_PATH}/missions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<Mission[]>(url);
    return response.data;
  }

  // ============================================================================
  // 🛡️ Guardian Methods
  // ============================================================================

  /**
   * Obtener estado de todos los guardianes
   */
  static async getAllGuardians(): Promise<GuardianStatus[]> {
    const response = await api.get<GuardianStatus[]>(`${this.BASE_PATH}/guardians`);
    return response.data;
  }

  /**
   * Obtener estado de un guardián específico
   */
  static async getGuardianByType(type: GuardianType): Promise<GuardianStatus> {
    const response = await api.get<GuardianStatus>(`${this.BASE_PATH}/guardians/${type}`);
    return response.data;
  }

  // ============================================================================
  // 🔄 Evolution Methods
  // ============================================================================

  /**
   * Trigger evolución del AI Cosmic Brain (solo admins)
   */
  static async triggerEvolution(): Promise<EvolutionResult> {
    const response = await api.post<EvolutionResult>(`${this.BASE_PATH}/evolve`);
    return response.data;
  }

  // ============================================================================
  // 🏥 Health Check Methods
  // ============================================================================

  /**
   * Health check del módulo Cosmic Brain
   */
  static async healthCheck(): Promise<{
    status: string;
    module: string;
    timestamp: string;
    version: string;
  }> {
    const response = await api.get(`${this.BASE_PATH}/health`);
    return response.data;
  }
}

export default CosmicBrainService;
