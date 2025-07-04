import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/api-service';
import { useAuth } from '@/contexts/AuthContext';
import { safeLog } from '@/utils/safeConversion';
import { ReciprocidadMetricsDTO } from '@/types/reciprocidad.types';

// Estructura de datos para la UI, con nombres en español y más claros
export interface ReciprocidadMetricsUI {
  metricas: {
    ondas: number;
    meritos: number;
    balance: number; // 0-1
    contribucionesBienComun: number;
    puntuacion: number;
    transaccionesTotales: number;
    impactoPositivo: number;
    rangoComunidad: number;
    crecimientoSemanal: number;
  };
  nivel: {
    actual: string;
    siguiente: string;
    progreso: number; // 0-100
  };
  elementos: {
    fuego: number;
    agua: number;
    tierra: number;
    aire: number;
  };
  fechas: {
    ultimaActualizacion: string;
    fechaUnion: string;
  };
  // Referencia a los datos originales del backend para depuración
  _raw: ReciprocidadMetricsDTO;
}

// Datos por defecto realistas para la UI
const DEFAULT_RECIPROCIDAD_METRICS: ReciprocidadMetricsUI = {
  metricas: {
    ondas: 1247,
    meritos: 89,
    balance: 0.87,
    contribucionesBienComun: 23,
    puntuacion: 8.4,
    transaccionesTotales: 45,
    impactoPositivo: 912,
    rangoComunidad: 127,
    crecimientoSemanal: 12.3,
  },
  nivel: {
    actual: 'Emprendedor Confiable',
    siguiente: 'Guardián del Bien Común',
    progreso: 73,
  },
  elementos: {
    fuego: 342,
    agua: 189,
    tierra: 267,
    aire: 156,
  },
  fechas: {
    ultimaActualizacion: new Date().toISOString(),
    fechaUnion: '2024-03-15T00:00:00.000Z',
  },
  _raw: {} as ReciprocidadMetricsDTO, // Se llenará con datos reales
};

/**
 * Función traductora: Convierte el DTO del backend a la estructura de la UI.
 * @param dto - Objeto de datos del backend (ReciprocidadMetricsDTO)
 * @returns Objeto de datos para la UI (ReciprocidadMetricsUI)
 */
const translateDTOtoUI = (dto: ReciprocidadMetricsDTO): ReciprocidadMetricsUI => {
  return {
    metricas: {
      ondas: dto.ondas,
      meritos: dto.meritos,
      balance: dto.balanceReciprocidad,
      contribucionesBienComun: dto.bienComunContributions,
      puntuacion: dto.reciprocityScore,
      transaccionesTotales: dto.totalTransactions,
      impactoPositivo: dto.positiveImpact,
      rangoComunidad: dto.communityRank,
      crecimientoSemanal: dto.weeklyGrowth,
    },
    nivel: {
      actual: dto.reciprocidadLevel,
      siguiente: dto.nextLevel,
      progreso: dto.reciprocidadProgress,
    },
    elementos: dto.elementos,
    fechas: {
      ultimaActualizacion: new Date(dto.lastUpdated).toISOString(),
      fechaUnion: new Date(dto.joinedDate).toISOString(),
    },
    _raw: dto,
  };
};

export const useReciprocidadMetrics = () => {
  const { user } = useAuth();

  return useQuery<ReciprocidadMetricsUI>({
    queryKey: ['reciprocidad-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return { ...DEFAULT_RECIPROCIDAD_METRICS, fechas: { ...DEFAULT_RECIPROCIDAD_METRICS.fechas, ultimaActualizacion: new Date().toISOString() } };
      }

      try {
        const response = await apiService.get<ReciprocidadMetricsDTO | { data: ReciprocidadMetricsDTO }>(`/users/${user.id}/reciprocidad-metrics`);

        const backendData = (response as any).data || response;

        if (backendData && backendData.ondas !== undefined) {
           safeLog.log('🌟 ÉXITO: Datos Reciprocidad (Reciprocidad) obtenidos del backend real:', {
            userId: user.id,
            ondas: backendData.ondas,
            nivel: backendData.reciprocidadLevel,
            source: 'BACKEND_REAL'
          });
          // Traducimos el DTO a la estructura de UI
          return translateDTOtoUI(backendData);
        } else {
          throw new Error("La respuesta del backend para métricas de reciprocidad está vacía o es inválida.");
        }
      } catch (error) {
        safeLog.warn('🌟 Usando métricas de reciprocidad por defecto (backend no disponible):', error);
        return { ...DEFAULT_RECIPROCIDAD_METRICS, fechas: { ...DEFAULT_RECIPROCIDAD_METRICS.fechas, ultimaActualizacion: new Date().toISOString() } };
      }
    },
    enabled: true,
    refetchInterval: 2 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    placeholderData: DEFAULT_RECIPROCIDAD_METRICS,
    retry: false,
  });
};

// Hook adicional para métricas en tiempo real (simulado)
export const useReciprocidadMetricsRealTime = () => {
  const baseMetrics = useReciprocidadMetrics();

  return {
    ...baseMetrics,
    data: baseMetrics.data ? {
      ...baseMetrics.data,
      metricas: {
        ...baseMetrics.data.metricas,
        // Simular pequeñas variaciones en tiempo real para demo
        ondas: baseMetrics.data.metricas.ondas + Math.floor(Math.sin(Date.now() / 10000) * 5),
        balance: Math.min(1, Math.max(0, baseMetrics.data.metricas.balance + Math.sin(Date.now() / 15000) * 0.02)),
      }
    } : undefined
  };
};

export default useReciprocidadMetrics;
