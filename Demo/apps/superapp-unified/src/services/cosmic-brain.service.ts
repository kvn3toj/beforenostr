import { apiService } from './api.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';
const COSMIC_BRAIN_ENDPOINT = `${API_BASE_URL}/admin/cosmic-brain`;

// 🌌 COSMIC BRAIN API TYPES
export interface GuardianStatus {
  id: string;
  name: string;
  type: 'ATLAS' | 'CRONOS' | 'COSMOS' | 'ARIA' | 'EUNOIA' | 'KIRA' | 'HELIOS' | 'SAGE';
  status: 'active' | 'inactive' | 'processing' | 'error';
  healthScore: number;
  lastActivity: string;
  currentTask?: string;
  metrics: {
    tasksCompleted: number;
    efficiency: number;
    uptime: number;
    errorRate: number;
  };
}

export interface PhilosophyMetrics {
  bienComun: number;
  ayni: number;
  metanoia: number;
  neguentropia: number;
  vocacion: number;
  overallAlignment: number;
  trends: {
    period: string;
    values: number[];
  };
}

export interface SystemHealth {
  overall: number;
  components: {
    backend: number;
    frontend: number;
    database: number;
    cache: number;
    ai: number;
  };
  uptime: number;
  responseTime: number;
  errors: number;
  warnings: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedGuardian: string;
  progress: number;
  estimatedCompletion: string;
  createdAt: string;
  updatedAt: string;
}

export interface HarmonyMetrics {
  overall: number;
  components: {
    userExperience: number;
    systemStability: number;
    philosophyAlignment: number;
    performanceOptimization: number;
    cosmicResonance: number;
  };
  vibration: 'low' | 'medium' | 'high' | 'transcendent';
  resonanceFrequency: number;
}

export interface CosmicDashboardData {
  guardians: GuardianStatus[];
  philosophy: PhilosophyMetrics;
  systemHealth: SystemHealth;
  missions: Mission[];
  harmony: HarmonyMetrics;
  lastUpdated: string;
}

// 🌟 COSMIC BRAIN API SERVICE
export class CosmicBrainService {
  /**
   * Get complete dashboard data
   */
  static async getDashboardData(): Promise<CosmicDashboardData> {
    try {
      const response = await apiService.get<CosmicDashboardData>(`${COSMIC_BRAIN_ENDPOINT}/dashboard`);
      return response;
    } catch (error) {
      console.error('Error fetching cosmic brain dashboard data:', error);
      throw new Error('Failed to fetch cosmic brain dashboard data');
    }
  }

  /**
   * Get philosophy alignment metrics
   */
  static async getPhilosophyMetrics(): Promise<PhilosophyMetrics> {
    try {
      const response = await apiService.get<PhilosophyMetrics>(`${COSMIC_BRAIN_ENDPOINT}/metrics/philosophy`);
      return response;
    } catch (error) {
      console.error('Error fetching philosophy metrics:', error);
      throw new Error('Failed to fetch philosophy metrics');
    }
  }

  /**
   * Get system health metrics
   */
  static async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await apiService.get<SystemHealth>(`${COSMIC_BRAIN_ENDPOINT}/metrics/system-health`);
      return response;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw new Error('Failed to fetch system health');
    }
  }

  /**
   * Get all missions
   */
  static async getMissions(): Promise<Mission[]> {
    try {
      const response = await apiService.get<Mission[]>(`${COSMIC_BRAIN_ENDPOINT}/missions`);
      return response;
    } catch (error) {
      console.error('Error fetching missions:', error);
      throw new Error('Failed to fetch missions');
    }
  }

  /**
   * Get harmony metrics
   */
  static async getHarmonyMetrics(): Promise<HarmonyMetrics> {
    try {
      const response = await apiService.get<HarmonyMetrics>(`${COSMIC_BRAIN_ENDPOINT}/harmony`);
      return response;
    } catch (error) {
      console.error('Error fetching harmony metrics:', error);
      throw new Error('Failed to fetch harmony metrics');
    }
  }

  /**
   * Get all guardians status
   */
  static async getGuardians(): Promise<GuardianStatus[]> {
    try {
      const response = await apiService.get<GuardianStatus[]>(`${COSMIC_BRAIN_ENDPOINT}/guardians`);
      return response;
    } catch (error) {
      console.error('Error fetching guardians:', error);
      throw new Error('Failed to fetch guardians');
    }
  }

  /**
   * Get specific guardian status
   */
  static async getGuardianByType(type: GuardianStatus['type']): Promise<GuardianStatus> {
    try {
      const response = await apiService.get<GuardianStatus>(`${COSMIC_BRAIN_ENDPOINT}/guardians/${type}`);
      return response;
    } catch (error) {
      console.error(`Error fetching guardian ${type}:`, error);
      throw new Error(`Failed to fetch guardian ${type}`);
    }
  }

  /**
   * Trigger cosmic brain evolution
   */
  static async triggerEvolution(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(`${COSMIC_BRAIN_ENDPOINT}/evolve`);
      return response;
    } catch (error) {
      console.error('Error triggering evolution:', error);
      throw new Error('Failed to trigger evolution');
    }
  }

  /**
   * Health check for cosmic brain system
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiService.get<{ status: string; timestamp: string }>(`${COSMIC_BRAIN_ENDPOINT}/health`);
      return response;
    } catch (error) {
      console.error('Error in cosmic brain health check:', error);
      throw new Error('Failed to perform health check');
    }
  }
}

// 🎯 CONVENIENCE FUNCTIONS
export const cosmicBrainService = CosmicBrainService;

// Export individual functions for easier imports
export const {
  getDashboardData,
  getPhilosophyMetrics,
  getSystemHealth,
  getMissions,
  getHarmonyMetrics,
  getGuardians,
  getGuardianByType,
  triggerEvolution,
  healthCheck,
} = CosmicBrainService;

export default CosmicBrainService;
