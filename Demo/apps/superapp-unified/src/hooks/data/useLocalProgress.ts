import { useState, useEffect, useCallback } from 'react';
import { 
  LocalStorageData, 
  VideoProgress, 
  UserPreferences, 
  PlayerMetrics,
  validateLocalStorageData,
  validateVideoProgress,
  validateUserPreferences,
  validatePlayerMetrics,
  createDefaultPlayerMetrics,
  createDefaultUserPreferences,
  createVideoProgress
} from '../../types/video-player.schemas';

// ============================================================================
// CONSTANTES DE CONFIGURACIÓN
// ============================================================================

const STORAGE_KEYS = {
  UPLAY_DATA: 'coomunity_uplay_data',
  BACKUP_SUFFIX: '_backup',
  VERSION: '1.0.0',
} as const;

const STORAGE_CONFIG = {
  AUTO_SAVE_DELAY: 1000, // 1 segundo de debounce
  MAX_RETRIES: 3,
  BACKUP_ENABLED: true,
  COMPRESSION_ENABLED: false, // Para futuras mejoras
} as const;

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface UseLocalProgressOptions {
  userId?: string;
  autoSave?: boolean;
  syncInterval?: number;
  onError?: (error: Error) => void;
  onSync?: (data: LocalStorageData) => void;
}

interface UseLocalProgressReturn {
  // Estado
  data: LocalStorageData | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
  
  // Métricas del jugador
  playerMetrics: PlayerMetrics;
  updatePlayerMetrics: (updates: Partial<PlayerMetrics>) => Promise<boolean>;
  resetPlayerMetrics: () => Promise<boolean>;
  
  // Progreso de videos
  videoProgress: VideoProgress[];
  getVideoProgress: (videoId: string) => VideoProgress | null;
  updateVideoProgress: (videoId: string, progress: Partial<VideoProgress>) => Promise<boolean>;
  removeVideoProgress: (videoId: string) => Promise<boolean>;
  
  // Preferencias de usuario
  userPreferences: UserPreferences;
  updateUserPreferences: (updates: Partial<UserPreferences>) => Promise<boolean>;
  resetUserPreferences: () => Promise<boolean>;
  
  // Operaciones generales
  saveData: () => Promise<boolean>;
  loadData: () => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  
  // Estadísticas
  getStorageStats: () => {
    totalSize: number;
    itemCount: number;
    lastSync: Date | null;
    version: string;
  };
}

// ============================================================================
// UTILIDADES DE STORAGE
// ============================================================================

