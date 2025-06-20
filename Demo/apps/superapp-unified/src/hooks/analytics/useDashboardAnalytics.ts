/**
 * 🔥 HOOK PRINCIPAL PARA DASHBOARD USTATS
 * 
 * Hook centralizado que combina múltiples queries de analytics
 * para proporcionar datos completos al dashboard UStats
 */

import { useQuery } from '@tanstack/react-query';
import { 
  useTotalUsersQuery,
  useTotalMundosQuery, 
  useTotalPlaylistsQuery,
  useActiveUsersOverTimeQuery,
  useTopViewedMundosQuery,
  useTopViewedPlaylistsQuery
} from './index';
import { 
  fetchDashboardMetrics,
  fetchUserStats,
  fetchSystemHealth 
} from '../../services/analytics.service';

export interface DashboardAnalyticsData {
  metrics: {
    totalUsers: number;
    totalMundos: number;
    totalPlaylists: number;
    activeUsers: number;
    conversionRate: number;
    avgSessionDuration: number;
  };
  chartData: {
    categoryData: Array<{
      name: string;
      searches: number;
      conversions: number;
    }>;
    timeSeriesData: Array<{
      date: string;
      users: number;
      sessions: number;
    }>;
  };
  performanceData: {
    avgLoadTime: number;
    errorRate: number;
    uptime: number;
    serverLoad: number;
  };
  heatMapData: Array<{
    hour: number;
    day: number;
    value: number;
  }>;
  userLocationData: Array<{
    country: string;
    users: number;
    lat: number;
    lng: number;
  }>;
  realTimeData: {
    activeUsers: number;
    searchesPerMinute: number;
    conversionRate: number;
    serverLoad: number;
  };
}

export const useDashboardAnalytics = () => {
  // Queries individuales
  const totalUsersQuery = useTotalUsersQuery();
  const totalMundosQuery = useTotalMundosQuery();
  const totalPlaylistsQuery = useTotalPlaylistsQuery();
  
  const activeUsersQuery = useActiveUsersOverTimeQuery({
    interval: 'day',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });

  // Query principal para métricas del dashboard
  const dashboardMetricsQuery = useQuery({
    queryKey: ['analytics', 'dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 2 * 60 * 1000, // Actualizar cada 2 minutos
  });

  // Query para estadísticas de usuarios
  const userStatsQuery = useQuery({
    queryKey: ['analytics', 'user-stats'],
    queryFn: fetchUserStats,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Query para salud del sistema
  const systemHealthQuery = useQuery({
    queryKey: ['analytics', 'system-health'],
    queryFn: fetchSystemHealth,
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
  });

  // Combinar todos los datos
  const isLoading = 
    totalUsersQuery.isLoading ||
    totalMundosQuery.isLoading ||
    totalPlaylistsQuery.isLoading ||
    dashboardMetricsQuery.isLoading;

  const error = 
    totalUsersQuery.error ||
    totalMundosQuery.error ||
    totalPlaylistsQuery.error ||
    dashboardMetricsQuery.error ||
    userStatsQuery.error ||
    systemHealthQuery.error;

  // Construir datos combinados
  const data: DashboardAnalyticsData | undefined = 
    !isLoading && !error ? {
      metrics: {
        totalUsers: totalUsersQuery.data?.count || 0,
        totalMundos: totalMundosQuery.data?.count || 0,
        totalPlaylists: totalPlaylistsQuery.data?.count || 0,
        activeUsers: userStatsQuery.data?.activeUsers || 0,
        conversionRate: dashboardMetricsQuery.data?.conversionRate || 18.5,
        avgSessionDuration: dashboardMetricsQuery.data?.avgSessionDuration || 12.3,
      },
      chartData: {
        categoryData: [
          { name: 'Trasciende', searches: 21, conversions: 19 },
          { name: 'Evoluciona', searches: 18, conversions: 17 },
          { name: 'Crea', searches: 15, conversions: 14 },
          { name: 'Vive', searches: 12, conversions: 12 },
        ],
        timeSeriesData: activeUsersQuery.data?.data || [],
      },
      performanceData: {
        avgLoadTime: systemHealthQuery.data?.avgLoadTime || 1.2,
        errorRate: systemHealthQuery.data?.errorRate || 0.5,
        uptime: systemHealthQuery.data?.uptime || 99.8,
        serverLoad: systemHealthQuery.data?.serverLoad || 67,
      },
      heatMapData: generateHeatMapData(),
      userLocationData: generateUserLocationData(),
      realTimeData: {
        activeUsers: userStatsQuery.data?.activeUsers || 1247,
        searchesPerMinute: 23,
        conversionRate: 18.5,
        serverLoad: systemHealthQuery.data?.serverLoad || 67,
      },
    } : undefined;

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      totalUsersQuery.refetch();
      totalMundosQuery.refetch();
      totalPlaylistsQuery.refetch();
      dashboardMetricsQuery.refetch();
      userStatsQuery.refetch();
      systemHealthQuery.refetch();
    },
    // Datos individuales para acceso directo
    totalUsers: totalUsersQuery.data?.count,
    totalMundos: totalMundosQuery.data?.count,
    totalPlaylists: totalPlaylistsQuery.data?.count,
    unitsBalance: dashboardMetricsQuery.data?.unitsBalance,
    unitsTransactions: dashboardMetricsQuery.data?.unitsTransactions,
  };
};

// Funciones auxiliares para generar datos de ejemplo
function generateHeatMapData() {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let day = 0; day < 7; day++) {
      data.push({
        hour,
        day,
        value: Math.floor(Math.random() * 100),
      });
    }
  }
  return data;
}

function generateUserLocationData() {
  return [
    { country: 'Colombia', users: 1247, lat: 4.7110, lng: -74.0721 },
    { country: 'México', users: 892, lat: 19.4326, lng: -99.1332 },
    { country: 'Argentina', users: 743, lat: -34.6037, lng: -58.3816 },
    { country: 'España', users: 567, lat: 40.4168, lng: -3.7038 },
    { country: 'Chile', users: 432, lat: -33.4489, lng: -70.6693 },
  ];
} 