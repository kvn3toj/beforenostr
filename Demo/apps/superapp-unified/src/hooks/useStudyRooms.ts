import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// 🎪 TIPOS PARA STUDY ROOMS
export interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  videoId: string;
  hostId: string;
  isActive: boolean;
  currentTime: number;
  isPaused: boolean;
  maxParticipants: number;
  createdAt: string;
  video?: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    duration?: number;
  };
  participants?: {
    id: string;
    userId: string;
    isHost: boolean;
    joinedAt: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export interface CreateStudyRoomData {
  name: string;
  description?: string;
  videoId: string;
  maxParticipants?: number;
}

export interface StudyRoomSyncData {
  currentTime: number;
  isPaused: boolean;
}

// 🔧 SERVICIOS API
const studyRoomsAPI = {
  // Obtener todas las salas activas
  getRooms: async (page = 1, limit = 10): Promise<{ rooms: StudyRoom[]; total: number }> => {
    const response = await apiService.get(`/study-rooms?page=${page}&limit=${limit}`);
    return response as { rooms: StudyRoom[]; total: number };
  },

  // Obtener detalles de una sala específica
  getRoom: async (roomId: string): Promise<StudyRoom> => {
    const response = await apiService.get(`/study-rooms/${roomId}`);
    return response as StudyRoom;
  },

  // Crear nueva sala
  createRoom: async (data: CreateStudyRoomData): Promise<StudyRoom> => {
    const response = await apiService.post('/study-rooms', data);
    return response as StudyRoom;
  },

  // Unirse a sala
  joinRoom: async (roomId: string): Promise<StudyRoom> => {
    const response = await apiService.post(`/study-rooms/${roomId}/join`);
    return response as StudyRoom;
  },

  // Salir de sala
  leaveRoom: async (roomId: string): Promise<{ message: string }> => {
    const response = await apiService.post(`/study-rooms/${roomId}/leave`);
    return response as { message: string };
  },

  // Sincronizar video (solo host)
  syncRoom: async (roomId: string, syncData: StudyRoomSyncData): Promise<{ message: string }> => {
    const response = await apiService.put(`/study-rooms/${roomId}/sync`, syncData);
    return response as { message: string };
  },

  // Eliminar sala (solo host)
  deleteRoom: async (roomId: string): Promise<{ message: string }> => {
    const response = await apiService.delete(`/study-rooms/${roomId}`);
    return response as { message: string };
  },
};

// 🪝 HOOK PRINCIPAL: useStudyRooms
export const useStudyRooms = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  // Query para obtener todas las salas
  const {
    data: roomsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['studyRooms', page, limit],
    queryFn: () => studyRoomsAPI.getRooms(page, limit),
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refetch cada minuto para salas activas
  });

  // Mutación para crear sala
  const createRoomMutation = useMutation({
    mutationFn: studyRoomsAPI.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
    },
  });

  // Mutación para unirse a sala
  const joinRoomMutation = useMutation({
    mutationFn: studyRoomsAPI.joinRoom,
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
      queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] });
    },
  });

  // Mutación para salir de sala
  const leaveRoomMutation = useMutation({
    mutationFn: studyRoomsAPI.leaveRoom,
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
      queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] });
    },
  });

  // Mutación para sincronizar video
  const syncRoomMutation = useMutation({
    mutationFn: ({ roomId, syncData }: { roomId: string; syncData: StudyRoomSyncData }) =>
      studyRoomsAPI.syncRoom(roomId, syncData),
    onSuccess: (data, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] });
    },
  });

  // Mutación para eliminar sala
  const deleteRoomMutation = useMutation({
    mutationFn: studyRoomsAPI.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
    },
  });

  return {
    // Datos
    rooms: roomsData?.rooms || [],
    totalRooms: roomsData?.total || 0,
    isLoading,
    error,

    // Acciones
    createRoom: createRoomMutation.mutate,
    joinRoom: joinRoomMutation.mutate,
    leaveRoom: leaveRoomMutation.mutate,
    syncRoom: ({ roomId, syncData }: { roomId: string; syncData: StudyRoomSyncData }) =>
      syncRoomMutation.mutate({ roomId, syncData }),
    deleteRoom: deleteRoomMutation.mutate,
    refetch,

    // Estados de mutaciones
    isCreating: createRoomMutation.isPending,
    isJoining: joinRoomMutation.isPending,
    isLeaving: leaveRoomMutation.isPending,
    isSyncing: syncRoomMutation.isPending,
    isDeleting: deleteRoomMutation.isPending,

    // Errores de mutaciones
    createError: createRoomMutation.error,
    joinError: joinRoomMutation.error,
    leaveError: leaveRoomMutation.error,
    syncError: syncRoomMutation.error,
    deleteError: deleteRoomMutation.error,
  };
};

// 🪝 HOOK ESPECÍFICO: useStudyRoom (para una sala específica)
export const useStudyRoom = (roomId: string | null) => {
  const queryClient = useQueryClient();

  const {
    data: room,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['studyRoom', roomId],
    queryFn: () => studyRoomsAPI.getRoom(roomId!),
    enabled: !!roomId,
    staleTime: 10000, // 10 segundos para sala activa
    refetchInterval: 30000, // Refetch cada 30 segundos para sincronización
  });

  return {
    room,
    isLoading,
    error,
    refetch,
  };
};

// 🪝 HOOK DE UTILIDAD: useStudyRoomActions
export const useStudyRoomActions = () => {
  const queryClient = useQueryClient();

  const createRoom = useMutation({
    mutationFn: studyRoomsAPI.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
    },
  });

  const joinRoom = useMutation({
    mutationFn: studyRoomsAPI.joinRoom,
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
      queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] });
    },
  });

  const leaveRoom = useMutation({
    mutationFn: studyRoomsAPI.leaveRoom,
    onSuccess: (data, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['studyRooms'] });
      queryClient.invalidateQueries({ queryKey: ['studyRoom', roomId] });
    },
  });

  return {
    createRoom: createRoom.mutate,
    joinRoom: joinRoom.mutate,
    leaveRoom: leaveRoom.mutate,
    
    isCreating: createRoom.isPending,
    isJoining: joinRoom.isPending,
    isLeaving: leaveRoom.isPending,
    
    createError: createRoom.error,
    joinError: joinRoom.error,
    leaveError: leaveRoom.error,
  };
};