const StorageUtils = {
  // Verificar disponibilidad de localStorage
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  // Obtener datos con manejo de errores
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  // Guardar datos con manejo de errores
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  // Eliminar datos
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  // Obtener tamaño aproximado del storage
  getStorageSize(): number {
    let total = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
    } catch {
      return 0;
    }
    return total;
  },
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useLocalProgress = (options: UseLocalProgressOptions = {}): UseLocalProgressReturn => {
  const {
    userId,
    autoSave = true,
    syncInterval = 30000, // 30 segundos
    onError,
    onSync,
  } = options;

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [data, setData] = useState<LocalStorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // ============================================================================
  // FUNCIONES DE UTILIDAD INTERNA
  // ============================================================================

  const handleError = useCallback((err: Error) => {
    setError(err);
    onError?.(err);
    console.error('useLocalProgress error:', err);
  }, [onError]);

  const createDefaultData = useCallback((): LocalStorageData => {
    return {
      userId,
      playerMetrics: createDefaultPlayerMetrics(),
      videoProgress: [],
      userPreferences: createDefaultUserPreferences(),
      lastSync: new Date(),
      version: STORAGE_CONFIG.VERSION,
    };
  }, [userId]);

  // ============================================================================
  // FUNCIONES DE PERSISTENCIA
  // ============================================================================

  const saveToStorage = useCallback(async (dataToSave: LocalStorageData): Promise<boolean> => {
    if (!StorageUtils.isAvailable()) {
      handleError(new Error('localStorage no está disponible'));
      return false;
    }

    try {
      // Validar datos antes de guardar
      const validatedData = validateLocalStorageData(dataToSave);
      
      // Actualizar timestamp de sincronización
      validatedData.lastSync = new Date();
      
      // Crear backup si está habilitado
      if (STORAGE_CONFIG.BACKUP_ENABLED) {
        const currentData = StorageUtils.getItem(STORAGE_KEYS.UPLAY_DATA);
        if (currentData) {
          StorageUtils.setItem(
            STORAGE_KEYS.UPLAY_DATA + STORAGE_CONFIG.BACKUP_SUFFIX,
            currentData
          );
        }
      }

      // Guardar datos principales
      const success = StorageUtils.setItem(
        STORAGE_KEYS.UPLAY_DATA,
        JSON.stringify(validatedData)
      );

      if (success) {
        setData(validatedData);
        setError(null);
        onSync?.(validatedData);
      }

      return success;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error desconocido al guardar'));
      return false;
    }
  }, [handleError, onSync]);

  const loadFromStorage = useCallback(async (): Promise<boolean> => {
    if (!StorageUtils.isAvailable()) {
      handleError(new Error('localStorage no está disponible'));
      return false;
    }

    try {
      const storedData = StorageUtils.getItem(STORAGE_KEYS.UPLAY_DATA);
      
      if (!storedData) {
        // No hay datos guardados, crear datos por defecto
        const defaultData = createDefaultData();
        const saved = await saveToStorage(defaultData);
        return saved;
      }

      // Parsear y validar datos existentes
      const parsedData = JSON.parse(storedData);
      const validatedData = validateLocalStorageData(parsedData);
      
      setData(validatedData);
      setError(null);
      return true;
    } catch (err) {
      // Intentar recuperar desde backup
      try {
        const backupData = StorageUtils.getItem(STORAGE_KEYS.UPLAY_DATA + STORAGE_CONFIG.BACKUP_SUFFIX);
        if (backupData) {
          const parsedBackup = JSON.parse(backupData);
          const validatedBackup = validateLocalStorageData(parsedBackup);
          setData(validatedBackup);
          
          // Restaurar backup como datos principales
          await saveToStorage(validatedBackup);
          return true;
        }
      } catch {
        // Backup también falló
      }

      // Crear datos por defecto como último recurso
      handleError(err instanceof Error ? err : new Error('Error al cargar datos'));
      const defaultData = createDefaultData();
      const saved = await saveToStorage(defaultData);
      return saved;
    }
  }, [createDefaultData, saveToStorage, handleError]);

  // ============================================================================
  // FUNCIONES DE AUTO-GUARDADO
  // ============================================================================

  const scheduleAutoSave = useCallback((dataToSave: LocalStorageData) => {
    if (!autoSave) return;

    // Cancelar timeout anterior
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Programar nuevo guardado
    const timeout = setTimeout(() => {
      saveToStorage(dataToSave);
    }, STORAGE_CONFIG.AUTO_SAVE_DELAY);

    setSaveTimeout(timeout);
  }, [autoSave, saveTimeout, saveToStorage]);

  // ============================================================================
  // FUNCIONES PÚBLICAS - MÉTRICAS DEL JUGADOR
  // ============================================================================

  const updatePlayerMetrics = useCallback(async (updates: Partial<PlayerMetrics>): Promise<boolean> => {
    if (!data) return false;

    try {
      const updatedMetrics = { ...data.playerMetrics, ...updates };
      const validatedMetrics = validatePlayerMetrics(updatedMetrics);
      
      const newData = {
        ...data,
        playerMetrics: validatedMetrics,
      };

      if (autoSave) {
        scheduleAutoSave(newData);
      } else {
        setData(newData);
      }

      return true;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error al actualizar métricas'));
      return false;
    }
  }, [data, autoSave, scheduleAutoSave, handleError]);

  const resetPlayerMetrics = useCallback(async (): Promise<boolean> => {
    if (!data) return false;

    const defaultMetrics = createDefaultPlayerMetrics();
    return updatePlayerMetrics(defaultMetrics);
  }, [data, updatePlayerMetrics]);

  // ============================================================================
  // FUNCIONES PÚBLICAS - PROGRESO DE VIDEOS
  // ============================================================================

  const getVideoProgress = useCallback((videoId: string): VideoProgress | null => {
    if (!data) return null;
    return data.videoProgress.find(progress => progress.videoId === videoId) || null;
  }, [data]);

  const updateVideoProgress = useCallback(async (
    videoId: string, 
    progressUpdates: Partial<VideoProgress>
  ): Promise<boolean> => {
    if (!data) return false;

    try {
      const existingProgressIndex = data.videoProgress.findIndex(p => p.videoId === videoId);
      let updatedProgress: VideoProgress;

      if (existingProgressIndex >= 0) {
        // Actualizar progreso existente
        updatedProgress = {
          ...data.videoProgress[existingProgressIndex],
          ...progressUpdates,
          lastWatched: new Date(),
        };
      } else {
        // Crear nuevo progreso
        updatedProgress = createVideoProgress(videoId, progressUpdates.currentTime || 0);
        Object.assign(updatedProgress, progressUpdates);
      }

      const validatedProgress = validateVideoProgress(updatedProgress);
      
      const newVideoProgress = [...data.videoProgress];
      if (existingProgressIndex >= 0) {
        newVideoProgress[existingProgressIndex] = validatedProgress;
      } else {
        newVideoProgress.push(validatedProgress);
      }

      const newData = {
        ...data,
        videoProgress: newVideoProgress,
      };

      if (autoSave) {
        scheduleAutoSave(newData);
      } else {
        setData(newData);
      }

      return true;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error al actualizar progreso del video'));
      return false;
    }
  }, [data, autoSave, scheduleAutoSave, handleError]);

  const removeVideoProgress = useCallback(async (videoId: string): Promise<boolean> => {
    if (!data) return false;

    const newVideoProgress = data.videoProgress.filter(p => p.videoId !== videoId);
    const newData = {
      ...data,
      videoProgress: newVideoProgress,
    };

    if (autoSave) {
      scheduleAutoSave(newData);
    } else {
      setData(newData);
    }

    return true;
  }, [data, autoSave, scheduleAutoSave]);

  // ============================================================================
  // FUNCIONES PÚBLICAS - PREFERENCIAS DE USUARIO
  // ============================================================================

  const updateUserPreferences = useCallback(async (updates: Partial<UserPreferences>): Promise<boolean> => {
    if (!data) return false;

    try {
      const updatedPreferences = { ...data.userPreferences, ...updates };
      const validatedPreferences = validateUserPreferences(updatedPreferences);
      
      const newData = {
        ...data,
        userPreferences: validatedPreferences,
      };

      if (autoSave) {
        scheduleAutoSave(newData);
      } else {
        setData(newData);
      }

      return true;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error al actualizar preferencias'));
      return false;
    }
  }, [data, autoSave, scheduleAutoSave, handleError]);

  const resetUserPreferences = useCallback(async (): Promise<boolean> => {
    if (!data) return false;

    const defaultPreferences = createDefaultUserPreferences();
    return updateUserPreferences(defaultPreferences);
  }, [data, updateUserPreferences]);

  // ============================================================================
  // FUNCIONES PÚBLICAS - OPERACIONES GENERALES
  // ============================================================================

  const saveData = useCallback(async (): Promise<boolean> => {
    if (!data) return false;
    return saveToStorage(data);
  }, [data, saveToStorage]);

  const loadData = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const success = await loadFromStorage();
    setIsLoading(false);
    return success;
  }, [loadFromStorage]);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      StorageUtils.removeItem(STORAGE_KEYS.UPLAY_DATA);
      StorageUtils.removeItem(STORAGE_KEYS.UPLAY_DATA + STORAGE_CONFIG.BACKUP_SUFFIX);
      
      const defaultData = createDefaultData();
      setData(defaultData);
      setError(null);
      
      return true;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error al limpiar datos'));
      return false;
    }
  }, [createDefaultData, handleError]);

  const exportData = useCallback((): string => {
    if (!data) return '{}';
    return JSON.stringify(data, null, 2);
  }, [data]);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const parsedData = JSON.parse(jsonData);
      const validatedData = validateLocalStorageData(parsedData);
      
      return await saveToStorage(validatedData);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Error al importar datos'));
      return false;
    }
  }, [saveToStorage, handleError]);

  const getStorageStats = useCallback(() => {
    return {
      totalSize: StorageUtils.getStorageSize(),
      itemCount: data?.videoProgress.length || 0,
      lastSync: data?.lastSync || null,
      version: data?.version || STORAGE_CONFIG.VERSION,
    };
  }, [data]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Inicialización
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const success = await loadFromStorage();
      setIsInitialized(true);
      setIsLoading(false);
    };

    initialize();
  }, [loadFromStorage]);

  // Sincronización periódica
  useEffect(() => {
    if (!autoSave || !data || syncInterval <= 0) return;

    const interval = setInterval(() => {
      saveToStorage(data);
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSave, data, syncInterval, saveToStorage]);

  // Cleanup de timeouts
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    data,
    isLoading,
    error,
    isInitialized,
    
    // Métricas del jugador
    playerMetrics: data?.playerMetrics || createDefaultPlayerMetrics(),
    updatePlayerMetrics,
    resetPlayerMetrics,
    
    // Progreso de videos
    videoProgress: data?.videoProgress || [],
    getVideoProgress,
    updateVideoProgress,
    removeVideoProgress,
    
    // Preferencias de usuario
    userPreferences: data?.userPreferences || createDefaultUserPreferences(),
    updateUserPreferences,
    resetUserPreferences,
    
    // Operaciones generales
    saveData,
    loadData,
    clearAllData,
    exportData,
    importData,
    getStorageStats,
  };
}; 