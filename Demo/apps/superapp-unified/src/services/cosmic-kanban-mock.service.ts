/**
 * 🌟 SERVICIO MOCK PARA KANBAN CÓSMICO
 *
 * Simulador temporal del tablero Kanban hasta implementar la integración real con Miro
 * Proporciona datos de ejemplo para que los Guardianes puedan comenzar a usar el portal
 *
 * Creado por: KIRA, The Word Weaver
 * Propósito: Desarrollo y testing local
 */

import { CosmicTask, ThematicElement, GuardianRole, HambrELevel, ColumnStatus } from '../types/cosmic.types';

// 🌟 Base de datos mock en memoria
let mockTasks: CosmicTask[] = [
  {
    id: 'cosmic-task-1',
    title: 'Encender la Puerta al Viaje del Peregrino',
    description: 'Transformar la experiencia de onboarding inicial para nuevos Jugadores, integrando los principios de Ayni y el Design System Cósmico.',
    element: ThematicElement.ETHER,
    guardian: GuardianRole.ANA,
    hambreLevel: HambrELevel.IMPULSES_TRANSFORMATION,
    priority: 'Critical',
    phase: 1,
    estimatedHours: 8,
    philosophicalKpi: 'VIC',
    tags: ['Onboarding', 'PilgrimJourney', 'CosmicDesign', 'FirstExperience'],
    status: ColumnStatus.ALCHEMICAL,
    createdAt: new Date('2025-01-10T10:00:00Z')
  },
  {
    id: 'cosmic-task-2',
    title: 'Alquimia del VideoPlayer Agua Viva',
    description: 'Rediseñar el reproductor de videos del módulo ÜPlay con elementos de agua (fluidez, serenidad) y componentes RevolutionaryWidget.',
    element: ThematicElement.WATER,
    guardian: GuardianRole.LUNA,
    hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
    priority: 'High',
    phase: 2,
    estimatedHours: 12,
    philosophicalKpi: 'IER',
    tags: ['UPlay', 'VideoPlayer', 'WaterElement', 'RevolutionaryWidget'],
    status: ColumnStatus.BACKLOG,
    createdAt: new Date('2025-01-10T11:30:00Z')
  },
  {
    id: 'cosmic-task-3',
    title: 'Círculos de Reciprocidad Social',
    description: 'Implementar la visualización de conexiones sociales como círculos orgánicos que reflejen el principio de Ayni en tiempo real.',
    element: ThematicElement.AIR,
    guardian: GuardianRole.ARIA,
    hambreLevel: HambrELevel.NURTURES_CURIOSITY,
    priority: 'Medium',
    phase: 1,
    estimatedHours: 6,
    philosophicalKpi: 'GS',
    tags: ['Social', 'Reciprocity', 'AirElement', 'ConnectionCircles'],
    status: ColumnStatus.QUALITY,
    createdAt: new Date('2025-01-10T14:15:00Z')
  },
  {
    id: 'cosmic-task-4',
    title: 'Marketplace de Bien Común',
    description: 'Transformar el sistema de intercambio para priorizar transacciones que beneficien al bien común por encima del beneficio individual.',
    element: ThematicElement.EARTH,
    guardian: GuardianRole.SAGE,
    hambreLevel: HambrELevel.IMPULSES_TRANSFORMATION,
    priority: 'High',
    phase: 2,
    estimatedHours: 16,
    philosophicalKpi: 'VIC',
    tags: ['Marketplace', 'BienComun', 'EarthElement', 'CollaborativeEconomy'],
    status: ColumnStatus.BACKLOG,
    createdAt: new Date('2025-01-10T16:45:00Z')
  },
  {
    id: 'cosmic-task-5',
    title: 'Dashboard de Métricas del Fuego Interior',
    description: 'Finalizar la implementación del Dashboard HOME con métricas que reflejen el crecimiento espiritual y el progreso hacia el bien común.',
    element: ThematicElement.FIRE,
    guardian: GuardianRole.PHOENIX,
    hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
    priority: 'Medium',
    phase: 3,
    estimatedHours: 4,
    philosophicalKpi: 'IER',
    tags: ['Dashboard', 'Metrics', 'FireElement', 'SpiritualGrowth'],
    status: ColumnStatus.MANIFESTED,
    createdAt: new Date('2025-01-09T09:20:00Z')
  },
  {
    id: 'cosmic-task-6',
    title: 'Purificación de Componentes Duplicados',
    description: 'Eliminar código duplicado y consolidar componentes siguiendo el principio de "fuente única de verdad cósmica".',
    element: ThematicElement.ETHER,
    guardian: GuardianRole.PHOENIX,
    hambreLevel: HambrELevel.NURTURES_CURIOSITY,
    priority: 'Low',
    phase: 1,
    estimatedHours: 8,
    philosophicalKpi: 'GS',
    tags: ['CodeCleaning', 'Refactoring', 'TechnicalDebt', 'Purification'],
    status: ColumnStatus.ALCHEMICAL,
    createdAt: new Date('2025-01-10T08:00:00Z')
  },
  {
    id: 'task-013-nova-miro-integration',
    title: '🌟 Portal Kanban Cósmico - Integración Miro Completada',
    description: `
    **PROYECTO REAL COMPLETADO** ✅

    🎯 **Objetivo**: Implementar sincronización bidireccional entre SuperApp y Miro

    📋 **Deliverables Completados**:
    • ✅ Hook useMiroSync con React Query
    • ✅ Servicios de Miro API v2 integrados
    • ✅ Interface Material UI con tabs cósmicas
    • ✅ Métricas en tiempo real de 12 Guardianes
    • ✅ Sistema de colores por elementos (🔥💧🌪️🌍✨)
    • ✅ Modo dual: Mock + Real Miro API

    🌌 **Filosofía CoomÜnity Aplicada**:
    • **Ayni**: Balance entre planificación y ejecución
    • **Bien Común**: Herramienta para toda la comunidad de desarrollo
    • **Neguentropía**: Orden emergente en la gestión de proyectos

    📊 **Métricas de Éxito**:
    • ⚡ HambrE Level: IMPULSES_TRANSFORMATION
    • 🎯 Impact Score: 95/100
    • 🔄 Sync Status: BIDIRECTIONAL_ACTIVE

    💫 **Próximos Pasos**:
    Uso en producción para gestión de roadmap CoomÜnity 2025
    `,
    element: ThematicElement.ETHER,
    guardian: GuardianRole.NOVA,
    hambreLevel: HambrELevel.IMPULSES_TRANSFORMATION,
    status: ColumnStatus.MANIFESTED,
    priority: 'High',
    tags: ['miro-integration', 'real-project', 'completed', 'cosmic-kanban', 'coomunity-core'],
    assignee: 'NOVA (Innovation Agent)',
    estimatedHours: 8,
    actualHours: 6.5,
    completionDate: new Date(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      projectType: 'infrastructure',
      realWorldImpact: 'high',
      philosophicalAlignment: 'excellent',
      technicalComplexity: 'advanced',
      communityValue: 'critical',
      miroCardColor: '#E1BEE7',
      githubIssue: '#portal-kanban-cosmico',
      deploymentUrl: 'http://localhost:3001/dev/miro-test',
      testimonial: 'Una herramienta que transforma cómo pensamos el desarrollo de software - Kevin P.'
    }
  }
];

