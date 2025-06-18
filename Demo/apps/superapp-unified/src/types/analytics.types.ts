/**
 * 📊 Analytics Types - Tipos para análisis y métricas de la SuperApp CoomÜnity
 */

// 📈 Datos de usuarios en el tiempo
export interface UsersOverTimeData {
  date: string;
  count: number;
  active: number;
  new: number;
}

// 🌍 Datos de mundos 
export interface MundoAnalytics {
  id: string;
  name: string;
  viewCount: number;
  interactionCount: number;
  created_at: string;
}

// 📝 Datos de playlists
export interface PlaylistAnalytics {
  id: string;
  title: string;
  viewCount: number;
  interactionCount: number;
  created_at: string;
}

// 📊 Contenido top interactuado
export interface TopInteractedContent {
  id: string;
  title: string;
  type: 'mundo' | 'playlist' | 'video';
  interactions: number;
  views: number;
}

// 📋 Métricas de totales
export interface TotalMetrics {
  users: number;
  mundos: number;
  playlists: number;
  videos: number;
}

// 📈 Serie temporal genérica
export interface TimeSeriesData {
  date: string;
  value: number;
}

// 🎯 Query response types
export interface AnalyticsQueryResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 