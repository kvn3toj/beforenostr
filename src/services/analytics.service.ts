import { supabase } from './supabaseClient';
import {
  TotalCountMetric,
  UsersCreatedOverTimeMetric,
  TimeRangeParams,
  TimeSeriesDataPoint,
  TopViewedPlaylistsMetric,
  TopViewedMundosMetric,
  ActiveUsersOverTimeMetric,
  TopInteractedContentMetric,
  LeastViewedPlaylistsMetric,
  LeastViewedMundosMetric,
  LeastInteractedPlaylistsMetric,
  LeastInteractedMundosMetric,
} from '../types/analytics.types';

export const fetchTotalUsers = async (): Promise<TotalCountMetric> => {
  const { data, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching total users: ${error.message}`);
  }

  return { count: data?.length || 0 };
};

export const fetchTotalPlaylists = async (): Promise<TotalCountMetric> => {
  const { data, error } = await supabase
    .from('playlists')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching total playlists: ${error.message}`);
  }

  return { count: data?.length || 0 };
};

export const fetchTotalMundos = async (): Promise<TotalCountMetric> => {
  const { data, error } = await supabase
    .from('mundos')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching total mundos: ${error.message}`);
  }

  return { count: data?.length || 0 };
};

export const fetchUsersCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<UsersCreatedOverTimeMetric> => {
  const { data, error } = await supabase.rpc('get_users_created_over_time', {
    interval_param: interval,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(`Error fetching users created over time: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_users_created_over_time');
  }

  return data.map(point => ({
    time_period: point.time_period,
    count: point.count,
  }));
};

export const fetchPlaylistsCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<TimeSeriesDataPoint[]> => {
  const { data, error } = await supabase.rpc('get_playlists_created_over_time', {
    interval_param: interval,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(`Error fetching playlists created over time: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_playlists_created_over_time');
  }

  return data.map(point => ({
    time_period: point.time_period,
    count: point.count,
  }));
};

export const fetchMundosCreatedOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<TimeSeriesDataPoint[]> => {
  const { data, error } = await supabase.rpc('get_mundos_created_over_time', {
    interval_param: interval,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(`Error fetching mundos created over time: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_mundos_created_over_time');
  }

  return data.map(point => ({
    time_period: point.time_period,
    count: point.count,
  }));
};

export const fetchTopViewedPlaylists = async (): Promise<TopViewedPlaylistsMetric> => {
  const { data, error } = await supabase.rpc('get_top_viewed_playlists', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching top viewed playlists: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_top_viewed_playlists');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    view_count: item.view_count,
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchTopViewedMundos = async (): Promise<TopViewedMundosMetric> => {
  const { data, error } = await supabase.rpc('get_top_viewed_mundos', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching top viewed mundos: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_top_viewed_mundos');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    view_count: item.view_count,
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchActiveUsersOverTime = async ({
  interval,
  startDate,
  endDate,
}: TimeRangeParams): Promise<ActiveUsersOverTimeMetric> => {
  const { data, error } = await supabase.rpc('get_active_users_over_time', {
    interval_param: interval,
    start_date: startDate,
    end_date: endDate,
  });

  if (error) {
    throw new Error(`Error fetching active users over time: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_active_users_over_time');
  }

  return data.map(point => ({
    time_period: point.time_period,
    count: point.count,
  }));
};

export const fetchTopInteractedContent = async (): Promise<TopInteractedContentMetric> => {
  const { data, error } = await supabase.rpc('get_top_interacted_content', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching top interacted content: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_top_interacted_content');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    interaction_count: item.interaction_count,
    content_type: item.content_type,
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchLeastViewedPlaylists = async (): Promise<LeastViewedPlaylistsMetric> => {
  const { data, error } = await supabase.rpc('get_least_viewed_playlists', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching least viewed playlists: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_least_viewed_playlists');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    view_count: item.view_count,
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchLeastViewedMundos = async (): Promise<LeastViewedMundosMetric> => {
  const { data, error } = await supabase.rpc('get_least_viewed_mundos', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching least viewed mundos: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_least_viewed_mundos');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    view_count: item.view_count,
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchLeastInteractedPlaylists = async (): Promise<LeastInteractedPlaylistsMetric> => {
  const { data, error } = await supabase.rpc('get_least_interacted_playlists', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching least interacted playlists: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_least_interacted_playlists');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    interaction_count: item.interaction_count,
    content_type: 'playlist',
    thumbnail_url: item.thumbnail_url
  }));
};

export const fetchLeastInteractedMundos = async (): Promise<LeastInteractedMundosMetric> => {
  const { data, error } = await supabase.rpc('get_least_interacted_mundos', {
    limit_param: 10
  });

  if (error) {
    throw new Error(`Error fetching least interacted mundos: ${error.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format from get_least_interacted_mundos');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    interaction_count: item.interaction_count,
    content_type: 'mundo',
    thumbnail_url: item.thumbnail_url
  }));
};

// Nota: En el futuro, estas funciones podrían ser reemplazadas por llamadas RPC
// más eficientes, por ejemplo:
// export const fetchTotalUsers = async (): Promise<TotalCountMetric> => {
//   const { data, error } = await supabase.rpc('get_total_users_count');
//   if (error) throw new Error(`Error fetching total users: ${error.message}`);
//   return data;
// }; 