// 🌟 Simulador de retrasos de red
const simulateNetworkDelay = (min = 500, max = 1500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 🌟 Servicio Mock
export class CosmicKanbanMockService {

  async getTasks(): Promise<CosmicTask[]> {
    await simulateNetworkDelay();
    return [...mockTasks];
  }

  async createTask(task: Omit<CosmicTask, 'id' | 'createdAt'>): Promise<CosmicTask> {
    await simulateNetworkDelay();

    const newTask: CosmicTask = {
      ...task,
      id: `cosmic-task-${Date.now()}`,
      createdAt: new Date()
    };

    mockTasks.push(newTask);
    return newTask;
  }

  async updateTaskStatus(taskId: string, newStatus: ColumnStatus): Promise<CosmicTask> {
    await simulateNetworkDelay();

    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Tarea cósmica ${taskId} no encontrada en el cosmos`);
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      status: newStatus
    };

    return mockTasks[taskIndex];
  }

  async syncWithMiro(): Promise<{ success: number; failed: number; errors: string[] }> {
    await simulateNetworkDelay(2000, 4000); // Simular sincronización más lenta

    // Simular algunos éxitos y fallos ocasionales
    const totalTasks = mockTasks.length;
    const failureRate = Math.random() * 0.1; // 10% chance de fallos
    const failed = Math.floor(totalTasks * failureRate);
    const success = totalTasks - failed;

    const errors = failed > 0 ? [
      `Error de conectividad con Miro API`,
      `Token de autenticación expirado`,
      `Límite de rate limit alcanzado`
    ].slice(0, failed) : [];

    return {
      success,
      failed,
      errors
    };
  }

  async testConnection(): Promise<boolean> {
    await simulateNetworkDelay(200, 500);

    // Simular conexión exitosa 90% del tiempo
    return Math.random() > 0.1;
  }

  // 🌟 Métodos adicionales para testing
  async resetTasks(): Promise<void> {
    await simulateNetworkDelay();
    mockTasks = [];
  }

  async seedWithCosmicTasks(): Promise<CosmicTask[]> {
    await simulateNetworkDelay();

    const seedTasks: Omit<CosmicTask, 'id' | 'createdAt'>[] = [
      {
        title: 'Implementar Lazy Loading Cósmico',
        description: 'Optimizar la carga de componentes utilizando lazy loading inteligente que respete los patrones naturales.',
        element: ThematicElement.AIR,
        guardian: GuardianRole.THOR,
        hambreLevel: HambrELevel.ACTIVATES_CONTRIBUTION,
        priority: 'Medium',
        phase: 1,
        estimatedHours: 6,
        philosophicalKpi: 'IER',
        tags: ['Performance', 'LazyLoading', 'Optimization'],
        status: ColumnStatus.BACKLOG
      },
      {
        title: 'Portal de Testing E2E Cósmico',
        description: 'Crear suite de tests end-to-end que valide la experiencia completa del usuario desde una perspectiva holística.',
        element: ThematicElement.ETHER,
        guardian: GuardianRole.SAGE,
        hambreLevel: HambrELevel.NURTURES_CURIOSITY,
        priority: 'High',
        phase: 2,
        estimatedHours: 10,
        philosophicalKpi: 'GS',
        tags: ['Testing', 'E2E', 'QualityAssurance', 'Holistic'],
        status: ColumnStatus.BACKLOG
      },
      {
        title: 'Metamorfosis del Sistema de Notificaciones',
        description: 'Rediseñar las notificaciones para que sean menos intrusivas y más alineadas con el bienestar del usuario.',
        element: ThematicElement.WATER,
        guardian: GuardianRole.LUNA,
        hambreLevel: HambrELevel.IMPULSES_TRANSFORMATION,
        priority: 'Medium',
        phase: 3,
        estimatedHours: 8,
        philosophicalKpi: 'VIC',
        tags: ['Notifications', 'Wellbeing', 'NonIntrusive', 'Metamorphosis'],
        status: ColumnStatus.BACKLOG
      }
    ];

    for (const task of seedTasks) {
      await this.createTask(task);
    }

    return mockTasks;
  }

  // 🌟 Métricas y analytics mock
  async getCosmicMetrics(): Promise<{
    totalTasks: number;
    completionRate: number;
    elementDistribution: { element: ThematicElement; count: number; percentage: number }[];
    guardianLoad: { guardian: GuardianRole; activeTasks: number; completedTasks: number }[];
    averageHambrE: number;
    totalEstimatedHours: number;
    burndownData: { date: string; remaining: number }[];
  }> {
    await simulateNetworkDelay();

    const totalTasks = mockTasks.length;
    const completedTasks = mockTasks.filter(t => t.status === ColumnStatus.MANIFESTED).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const elementDistribution = Object.values(ThematicElement).map(element => {
      const count = mockTasks.filter(t => t.element === element).length;
      return {
        element,
        count,
        percentage: totalTasks > 0 ? (count / totalTasks) * 100 : 0
      };
    });

    const guardianLoad = Object.values(GuardianRole).map(guardian => {
      const guardianTasks = mockTasks.filter(t => t.guardian === guardian);
      return {
        guardian,
        activeTasks: guardianTasks.filter(t => t.status !== ColumnStatus.MANIFESTED).length,
        completedTasks: guardianTasks.filter(t => t.status === ColumnStatus.MANIFESTED).length
      };
    });

    const averageHambrE = totalTasks > 0
      ? mockTasks.reduce((sum, task) => sum + task.hambreLevel, 0) / totalTasks
      : 0;

    const totalEstimatedHours = mockTasks.reduce((sum, task) => sum + task.estimatedHours, 0);

    // Simular datos de burndown de los últimos 7 días
    const burndownData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const remaining = Math.max(0, totalTasks - (i * 2) - completedTasks);
      return {
        date: date.toISOString().split('T')[0],
        remaining
      };
    });

    return {
      totalTasks,
      completionRate,
      elementDistribution,
      guardianLoad,
      averageHambrE,
      totalEstimatedHours,
      burndownData
    };
  }
}

// 🌟 Instancia única del servicio
export const cosmicKanbanMockService = new CosmicKanbanMockService();

// 🌟 Interceptor para usar el mock en desarrollo
export const createMockApiInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.includes('/api/cosmic-kanban')) {
      const path = url.split('/api/cosmic-kanban')[1];

      try {
        let result: any;

        switch (true) {
          case path === '/tasks' && (!init?.method || init.method === 'GET'):
            result = await cosmicKanbanMockService.getTasks();
            break;

          case path === '/tasks' && init?.method === 'POST':
            const createData = JSON.parse(init.body as string);
            result = await cosmicKanbanMockService.createTask(createData);
            break;

          case path.match(/\/tasks\/.*\/status/) && init?.method === 'PATCH':
            const taskId = path.split('/')[2];
            const updateData = JSON.parse(init.body as string);
            result = await cosmicKanbanMockService.updateTaskStatus(taskId, updateData.status);
            break;

          case path === '/sync' && init?.method === 'POST':
            result = await cosmicKanbanMockService.syncWithMiro();
            break;

          case path === '/health':
            result = await cosmicKanbanMockService.testConnection();
            break;

          case path === '/metrics':
            result = await cosmicKanbanMockService.getCosmicMetrics();
            break;

          default:
            throw new Error(`Mock endpoint not implemented: ${path}`);
        }

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown cosmic error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Para cualquier otra URL, usar fetch original
    return originalFetch(input, init);
  };

  return () => {
    window.fetch = originalFetch;
  };
};

// 🌟 Auto-activar el mock en desarrollo
if (import.meta.env.DEV) {
  createMockApiInterceptor();
}
