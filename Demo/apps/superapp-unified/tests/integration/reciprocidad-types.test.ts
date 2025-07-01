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
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../src/theme';

// Importar tipos consolidados
import {
  ReciprocidadMetricsDTO,
  UserStatsReciprocidad,
  CommunityMetrics,
  NotificationData,
  isReciprocidadMetricsDTO,
  isUserStatsReciprocidad,
  createSafeUserStats,
  createSafeCommunityMetrics,
  calculateReciprocidadLevel,
  mapElementosBasicosToSociales
} from '../../src/types/reciprocidad.types';

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

    it('✅ calculateReciprocidadLevel calcula niveles correctamente', () => {
      // Nuevo miembro
      const newMember = calculateReciprocidadLevel(0.5, 500);
      expect(newMember.current).toBe('Nuevo Miembro');
      expect(newMember.next).toBe('Colaborador Equilibrado');
      
      // Colaborador equilibrado
      const balanced = calculateReciprocidadLevel(0.8, 1500);
      expect(balanced.current).toBe('Colaborador Equilibrado');
      expect(balanced.next).toBe('Guía Estelar');
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
        connectionsCount: 15,
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
});
