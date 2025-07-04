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
      icon?: string;
      value?: number;
      growth?: number;
    }>;
    timeSeriesData: Array<{
      date: string;
      users: number;
      sessions: number;
    }>;
    activityData: Array<{
      time: string;
      searches: number;
      users: number;
      conversions: number;
    }>;
    barChart: Array<{
      name: string;
      value: number;
      color?: string;
    }>;
    pieChart: Array<{
      name: string;
      value: number;
      color?: string;
    }>;
  };
  performanceData: Array<{
    name: string;
    value: number;
    unit: string;
    change: number;
    trend: 'up' | 'down';
  }>;
  heatMapData: Array<{
    hour: number;
    day: number;
    value: number;
  }>;
  userLocationData: Array<{
    country: string;
    city?: string;
    users: number;
    lat: number;
    lng: number;
    color?: string;
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
          { name: 'Trasciende', searches: 21, conversions: 19, icon: 'psychology', value: 85, growth: 12 },
          { name: 'Evoluciona', searches: 18, conversions: 17, icon: 'person', value: 72, growth: 8 },
          { name: 'Crea', searches: 15, conversions: 14, icon: 'business', value: 68, growth: 15 },
          { name: 'Vive', searches: 12, conversions: 12, icon: 'school', value: 60, growth: 5 },
        ],
        timeSeriesData: activeUsersQuery.data?.data || [],
        activityData: generateActivityData(),
        barChart: generateBarChartData(),
        pieChart: generatePieChartData(),
      },
      performanceData: generatePerformanceData(systemHealthQuery.data),
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
    { country: 'Colombia', city: 'Bogotá', users: 1247, lat: 4.7110, lng: -74.0721, color: '#1976d2' },
    { country: 'México', city: 'Ciudad de México', users: 892, lat: 19.4326, lng: -99.1332, color: '#dc004e' },
    { country: 'Argentina', city: 'Buenos Aires', users: 743, lat: -34.6037, lng: -58.3816, color: '#9c27b0' },
    { country: 'España', city: 'Madrid', users: 567, lat: 40.4168, lng: -3.7038, color: '#f57c00' },
    { country: 'Chile', city: 'Santiago', users: 432, lat: -33.4489, lng: -70.6693, color: '#388e3c' },
  ];
}

function generateActivityData() {
  return [
    { time: '06:00', searches: 45, users: 120, conversions: 38 },
    { time: '09:00', searches: 89, users: 245, conversions: 72 },
    { time: '12:00', searches: 134, users: 387, conversions: 115 },
    { time: '15:00', searches: 156, users: 421, conversions: 142 },
    { time: '18:00', searches: 178, users: 467, conversions: 159 },
    { time: '21:00', searches: 98, users: 298, conversions: 87 },
  ];
}

function generateBarChartData() {
  return [
    { name: 'Trasciende', value: 245, color: '#1976d2' },
    { name: 'Evoluciona', value: 198, color: '#dc004e' },
    { name: 'Crea', value: 167, color: '#9c27b0' },
    { name: 'Vive', value: 134, color: '#f57c00' },
    { name: 'Conecta', value: 89, color: '#388e3c' },
  ];
}

function generatePieChartData() {
  return [
    { name: 'Nuevos', value: 45, color: '#1976d2' },
    { name: 'Activos', value: 35, color: '#dc004e' },
    { name: 'Premium', value: 15, color: '#9c27b0' },
    { name: 'Inactivos', value: 5, color: '#757575' },
  ];
}

function generatePerformanceData(systemHealthData?: any) {
  return [
    {
      name: 'Tiempo de Carga',
      value: systemHealthData?.avgLoadTime || 1.2,
      unit: 's',
      change: -8.5,
      trend: 'down' as const,
    },
    {
      name: 'Tasa de Error',
      value: systemHealthData?.errorRate || 0.5,
      unit: '%',
      change: -12.3,
      trend: 'down' as const,
    },
    {
      name: 'Tiempo Activo',
      value: systemHealthData?.uptime || 99.8,
      unit: '%',
      change: 0.2,
      trend: 'up' as const,
    },
    {
      name: 'Carga del Servidor',
      value: systemHealthData?.serverLoad || 67,
      unit: '%',
      change: -5.1,
      trend: 'down' as const,
    },
  ];
} 