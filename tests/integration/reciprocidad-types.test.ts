/**
 * 🧪 TESTS DE INTEGRACIÓN - TIPOS DE RECIPROCIDAD CONSOLIDADOS
 * ============================================================
 *
 * Misión SAGE: Tests de integración para verificar que los tipos
 * consolidados de reciprocidad funcionan correctamente en componentes.
 *
 * Este es el "crisol que transmuta el error en perfección"
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../src/theme';

// Importar tipos consolidados
import {
  ReciprocidadMetricsDTO,
  UserStatsReciprocidad,
  CommunityMetrics,
  NotificationData,
  GroupReciprocidadData,
  isReciprocidadMetricsDTO,
  isUserStatsReciprocidad,
  createSafeUserStats,
  createSafeCommunityMetrics,
  calculateReciprocidadLevel,
  mapElementosBasicosToSociales
} from '../../src/types/reciprocidad.types';

// Importar componentes que usan los tipos
import ReciprocidadSocialMetrics from '../../src/components/modules/social/components/enhanced/ReciprocidadSocialMetrics';

// 🛡️ DATOS DE PRUEBA SIGUIENDO LOS TIPOS CONSOLIDADOS
const mockReciprocidadDTO: ReciprocidadMetricsDTO = {
  ondas: 1247,
  meritos: 89,
  balanceReciprocidad: 0.87,
  nivelReciprocidad: 'Colaborador Equilibrado',
  nextLevel: 'Guía Estelar',
  progresoReciprocidad: 73,
  bienComunContributions: 23,
  reciprocityScore: 8.4,
  elementos: {
    fuego: 342,
    agua: 189,
    tierra: 267,
    aire: 156
  },
  totalTransactions: 45,
  positiveImpact: 912,
  communityRank: 127,
  weeklyGrowth: 12.3,
  lastUpdated: '2025-01-23T10:30:00.000Z',
  joinedDate: '2024-03-15T00:00:00.000Z'
};

const mockUserStats: UserStatsReciprocidad = {
  reciprocidadBalance: 0.87,
  socialLevel: 'Colaborador Equilibrado',
  nextLevel: 'Guía Estelar',
  socialProgress: 73,
  connectionsCount: 15,
  collaborationsCount: 8,
  bienComunContributions: 23,
  socialMeritos: 89,
  trustScore: 4.2,
  elementos: {
    comunicacion: 78,
    empatia: 85,
    confianza: 72,
    inspiracion: 91
  },
  dailyInteractions: 12,
  activeCircles: 3
};

const mockCommunityMetrics: CommunityMetrics = {
  activeConnections: 124,
  onlineMembers: 45,
  dailyInteractions: 230,
  reciprocidadExchanges: 18,
  activeCircles: 7,
  weeklyGrowth: 8.5,
  totalMembers: 1250,
  monthlyGrowth: 15.2
};

const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'reciprocidad',
    title: '¡Nuevo nivel alcanzado!',
    message: 'Has llegado a Colaborador Equilibrado',
    time: '2025-01-23T10:00:00.000Z',
    priority: 'high',
    category: 'achievement',
    actionUrl: '/profile'
  }
];

// 🧪 HELPER PARA RENDERIZAR CON PROVIDERS
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('🌟 Tipos de Reciprocidad Consolidados - Tests de Integración', () => {

  describe('🔧 Type Guards y Validadores', () => {
    it('✅ isReciprocidadMetricsDTO valida correctamente DTOs válidos', () => {
      expect(isReciprocidadMetricsDTO(mockReciprocidadDTO)).toBe(true);

      // Caso inválido
      expect(isReciprocidadMetricsDTO({})).toBe(false);
      expect(isReciprocidadMetricsDTO({ ondas: 'invalid' })).toBe(false);
    });

    it('✅ isUserStatsReciprocidad valida correctamente UserStats', () => {
      expect(isUserStatsReciprocidad(mockUserStats)).toBe(true);

      // Caso inválido
      expect(isUserStatsReciprocidad({})).toBe(false);
      expect(isUserStatsReciprocidad({ reciprocidadBalance: 'invalid' })).toBe(false);
    });
  });

  describe('🛠️ Funciones Utilitarias', () => {
    it('✅ createSafeUserStats genera valores por defecto seguros', () => {
      const safeStats = createSafeUserStats();

      expect(safeStats.reciprocidadBalance).toBe(0.5);
      expect(safeStats.socialLevel).toBe('Nuevo Miembro');
      expect(safeStats.elementos.comunicacion).toBe(50);
      expect(isUserStatsReciprocidad(safeStats)).toBe(true);
    });

    it('✅ createSafeUserStats acepta valores parciales', () => {
      const partialStats = createSafeUserStats({
        reciprocidadBalance: 0.85,
        socialLevel: 'Colaborador Avanzado'
      });

      expect(partialStats.reciprocidadBalance).toBe(0.85);
      expect(partialStats.socialLevel).toBe('Colaborador Avanzado');
      expect(partialStats.elementos.comunicacion).toBe(50); // Valor por defecto
    });

    it('✅ createSafeCommunityMetrics genera métricas comunitarias seguras', () => {
      const safeMetrics = createSafeCommunityMetrics();

      expect(safeMetrics.activeConnections).toBe(0);
      expect(safeMetrics.onlineMembers).toBe(0);
      expect(safeMetrics.weeklyGrowth).toBe(0);
    });

    it('✅ calculateReciprocidadLevel calcula niveles correctamente', () => {
      // Nuevo miembro
      const newMember = calculateReciprocidadLevel(0.5, 500);
      expect(newMember.current).toBe('Nuevo Miembro');
      expect(newMember.next).toBe('Colaborador Equilibrado');

      // Colaborador equilibrado
      const balanced = calculateReciprocidadLevel(0.8, 1500);
      expect(balanced.current).toBe('Colaborador Equilibrado');
      expect(balanced.next).toBe('Guía Estelar');

      // Guía estelar
      const guide = calculateReciprocidadLevel(0.95, 2500);
      expect(guide.current).toBe('Guía Estelar');
      expect(guide.next).toBe('Maestro Cósmico');
    });

    it('✅ mapElementosBasicosToSociales mapea correctamente', () => {
      const elementosBasicos = mockReciprocidadDTO.elementos;
      const elementosSociales = mapElementosBasicosToSociales(elementosBasicos);

      expect(elementosSociales.comunicacion).toBe(elementosBasicos.aire);
      expect(elementosSociales.empatia).toBe(elementosBasicos.agua);
      expect(elementosSociales.confianza).toBe(elementosBasicos.tierra);
      expect(elementosSociales.inspiracion).toBe(elementosBasicos.fuego);
    });
  });

  describe('🎭 Integración con Componentes UI', () => {
    it('✅ ReciprocidadSocialMetrics renderiza con tipos consolidados', async () => {
      renderWithProviders(
        <ReciprocidadSocialMetrics
          userStats={mockUserStats}
          communityMetrics={mockCommunityMetrics}
          notifications={mockNotifications}
          isLoading={false}
          isConnected={true}
          showDetailedView={true}
        />
      );

      // Verificar que elementos clave se renderizan
      await waitFor(() => {
        expect(screen.getByText('Balance de Reciprocidad')).toBeInTheDocument();
        expect(screen.getByText('0.87')).toBeInTheDocument(); // Balance value
        expect(screen.getByText('Colaborador Equilibrado')).toBeInTheDocument();
      });
    });

    it('✅ Componente maneja valores por defecto seguros cuando no hay datos', () => {
      renderWithProviders(
        <ReciprocidadSocialMetrics
          userStats={createSafeUserStats()}
          communityMetrics={createSafeCommunityMetrics()}
          notifications={[]}
          isLoading={false}
          isConnected={true}
          showDetailedView={true}
        />
      );

      // Debería renderizar sin errores con valores por defecto
      expect(screen.getByText('Balance de Reciprocidad')).toBeInTheDocument();
      expect(screen.getByText('Nuevo Miembro')).toBeInTheDocument();
    });

    it('✅ Componente maneja estado de carga correctamente', () => {
      renderWithProviders(
        <ReciprocidadSocialMetrics
          userStats={mockUserStats}
          communityMetrics={mockCommunityMetrics}
          notifications={mockNotifications}
          isLoading={true}
          isConnected={true}
          showDetailedView={true}
        />
      );

      // Debería mostrar indicadores de carga
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('🌐 Compatibilidad de Tipos entre Componentes', () => {
    it('✅ Tipos son intercambiables entre componentes de diferente módulo', () => {
      // UserStatsReciprocidad debería ser compatible con componentes social y home
      const socialUserStats: UserStatsReciprocidad = mockUserStats;
      const homeUserStats = createSafeUserStats(socialUserStats);

      expect(homeUserStats.reciprocidadBalance).toBe(socialUserStats.reciprocidadBalance);
      expect(homeUserStats.socialLevel).toBe(socialUserStats.socialLevel);
    });

    it('✅ Transformación de DTO a UserStats mantiene integridad de datos', () => {
      // Simular transformación de DTO backend a UserStats para componentes
      const elementosSociales = mapElementosBasicosToSociales(mockReciprocidadDTO.elementos);

      const transformedUserStats: UserStatsReciprocidad = {
        reciprocidadBalance: mockReciprocidadDTO.balanceReciprocidad,
        socialLevel: mockReciprocidadDTO.nivelReciprocidad,
        nextLevel: mockReciprocidadDTO.nextLevel,
        socialProgress: mockReciprocidadDTO.progresoReciprocidad,
        connectionsCount: 15, // Datos adicionales no en DTO
        collaborationsCount: 8,
        bienComunContributions: mockReciprocidadDTO.bienComunContributions,
        socialMeritos: mockReciprocidadDTO.meritos,
        trustScore: 4.2,
        elementos: elementosSociales,
        dailyInteractions: 12,
        activeCircles: 3
      };

      expect(isUserStatsReciprocidad(transformedUserStats)).toBe(true);
      expect(transformedUserStats.elementos.comunicacion).toBe(mockReciprocidadDTO.elementos.aire);
    });
  });

  describe('🚀 Rendimiento y Validación', () => {
    it('✅ Type guards tienen rendimiento optimizado para grandes volúmenes', () => {
      const startTime = performance.now();

      // Ejecutar validaciones en lote
      for (let i = 0; i < 1000; i++) {
        isReciprocidadMetricsDTO(mockReciprocidadDTO);
        isUserStatsReciprocidad(mockUserStats);
      }

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Debería completarse en menos de 100ms para 1000 validaciones
      expect(executionTime).toBeLessThan(100);
    });

    it('✅ Funciones utilitarias mantienen inmutabilidad', () => {
      const originalStats = createSafeUserStats({ reciprocidadBalance: 0.5 });
      const modifiedStats = createSafeUserStats({
        ...originalStats,
        reciprocidadBalance: 0.8
      });

      // El objeto original no debe ser modificado
      expect(originalStats.reciprocidadBalance).toBe(0.5);
      expect(modifiedStats.reciprocidadBalance).toBe(0.8);
      expect(originalStats).not.toBe(modifiedStats);
    });
  });

  describe('🔄 Compatibilidad Hacia Atrás', () => {
    it('✅ Tipos legacy siguen siendo compatibles tras consolidación', () => {
      // Simular datos en formato legacy que podrían existir
      const legacyUserStats = {
        reciprocidadBalance: 0.7,
        socialLevel: 'Colaborador',
        elementos: {
          comunicacion: 75,
          empatia: 80,
          confianza: 70,
          inspiracion: 85
        }
      };

      // Debería poder convertirse sin problemas
      const modernUserStats = createSafeUserStats(legacyUserStats);
      expect(isUserStatsReciprocidad(modernUserStats)).toBe(true);
    });
  });
});

describe('🎯 Tests Específicos para Componentes Migrados', () => {
  it('✅ Componente migrado usa tipos consolidados sin errores', () => {
    // Este test verifica que el componente que fue migrado de tipos duplicados
    // funciona correctamente con la fuente única de verdad

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(
      <ReciprocidadSocialMetrics
        userStats={mockUserStats}
        communityMetrics={mockCommunityMetrics}
        notifications={mockNotifications}
        isLoading={false}
        isConnected={true}
        showDetailedView={true}
      />
    );

    // No debería haber errores de console durante el renderizado
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
